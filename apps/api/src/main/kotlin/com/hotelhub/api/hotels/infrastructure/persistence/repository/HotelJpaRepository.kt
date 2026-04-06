package com.hotelhub.api.hotels.infrastructure.persistence.repository

import com.hotelhub.api.hotels.infrastructure.persistence.entity.HotelEntity
import com.hotelhub.api.shared.domain.EntityStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.Optional
import java.util.UUID

interface HotelJpaRepository : JpaRepository<HotelEntity, UUID> {
    fun findByIdAndStatus(id: UUID, status: EntityStatus): Optional<HotelEntity>
    fun findAllByStatus(status: EntityStatus, pageable: Pageable): Page<HotelEntity>
    fun findAllByDestinationIdAndStatus(destinationId: UUID, status: EntityStatus, pageable: Pageable): Page<HotelEntity>
    fun findAllByDestinationIdAndStatus(destinationId: UUID, status: EntityStatus): List<HotelEntity>

    @Query(
        """
        select h from HotelEntity h, DestinationEntity d
        where h.destinationId = d.id
          and h.status = :hotelStatus
          and d.status = :destinationStatus
        """
    )
    fun findPublic(
        @Param("hotelStatus") hotelStatus: EntityStatus,
        @Param("destinationStatus") destinationStatus: EntityStatus,
        pageable: Pageable
    ): Page<HotelEntity>

    @Query(
        """
        select h from HotelEntity h, DestinationEntity d
        where h.destinationId = d.id
          and h.destinationId = :destinationId
          and h.status = :hotelStatus
          and d.status = :destinationStatus
        """
    )
    fun findPublicByDestination(
        @Param("destinationId") destinationId: UUID,
        @Param("hotelStatus") hotelStatus: EntityStatus,
        @Param("destinationStatus") destinationStatus: EntityStatus,
        pageable: Pageable
    ): Page<HotelEntity>

    @Query(
        """
        select h from HotelEntity h, DestinationEntity d
        where h.destinationId = d.id
          and h.destinationId = :destinationId
          and h.status = :hotelStatus
          and d.status = :destinationStatus
        """
    )
    fun findPublicByDestination(
        @Param("destinationId") destinationId: UUID,
        @Param("hotelStatus") hotelStatus: EntityStatus,
        @Param("destinationStatus") destinationStatus: EntityStatus
    ): List<HotelEntity>
}
