package com.hotelhub.api.packages.presentation.dto

import com.hotelhub.api.packages.domain.TravelPackage
import com.hotelhub.api.shared.domain.EntityStatus
import jakarta.validation.constraints.DecimalMax
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

data class TravelPackageResponse(
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
)

data class CreateTravelPackageRequest(
    @field:NotNull
    val hotelId: UUID,

    @field:NotBlank
    @field:Size(max = 160)
    val name: String,

    @field:NotBlank
    @field:Size(max = 3000)
    val description: String,

    val highlightedServices: List<@Size(max = 120) String> = emptyList(),

    @field:DecimalMin("0.00")
    @field:DecimalMax("99.99")
    val discountPercentage: BigDecimal = BigDecimal.ZERO,

    @field:NotNull
    val validFrom: LocalDate,

    @field:NotNull
    val validTo: LocalDate
)

data class UpdateTravelPackageRequest(
    @field:NotBlank
    @field:Size(max = 160)
    val name: String,

    @field:NotBlank
    @field:Size(max = 3000)
    val description: String,

    val highlightedServices: List<@Size(max = 120) String> = emptyList(),

    @field:DecimalMin("0.00")
    @field:DecimalMax("99.99")
    val discountPercentage: BigDecimal = BigDecimal.ZERO,

    @field:NotNull
    val validFrom: LocalDate,

    @field:NotNull
    val validTo: LocalDate
)

data class UpdatePackageStatusRequest(
    @field:NotNull
    val status: EntityStatus
)

fun TravelPackage.toResponse(): TravelPackageResponse {
    return TravelPackageResponse(
        id = id,
        hotelId = hotelId,
        name = name,
        description = description,
        highlightedServices = highlightedServices,
        discountPercentage = discountPercentage,
        validFrom = validFrom,
        validTo = validTo,
        status = status,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}
