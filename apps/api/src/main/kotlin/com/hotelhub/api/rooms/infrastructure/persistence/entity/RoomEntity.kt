package com.hotelhub.api.rooms.infrastructure.persistence.entity

import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.infrastructure.persistence.TimestampedEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal
import java.util.UUID

@Entity
@Table(name = "rooms")
class RoomEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(name = "hotel_id", nullable = false)
    var hotelId: UUID,

    @Column(nullable = false, length = 120)
    var name: String,

    @Column(nullable = false, length = 80)
    var type: String,

    @Column(nullable = false, columnDefinition = "text")
    var description: String,

    @Column(nullable = false)
    var capacity: Int,

    @Column(name = "price_per_night", nullable = false, precision = 12, scale = 2)
    var pricePerNight: BigDecimal,

    @Column(nullable = false)
    var quantity: Int,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    var status: EntityStatus
) : TimestampedEntity()
