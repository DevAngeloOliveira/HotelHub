package com.hotelhub.api.rooms.application

import com.hotelhub.api.reservations.infrastructure.persistence.repository.ReservationJpaRepository
import com.hotelhub.api.rooms.domain.Room
import com.hotelhub.api.rooms.infrastructure.persistence.mapper.toDomain
import com.hotelhub.api.rooms.infrastructure.persistence.repository.RoomJpaRepository
import com.hotelhub.api.shared.config.CacheNames
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.error.BusinessRuleException
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.UUID

@Service
class RoomQueryService(
    private val roomRepository: RoomJpaRepository,
    private val reservationRepository: ReservationJpaRepository
) {

    @Cacheable(cacheNames = [CacheNames.ROOMS_PUBLIC_ACTIVE_BY_HOTEL], key = "#hotelId")
    @Transactional(readOnly = true)
    fun listActiveByHotel(hotelId: UUID): List<Room> {
        return roomRepository.findAllByHotelIdAndStatus(hotelId, EntityStatus.ACTIVE).map { it.toDomain() }
    }

    @Cacheable(
        cacheNames = [CacheNames.ROOMS_PUBLIC_AVAILABILITY_BY_HOTEL],
        key = "#hotelId + '|' + #checkInDate + '|' + #checkOutDate + '|' + #guestCount"
    )
    @Transactional(readOnly = true)
    fun listByHotelWithAvailability(
        hotelId: UUID,
        checkInDate: LocalDate?,
        checkOutDate: LocalDate?,
        guestCount: Int?
    ): List<RoomAvailabilityView> {
        validateAvailabilityInputs(checkInDate, checkOutDate, guestCount)

        val rooms = roomRepository.findAllByHotelIdAndStatus(hotelId, EntityStatus.ACTIVE).map { it.toDomain() }
        val filteredByGuestCount = if (guestCount == null) rooms else rooms.filter { guestCount <= it.capacity }

        if (checkInDate == null || checkOutDate == null) {
            return filteredByGuestCount.map {
                RoomAvailabilityView(
                    room = it,
                    available = true,
                    availableUnits = it.quantity
                )
            }
        }

        return filteredByGuestCount
            .map { room ->
                val activeOverlaps = reservationRepository.countActiveOverlappingReservations(
                    roomId = room.id,
                    checkInDate = checkInDate,
                    checkOutDate = checkOutDate
                )
                val availableUnits = room.quantity - activeOverlaps
                RoomAvailabilityView(
                    room = room,
                    available = availableUnits > 0,
                    availableUnits = availableUnits.coerceAtLeast(0)
                )
            }
            .filter { it.available }
    }

    private fun validateAvailabilityInputs(
        checkInDate: LocalDate?,
        checkOutDate: LocalDate?,
        guestCount: Int?
    ) {
        if ((checkInDate == null) xor (checkOutDate == null)) {
            throw BusinessRuleException("Both checkInDate and checkOutDate are required for availability filtering")
        }
        if (checkInDate != null && checkOutDate != null) {
            if (!checkOutDate.isAfter(checkInDate)) {
                throw BusinessRuleException("checkOutDate must be after checkInDate")
            }
            if (checkInDate.isBefore(LocalDate.now())) {
                throw BusinessRuleException("Cannot query availability for past check-in date")
            }
        }
        if (guestCount != null && guestCount <= 0) {
            throw BusinessRuleException("guestCount must be greater than zero")
        }
    }
}
