package com.hotelhub.api.rooms.infrastructure.persistence.repository

import com.hotelhub.api.rooms.infrastructure.persistence.entity.RoomEntity
import com.hotelhub.api.shared.domain.EntityStatus
import jakarta.persistence.LockModeType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import java.util.Optional
import java.util.UUID

interface RoomJpaRepository : JpaRepository<RoomEntity, UUID> {
    fun findByIdAndStatus(id: UUID, status: EntityStatus): Optional<RoomEntity>
    fun findAllByHotelIdAndStatus(hotelId: UUID, status: EntityStatus): List<RoomEntity>
    fun findAllByHotelId(hotelId: UUID): List<RoomEntity>

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    fun findWithLockingById(id: UUID): Optional<RoomEntity>

    fun countByStatus(status: EntityStatus): Long
}
