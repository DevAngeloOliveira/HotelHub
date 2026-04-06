package com.hotelhub.api.hotels.presentation

import com.hotelhub.api.hotels.application.HotelPublicService
import com.hotelhub.api.hotels.presentation.dto.HotelDetailResponse
import com.hotelhub.api.hotels.presentation.dto.HotelSummaryResponse
import com.hotelhub.api.hotels.presentation.dto.toSummaryResponse
import com.hotelhub.api.rooms.application.RoomQueryService
import com.hotelhub.api.rooms.presentation.dto.RoomSummaryResponse
import com.hotelhub.api.rooms.presentation.dto.toSummaryResponse
import com.hotelhub.api.shared.pagination.PageResponse
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate
import java.util.UUID

@RestController
@RequestMapping("/hotels")
class HotelController(
    private val hotelPublicService: HotelPublicService,
    private val roomQueryService: RoomQueryService
) {

    @GetMapping
    fun list(
        @RequestParam(required = false) destinationId: UUID?,
        @PageableDefault(size = 20, sort = ["name"], direction = Sort.Direction.ASC) pageable: Pageable
    ): ResponseEntity<PageResponse<HotelSummaryResponse>> {
        val result = hotelPublicService.list(destinationId, pageable).map { it.toSummaryResponse() }
        return ResponseEntity.ok(PageResponse.from(result))
    }

    @GetMapping("/{id}")
    fun details(@PathVariable id: UUID): ResponseEntity<HotelDetailResponse> {
        val hotel = hotelPublicService.getActiveById(id)
        val rooms = roomQueryService.listActiveByHotel(id).map { it.toSummaryResponse() }
        return ResponseEntity.ok(
            HotelDetailResponse(
                id = hotel.id,
                destinationId = hotel.destinationId,
                name = hotel.name,
                description = hotel.description,
                address = hotel.address,
                category = hotel.category,
                amenities = hotel.amenities,
                contactPhone = hotel.contactPhone,
                contactEmail = hotel.contactEmail,
                status = hotel.status,
                rooms = rooms
            )
        )
    }

    @GetMapping("/{id}/rooms")
    fun roomsByHotel(
        @PathVariable id: UUID,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) checkInDate: LocalDate?,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) checkOutDate: LocalDate?,
        @RequestParam(required = false) guestCount: Int?
    ): ResponseEntity<List<RoomSummaryResponse>> {
        hotelPublicService.getActiveById(id)
        val result = if (checkInDate == null && checkOutDate == null && guestCount == null) {
            roomQueryService.listActiveByHotel(id).map { it.toSummaryResponse() }
        } else {
            roomQueryService.listByHotelWithAvailability(id, checkInDate, checkOutDate, guestCount)
                .map { it.toSummaryResponse() }
        }
        return ResponseEntity.ok(result)
    }
}
