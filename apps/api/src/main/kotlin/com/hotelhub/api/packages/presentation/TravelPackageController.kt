package com.hotelhub.api.packages.presentation

import com.hotelhub.api.packages.application.TravelPackageService
import com.hotelhub.api.packages.presentation.dto.TravelPackageResponse
import com.hotelhub.api.packages.presentation.dto.toResponse
import com.hotelhub.api.shared.pagination.PageResponse
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
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
@RequestMapping("/packages")
@Tag(name = "Travel Packages", description = "Public endpoints for browsing travel packages")
class TravelPackageController(
    private val packageService: TravelPackageService
) {

    @GetMapping
    @Operation(
        summary = "List active travel packages",
        description = "Returns travel packages that are currently valid (today is within validFrom–validTo). Optionally filter by hotel."
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Packages returned successfully")
        ]
    )
    fun listActive(
        @RequestParam(required = false)
        @Parameter(description = "Filter by hotel ID")
        hotelId: UUID?,
        @PageableDefault(size = 20, sort = ["validFrom"], direction = Sort.Direction.ASC) pageable: Pageable
    ): ResponseEntity<PageResponse<TravelPackageResponse>> {
        val page = packageService.listActive(hotelId, pageable).map { it.toResponse() }
        return ResponseEntity.ok(PageResponse.from(page))
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get travel package details")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Package found"),
            ApiResponse(responseCode = "404", description = "Package not found")
        ]
    )
    fun getById(
        @PathVariable
        @Parameter(description = "Package ID (UUID)")
        id: UUID
    ): ResponseEntity<TravelPackageResponse> {
        return ResponseEntity.ok(packageService.getById(id).toResponse())
    }
}
