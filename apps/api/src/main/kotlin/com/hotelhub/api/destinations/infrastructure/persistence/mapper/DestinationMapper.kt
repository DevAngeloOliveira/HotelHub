package com.hotelhub.api.destinations.infrastructure.persistence.mapper

import com.hotelhub.api.destinations.domain.Destination
import com.hotelhub.api.destinations.infrastructure.persistence.entity.DestinationEntity

fun DestinationEntity.toDomain(): Destination {
    return Destination(
        id = id,
        name = name,
        slug = slug,
        description = description,
        city = city,
        state = state,
        country = country,
        category = category,
        featuredImageUrl = featuredImageUrl,
        status = status,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}
