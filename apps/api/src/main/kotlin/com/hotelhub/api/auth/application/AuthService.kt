package com.hotelhub.api.auth.application

import com.hotelhub.api.auth.presentation.dto.AuthResponse
import com.hotelhub.api.auth.presentation.dto.LoginRequest
import com.hotelhub.api.auth.presentation.dto.RegisterRequest
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.domain.Role
import com.hotelhub.api.shared.error.ConflictException
import com.hotelhub.api.shared.error.UnauthorizedException
import com.hotelhub.api.shared.security.JwtService
import com.hotelhub.api.users.infrastructure.persistence.entity.UserEntity
import com.hotelhub.api.users.infrastructure.persistence.mapper.toDomain
import com.hotelhub.api.users.infrastructure.persistence.repository.UserJpaRepository
import com.hotelhub.api.users.presentation.dto.toProfileResponse
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class AuthService(
    private val userRepository: UserJpaRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        val email = request.email.trim().lowercase()
        if (userRepository.existsByEmail(email)) {
            throw ConflictException("Email already in use")
        }

        val savedUser = userRepository.save(
            UserEntity(
                id = UUID.randomUUID(),
                name = request.name.trim(),
                email = email,
                passwordHash = passwordEncoder.encode(request.password),
                phone = request.phone.trim(),
                role = Role.CLIENT,
                status = EntityStatus.ACTIVE
            )
        )

        val user = savedUser.toDomain()
        return AuthResponse(
            accessToken = jwtService.generateToken(user.id, user.role),
            user = user.toProfileResponse()
        )
    }

    @Transactional(readOnly = true)
    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email.trim().lowercase())
            .orElseThrow { UnauthorizedException("Invalid credentials") }

        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw UnauthorizedException("Invalid credentials")
        }
        if (user.status != EntityStatus.ACTIVE) {
            throw UnauthorizedException("Inactive user")
        }

        val domain = user.toDomain()
        return AuthResponse(
            accessToken = jwtService.generateToken(domain.id, domain.role),
            user = domain.toProfileResponse()
        )
    }
}
