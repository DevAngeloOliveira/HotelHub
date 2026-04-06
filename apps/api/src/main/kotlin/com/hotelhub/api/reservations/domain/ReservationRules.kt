package com.hotelhub.api.reservations.domain

import com.hotelhub.api.shared.error.BusinessRuleException
import java.math.BigDecimal
import java.time.LocalDate
import java.time.temporal.ChronoUnit

object ReservationRules {

    fun validateDates(checkInDate: LocalDate, checkOutDate: LocalDate, today: LocalDate = LocalDate.now()) {
        if (!checkOutDate.isAfter(checkInDate)) {
            throw BusinessRuleException("checkOutDate must be after checkInDate")
        }
        if (checkInDate.isBefore(today)) {
            throw BusinessRuleException("Cannot create reservation for past dates")
        }
    }

    fun validateGuestCount(guestCount: Int, roomCapacity: Int) {
        if (guestCount > roomCapacity) {
            throw BusinessRuleException("guestCount exceeds room capacity")
        }
    }

    fun calculateTotalAmount(pricePerNight: BigDecimal, checkInDate: LocalDate, checkOutDate: LocalDate): BigDecimal {
        val nights = ChronoUnit.DAYS.between(checkInDate, checkOutDate)
        return pricePerNight.multiply(BigDecimal.valueOf(nights))
    }

    fun canCancel(checkInDate: LocalDate, today: LocalDate = LocalDate.now()): Boolean {
        return today.isBefore(checkInDate)
    }
}
