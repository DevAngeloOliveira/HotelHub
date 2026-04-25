package com.hotelhub.api.reservations.domain

import com.hotelhub.api.shared.domain.BookingSource
import com.hotelhub.api.shared.domain.ReservationStatus
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

data class Reservation(
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
