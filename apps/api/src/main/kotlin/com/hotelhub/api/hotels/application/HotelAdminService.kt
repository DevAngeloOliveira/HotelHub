package com.hotelhub.api.hotels.application

import com.hotelhub.api.destinations.infrastructure.persistence.repository.DestinationJpaRepository
import com.hotelhub.api.hotels.domain.Hotel
import com.hotelhub.api.hotels.infrastructure.persistence.entity.HotelEntity
import com.hotelhub.api.hotels.infrastructure.persistence.mapper.encodeAmenities
import com.hotelhub.api.hotels.infrastructure.persistence.mapper.encodeStringList
import com.hotelhub.api.hotels.infrastructure.persistence.mapper.toDomain
import com.hotelhub.api.hotels.infrastructure.persistence.repository.HotelJpaRepository
import com.hotelhub.api.hotels.presentation.dto.CreateHotelRequest
import com.hotelhub.api.hotels.presentation.dto.UpdateHotelRequest
import com.hotelhub.api.shared.config.CacheNames
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.error.BusinessRuleException
import com.hotelhub.api.shared.error.ResourceNotFoundException
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Caching
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class HotelAdminService(
    private val hotelRepository: HotelJpaRepository,
    private val destinationRepository: DestinationJpaRepository
) {

    @Caching(
        evict = [
            CacheEvict(cacheNames = [CacheNames.HOTELS_PUBLIC_LIST], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.HOTELS_PUBLIC_BY_ID], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.HOTELS_PUBLIC_BY_DESTINATION_PAGE], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.HOTELS_PUBLIC_BY_DESTINATION_LIST], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.ROOMS_PUBLIC_ACTIVE_BY_HOTEL], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.ROOMS_PUBLIC_AVAILABILITY_BY_HOTEL], allEntries = true)
        ]
    )
    @Transactional
    fun create(request: CreateHotelRequest): Hotel {
        if (!destinationRepository.existsById(request.destinationId)) {
            throw ResourceNotFoundException("Destination not found")
        }

        val entity = HotelEntity(
            id = UUID.randomUUID(),
            destinationId = request.destinationId,
            name = request.name.trim(),
            description = request.description.trim(),
            address = request.address.trim(),
            category = request.category.trim(),
            amenities = encodeAmenities(request.amenities.map { it.trim() }),
            imageUrls = encodeStringList(request.imageUrls.map { it.trim() }),
            contactPhone = request.contactPhone.trim(),
            contactEmail = request.contactEmail.trim().lowercase(),
            status = EntityStatus.ACTIVE
        )
        return hotelRepository.save(entity).toDomain()
    }

    @Caching(
        evict = [
            CacheEvict(cacheNames = [CacheNames.HOTELS_PUBLIC_LIST], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.HOTELS_PUBLIC_BY_ID], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.HOTELS_PUBLIC_BY_DESTINATION_PAGE], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.HOTELS_PUBLIC_BY_DESTINATION_LIST], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.ROOMS_PUBLIC_ACTIVE_BY_HOTEL], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.ROOMS_PUBLIC_AVAILABILITY_BY_HOTEL], allEntries = true)
        ]
    )
    @Transactional
    fun update(hotelId: UUID, request: UpdateHotelRequest): Hotel {
        if (!destinationRepository.existsById(request.destinationId)) {
            throw ResourceNotFoundException("Destination not found")
        }

        val entity = hotelRepository.findById(hotelId)
            .orElseThrow { ResourceNotFoundException("Hotel not found") }

        entity.destinationId = request.destinationId
        entity.name = request.name.trim()
        entity.description = request.description.trim()
        entity.address = request.address.trim()
        entity.category = request.category.trim()
        entity.amenities = encodeAmenities(request.amenities.map { it.trim() })
        entity.imageUrls = encodeStringList(request.imageUrls.map { it.trim() })
        entity.contactPhone = request.contactPhone.trim()
        entity.contactEmail = request.contactEmail.trim().lowercase()

        return hotelRepository.save(entity).toDomain()
    }

    @Caching(
        evict = [
            CacheEvict(cacheNames = [CacheNames.HOTELS_PUBLIC_LIST], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.HOTELS_PUBLIC_BY_ID], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.HOTELS_PUBLIC_BY_DESTINATION_PAGE], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.HOTELS_PUBLIC_BY_DESTINATION_LIST], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.ROOMS_PUBLIC_ACTIVE_BY_HOTEL], allEntries = true),
            CacheEvict(cacheNames = [CacheNames.ROOMS_PUBLIC_AVAILABILITY_BY_HOTEL], allEntries = true)
        ]
    )
    @Transactional
    fun updateStatus(hotelId: UUID, status: EntityStatus): Hotel {
        val entity = hotelRepository.findById(hotelId)
            .orElseThrow { ResourceNotFoundException("Hotel not found") }
        entity.status = status
        return hotelRepository.save(entity).toDomain()
    }

    @Transactional(readOnly = true)
    fun getById(hotelId: UUID): Hotel {
        return hotelRepository.findById(hotelId)
            .orElseThrow { ResourceNotFoundException("Hotel not found") }
            .toDomain()
    }

    @Transactional(readOnly = true)
    fun requireActiveHotel(hotelId: UUID): Hotel {
        val hotel = hotelRepository.findById(hotelId)
            .orElseThrow { ResourceNotFoundException("Hotel not found") }
            .toDomain()
        if (hotel.status != EntityStatus.ACTIVE) {
            throw BusinessRuleException("Inactive hotel cannot accept reservations")
        }
        return hotel
    }
}
