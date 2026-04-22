package com.hotelhub.api.analytics.application

import com.hotelhub.api.analytics.presentation.dto.AnalyticsSummaryResponse
import com.hotelhub.api.analytics.presentation.dto.MonthlyRevenueEntry
import com.hotelhub.api.analytics.presentation.dto.TopHotelEntry
import com.hotelhub.api.reservations.infrastructure.persistence.repository.ReservationJpaRepository
import com.hotelhub.api.rooms.infrastructure.persistence.repository.RoomJpaRepository
import com.hotelhub.api.shared.domain.EntityStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import java.time.ZoneOffset

@Service
class AnalyticsService(
    private val reservationRepository: ReservationJpaRepository,
    private val roomRepository: RoomJpaRepository
) {

    @Transactional(readOnly = true)
    fun getSummary(): AnalyticsSummaryResponse {
        val today = LocalDate.now()
        val monthStart = today.withDayOfMonth(1)
        val last30Days = today.minusDays(30)

        val totalReservations = reservationRepository.countTotalReservations()
        val last30DaysReservations = reservationRepository.countReservationsSince(
            last30Days.atStartOfDay().toInstant(ZoneOffset.UTC)
        )
        val cancellations = reservationRepository.countCancelledReservations()
        val cancellationRate = if (totalReservations > 0)
            cancellations.toBigDecimal()
                .divide(totalReservations.toBigDecimal(), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal("100"))
                .setScale(2, RoundingMode.HALF_UP)
        else BigDecimal.ZERO

        val monthRevenue = reservationRepository.sumRevenueForPeriod(monthStart, today) ?: BigDecimal.ZERO
        val monthConfirmed = reservationRepository.countConfirmedForPeriod(monthStart, today)

        val totalRooms = roomRepository.countByStatus(EntityStatus.ACTIVE)
        val daysInMonth = monthStart.lengthOfMonth().toLong()
        val totalRoomNights = totalRooms * daysInMonth

        val occupiedNights = reservationRepository.sumOccupiedNightsForPeriod(monthStart, today) ?: 0L
        val occupancyRate = if (totalRoomNights > 0)
            occupiedNights.toBigDecimal()
                .divide(totalRoomNights.toBigDecimal(), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal("100"))
                .setScale(2, RoundingMode.HALF_UP)
        else BigDecimal.ZERO

        val adr = if (monthConfirmed > 0)
            monthRevenue.divide(monthConfirmed.toBigDecimal(), 2, RoundingMode.HALF_UP)
        else BigDecimal.ZERO

        val revPar = adr.multiply(occupancyRate.divide(BigDecimal("100"), 4, RoundingMode.HALF_UP))
            .setScale(2, RoundingMode.HALF_UP)

        val monthlyRevenue = reservationRepository.monthlyRevenueLast6Months()
            .map { row -> MonthlyRevenueEntry(month = row[0] as String, revenue = row[1] as BigDecimal) }

        val topHotels = reservationRepository.topHotelsByRevenue(5)
            .map { row ->
                TopHotelEntry(
                    hotelId = row[0].toString(),
                    hotelName = row[1] as String,
                    totalRevenue = row[2] as BigDecimal,
                    totalReservations = (row[3] as Number).toLong()
                )
            }

        return AnalyticsSummaryResponse(
            totalReservations = totalReservations,
            last30DaysReservations = last30DaysReservations,
            cancellationRate = cancellationRate,
            monthlyRevenue = monthRevenue.setScale(2, RoundingMode.HALF_UP),
            occupancyRate = occupancyRate,
            adr = adr,
            revPar = revPar,
            revenueByMonth = monthlyRevenue,
            topHotels = topHotels
        )
    }
}
