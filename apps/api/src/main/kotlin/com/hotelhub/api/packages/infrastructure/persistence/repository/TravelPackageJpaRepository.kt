package com.hotelhub.api.packages.infrastructure.persistence.repository

import com.hotelhub.api.packages.infrastructure.persistence.entity.TravelPackageEntity
import com.hotelhub.api.shared.domain.EntityStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.LocalDate
import java.util.UUID

interface TravelPackageJpaRepository : JpaRepository<TravelPackageEntity, UUID> {

    fun findAllByStatus(status: EntityStatus, pageable: Pageable): Page<TravelPackageEntity>

    fun findAllByHotelIdAndStatus(hotelId: UUID, status: EntityStatus, pageable: Pageable): Page<TravelPackageEntity>

    @Query(
        """
        select p from TravelPackageEntity p
        where p.status = 'ACTIVE'
          and p.validFrom <= :today
          and p.validTo >= :today
          and (:hotelId is null or p.hotelId = :hotelId)
        """
    )
    fun findActiveOnDate(
        @Param("today") today: LocalDate,
        @Param("hotelId") hotelId: UUID?,
        pageable: Pageable
    ): Page<TravelPackageEntity>

    @Query(
        """
        select p from TravelPackageEntity p
        where (:status is null or p.status = :status)
          and (:hotelId is null or p.hotelId = :hotelId)
        """
    )
    fun searchAdmin(
        @Param("status") status: EntityStatus?,
        @Param("hotelId") hotelId: UUID?,
        pageable: Pageable
    ): Page<TravelPackageEntity>
}
