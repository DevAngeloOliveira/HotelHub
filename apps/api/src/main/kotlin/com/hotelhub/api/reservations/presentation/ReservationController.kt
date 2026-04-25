package com.hotelhub.api.reservations.presentation

import com.hotelhub.api.reservations.application.ReservationService
import com.hotelhub.api.reservations.presentation.dto.CreateReservationRequest
import com.hotelhub.api.reservations.presentation.dto.ReservationResponse
import com.hotelhub.api.reservations.presentation.dto.toResponse
import com.hotelhub.api.shared.pagination.PageResponse
import com.hotelhub.api.shared.security.SecurityUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
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
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/reservations")
@Tag(name = "Reservations", description = "User reservation endpoints - Authentication required")
@SecurityRequirement(name = "bearer-jwt")
class ReservationController(
    private val reservationService: ReservationService
) {

    @GetMapping("/me")
    @Operation(
        summary = "List my reservations",
        description = "Retrieve all reservations for the authenticated user with pagination"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Reservations retrieved successfully"),
            ApiResponse(responseCode = "401", description = "Unauthorized - authentication required")
        ]
    )
    fun myReservations(
        @PageableDefault(size = 20, sort = ["createdAt"], direction = Sort.Direction.DESC) pageable: Pageable
    ): ResponseEntity<PageResponse<ReservationResponse>> {
        val userId = SecurityUtils.requireCurrentUserId()
        val page = reservationService.listMyReservations(userId, pageable).map { it.toResponse() }
        return ResponseEntity.ok(PageResponse.from(page))
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get reservation details",
        description = "Retrieve details of a specific reservation (must be owned by authenticated user)"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Reservation found"),
            ApiResponse(responseCode = "401", description = "Unauthorized - authentication required"),
            ApiResponse(responseCode = "404", description = "Reservation not found")
        ]
    )
    fun getReservation(
        @PathVariable
        @Parameter(description = "Reservation ID (UUID)")
        id: UUID
    ): ResponseEntity<ReservationResponse> {
        val userId = SecurityUtils.requireCurrentUserId()
        return ResponseEntity.ok(reservationService.getMyReservation(userId, id).toResponse())
    }

    @PostMapping
    @Operation(
        summary = "Create a new reservation",
        description = "Create a new hotel reservation. Check-out must be after check-in, and guest count must not exceed room capacity"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Reservation created successfully"),
            ApiResponse(responseCode = "400", description = "Invalid request data"),
            ApiResponse(responseCode = "401", description = "Unauthorized - authentication required"),
            ApiResponse(responseCode = "404", description = "Hotel or room not found"),
            ApiResponse(responseCode = "409", description = "Room not available for selected period")
        ]
    )
    fun create(
        @Valid
        @RequestBody
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Reservation details",
            required = true,
            content = [Content(schema = Schema(implementation = CreateReservationRequest::class))]
        )
        request: CreateReservationRequest
    ): ResponseEntity<ReservationResponse> {
        val userId = SecurityUtils.requireCurrentUserId()
        return ResponseEntity.ok(reservationService.create(userId, request).toResponse())
    }

    @PatchMapping("/{id}/cancel")
    @Operation(
        summary = "Cancel a reservation",
        description = "Cancel an existing reservation. Can only be done before check-in date"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Reservation cancelled successfully"),
            ApiResponse(responseCode = "401", description = "Unauthorized - authentication required"),
            ApiResponse(responseCode = "404", description = "Reservation not found"),
            ApiResponse(responseCode = "409", description = "Reservation cannot be cancelled")
        ]
    )
    fun cancel(
        @PathVariable
        @Parameter(description = "Reservation ID (UUID)")
        id: UUID
    ): ResponseEntity<ReservationResponse> {
        val userId = SecurityUtils.requireCurrentUserId()
        return ResponseEntity.ok(reservationService.cancel(userId, id).toResponse())
    }

    @PatchMapping("/{id}/check-in")
    @Operation(
        summary = "Check in to a reservation",
        description = "Mark a CONFIRMED reservation as CHECKED_IN. Only allowed on or after the check-in date"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Checked in successfully"),
            ApiResponse(responseCode = "400", description = "Check-in conditions not met"),
            ApiResponse(responseCode = "401", description = "Unauthorized - authentication required"),
            ApiResponse(responseCode = "404", description = "Reservation not found")
        ]
    )
    fun checkIn(
        @PathVariable
        @Parameter(description = "Reservation ID (UUID)")
        id: UUID
    ): ResponseEntity<ReservationResponse> {
        val userId = SecurityUtils.requireCurrentUserId()
        return ResponseEntity.ok(reservationService.checkIn(userId, id).toResponse())
    }

    @PatchMapping("/{id}/check-out")
    @Operation(
        summary = "Check out from a reservation",
        description = "Mark a CHECKED_IN reservation as CHECKED_OUT"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Checked out successfully"),
            ApiResponse(responseCode = "400", description = "Reservation is not in CHECKED_IN status"),
            ApiResponse(responseCode = "401", description = "Unauthorized - authentication required"),
            ApiResponse(responseCode = "404", description = "Reservation not found")
        ]
    )
    fun checkOut(
        @PathVariable
        @Parameter(description = "Reservation ID (UUID)")
        id: UUID
    ): ResponseEntity<ReservationResponse> {
        val userId = SecurityUtils.requireCurrentUserId()
        return ResponseEntity.ok(reservationService.checkOut(userId, id).toResponse())
    }
}
