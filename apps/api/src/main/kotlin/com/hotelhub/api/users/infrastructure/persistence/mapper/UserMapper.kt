package com.hotelhub.api.users.infrastructure.persistence.mapper

import com.hotelhub.api.users.domain.User
import com.hotelhub.api.users.infrastructure.persistence.entity.UserEntity

fun UserEntity.toDomain(): User {
    return User(
        id = id,
        name = name,
        email = email,
        passwordHash = passwordHash,
        phone = phone,
        role = role,
        status = status,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}
