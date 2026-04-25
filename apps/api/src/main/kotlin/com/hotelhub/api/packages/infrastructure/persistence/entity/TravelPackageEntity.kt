package com.hotelhub.api.packages.infrastructure.persistence.entity

import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.infrastructure.persistence.TimestampedEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "travel_packages")
class TravelPackageEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(name = "hotel_id", nullable = false)
    var hotelId: UUID,

    @Column(nullable = false, length = 160)
    var name: String,

    @Column(nullable = false, columnDefinition = "text")
    var description: String,

    @Column(name = "highlighted_services", nullable = false, columnDefinition = "text")
    var highlightedServices: String = "[]",

    @Column(name = "discount_percentage", nullable = false, precision = 5, scale = 2)
    var discountPercentage: BigDecimal = BigDecimal.ZERO,

    @Column(name = "valid_from", nullable = false)
    var validFrom: LocalDate,

    @Column(name = "valid_to", nullable = false)
    var validTo: LocalDate,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    var status: EntityStatus = EntityStatus.ACTIVE
) : TimestampedEntity()
