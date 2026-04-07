package com.hotelhub.api.hotels.application

import com.hotelhub.api.destinations.infrastructure.persistence.repository.DestinationJpaRepository
import com.hotelhub.api.hotels.domain.Hotel
import com.hotelhub.api.hotels.infrastructure.persistence.mapper.toDomain
import com.hotelhub.api.hotels.infrastructure.persistence.repository.HotelJpaRepository
import com.hotelhub.api.shared.config.CacheNames
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.error.ResourceNotFoundException
import org.slf4j.LoggerFactory
import org.springframework.cache.annotation.Cacheable
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
    companion object {
        private val logger = LoggerFactory.getLogger(HotelPublicService::class.java)
    }

    @Cacheable(
        cacheNames = [CacheNames.HOTELS_PUBLIC_LIST],
        key = "#destinationId + '|' + #pageable.pageNumber + '|' + #pageable.pageSize + '|' + #pageable.sort.toString()"
    )
    @Transactional(readOnly = true)
    fun list(destinationId: UUID?, pageable: Pageable): Page<Hotel> {
        logger.debug("Listing public hotels", mapOf("destinationId" to destinationId, "page" to pageable.pageNumber))
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
        val result = page.map { it.toDomain() }
        logger.debug("Found hotels", mapOf("count" to result.totalElements, "page" to pageable.pageNumber))
        return result
    }

    @Cacheable(
        cacheNames = [CacheNames.HOTELS_PUBLIC_BY_DESTINATION_PAGE],
        key = "#destinationId + '|' + #pageable.pageNumber + '|' + #pageable.pageSize + '|' + #pageable.sort.toString()"
    )
    @Transactional(readOnly = true)
    fun pageByDestination(destinationId: UUID, pageable: Pageable): Page<Hotel> {
        return hotelRepository.findPublicByDestination(
            destinationId = destinationId,
            hotelStatus = EntityStatus.ACTIVE,
            destinationStatus = EntityStatus.ACTIVE,
            pageable = pageable
        ).map { it.toDomain() }
    }

    @Cacheable(cacheNames = [CacheNames.HOTELS_PUBLIC_BY_DESTINATION_LIST], key = "#destinationId")
    @Transactional(readOnly = true)
    fun listByDestination(destinationId: UUID): List<Hotel> {
        return hotelRepository.findPublicByDestination(
            destinationId = destinationId,
            hotelStatus = EntityStatus.ACTIVE,
            destinationStatus = EntityStatus.ACTIVE
        ).map { it.toDomain() }
    }

    @Cacheable(cacheNames = [CacheNames.HOTELS_PUBLIC_BY_ID], key = "#hotelId")
    @Transactional(readOnly = true)
    fun getActiveById(hotelId: UUID): Hotel {
        logger.debug("Fetching active hotel", mapOf("hotelId" to hotelId))
        try {
            val hotel = hotelRepository.findByIdAndStatus(hotelId, EntityStatus.ACTIVE)
                .orElseThrow { ResourceNotFoundException("Hotel not found") }
                .toDomain()
            val destination = destinationRepository.findById(hotel.destinationId)
                .orElseThrow { ResourceNotFoundException("Destination not found") }
            if (destination.status != EntityStatus.ACTIVE) {
                logger.warn("Hotel destination inactive", mapOf("hotelId" to hotelId, "destinationId" to hotel.destinationId))
                throw ResourceNotFoundException("Hotel not found")
            }
            logger.debug("Hotel fetched successfully", mapOf("hotelId" to hotelId, "name" to hotel.name))
            return hotel
        } catch (e: ResourceNotFoundException) {
            logger.debug("Hotel not found", mapOf("hotelId" to hotelId))
            throw e
        } catch (e: Exception) {
            logger.error("Error fetching hotel", mapOf("hotelId" to hotelId), e)
            throw e
        }
    }
}
