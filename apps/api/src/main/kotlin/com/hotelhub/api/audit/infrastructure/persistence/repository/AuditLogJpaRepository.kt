package com.hotelhub.api.audit.infrastructure.persistence.repository

import com.hotelhub.api.audit.infrastructure.persistence.entity.AuditLogEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface AuditLogJpaRepository : JpaRepository<AuditLogEntity, UUID>
