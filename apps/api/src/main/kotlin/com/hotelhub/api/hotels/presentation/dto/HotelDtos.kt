package com.hotelhub.api.hotels.presentation.dto

import com.hotelhub.api.hotels.domain.Hotel
import com.hotelhub.api.rooms.presentation.dto.RoomSummaryResponse
import com.hotelhub.api.shared.domain.EntityStatus
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import java.time.Instant
import java.util.UUID

data class HotelSummaryResponse(
    val id: UUID,
    val destinationId: UUID,
    val name: String,
    val address: String,
    val category: String,
    val amenities: List<String>,
    val imageUrls: List<String>,
    val contactPhone: String,
    val contactEmail: String
)

data class HotelDetailResponse(
    val id: UUID,
    val destinationId: UUID,
    val name: String,
    val description: String,
    val address: String,
    val category: String,
    val amenities: List<String>,
    val imageUrls: List<String>,
    val contactPhone: String,
    val contactEmail: String,
    val status: EntityStatus,
    val rooms: List<RoomSummaryResponse>
)

data class HotelAdminResponse(
    val id: UUID,
    val destinationId: UUID,
    val name: String,
    val description: String,
    val address: String,
    val category: String,
    val amenities: List<String>,
    val imageUrls: List<String>,
    val contactPhone: String,
    val contactEmail: String,
    val status: EntityStatus,
    val createdAt: Instant,
    val updatedAt: Instant
)

data class CreateHotelRequest(
    val destinationId: UUID,

    @field:NotBlank
    @field:Size(max = 140)
    val name: String,

    @field:NotBlank
    @field:Size(max = 3000)
    val description: String,

    @field:NotBlank
    @field:Size(max = 240)
    val address: String,

    @field:NotBlank
    @field:Size(max = 80)
    val category: String,

    @field:NotEmpty
    val amenities: List<@Size(max = 60) String>,

    val imageUrls: List<@Size(max = 500) String> = emptyList(),

    @field:NotBlank
    @field:Pattern(regexp = "^[0-9+()\\-\\s]{8,32}$")
    val contactPhone: String,

    @field:NotBlank
    @field:Email
    @field:Size(max = 160)
    val contactEmail: String
)

data class UpdateHotelRequest(
    val destinationId: UUID,

    @field:NotBlank
    @field:Size(max = 140)
    val name: String,

    @field:NotBlank
    @field:Size(max = 3000)
    val description: String,

    @field:NotBlank
    @field:Size(max = 240)
    val address: String,

    @field:NotBlank
    @field:Size(max = 80)
    val category: String,

    @field:NotEmpty
    val amenities: List<@Size(max = 60) String>,

    val imageUrls: List<@Size(max = 500) String> = emptyList(),

    @field:NotBlank
    @field:Pattern(regexp = "^[0-9+()\\-\\s]{8,32}$")
    val contactPhone: String,

    @field:NotBlank
    @field:Email
    @field:Size(max = 160)
    val contactEmail: String
)

data class UpdateHotelStatusRequest(
    @field:NotNull
    val status: EntityStatus
)

fun Hotel.toSummaryResponse(): HotelSummaryResponse {
    return HotelSummaryResponse(
        id = id,
        destinationId = destinationId,
        name = name,
        address = address,
        category = category,
        amenities = amenities,
        imageUrls = imageUrls,
        contactPhone = contactPhone,
        contactEmail = contactEmail
    )
}

fun Hotel.toAdminResponse(): HotelAdminResponse {
    return HotelAdminResponse(
        id = id,
        destinationId = destinationId,
        name = name,
        description = description,
        address = address,
        category = category,
        amenities = amenities,
        imageUrls = imageUrls,
        contactPhone = contactPhone,
        contactEmail = contactEmail,
        status = status,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}
