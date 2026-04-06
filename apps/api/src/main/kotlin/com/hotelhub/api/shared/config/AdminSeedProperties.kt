package com.hotelhub.api.shared.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app.admin-seed")
data class AdminSeedProperties(
    val enabled: Boolean,
    val email: String,
    val password: String,
    val name: String,
    val phone: String
)
