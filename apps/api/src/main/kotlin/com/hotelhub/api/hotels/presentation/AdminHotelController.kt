package com.hotelhub.api.hotels.presentation

import com.hotelhub.api.audit.application.AuditService
import com.hotelhub.api.hotels.application.HotelAdminService
import com.hotelhub.api.hotels.presentation.dto.CreateHotelRequest
import com.hotelhub.api.hotels.presentation.dto.HotelAdminResponse
import com.hotelhub.api.hotels.presentation.dto.UpdateHotelRequest
import com.hotelhub.api.hotels.presentation.dto.UpdateHotelStatusRequest
import com.hotelhub.api.hotels.presentation.dto.toAdminResponse
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
@RequestMapping("/admin/hotels")
class AdminHotelController(
    private val hotelAdminService: HotelAdminService,
    private val auditService: AuditService
) {

    @PostMapping
    fun create(@Valid @RequestBody request: CreateHotelRequest): ResponseEntity<HotelAdminResponse> {
        val hotel = hotelAdminService.create(request)
        auditService.log(
            actorId = SecurityUtils.requireCurrentUserId(),
            action = "ADMIN_HOTEL_CREATED",
            entityType = "HOTEL",
            entityId = hotel.id,
            metadata = mapOf("name" to hotel.name, "destinationId" to hotel.destinationId.toString())
        )
        return ResponseEntity.ok(hotel.toAdminResponse())
    }

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateHotelRequest
    ): ResponseEntity<HotelAdminResponse> {
        val hotel = hotelAdminService.update(id, request)
        auditService.log(
            actorId = SecurityUtils.requireCurrentUserId(),
            action = "ADMIN_HOTEL_UPDATED",
            entityType = "HOTEL",
            entityId = hotel.id,
            metadata = mapOf("name" to hotel.name, "destinationId" to hotel.destinationId.toString())
        )
        return ResponseEntity.ok(hotel.toAdminResponse())
    }

    @PatchMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateHotelStatusRequest
    ): ResponseEntity<HotelAdminResponse> {
        val hotel = hotelAdminService.updateStatus(id, request.status)
        auditService.log(
            actorId = SecurityUtils.requireCurrentUserId(),
            action = "ADMIN_HOTEL_STATUS_UPDATED",
            entityType = "HOTEL",
            entityId = hotel.id,
            metadata = mapOf("status" to hotel.status.name)
        )
        return ResponseEntity.ok(hotel.toAdminResponse())
    }
}
