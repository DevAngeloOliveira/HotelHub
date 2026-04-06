package com.hotelhub.api.rooms.application

import com.hotelhub.api.rooms.domain.Room

data class RoomAvailabilityView(
    val room: Room,
    val available: Boolean,
    val availableUnits: Int
)
