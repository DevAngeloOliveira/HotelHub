package com.hotelhub.api.audit.infrastructure.persistence.mapper

import com.hotelhub.api.audit.domain.AuditLog
import com.hotelhub.api.audit.infrastructure.persistence.entity.AuditLogEntity

fun AuditLogEntity.toDomain(): AuditLog {
    return AuditLog(
        id = id,
        actorId = actorId,
        action = action,
        entityType = entityType,
        entityId = entityId,
        metadata = metadata,
        createdAt = createdAt
    )
}
