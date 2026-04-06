package com.hotelhub.api.shared.security

import com.hotelhub.api.shared.domain.Role
import com.hotelhub.api.shared.error.UnauthorizedException
import org.springframework.security.core.context.SecurityContextHolder
import java.util.UUID

object SecurityUtils {

    fun requireCurrentUserId(): UUID {
        return requireAuthenticatedUser().id
    }

    fun requireCurrentRole(): Role {
        return requireAuthenticatedUser().role
    }

    private fun requireAuthenticatedUser(): AuthenticatedUser {
        val principal = SecurityContextHolder.getContext().authentication?.principal
        if (principal is AuthenticatedUser) {
            return principal
        }
        throw UnauthorizedException("Authentication required")
    }
}
