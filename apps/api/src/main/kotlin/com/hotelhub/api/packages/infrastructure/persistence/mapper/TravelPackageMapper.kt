package com.hotelhub.api.packages.infrastructure.persistence.mapper

import com.hotelhub.api.hotels.infrastructure.persistence.mapper.decodeStringList
import com.hotelhub.api.hotels.infrastructure.persistence.mapper.encodeStringList
import com.hotelhub.api.packages.domain.TravelPackage
import com.hotelhub.api.packages.infrastructure.persistence.entity.TravelPackageEntity

fun TravelPackageEntity.toDomain(): TravelPackage {
    return TravelPackage(
        id = id,
        hotelId = hotelId,
        name = name,
        description = description,
        highlightedServices = decodeStringList(highlightedServices),
        discountPercentage = discountPercentage,
        validFrom = validFrom,
        validTo = validTo,
        status = status,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}

fun encodeServices(values: List<String>): String = encodeStringList(values)
