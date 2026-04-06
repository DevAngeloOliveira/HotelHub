package com.hotelhub.api.reservations.application

import com.hotelhub.api.audit.application.AuditService
import com.hotelhub.api.destinations.infrastructure.persistence.repository.DestinationJpaRepository
import com.hotelhub.api.hotels.infrastructure.persistence.repository.HotelJpaRepository
import com.hotelhub.api.reservations.domain.Reservation
import com.hotelhub.api.reservations.domain.ReservationRules
import com.hotelhub.api.reservations.infrastructure.persistence.entity.ReservationEntity
import com.hotelhub.api.reservations.infrastructure.persistence.mapper.toDomain
import com.hotelhub.api.reservations.infrastructure.persistence.repository.ReservationJpaRepository
import com.hotelhub.api.reservations.presentation.dto.CreateReservationRequest
import com.hotelhub.api.rooms.infrastructure.persistence.repository.RoomJpaRepository
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.domain.ReservationStatus
import com.hotelhub.api.shared.error.BusinessRuleException
import com.hotelhub.api.shared.error.ConflictException
import com.hotelhub.api.shared.error.ResourceNotFoundException
import com.hotelhub.api.users.infrastructure.persistence.repository.UserJpaRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@Service
class ReservationService(
    private val reservationRepository: ReservationJpaRepository,
    private val userRepository: UserJpaRepository,
    private val hotelRepository: HotelJpaRepository,
    private val roomRepository: RoomJpaRepository,
    private val destinationRepository: DestinationJpaRepository,
    private val auditService: AuditService
) {

    @Transactional(readOnly = true)
    fun listMyReservations(userId: UUID, pageable: Pageable): Page<Reservation> {
        return reservationRepository.findAllByUserId(userId, pageable).map { it.toDomain() }
    }

    @Transactional(readOnly = true)
    fun getMyReservation(userId: UUID, reservationId: UUID): Reservation {
        return reservationRepository.findByIdAndUserId(reservationId, userId)
            .orElseThrow { ResourceNotFoundException("Reservation not found") }
            .toDomain()
    }

    @Transactional
    fun create(userId: UUID, request: CreateReservationRequest): Reservation {
        validateReservationDates(request.checkInDate, request.checkOutDate)

        val user = userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found") }
        if (user.status != EntityStatus.ACTIVE) {
            throw BusinessRuleException("Inactive user cannot create reservations")
        }

        val hotel = hotelRepository.findById(request.hotelId)
            .orElseThrow { ResourceNotFoundException("Hotel not found") }
        if (hotel.status != EntityStatus.ACTIVE) {
            throw BusinessRuleException("Inactive hotel cannot accept reservations")
        }

        val destination = destinationRepository.findById(hotel.destinationId)
            .orElseThrow { ResourceNotFoundException("Destination not found") }
        if (destination.status != EntityStatus.ACTIVE) {
            throw BusinessRuleException("Inactive destination cannot accept reservations")
        }

        val room = roomRepository.findWithLockingById(request.roomId)
            .orElseThrow { ResourceNotFoundException("Room not found") }

        if (room.hotelId != request.hotelId) {
            throw BusinessRuleException("Room does not belong to selected hotel")
        }
        if (room.status != EntityStatus.ACTIVE) {
            throw BusinessRuleException("Inactive room cannot be reserved")
        }
        ReservationRules.validateGuestCount(request.guestCount, room.capacity)

        val activeOverlaps = reservationRepository.countActiveOverlappingReservations(
            roomId = room.id,
            checkInDate = request.checkInDate,
            checkOutDate = request.checkOutDate
        )
        if (activeOverlaps >= room.quantity) {
            throw ConflictException("No availability for selected period")
        }

        val totalAmount = ReservationRules.calculateTotalAmount(
            pricePerNight = room.pricePerNight,
            checkInDate = request.checkInDate,
            checkOutDate = request.checkOutDate
        )

        val reservation = reservationRepository.save(
            ReservationEntity(
                id = UUID.randomUUID(),
                userId = user.id,
                hotelId = hotel.id,
                roomId = room.id,
                checkInDate = request.checkInDate,
                checkOutDate = request.checkOutDate,
                guestCount = request.guestCount,
                totalAmount = totalAmount,
                status = ReservationStatus.CONFIRMED
            )
        ).toDomain()

        auditService.log(
            actorId = userId,
            action = "RESERVATION_CREATED",
            entityType = "RESERVATION",
            entityId = reservation.id,
            metadata = mapOf(
                "hotelId" to reservation.hotelId.toString(),
                "roomId" to reservation.roomId.toString(),
                "checkInDate" to reservation.checkInDate.toString(),
                "checkOutDate" to reservation.checkOutDate.toString()
            )
        )

        return reservation
    }

    @Transactional
    fun cancel(userId: UUID, reservationId: UUID): Reservation {
        val reservation = reservationRepository.findByIdAndUserId(reservationId, userId)
            .orElseThrow { ResourceNotFoundException("Reservation not found") }

        if (reservation.status == ReservationStatus.CANCELLED) {
            throw BusinessRuleException("Reservation is already cancelled")
        }
        if (!ReservationRules.canCancel(reservation.checkInDate)) {
            throw BusinessRuleException("Reservation can only be cancelled before check-in date")
        }

        reservation.status = ReservationStatus.CANCELLED
        reservation.cancelledAt = Instant.now()

        val cancelled = reservationRepository.save(reservation).toDomain()
        auditService.log(
            actorId = userId,
            action = "RESERVATION_CANCELLED",
            entityType = "RESERVATION",
            entityId = cancelled.id,
            metadata = mapOf("cancelledAt" to cancelled.cancelledAt.toString())
        )

        return cancelled
    }

    private fun validateReservationDates(checkInDate: LocalDate, checkOutDate: LocalDate) {
        ReservationRules.validateDates(checkInDate, checkOutDate)
    }
}
