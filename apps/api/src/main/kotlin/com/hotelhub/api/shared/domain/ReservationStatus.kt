package com.hotelhub.api.shared.domain

enum class ReservationStatus {
    PENDING,
    CONFIRMED,
    CHECKED_IN,
    CHECKED_OUT,
    NO_SHOW,
    CANCELLED;

    fun isActive(): Boolean = this == CONFIRMED || this == CHECKED_IN
}
