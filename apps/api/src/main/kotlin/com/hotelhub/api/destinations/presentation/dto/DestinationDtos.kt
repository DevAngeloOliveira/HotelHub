package com.hotelhub.api.destinations.presentation.dto

import com.hotelhub.api.destinations.domain.Destination
import com.hotelhub.api.hotels.presentation.dto.HotelSummaryResponse
import com.hotelhub.api.shared.domain.EntityStatus
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import java.time.Instant
import java.util.UUID

data class DestinationSummaryResponse(
    val id: UUID,
    val name: String,
    val slug: String,
    val city: String,
    val state: String,
    val country: String,
    val category: String,
    val featuredImageUrl: String
)

data class DestinationDetailResponse(
    val id: UUID,
    val name: String,
    val slug: String,
    val description: String,
    val city: String,
    val state: String,
    val country: String,
    val category: String,
    val featuredImageUrl: String,
    val status: EntityStatus,
    val hotels: List<HotelSummaryResponse>
)

data class DestinationAdminResponse(
    val id: UUID,
    val name: String,
    val slug: String,
    val description: String,
    val city: String,
    val state: String,
    val country: String,
    val category: String,
    val featuredImageUrl: String,
    val status: EntityStatus,
    val createdAt: Instant,
    val updatedAt: Instant
)

data class CreateDestinationRequest(
    @field:NotBlank
    @field:Size(max = 120)
    val name: String,

    @field:NotBlank
    @field:Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$")
    @field:Size(max = 140)
    val slug: String,

    @field:NotBlank
    @field:Size(max = 3000)
    val description: String,

    @field:NotBlank
    @field:Size(max = 100)
    val city: String,

    @field:NotBlank
    @field:Size(max = 100)
    val state: String,

    @field:NotBlank
    @field:Size(max = 100)
    val country: String,

    @field:NotBlank
    @field:Size(max = 80)
    val category: String,

    @field:NotBlank
    @field:Size(max = 500)
    val featuredImageUrl: String
)

data class UpdateDestinationRequest(
    @field:NotBlank
    @field:Size(max = 120)
    val name: String,

    @field:NotBlank
    @field:Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$")
    @field:Size(max = 140)
    val slug: String,

    @field:NotBlank
    @field:Size(max = 3000)
    val description: String,

    @field:NotBlank
    @field:Size(max = 100)
    val city: String,

    @field:NotBlank
    @field:Size(max = 100)
    val state: String,

    @field:NotBlank
    @field:Size(max = 100)
    val country: String,

    @field:NotBlank
    @field:Size(max = 80)
    val category: String,

    @field:NotBlank
    @field:Size(max = 500)
    val featuredImageUrl: String
)

data class UpdateDestinationStatusRequest(
    @field:NotNull
    val status: EntityStatus
)

fun Destination.toSummaryResponse(): DestinationSummaryResponse {
    return DestinationSummaryResponse(
        id = id,
        name = name,
        slug = slug,
        city = city,
        state = state,
        country = country,
        category = category,
        featuredImageUrl = featuredImageUrl
    )
}

fun Destination.toAdminResponse(): DestinationAdminResponse {
    return DestinationAdminResponse(
        id = id,
        name = name,
        slug = slug,
        description = description,
        city = city,
        state = state,
        country = country,
        category = category,
        featuredImageUrl = featuredImageUrl,
        status = status,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}
