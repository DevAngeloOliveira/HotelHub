package com.hotelhub.api.packages.presentation

import com.hotelhub.api.packages.application.TravelPackageService
import com.hotelhub.api.packages.presentation.dto.CreateTravelPackageRequest
import com.hotelhub.api.packages.presentation.dto.TravelPackageResponse
import com.hotelhub.api.packages.presentation.dto.UpdatePackageStatusRequest
import com.hotelhub.api.packages.presentation.dto.UpdateTravelPackageRequest
import com.hotelhub.api.packages.presentation.dto.toResponse
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.pagination.PageResponse
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/admin/packages")
@Tag(name = "Admin Travel Packages", description = "CRUD management of travel packages - Admin only")
@SecurityRequirement(name = "bearer-jwt")
class AdminTravelPackageController(
    private val packageService: TravelPackageService
) {

    @GetMapping
    @Operation(summary = "List all travel packages (admin)")
    fun list(
        @RequestParam(required = false) status: EntityStatus?,
        @RequestParam(required = false) hotelId: UUID?,
        @PageableDefault(size = 20, sort = ["createdAt"], direction = Sort.Direction.DESC) pageable: Pageable
    ): ResponseEntity<PageResponse<TravelPackageResponse>> {
        val page = packageService.adminList(status, hotelId, pageable).map { it.toResponse() }
        return ResponseEntity.ok(PageResponse.from(page))
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get travel package by ID (admin)")
    fun getById(@PathVariable id: UUID): ResponseEntity<TravelPackageResponse> {
        return ResponseEntity.ok(packageService.getById(id).toResponse())
    }

    @PostMapping
    @Operation(summary = "Create a new travel package")
    fun create(@Valid @RequestBody request: CreateTravelPackageRequest): ResponseEntity<TravelPackageResponse> {
        return ResponseEntity.ok(packageService.create(request).toResponse())
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a travel package")
    fun update(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateTravelPackageRequest
    ): ResponseEntity<TravelPackageResponse> {
        return ResponseEntity.ok(packageService.update(id, request).toResponse())
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update travel package status (ACTIVE / INACTIVE)")
    fun updateStatus(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdatePackageStatusRequest
    ): ResponseEntity<TravelPackageResponse> {
        return ResponseEntity.ok(packageService.updateStatus(id, request.status).toResponse())
    }
}
