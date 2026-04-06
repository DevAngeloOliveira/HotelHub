package com.hotelhub.api.hotels.infrastructure.persistence.mapper

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.hotelhub.api.hotels.domain.Hotel
import com.hotelhub.api.hotels.infrastructure.persistence.entity.HotelEntity

private val mapper = jacksonObjectMapper()
private val amenitiesType = object : TypeReference<List<String>>() {}

fun HotelEntity.toDomain(): Hotel {
    return Hotel(
        id = id,
        destinationId = destinationId,
        name = name,
        description = description,
        address = address,
        category = category,
        amenities = decodeAmenities(amenities),
        contactPhone = contactPhone,
        contactEmail = contactEmail,
        status = status,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}

fun encodeAmenities(values: List<String>): String = mapper.writeValueAsString(values)

fun decodeAmenities(raw: String): List<String> = runCatching {
    mapper.readValue(raw, amenitiesType)
}.getOrElse { emptyList() }
