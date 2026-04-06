package com.hotelhub.api.rooms.presentation

import com.hotelhub.api.audit.application.AuditService
import com.hotelhub.api.rooms.application.RoomAdminService
import com.hotelhub.api.rooms.presentation.dto.CreateRoomRequest
import com.hotelhub.api.rooms.presentation.dto.RoomAdminResponse
import com.hotelhub.api.rooms.presentation.dto.UpdateRoomRequest
import com.hotelhub.api.rooms.presentation.dto.UpdateRoomStatusRequest
import com.hotelhub.api.rooms.presentation.dto.toAdminResponse
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
@RequestMapping("/admin/rooms")
class AdminRoomController(
    private val roomAdminService: RoomAdminService,
    private val auditService: AuditService
) {

    @PostMapping
    fun create(@Valid @RequestBody request: CreateRoomRequest): ResponseEntity<RoomAdminResponse> {
        val room = roomAdminService.create(request)
        auditService.log(
            actorId = SecurityUtils.requireCurrentUserId(),
            action = "ADMIN_ROOM_CREATED",
            entityType = "ROOM",
            entityId = room.id,
            metadata = mapOf("name" to room.name, "hotelId" to room.hotelId.toString())
        )
        return ResponseEntity.ok(room.toAdminResponse())
    }

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateRoomRequest
    ): ResponseEntity<RoomAdminResponse> {
        val room = roomAdminService.update(id, request)
        auditService.log(
            actorId = SecurityUtils.requireCurrentUserId(),
            action = "ADMIN_ROOM_UPDATED",
            entityType = "ROOM",
            entityId = room.id,
            metadata = mapOf("name" to room.name, "hotelId" to room.hotelId.toString())
        )
        return ResponseEntity.ok(room.toAdminResponse())
    }

    @PatchMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateRoomStatusRequest
    ): ResponseEntity<RoomAdminResponse> {
        val room = roomAdminService.updateStatus(id, request.status)
        auditService.log(
            actorId = SecurityUtils.requireCurrentUserId(),
            action = "ADMIN_ROOM_STATUS_UPDATED",
            entityType = "ROOM",
            entityId = room.id,
            metadata = mapOf("status" to room.status.name)
        )
        return ResponseEntity.ok(room.toAdminResponse())
    }
}
