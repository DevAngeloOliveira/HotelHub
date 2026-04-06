package com.hotelhub.api.reservations.domain

import com.hotelhub.api.shared.error.BusinessRuleException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDate

class ReservationRulesTest {

    @Test
    fun `calculate total amount by nights and nightly price`() {
        val checkIn = LocalDate.of(2026, 6, 10)
        val checkOut = LocalDate.of(2026, 6, 13)

        val total = ReservationRules.calculateTotalAmount(BigDecimal("150.00"), checkIn, checkOut)

        assertEquals(BigDecimal("450.00"), total)
    }

    @Test
    fun `reject reservation with invalid date range`() {
        val checkIn = LocalDate.of(2026, 6, 10)
        val checkOut = LocalDate.of(2026, 6, 10)

        assertThrows(BusinessRuleException::class.java) {
            ReservationRules.validateDates(checkIn, checkOut, today = LocalDate.of(2026, 1, 1))
        }
    }

    @Test
    fun `reject guest count above room capacity`() {
        assertThrows(BusinessRuleException::class.java) {
            ReservationRules.validateGuestCount(guestCount = 5, roomCapacity = 4)
        }
    }

    @Test
    fun `allow cancellation only before check-in`() {
        val checkIn = LocalDate.of(2026, 8, 10)
        assertTrue(ReservationRules.canCancel(checkInDate = checkIn, today = LocalDate.of(2026, 8, 9)))
        assertFalse(ReservationRules.canCancel(checkInDate = checkIn, today = LocalDate.of(2026, 8, 10)))
    }
}
