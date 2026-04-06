package com.hotelhub.api.reservations.application

import com.hotelhub.api.reservations.domain.Reservation
import com.hotelhub.api.reservations.infrastructure.persistence.mapper.toDomain
import com.hotelhub.api.reservations.infrastructure.persistence.repository.ReservationJpaRepository
import com.hotelhub.api.shared.domain.ReservationStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.UUID

@Service
class AdminReservationService(
    private val reservationRepository: ReservationJpaRepository
) {

    @Transactional(readOnly = true)
    fun list(
        status: ReservationStatus?,
        hotelId: UUID?,
        userId: UUID?,
        fromDate: LocalDate?,
        toDate: LocalDate?,
        pageable: Pageable
    ): Page<Reservation> {
        return reservationRepository.searchAdmin(
            status = status,
            hotelId = hotelId,
            userId = userId,
            fromDate = fromDate,
            toDate = toDate,
            pageable = pageable
        ).map { it.toDomain() }
    }
}
