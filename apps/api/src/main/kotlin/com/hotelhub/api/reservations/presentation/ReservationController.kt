package com.hotelhub.api.reservations.presentation

import com.hotelhub.api.reservations.application.ReservationService
import com.hotelhub.api.reservations.presentation.dto.CreateReservationRequest
import com.hotelhub.api.reservations.presentation.dto.ReservationResponse
import com.hotelhub.api.reservations.presentation.dto.toResponse
import com.hotelhub.api.shared.pagination.PageResponse
import com.hotelhub.api.shared.security.SecurityUtils
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
class ReservationController(
    private val reservationService: ReservationService
) {

    @GetMapping("/me")
    fun myReservations(
        @PageableDefault(size = 20, sort = ["createdAt"], direction = Sort.Direction.DESC) pageable: Pageable
    ): ResponseEntity<PageResponse<ReservationResponse>> {
        val userId = SecurityUtils.requireCurrentUserId()
        val page = reservationService.listMyReservations(userId, pageable).map { it.toResponse() }
        return ResponseEntity.ok(PageResponse.from(page))
    }

    @GetMapping("/{id}")
    fun getReservation(@PathVariable id: UUID): ResponseEntity<ReservationResponse> {
        val userId = SecurityUtils.requireCurrentUserId()
        return ResponseEntity.ok(reservationService.getMyReservation(userId, id).toResponse())
    }

    @PostMapping
    fun create(@Valid @RequestBody request: CreateReservationRequest): ResponseEntity<ReservationResponse> {
        val userId = SecurityUtils.requireCurrentUserId()
        return ResponseEntity.ok(reservationService.create(userId, request).toResponse())
    }

    @PatchMapping("/{id}/cancel")
    fun cancel(@PathVariable id: UUID): ResponseEntity<ReservationResponse> {
        val userId = SecurityUtils.requireCurrentUserId()
        return ResponseEntity.ok(reservationService.cancel(userId, id).toResponse())
    }
}
