package com.hotelhub.api.users.domain

import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.domain.Role
import java.time.Instant
import java.util.UUID

data class User(
    val id: UUID,
    val name: String,
    val email: String,
    val passwordHash: String,
    val phone: String,
    val role: Role,
    val status: EntityStatus,
    val createdAt: Instant,
    val updatedAt: Instant
)
