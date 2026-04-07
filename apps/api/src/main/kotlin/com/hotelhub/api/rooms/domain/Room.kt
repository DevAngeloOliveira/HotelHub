package com.hotelhub.api.rooms.domain

import com.hotelhub.api.shared.domain.EntityStatus
import java.io.Serializable
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

data class Room(
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
) : Serializable
