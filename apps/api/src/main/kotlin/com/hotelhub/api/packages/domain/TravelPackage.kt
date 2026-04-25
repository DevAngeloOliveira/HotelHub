package com.hotelhub.api.packages.domain

import com.hotelhub.api.shared.domain.EntityStatus
import java.io.Serializable
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

data class TravelPackage(
    val id: UUID,
    val hotelId: UUID,
    val name: String,
    val description: String,
    val highlightedServices: List<String>,
    val discountPercentage: BigDecimal,
    val validFrom: LocalDate,
    val validTo: LocalDate,
    val status: EntityStatus,
    val createdAt: Instant,
    val updatedAt: Instant
) : Serializable
