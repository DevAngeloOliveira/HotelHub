package com.hotelhub.api.reservations.infrastructure.persistence.entity

import com.hotelhub.api.shared.domain.ReservationStatus
import com.hotelhub.api.shared.infrastructure.persistence.TimestampedEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "reservations")
class ReservationEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(name = "user_id", nullable = false)
    var userId: UUID,

    @Column(name = "hotel_id", nullable = false)
    var hotelId: UUID,

    @Column(name = "room_id", nullable = false)
    var roomId: UUID,

    @Column(name = "check_in_date", nullable = false)
    var checkInDate: LocalDate,

    @Column(name = "check_out_date", nullable = false)
    var checkOutDate: LocalDate,

    @Column(name = "guest_count", nullable = false)
    var guestCount: Int,

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    var totalAmount: BigDecimal,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    var status: ReservationStatus,

    @Column(name = "cancelled_at")
    var cancelledAt: Instant? = null
) : TimestampedEntity()
