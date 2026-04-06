package com.hotelhub.api.audit.application

import com.hotelhub.api.audit.domain.AuditLog
import com.hotelhub.api.audit.infrastructure.persistence.entity.AuditLogEntity
import com.hotelhub.api.audit.infrastructure.persistence.mapper.toDomain
import com.hotelhub.api.audit.infrastructure.persistence.repository.AuditLogJpaRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class AuditService(
    private val auditLogRepository: AuditLogJpaRepository
) {

    @Transactional(propagation = Propagation.REQUIRED)
    fun log(
        actorId: UUID,
        action: String,
        entityType: String,
        entityId: UUID,
        metadata: Map<String, Any?>
    ): AuditLog {
        val serializedMetadata = metadata.mapValues { (_, value) -> value?.toString() ?: "null" }
        return auditLogRepository.save(
            AuditLogEntity(
                actorId = actorId,
                action = action,
                entityType = entityType,
                entityId = entityId,
                metadata = serializedMetadata
            )
        ).toDomain()
    }
}
