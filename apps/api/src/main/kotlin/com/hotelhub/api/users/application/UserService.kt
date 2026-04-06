package com.hotelhub.api.users.application

import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.error.ResourceNotFoundException
import com.hotelhub.api.users.domain.User
import com.hotelhub.api.users.infrastructure.persistence.mapper.toDomain
import com.hotelhub.api.users.infrastructure.persistence.repository.UserJpaRepository
import com.hotelhub.api.users.presentation.dto.UpdateProfileRequest
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class UserService(
    private val userRepository: UserJpaRepository
) {

    @Transactional(readOnly = true)
    fun getById(userId: UUID): User {
        return userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found") }
            .toDomain()
    }

    @Transactional
    fun updateProfile(userId: UUID, request: UpdateProfileRequest): User {
        val userEntity = userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found") }
        userEntity.name = request.name.trim()
        userEntity.phone = request.phone.trim()
        return userRepository.save(userEntity).toDomain()
    }

    @Transactional(readOnly = true)
    fun listUsers(status: EntityStatus?, pageable: Pageable): Page<User> {
        val page = if (status == null) {
            userRepository.findAll(pageable)
        } else {
            userRepository.findAllByStatus(status, pageable)
        }
        return page.map { it.toDomain() }
    }
}
