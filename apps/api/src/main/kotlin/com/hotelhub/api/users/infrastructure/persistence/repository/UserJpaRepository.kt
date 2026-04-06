package com.hotelhub.api.users.infrastructure.persistence.repository

import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.domain.Role
import com.hotelhub.api.users.infrastructure.persistence.entity.UserEntity
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional
import java.util.UUID

interface UserJpaRepository : JpaRepository<UserEntity, UUID> {
    fun findByEmail(email: String): Optional<UserEntity>
    fun existsByEmail(email: String): Boolean
    fun existsByRole(role: Role): Boolean
    fun findAllByStatus(status: EntityStatus, pageable: Pageable): Page<UserEntity>
}
