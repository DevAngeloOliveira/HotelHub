package com.hotelhub.api.analytics.presentation

import com.hotelhub.api.analytics.application.AnalyticsService
import com.hotelhub.api.analytics.presentation.dto.AnalyticsSummaryResponse
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/admin/analytics")
@Tag(name = "Admin Analytics", description = "Business intelligence and KPI dashboard for administrators")
@SecurityRequirement(name = "bearer-jwt")
class AdminAnalyticsController(
    private val analyticsService: AnalyticsService
) {

    @GetMapping("/summary")
    @Operation(
        summary = "Get analytics summary",
        description = "Returns key performance indicators: occupancy rate, ADR, RevPAR, revenue breakdown, top hotels and booking trends"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Analytics summary returned successfully"),
            ApiResponse(responseCode = "401", description = "Unauthorized"),
            ApiResponse(responseCode = "403", description = "Forbidden - admin only")
        ]
    )
    fun summary(): ResponseEntity<AnalyticsSummaryResponse> {
        return ResponseEntity.ok(analyticsService.getSummary())
    }
}
