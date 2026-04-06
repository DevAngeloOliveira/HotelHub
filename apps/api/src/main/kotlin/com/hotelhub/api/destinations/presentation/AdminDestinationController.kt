package com.hotelhub.api.destinations.presentation

import com.hotelhub.api.audit.application.AuditService
import com.hotelhub.api.destinations.application.DestinationAdminService
import com.hotelhub.api.destinations.presentation.dto.CreateDestinationRequest
import com.hotelhub.api.destinations.presentation.dto.DestinationAdminResponse
import com.hotelhub.api.destinations.presentation.dto.UpdateDestinationRequest
import com.hotelhub.api.destinations.presentation.dto.UpdateDestinationStatusRequest
import com.hotelhub.api.destinations.presentation.dto.toAdminResponse
import com.hotelhub.api.shared.security.SecurityUtils
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/admin/destinations")
class AdminDestinationController(
    private val destinationAdminService: DestinationAdminService,
    private val auditService: AuditService
) {

    @PostMapping
    fun create(@Valid @RequestBody request: CreateDestinationRequest): ResponseEntity<DestinationAdminResponse> {
        val destination = destinationAdminService.create(request)
        auditService.log(
            actorId = SecurityUtils.requireCurrentUserId(),
            action = "ADMIN_DESTINATION_CREATED",
            entityType = "DESTINATION",
            entityId = destination.id,
            metadata = mapOf("name" to destination.name, "slug" to destination.slug)
        )
        return ResponseEntity.ok(destination.toAdminResponse())
    }

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateDestinationRequest
    ): ResponseEntity<DestinationAdminResponse> {
        val destination = destinationAdminService.update(id, request)
        auditService.log(
            actorId = SecurityUtils.requireCurrentUserId(),
            action = "ADMIN_DESTINATION_UPDATED",
            entityType = "DESTINATION",
            entityId = destination.id,
            metadata = mapOf("name" to destination.name, "slug" to destination.slug)
        )
        return ResponseEntity.ok(destination.toAdminResponse())
    }

    @PatchMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateDestinationStatusRequest
    ): ResponseEntity<DestinationAdminResponse> {
        val destination = destinationAdminService.updateStatus(id, request.status)
        auditService.log(
            actorId = SecurityUtils.requireCurrentUserId(),
            action = "ADMIN_DESTINATION_STATUS_UPDATED",
            entityType = "DESTINATION",
            entityId = destination.id,
            metadata = mapOf("status" to destination.status.name)
        )
        return ResponseEntity.ok(destination.toAdminResponse())
    }
}
