package com.hotelhub.api.users.presentation.dto

import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.domain.Role
import com.hotelhub.api.users.domain.User
import java.time.Instant
import java.util.UUID

data class UserProfileResponse(
    val id: UUID,
    val name: String,
    val email: String,
    val phone: String,
    val role: Role,
    val status: EntityStatus,
    val createdAt: Instant,
    val updatedAt: Instant
)

fun User.toProfileResponse(): UserProfileResponse {
    return UserProfileResponse(
        id = id,
        name = name,
        email = email,
        phone = phone,
        role = role,
        status = status,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}
