package com.hotelhub.api.rooms.infrastructure.persistence.mapper

import com.hotelhub.api.rooms.domain.Room
import com.hotelhub.api.rooms.infrastructure.persistence.entity.RoomEntity

fun RoomEntity.toDomain(): Room {
    return Room(
        id = id,
        hotelId = hotelId,
        name = name,
        type = type,
        description = description,
        capacity = capacity,
        pricePerNight = pricePerNight,
        quantity = quantity,
        status = status,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}
