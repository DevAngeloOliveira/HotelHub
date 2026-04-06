package com.hotelhub.api.hotels.infrastructure.persistence.entity

import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.infrastructure.persistence.TimestampedEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "hotels")
class HotelEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(name = "destination_id", nullable = false)
    var destinationId: UUID,

    @Column(nullable = false, length = 140)
    var name: String,

    @Column(nullable = false, columnDefinition = "text")
    var description: String,

    @Column(nullable = false, length = 240)
    var address: String,

    @Column(nullable = false, length = 80)
    var category: String,

    @Column(nullable = false, columnDefinition = "text")
    var amenities: String,

    @Column(name = "contact_phone", nullable = false, length = 32)
    var contactPhone: String,

    @Column(name = "contact_email", nullable = false, length = 160)
    var contactEmail: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    var status: EntityStatus
) : TimestampedEntity()
