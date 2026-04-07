package com.hotelhub.api.destinations.application

import com.hotelhub.api.destinations.domain.Destination
import com.hotelhub.api.destinations.infrastructure.persistence.mapper.toDomain
import com.hotelhub.api.destinations.infrastructure.persistence.repository.DestinationJpaRepository
import com.hotelhub.api.shared.config.CacheNames
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.error.ResourceNotFoundException
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class DestinationPublicService(
    private val destinationRepository: DestinationJpaRepository
) {

    @Cacheable(
        cacheNames = [CacheNames.DESTINATIONS_PUBLIC_LIST],
        key = "#name + '|' + #city + '|' + #state + '|' + #country + '|' + #category + '|' + #pageable.pageNumber + '|' + #pageable.pageSize + '|' + #pageable.sort.toString()"
    )
    @Transactional(readOnly = true)
    fun list(
        name: String?,
        city: String?,
        state: String?,
        country: String?,
        category: String?,
        pageable: Pageable
    ): Page<Destination> {
        return destinationRepository.searchPublic(
            status = EntityStatus.ACTIVE,
            name = name?.takeIf { it.isNotBlank() },
            city = city?.takeIf { it.isNotBlank() },
            state = state?.takeIf { it.isNotBlank() },
            country = country?.takeIf { it.isNotBlank() },
            category = category?.takeIf { it.isNotBlank() },
            pageable = pageable
        ).map { it.toDomain() }
    }

    @Cacheable(cacheNames = [CacheNames.DESTINATIONS_PUBLIC_BY_ID], key = "#destinationId")
    @Transactional(readOnly = true)
    fun getActiveById(destinationId: UUID): Destination {
        return destinationRepository.findByIdAndStatus(destinationId, EntityStatus.ACTIVE)
            .orElseThrow { ResourceNotFoundException("Destination not found") }
            .toDomain()
    }
}
