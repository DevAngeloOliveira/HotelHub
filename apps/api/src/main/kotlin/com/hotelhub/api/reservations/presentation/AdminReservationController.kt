package com.hotelhub.api.reservations.presentation

import com.hotelhub.api.reservations.application.AdminReservationService
import com.hotelhub.api.reservations.presentation.dto.ReservationResponse
import com.hotelhub.api.reservations.presentation.dto.toResponse
import com.hotelhub.api.shared.domain.ReservationStatus
import com.hotelhub.api.shared.pagination.PageResponse
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate
import java.util.UUID

@RestController
@RequestMapping("/admin/reservations")
class AdminReservationController(
    private val adminReservationService: AdminReservationService
) {

    @GetMapping
    fun list(
        @RequestParam(required = false) status: ReservationStatus?,
        @RequestParam(required = false) hotelId: UUID?,
        @RequestParam(required = false) userId: UUID?,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) fromDate: LocalDate?,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) toDate: LocalDate?,
        @PageableDefault(size = 20, sort = ["createdAt"], direction = Sort.Direction.DESC) pageable: Pageable
    ): ResponseEntity<PageResponse<ReservationResponse>> {
        val result = adminReservationService.list(status, hotelId, userId, fromDate, toDate, pageable)
            .map { it.toResponse() }
        return ResponseEntity.ok(PageResponse.from(result))
    }
}
