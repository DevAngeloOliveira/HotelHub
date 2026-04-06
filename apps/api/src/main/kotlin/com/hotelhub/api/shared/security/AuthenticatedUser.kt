package com.hotelhub.api.shared.security

import com.hotelhub.api.shared.domain.Role
import java.util.UUID

data class AuthenticatedUser(
    val id: UUID,
    val role: Role
)
