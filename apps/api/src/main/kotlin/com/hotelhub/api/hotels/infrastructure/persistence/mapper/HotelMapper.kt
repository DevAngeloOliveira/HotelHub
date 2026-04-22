package com.hotelhub.api.hotels.infrastructure.persistence.mapper

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.hotelhub.api.hotels.domain.Hotel
import com.hotelhub.api.hotels.infrastructure.persistence.entity.HotelEntity

private val mapper = jacksonObjectMapper()
private val stringListType = object : TypeReference<List<String>>() {}

fun HotelEntity.toDomain(): Hotel {
    return Hotel(
        id = id,
        destinationId = destinationId,
        name = name,
        description = description,
        address = address,
        category = category,
        amenities = decodeStringList(amenities),
        imageUrls = decodeStringList(imageUrls),
        contactPhone = contactPhone,
        contactEmail = contactEmail,
        status = status,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}

fun encodeAmenities(values: List<String>): String = encodeStringList(values)

fun encodeStringList(values: List<String>): String = mapper.writeValueAsString(values)

fun decodeAmenities(raw: String): List<String> = decodeStringList(raw)

fun decodeStringList(raw: String): List<String> = runCatching {
    mapper.readValue(raw, stringListType)
}.getOrElse { emptyList() }
