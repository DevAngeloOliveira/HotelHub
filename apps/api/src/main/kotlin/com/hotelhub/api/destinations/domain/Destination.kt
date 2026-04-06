package com.hotelhub.api.destinations.domain

import com.hotelhub.api.shared.domain.EntityStatus
import java.time.Instant
import java.util.UUID

data class Destination(
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
