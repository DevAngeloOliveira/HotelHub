package com.hotelhub.api.hotels.presentation

import com.hotelhub.api.hotels.application.HotelPublicService
import com.hotelhub.api.hotels.presentation.dto.HotelDetailResponse
import com.hotelhub.api.hotels.presentation.dto.HotelSummaryResponse
import com.hotelhub.api.hotels.presentation.dto.toSummaryResponse
import com.hotelhub.api.rooms.application.RoomQueryService
import com.hotelhub.api.rooms.presentation.dto.RoomSummaryResponse
import com.hotelhub.api.rooms.presentation.dto.toSummaryResponse
import com.hotelhub.api.shared.pagination.PageResponse
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
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
@Tag(name = "Hotels", description = "Public hotel endpoints for browsing available accommodations")
class HotelController(
    private val hotelPublicService: HotelPublicService,
    private val roomQueryService: RoomQueryService
) {

    @GetMapping
    @Operation(
        summary = "List all active hotels",
        description = "Retrieve a paginated list of active hotels, optionally filtered by destination"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Hotels retrieved successfully"),
            ApiResponse(responseCode = "400", description = "Invalid pagination parameters")
        ]
    )
    fun list(
        @RequestParam(required = false)
        @Parameter(description = "Filter by destination ID (optional)")
        destinationId: UUID?,
        @PageableDefault(size = 20, sort = ["name"], direction = Sort.Direction.ASC) pageable: Pageable
    ): ResponseEntity<PageResponse<HotelSummaryResponse>> {
        val result = hotelPublicService.list(destinationId, pageable).map { it.toSummaryResponse() }
        return ResponseEntity.ok(PageResponse.from(result))
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get hotel details",
        description = "Retrieve detailed information about a specific hotel including its rooms"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Hotel found"),
            ApiResponse(responseCode = "404", description = "Hotel not found")
        ]
    )
    fun details(
        @PathVariable
        @Parameter(description = "Hotel ID (UUID)")
        id: UUID
    ): ResponseEntity<HotelDetailResponse> {
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
    @Operation(
        summary = "List hotel rooms with availability",
        description = "Get all active rooms for a hotel, optionally filtered by availability dates and guest count"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Rooms retrieved successfully"),
            ApiResponse(responseCode = "404", description = "Hotel not found"),
            ApiResponse(responseCode = "400", description = "Invalid date range or guest count")
        ]
    )
    fun roomsByHotel(
        @PathVariable
        @Parameter(description = "Hotel ID (UUID)")
        id: UUID,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        @Parameter(description = "Check-in date (YYYY-MM-DD)")
        checkInDate: LocalDate?,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        @Parameter(description = "Check-out date (YYYY-MM-DD)")
        checkOutDate: LocalDate?,
        @RequestParam(required = false)
        @Parameter(description = "Number of guests")
        guestCount: Int?
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
