package com.hotelhub.api.reservations.infrastructure.persistence.repository

import com.hotelhub.api.reservations.infrastructure.persistence.entity.ReservationEntity
import com.hotelhub.api.shared.domain.ReservationStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
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
          and r.status = com.hotelhub.api.shared.domain.ReservationStatus.CONFIRMED
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
}
