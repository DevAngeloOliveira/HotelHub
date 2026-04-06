package com.hotelhub.api.destinations.presentation

import com.hotelhub.api.destinations.application.DestinationPublicService
import com.hotelhub.api.destinations.presentation.dto.DestinationDetailResponse
import com.hotelhub.api.destinations.presentation.dto.DestinationSummaryResponse
import com.hotelhub.api.destinations.presentation.dto.toSummaryResponse
import com.hotelhub.api.hotels.application.HotelPublicService
import com.hotelhub.api.hotels.presentation.dto.HotelSummaryResponse
import com.hotelhub.api.hotels.presentation.dto.toSummaryResponse
import com.hotelhub.api.shared.pagination.PageResponse
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/destinations")
class DestinationController(
    private val destinationPublicService: DestinationPublicService,
    private val hotelPublicService: HotelPublicService
) {

    @GetMapping
    fun list(
        @RequestParam(required = false) name: String?,
        @RequestParam(required = false) city: String?,
        @RequestParam(required = false) state: String?,
        @RequestParam(required = false) country: String?,
        @RequestParam(required = false) category: String?,
        @PageableDefault(size = 20, sort = ["name"], direction = Sort.Direction.ASC) pageable: Pageable
    ): ResponseEntity<PageResponse<DestinationSummaryResponse>> {
        val result = destinationPublicService.list(name, city, state, country, category, pageable)
            .map { it.toSummaryResponse() }
        return ResponseEntity.ok(PageResponse.from(result))
    }

    @GetMapping("/{id}")
    fun details(@PathVariable id: UUID): ResponseEntity<DestinationDetailResponse> {
        val destination = destinationPublicService.getActiveById(id)
        val hotels = hotelPublicService.listByDestination(id)
            .map { it.toSummaryResponse() }
        return ResponseEntity.ok(
            DestinationDetailResponse(
                id = destination.id,
                name = destination.name,
                slug = destination.slug,
                description = destination.description,
                city = destination.city,
                state = destination.state,
                country = destination.country,
                category = destination.category,
                featuredImageUrl = destination.featuredImageUrl,
                status = destination.status,
                hotels = hotels
            )
        )
    }

    @GetMapping("/{id}/hotels")
    fun hotelsByDestination(
        @PathVariable id: UUID,
        @PageableDefault(size = 20, sort = ["name"], direction = Sort.Direction.ASC) pageable: Pageable
    ): ResponseEntity<PageResponse<HotelSummaryResponse>> {
        destinationPublicService.getActiveById(id)
        val result = hotelPublicService.pageByDestination(id, pageable).map { it.toSummaryResponse() }
        return ResponseEntity.ok(PageResponse.from(result))
    }
}
