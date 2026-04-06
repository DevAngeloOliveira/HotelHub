package com.hotelhub.api.users.presentation.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

data class UpdateProfileRequest(
    @field:NotBlank
    @field:Size(max = 120)
    val name: String,

    @field:NotBlank
    @field:Pattern(regexp = "^[0-9+()\\-\\s]{8,32}$")
    val phone: String
)
