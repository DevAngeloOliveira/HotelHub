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
import org.slf4j.LoggerFactory
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
    companion object {
        private val logger = LoggerFactory.getLogger(AuthService::class.java)
    }

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        logger.debug("User registration attempt", mapOf("email" to request.email))
        try {
            val email = request.email.trim().lowercase()
            if (userRepository.existsByEmail(email)) {
                logger.warn("Registration failed: email already in use", mapOf("email" to email))
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
            logger.info("User registered successfully", mapOf("userId" to user.id, "email" to email))
            return AuthResponse(
                accessToken = jwtService.generateToken(user.id, user.role),
                user = user.toProfileResponse()
            )
        } catch (e: ConflictException) {
            logger.debug("Registration rejected", mapOf("email" to request.email, "reason" to e.message))
            throw e
        } catch (e: Exception) {
            logger.error("Unexpected error during registration", mapOf("email" to request.email), e)
            throw e
        }
    }

    @Transactional(readOnly = true)
    fun login(request: LoginRequest): AuthResponse {
        logger.debug("Login attempt", mapOf("email" to request.email))
        try {
            val user = userRepository.findByEmail(request.email.trim().lowercase())
                .orElseThrow { UnauthorizedException("Invalid credentials") }

            if (!passwordEncoder.matches(request.password, user.passwordHash)) {
                logger.warn("Login failed: invalid password", mapOf("email" to request.email, "userId" to user.id))
                throw UnauthorizedException("Invalid credentials")
            }
            if (user.status != EntityStatus.ACTIVE) {
                logger.warn("Login failed: inactive user", mapOf("email" to request.email, "userId" to user.id))
                throw UnauthorizedException("Inactive user")
            }

            val domain = user.toDomain()
            logger.info("User logged in successfully", mapOf("userId" to domain.id, "email" to request.email))
            return AuthResponse(
                accessToken = jwtService.generateToken(domain.id, domain.role),
                user = domain.toProfileResponse()
            )
        } catch (e: UnauthorizedException) {
            logger.debug("Login rejected", mapOf("email" to request.email, "reason" to e.message))
            throw e
        } catch (e: Exception) {
            logger.error("Unexpected error during login", mapOf("email" to request.email), e)
            throw e
        }
    }
}
