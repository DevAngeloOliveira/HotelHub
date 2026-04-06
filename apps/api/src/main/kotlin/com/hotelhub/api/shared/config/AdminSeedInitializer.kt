package com.hotelhub.api.shared.config

import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.domain.Role
import com.hotelhub.api.users.infrastructure.persistence.entity.UserEntity
import com.hotelhub.api.users.infrastructure.persistence.repository.UserJpaRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class AdminSeedInitializer(
    private val adminSeedProperties: AdminSeedProperties,
    private val userRepository: UserJpaRepository,
    private val passwordEncoder: PasswordEncoder
) : CommandLineRunner {

    private val logger = LoggerFactory.getLogger(javaClass)

    override fun run(vararg args: String?) {
        if (!adminSeedProperties.enabled) {
            return
        }
        if (adminSeedProperties.email.isBlank() || adminSeedProperties.password.isBlank()) {
            logger.warn("ADMIN_SEED_ENABLED is true but credentials are missing")
            return
        }

        val email = adminSeedProperties.email.trim().lowercase()
        if (userRepository.existsByEmail(email)) {
            logger.info("Admin seed skipped because user already exists: {}", email)
            return
        }

        userRepository.save(
            UserEntity(
                id = UUID.randomUUID(),
                name = adminSeedProperties.name.trim(),
                email = email,
                passwordHash = passwordEncoder.encode(adminSeedProperties.password),
                phone = adminSeedProperties.phone.trim().ifBlank { "N/A" },
                role = Role.ADMIN,
                status = EntityStatus.ACTIVE
            )
        )
        logger.info("Admin user seeded for {}", email)
    }
}
