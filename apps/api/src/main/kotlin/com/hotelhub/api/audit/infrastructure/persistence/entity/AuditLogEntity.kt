package com.hotelhub.api.audit.infrastructure.persistence.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.PrePersist
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "audit_logs")
class AuditLogEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(name = "actor_id", nullable = false)
    var actorId: UUID,

    @Column(nullable = false, length = 120)
    var action: String,

    @Column(name = "entity_type", nullable = false, length = 80)
    var entityType: String,

    @Column(name = "entity_id", nullable = false)
    var entityId: UUID,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    var metadata: Map<String, String> = emptyMap(),

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now()
) {
    @PrePersist
    fun onCreate() {
        createdAt = Instant.now()
    }
}
