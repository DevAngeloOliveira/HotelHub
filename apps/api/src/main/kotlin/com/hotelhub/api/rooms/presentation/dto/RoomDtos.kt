package com.hotelhub.api.rooms.presentation.dto

import com.hotelhub.api.rooms.application.RoomAvailabilityView
import com.hotelhub.api.rooms.domain.Room
import com.hotelhub.api.shared.domain.EntityStatus
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

data class RoomSummaryResponse(
    val id: UUID,
    val hotelId: UUID,
    val name: String,
    val type: String,
    val description: String,
    val capacity: Int,
    val pricePerNight: BigDecimal,
    val quantity: Int,
    val status: EntityStatus,
    val available: Boolean? = null,
    val availableUnits: Int? = null
)

data class RoomAdminResponse(
    val id: UUID,
    val hotelId: UUID,
    val name: String,
    val type: String,
    val description: String,
    val capacity: Int,
    val pricePerNight: BigDecimal,
    val quantity: Int,
    val status: EntityStatus,
    val createdAt: Instant,
    val updatedAt: Instant
)

data class CreateRoomRequest(
    val hotelId: UUID,

    @field:NotBlank
    @field:Size(max = 120)
    val name: String,

    @field:NotBlank
    @field:Size(max = 80)
    val type: String,

    @field:NotBlank
    @field:Size(max = 2000)
    val description: String,

    @field:Min(1)
    val capacity: Int,

    @field:DecimalMin(value = "0.01")
    val pricePerNight: BigDecimal,

    @field:Min(1)
    val quantity: Int
)

data class UpdateRoomRequest(
    val hotelId: UUID,

    @field:NotBlank
    @field:Size(max = 120)
    val name: String,

    @field:NotBlank
    @field:Size(max = 80)
    val type: String,

    @field:NotBlank
    @field:Size(max = 2000)
    val description: String,

    @field:Min(1)
    val capacity: Int,

    @field:DecimalMin(value = "0.01")
    val pricePerNight: BigDecimal,

    @field:Min(1)
    val quantity: Int
)

data class UpdateRoomStatusRequest(
    @field:NotNull
    val status: EntityStatus
)

fun Room.toSummaryResponse(available: Boolean? = null, availableUnits: Int? = null): RoomSummaryResponse {
    return RoomSummaryResponse(
        id = id,
        hotelId = hotelId,
        name = name,
        type = type,
        description = description,
        capacity = capacity,
        pricePerNight = pricePerNight,
        quantity = quantity,
        status = status,
        available = available,
        availableUnits = availableUnits
    )
}

fun Room.toAdminResponse(): RoomAdminResponse {
    return RoomAdminResponse(
        id = id,
        hotelId = hotelId,
        name = name,
        type = type,
        description = description,
        capacity = capacity,
        pricePerNight = pricePerNight,
        quantity = quantity,
        status = status,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}

fun RoomAvailabilityView.toSummaryResponse(): RoomSummaryResponse {
    return room.toSummaryResponse(
        available = available,
        availableUnits = availableUnits
    )
}
