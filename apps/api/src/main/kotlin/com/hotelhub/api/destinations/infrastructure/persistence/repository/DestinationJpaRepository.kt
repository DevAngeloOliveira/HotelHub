package com.hotelhub.api.destinations.infrastructure.persistence.repository

import com.hotelhub.api.destinations.infrastructure.persistence.entity.DestinationEntity
import com.hotelhub.api.shared.domain.EntityStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.Optional
import java.util.UUID

interface DestinationJpaRepository : JpaRepository<DestinationEntity, UUID> {

    fun findByIdAndStatus(id: UUID, status: EntityStatus): Optional<DestinationEntity>

    fun existsBySlug(slug: String): Boolean
    fun existsBySlugAndIdNot(slug: String, id: UUID): Boolean

    @Query(
        """
        select d from DestinationEntity d
        where d.status = :status
          and (:name is null or lower(d.name) like lower(concat('%', :name, '%')))
          and (:city is null or lower(d.city) like lower(concat('%', :city, '%')))
          and (:state is null or lower(d.state) like lower(concat('%', :state, '%')))
          and (:country is null or lower(d.country) like lower(concat('%', :country, '%')))
          and (:category is null or lower(d.category) like lower(concat('%', :category, '%')))
        """
    )
    fun searchPublic(
        @Param("status") status: EntityStatus,
        @Param("name") name: String?,
        @Param("city") city: String?,
        @Param("state") state: String?,
        @Param("country") country: String?,
        @Param("category") category: String?,
        pageable: Pageable
    ): Page<DestinationEntity>
}
