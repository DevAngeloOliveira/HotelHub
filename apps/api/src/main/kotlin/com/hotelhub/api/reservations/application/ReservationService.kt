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
import com.hotelhub.api.shared.config.CacheNames
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.domain.ReservationStatus
import com.hotelhub.api.shared.error.BusinessRuleException
import com.hotelhub.api.shared.error.ConflictException
import com.hotelhub.api.shared.error.ResourceNotFoundException
import com.hotelhub.api.users.infrastructure.persistence.repository.UserJpaRepository
import org.slf4j.LoggerFactory
import org.springframework.cache.annotation.CacheEvict
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
    companion object {
        private val logger = LoggerFactory.getLogger(ReservationService::class.java)
    }

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

    @CacheEvict(cacheNames = [CacheNames.ROOMS_PUBLIC_AVAILABILITY_BY_HOTEL], allEntries = true)
    @Transactional
    fun create(userId: UUID, request: CreateReservationRequest): Reservation {
        logger.debug("Creating reservation", mapOf("userId" to userId, "hotelId" to request.hotelId, "roomId" to request.roomId))
        try {
            validateReservationDates(request.checkInDate, request.checkOutDate)

            val user = userRepository.findById(userId)
                .orElseThrow { ResourceNotFoundException("User not found") }
            if (user.status != EntityStatus.ACTIVE) {
                logger.warn("Inactive user attempted reservation", mapOf("userId" to userId))
                throw BusinessRuleException("Inactive user cannot create reservations")
            }

            val hotel = hotelRepository.findById(request.hotelId)
                .orElseThrow { ResourceNotFoundException("Hotel not found") }
            if (hotel.status != EntityStatus.ACTIVE) {
                logger.warn("Inactive hotel reservation attempt", mapOf("hotelId" to request.hotelId))
                throw BusinessRuleException("Inactive hotel cannot accept reservations")
            }

            val destination = destinationRepository.findById(hotel.destinationId)
                .orElseThrow { ResourceNotFoundException("Destination not found") }
            if (destination.status != EntityStatus.ACTIVE) {
                logger.warn("Inactive destination reservation attempt", mapOf("destinationId" to hotel.destinationId))
                throw BusinessRuleException("Inactive destination cannot accept reservations")
            }

            val room = roomRepository.findWithLockingById(request.roomId)
                .orElseThrow { ResourceNotFoundException("Room not found") }

            if (room.hotelId != request.hotelId) {
                logger.warn("Room/Hotel mismatch", mapOf("roomId" to request.roomId, "hotelId" to request.hotelId))
                throw BusinessRuleException("Room does not belong to selected hotel")
            }
            if (room.status != EntityStatus.ACTIVE) {
                logger.warn("Inactive room reservation attempt", mapOf("roomId" to request.roomId))
                throw BusinessRuleException("Inactive room cannot be reserved")
            }
            ReservationRules.validateGuestCount(request.guestCount, room.capacity)

            val activeOverlaps = reservationRepository.countActiveOverlappingReservations(
                roomId = room.id,
                checkInDate = request.checkInDate,
                checkOutDate = request.checkOutDate
            )
            if (activeOverlaps >= room.quantity) {
                logger.debug("Room unavailable for period", mapOf("roomId" to room.id, "checkIn" to request.checkInDate, "checkOut" to request.checkOutDate))
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

            logger.info("Reservation created successfully", mapOf("reservationId" to reservation.id, "userId" to userId, "amount" to totalAmount))
            return reservation
        } catch (e: BusinessRuleException) {
            logger.debug("Reservation creation rejected by business rule", mapOf("userId" to userId, "reason" to e.message))
            throw e
        } catch (e: ConflictException) {
            logger.debug("Reservation conflict", mapOf("userId" to userId, "reason" to e.message))
            throw e
        } catch (e: Exception) {
            logger.error("Unexpected error creating reservation", mapOf("userId" to userId, "hotelId" to request.hotelId), e)
            throw e
        }
    }

    @CacheEvict(cacheNames = [CacheNames.ROOMS_PUBLIC_AVAILABILITY_BY_HOTEL], allEntries = true)
    @Transactional
    fun cancel(userId: UUID, reservationId: UUID): Reservation {
        logger.debug("Cancelling reservation", mapOf("userId" to userId, "reservationId" to reservationId))
        try {
            val reservation = reservationRepository.findByIdAndUserId(reservationId, userId)
                .orElseThrow { ResourceNotFoundException("Reservation not found") }

            if (reservation.status == ReservationStatus.CANCELLED) {
                logger.debug("Reservation already cancelled", mapOf("reservationId" to reservationId))
                throw BusinessRuleException("Reservation is already cancelled")
            }
            if (!ReservationRules.canCancel(reservation.checkInDate)) {
                logger.warn("Reservation cancellation out of window", mapOf("reservationId" to reservationId, "checkIn" to reservation.checkInDate))
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

            logger.info("Reservation cancelled successfully", mapOf("reservationId" to cancelled.id, "userId" to userId))
            return cancelled
        } catch (e: BusinessRuleException) {
            logger.debug("Reservation cancellation rejected", mapOf("reservationId" to reservationId, "reason" to e.message))
            throw e
        } catch (e: Exception) {
            logger.error("Unexpected error cancelling reservation", mapOf("reservationId" to reservationId, "userId" to userId), e)
            throw e
        }
    }

    private fun validateReservationDates(checkInDate: LocalDate, checkOutDate: LocalDate) {
        ReservationRules.validateDates(checkInDate, checkOutDate)
    }
}
