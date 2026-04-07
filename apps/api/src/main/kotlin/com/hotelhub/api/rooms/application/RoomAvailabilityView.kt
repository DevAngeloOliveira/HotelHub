package com.hotelhub.api.rooms.application

import com.hotelhub.api.rooms.domain.Room
import java.io.Serializable

data class RoomAvailabilityView(
    val room: Room,
    val available: Boolean,
    val availableUnits: Int
) : Serializable
