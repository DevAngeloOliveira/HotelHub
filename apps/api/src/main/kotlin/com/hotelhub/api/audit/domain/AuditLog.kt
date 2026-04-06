package com.hotelhub.api.audit.domain

import java.time.Instant
import java.util.UUID

data class AuditLog(
    val id: UUID,
    val actorId: UUID,
    val action: String,
    val entityType: String,
    val entityId: UUID,
    val metadata: Map<String, String>,
    val createdAt: Instant
)
