package com.hotelhub.api.reservations.infrastructure.persistence.repository

import com.hotelhub.api.reservations.infrastructure.persistence.entity.ReservationEntity
import com.hotelhub.api.shared.domain.ReservationStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.math.BigDecimal
import java.time.LocalDate
import java.util.Optional
import java.util.UUID

interface ReservationJpaRepository : JpaRepository<ReservationEntity, UUID> {

    fun findByIdAndUserId(id: UUID, userId: UUID): Optional<ReservationEntity>

    fun findAllByUserId(userId: UUID, pageable: Pageable): Page<ReservationEntity>

    @Query(
        """
        select count(r) from ReservationEntity r
        where r.roomId = :roomId
          and r.status in (
              com.hotelhub.api.shared.domain.ReservationStatus.CONFIRMED,
              com.hotelhub.api.shared.domain.ReservationStatus.CHECKED_IN
          )
          and r.checkInDate < :checkOutDate
          and r.checkOutDate > :checkInDate
        """
    )
    fun countActiveOverlappingReservations(
        @Param("roomId") roomId: UUID,
        @Param("checkInDate") checkInDate: LocalDate,
        @Param("checkOutDate") checkOutDate: LocalDate
    ): Int

    @Query(
        """
        select r from ReservationEntity r
        where (:status is null or r.status = :status)
          and (:hotelId is null or r.hotelId = :hotelId)
          and (:userId is null or r.userId = :userId)
          and (:fromDate is null or r.checkInDate >= :fromDate)
          and (:toDate is null or r.checkOutDate <= :toDate)
        """
    )
    fun searchAdmin(
        @Param("status") status: ReservationStatus?,
        @Param("hotelId") hotelId: UUID?,
        @Param("userId") userId: UUID?,
        @Param("fromDate") fromDate: LocalDate?,
        @Param("toDate") toDate: LocalDate?,
        pageable: Pageable
    ): Page<ReservationEntity>

    @Query("select count(r) from ReservationEntity r")
    fun countTotalReservations(): Long

    @Query("select count(r) from ReservationEntity r where r.createdAt >= :since")
    fun countReservationsSince(@Param("since") since: java.time.Instant): Long

    @Query(
        """
        select count(r) from ReservationEntity r
        where r.status = com.hotelhub.api.shared.domain.ReservationStatus.CANCELLED
        """
    )
    fun countCancelledReservations(): Long

    @Query(
        """
        select coalesce(sum(r.totalAmount), 0) from ReservationEntity r
        where r.status not in (
            com.hotelhub.api.shared.domain.ReservationStatus.CANCELLED,
            com.hotelhub.api.shared.domain.ReservationStatus.NO_SHOW
        )
          and r.checkInDate >= :from
          and r.checkInDate <= :to
        """
    )
    fun sumRevenueForPeriod(@Param("from") from: LocalDate, @Param("to") to: LocalDate): BigDecimal?

    @Query(
        """
        select count(r) from ReservationEntity r
        where r.status not in (
            com.hotelhub.api.shared.domain.ReservationStatus.CANCELLED,
            com.hotelhub.api.shared.domain.ReservationStatus.NO_SHOW
        )
          and r.checkInDate >= :from
          and r.checkInDate <= :to
        """
    )
    fun countConfirmedForPeriod(@Param("from") from: LocalDate, @Param("to") to: LocalDate): Long

    @Query(
        value = """
        select coalesce(
            sum(
                (least(r.check_out_date, :to + interval '1 day') - greatest(r.check_in_date, :from))
            ), 0
        )
        from reservations r
        where r.status not in ('CANCELLED', 'NO_SHOW')
          and r.check_in_date <= :to
          and r.check_out_date > :from
        """,
        nativeQuery = true
    )
    fun sumOccupiedNightsForPeriod(@Param("from") from: LocalDate, @Param("to") to: LocalDate): Long?

    @Query(
        value = """
        select to_char(date_trunc('month', r.check_in_date), 'YYYY-MM') as month,
               coalesce(sum(r.total_amount), 0) as revenue
        from reservations r
        where r.status not in ('CANCELLED', 'NO_SHOW')
          and r.check_in_date >= date_trunc('month', current_date) - interval '5 months'
        group by 1
        order by 1
        """,
        nativeQuery = true
    )
    fun monthlyRevenueLast6Months(): List<Array<Any>>

    @Query(
        value = """
        select h.id, h.name, coalesce(sum(r.total_amount), 0) as total_revenue, count(r.id) as total_reservations
        from hotels h
        left join reservations r on r.hotel_id = h.id
            and r.status not in ('CANCELLED', 'NO_SHOW')
        group by h.id, h.name
        order by total_revenue desc
        limit :limit
        """,
        nativeQuery = true
    )
    fun topHotelsByRevenue(@Param("limit") limit: Int): List<Array<Any>>
}
