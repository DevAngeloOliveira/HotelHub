package com.hotelhub.api.reservations.infrastructure.persistence.mapper

import com.hotelhub.api.reservations.domain.Reservation
import com.hotelhub.api.reservations.infrastructure.persistence.entity.ReservationEntity

fun ReservationEntity.toDomain(): Reservation {
    return Reservation(
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
