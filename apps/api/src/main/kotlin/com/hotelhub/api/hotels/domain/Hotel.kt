package com.hotelhub.api.hotels.domain

import com.hotelhub.api.shared.domain.EntityStatus
import java.io.Serializable
import java.time.Instant
import java.util.UUID

data class Hotel(
    val id: UUID,
    val destinationId: UUID,
    val name: String,
    val description: String,
    val address: String,
    val category: String,
    val amenities: List<String>,
    val contactPhone: String,
    val contactEmail: String,
    val status: EntityStatus,
    val createdAt: Instant,
    val updatedAt: Instant
) : Serializable
