package com.hotelhub.api.destinations.application

import com.hotelhub.api.destinations.domain.Destination
import com.hotelhub.api.destinations.infrastructure.persistence.entity.DestinationEntity
import com.hotelhub.api.destinations.infrastructure.persistence.mapper.toDomain
import com.hotelhub.api.destinations.infrastructure.persistence.repository.DestinationJpaRepository
import com.hotelhub.api.destinations.presentation.dto.CreateDestinationRequest
import com.hotelhub.api.destinations.presentation.dto.UpdateDestinationRequest
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.error.ConflictException
import com.hotelhub.api.shared.error.ResourceNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class DestinationAdminService(
    private val destinationRepository: DestinationJpaRepository
) {

    @Transactional
    fun create(request: CreateDestinationRequest): Destination {
        val slug = request.slug.trim().lowercase()
        if (destinationRepository.existsBySlug(slug)) {
            throw ConflictException("Destination slug already exists")
        }

        val entity = DestinationEntity(
            id = UUID.randomUUID(),
            name = request.name.trim(),
            slug = slug,
            description = request.description.trim(),
            city = request.city.trim(),
            state = request.state.trim(),
            country = request.country.trim(),
            category = request.category.trim(),
            featuredImageUrl = request.featuredImageUrl.trim(),
            status = EntityStatus.ACTIVE
        )

        return destinationRepository.save(entity).toDomain()
    }

    @Transactional
    fun update(destinationId: UUID, request: UpdateDestinationRequest): Destination {
        val entity = destinationRepository.findById(destinationId)
            .orElseThrow { ResourceNotFoundException("Destination not found") }

        val slug = request.slug.trim().lowercase()
        if (destinationRepository.existsBySlugAndIdNot(slug, destinationId)) {
            throw ConflictException("Destination slug already exists")
        }

        entity.name = request.name.trim()
        entity.slug = slug
        entity.description = request.description.trim()
        entity.city = request.city.trim()
        entity.state = request.state.trim()
        entity.country = request.country.trim()
        entity.category = request.category.trim()
        entity.featuredImageUrl = request.featuredImageUrl.trim()

        return destinationRepository.save(entity).toDomain()
    }

    @Transactional
    fun updateStatus(destinationId: UUID, status: EntityStatus): Destination {
        val entity = destinationRepository.findById(destinationId)
            .orElseThrow { ResourceNotFoundException("Destination not found") }
        entity.status = status
        return destinationRepository.save(entity).toDomain()
    }
}
