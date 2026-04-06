package com.hotelhub.api.auth.presentation.dto

import com.hotelhub.api.users.presentation.dto.UserProfileResponse

data class AuthResponse(
    val accessToken: String,
    val tokenType: String = "Bearer",
    val user: UserProfileResponse
)
