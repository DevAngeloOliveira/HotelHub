package com.hotelhub.api.packages.application

import com.hotelhub.api.hotels.infrastructure.persistence.repository.HotelJpaRepository
import com.hotelhub.api.packages.domain.TravelPackage
import com.hotelhub.api.packages.infrastructure.persistence.entity.TravelPackageEntity
import com.hotelhub.api.packages.infrastructure.persistence.mapper.encodeServices
import com.hotelhub.api.packages.infrastructure.persistence.mapper.toDomain
import com.hotelhub.api.packages.infrastructure.persistence.repository.TravelPackageJpaRepository
import com.hotelhub.api.packages.presentation.dto.CreateTravelPackageRequest
import com.hotelhub.api.packages.presentation.dto.UpdateTravelPackageRequest
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.error.BusinessRuleException
import com.hotelhub.api.shared.error.ResourceNotFoundException
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.UUID

@Service
class TravelPackageService(
    private val packageRepository: TravelPackageJpaRepository,
    private val hotelRepository: HotelJpaRepository
) {

    @Transactional(readOnly = true)
    fun listActive(hotelId: UUID?, pageable: Pageable): Page<TravelPackage> {
        return packageRepository.findActiveOnDate(LocalDate.now(), hotelId, pageable).map { it.toDomain() }
    }

    @Transactional(readOnly = true)
    fun getById(id: UUID): TravelPackage {
        return packageRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Travel package not found") }
            .toDomain()
    }

    @Transactional(readOnly = true)
    fun adminList(status: EntityStatus?, hotelId: UUID?, pageable: Pageable): Page<TravelPackage> {
        return packageRepository.searchAdmin(status, hotelId, pageable).map { it.toDomain() }
    }

    @Transactional
    fun create(request: CreateTravelPackageRequest): TravelPackage {
        if (!hotelRepository.existsById(request.hotelId)) {
            throw ResourceNotFoundException("Hotel not found")
        }
        validateDates(request.validFrom, request.validTo)

        val entity = TravelPackageEntity(
            id = UUID.randomUUID(),
            hotelId = request.hotelId,
            name = request.name.trim(),
            description = request.description.trim(),
            highlightedServices = encodeServices(request.highlightedServices.map { it.trim() }),
            discountPercentage = request.discountPercentage,
            validFrom = request.validFrom,
            validTo = request.validTo,
            status = EntityStatus.ACTIVE
        )
        return packageRepository.save(entity).toDomain()
    }

    @Transactional
    fun update(id: UUID, request: UpdateTravelPackageRequest): TravelPackage {
        val entity = packageRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Travel package not found") }

        validateDates(request.validFrom, request.validTo)

        entity.name = request.name.trim()
        entity.description = request.description.trim()
        entity.highlightedServices = encodeServices(request.highlightedServices.map { it.trim() })
        entity.discountPercentage = request.discountPercentage
        entity.validFrom = request.validFrom
        entity.validTo = request.validTo

        return packageRepository.save(entity).toDomain()
    }

    @Transactional
    fun updateStatus(id: UUID, status: EntityStatus): TravelPackage {
        val entity = packageRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Travel package not found") }
        entity.status = status
        return packageRepository.save(entity).toDomain()
    }

    private fun validateDates(validFrom: LocalDate, validTo: LocalDate) {
        if (!validTo.isAfter(validFrom)) {
            throw BusinessRuleException("validTo must be after validFrom")
        }
    }
}
