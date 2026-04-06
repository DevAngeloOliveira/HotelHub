package com.hotelhub.api.hotels.application

import com.hotelhub.api.destinations.infrastructure.persistence.repository.DestinationJpaRepository
import com.hotelhub.api.hotels.domain.Hotel
import com.hotelhub.api.hotels.infrastructure.persistence.mapper.toDomain
import com.hotelhub.api.hotels.infrastructure.persistence.repository.HotelJpaRepository
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.error.ResourceNotFoundException
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class HotelPublicService(
    private val hotelRepository: HotelJpaRepository,
    private val destinationRepository: DestinationJpaRepository
) {

    @Transactional(readOnly = true)
    fun list(destinationId: UUID?, pageable: Pageable): Page<Hotel> {
        val page = if (destinationId == null) {
            hotelRepository.findPublic(
                hotelStatus = EntityStatus.ACTIVE,
                destinationStatus = EntityStatus.ACTIVE,
                pageable = pageable
            )
        } else {
            hotelRepository.findPublicByDestination(
                destinationId = destinationId,
                hotelStatus = EntityStatus.ACTIVE,
                destinationStatus = EntityStatus.ACTIVE,
                pageable = pageable
            )
        }
        return page.map { it.toDomain() }
    }

    @Transactional(readOnly = true)
    fun pageByDestination(destinationId: UUID, pageable: Pageable): Page<Hotel> {
        return hotelRepository.findPublicByDestination(
            destinationId = destinationId,
            hotelStatus = EntityStatus.ACTIVE,
            destinationStatus = EntityStatus.ACTIVE,
            pageable = pageable
        ).map { it.toDomain() }
    }

    @Transactional(readOnly = true)
    fun listByDestination(destinationId: UUID): List<Hotel> {
        return hotelRepository.findPublicByDestination(
            destinationId = destinationId,
            hotelStatus = EntityStatus.ACTIVE,
            destinationStatus = EntityStatus.ACTIVE
        ).map { it.toDomain() }
    }

    @Transactional(readOnly = true)
    fun getActiveById(hotelId: UUID): Hotel {
        val hotel = hotelRepository.findByIdAndStatus(hotelId, EntityStatus.ACTIVE)
            .orElseThrow { ResourceNotFoundException("Hotel not found") }
            .toDomain()
        val destination = destinationRepository.findById(hotel.destinationId)
            .orElseThrow { ResourceNotFoundException("Destination not found") }
        if (destination.status != EntityStatus.ACTIVE) {
            throw ResourceNotFoundException("Hotel not found")
        }
        return hotel
    }
}
