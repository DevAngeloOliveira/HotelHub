package com.hotelhub.api.shared.security

import com.hotelhub.api.shared.config.JwtProperties
import com.hotelhub.api.shared.domain.Role
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Date
import java.util.UUID

@Component
class JwtService(
    private val properties: JwtProperties
) {

    private val signingKey = Keys.hmacShaKeyFor(properties.secret.toByteArray(StandardCharsets.UTF_8))

    fun generateToken(userId: UUID, role: Role): String {
        val issuedAt = Instant.now()
        val expiresAt = issuedAt.plus(properties.expirationMinutes, ChronoUnit.MINUTES)

        return Jwts.builder()
            .subject(userId.toString())
            .claim("role", role.name)
            .issuedAt(Date.from(issuedAt))
            .expiration(Date.from(expiresAt))
            .signWith(signingKey)
            .compact()
    }

    fun parse(token: String): AuthenticatedUser? {
        return runCatching {
            val claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .payload
            claims.toAuthenticatedUser()
        }.getOrNull()
    }

    private fun Claims.toAuthenticatedUser(): AuthenticatedUser {
        val role = Role.valueOf(get("role", String::class.java))
        return AuthenticatedUser(
            id = UUID.fromString(subject),
            role = role
        )
    }
}
