package com.hotelhub.api.reservations.presentation.dto

import com.hotelhub.api.reservations.domain.Reservation
import com.hotelhub.api.shared.domain.BookingSource
import com.hotelhub.api.shared.domain.ReservationStatus
import jakarta.validation.constraints.Min
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

data class CreateReservationRequest(
    val hotelId: UUID,
    val roomId: UUID,
    val checkInDate: LocalDate,
    val checkOutDate: LocalDate,

    @field:Min(1)
    val guestCount: Int,

    val bookingSource: BookingSource? = null
)

data class ReservationResponse(
    val id: UUID,
    val userId: UUID,
    val hotelId: UUID,
    val roomId: UUID,
    val checkInDate: LocalDate,
    val checkOutDate: LocalDate,
    val guestCount: Int,
    val totalAmount: BigDecimal,
    val status: ReservationStatus,
    val bookingSource: BookingSource,
    val createdAt: Instant,
    val updatedAt: Instant,
    val cancelledAt: Instant?,
    val checkedInAt: Instant?,
    val checkedOutAt: Instant?
)

fun Reservation.toResponse(): ReservationResponse {
    return ReservationResponse(
        id = id,
        userId = userId,
        hotelId = hotelId,
        roomId = roomId,
        checkInDate = checkInDate,
        checkOutDate = checkOutDate,
        guestCount = guestCount,
        totalAmount = totalAmount,
        status = status,
        bookingSource = bookingSource,
        createdAt = createdAt,
        updatedAt = updatedAt,
        cancelledAt = cancelledAt,
        checkedInAt = checkedInAt,
        checkedOutAt = checkedOutAt
    )
}
