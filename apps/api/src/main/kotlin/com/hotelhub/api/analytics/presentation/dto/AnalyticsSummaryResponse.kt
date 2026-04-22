package com.hotelhub.api.analytics.presentation.dto

import java.math.BigDecimal

data class AnalyticsSummaryResponse(
    val totalReservations: Long,
    val last30DaysReservations: Long,
    val cancellationRate: BigDecimal,
    val monthlyRevenue: BigDecimal,
    val occupancyRate: BigDecimal,
    val adr: BigDecimal,
    val revPar: BigDecimal,
    val revenueByMonth: List<MonthlyRevenueEntry>,
    val topHotels: List<TopHotelEntry>
)

data class MonthlyRevenueEntry(
    val month: String,
    val revenue: BigDecimal
)

data class TopHotelEntry(
    val hotelId: String,
    val hotelName: String,
    val totalRevenue: BigDecimal,
    val totalReservations: Long
)
