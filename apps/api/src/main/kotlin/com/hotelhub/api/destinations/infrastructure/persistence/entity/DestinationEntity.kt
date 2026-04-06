package com.hotelhub.api.destinations.infrastructure.persistence.entity

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
@Table(name = "destinations")
class DestinationEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false, length = 120)
    var name: String,

    @Column(nullable = false, unique = true, length = 140)
    var slug: String,

    @Column(nullable = false, columnDefinition = "text")
    var description: String,

    @Column(nullable = false, length = 100)
    var city: String,

    @Column(nullable = false, length = 100)
    var state: String,

    @Column(nullable = false, length = 100)
    var country: String,

    @Column(nullable = false, length = 80)
    var category: String,

    @Column(name = "featured_image_url", nullable = false, length = 500)
    var featuredImageUrl: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    var status: EntityStatus
) : TimestampedEntity()
