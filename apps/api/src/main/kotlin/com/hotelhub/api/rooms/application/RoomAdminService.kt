package com.hotelhub.api.rooms.application

import com.hotelhub.api.hotels.infrastructure.persistence.repository.HotelJpaRepository
import com.hotelhub.api.rooms.domain.Room
import com.hotelhub.api.rooms.infrastructure.persistence.entity.RoomEntity
import com.hotelhub.api.rooms.infrastructure.persistence.mapper.toDomain
import com.hotelhub.api.rooms.infrastructure.persistence.repository.RoomJpaRepository
import com.hotelhub.api.rooms.presentation.dto.CreateRoomRequest
import com.hotelhub.api.rooms.presentation.dto.UpdateRoomRequest
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.error.ResourceNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class RoomAdminService(
    private val roomRepository: RoomJpaRepository,
    private val hotelRepository: HotelJpaRepository
) {

    @Transactional
    fun create(request: CreateRoomRequest): Room {
        if (!hotelRepository.existsById(request.hotelId)) {
            throw ResourceNotFoundException("Hotel not found")
        }
        val entity = RoomEntity(
            id = UUID.randomUUID(),
            hotelId = request.hotelId,
            name = request.name.trim(),
            type = request.type.trim(),
            description = request.description.trim(),
            capacity = request.capacity,
            pricePerNight = request.pricePerNight,
            quantity = request.quantity,
            status = EntityStatus.ACTIVE
        )
        return roomRepository.save(entity).toDomain()
    }

    @Transactional
    fun update(roomId: UUID, request: UpdateRoomRequest): Room {
        if (!hotelRepository.existsById(request.hotelId)) {
            throw ResourceNotFoundException("Hotel not found")
        }
        val entity = roomRepository.findById(roomId)
            .orElseThrow { ResourceNotFoundException("Room not found") }

        entity.hotelId = request.hotelId
        entity.name = request.name.trim()
        entity.type = request.type.trim()
        entity.description = request.description.trim()
        entity.capacity = request.capacity
        entity.pricePerNight = request.pricePerNight
        entity.quantity = request.quantity

        return roomRepository.save(entity).toDomain()
    }

    @Transactional
    fun updateStatus(roomId: UUID, status: EntityStatus): Room {
        val entity = roomRepository.findById(roomId)
            .orElseThrow { ResourceNotFoundException("Room not found") }
        entity.status = status
        return roomRepository.save(entity).toDomain()
    }

    @Transactional(readOnly = true)
    fun getById(roomId: UUID): Room {
        return roomRepository.findById(roomId)
            .orElseThrow { ResourceNotFoundException("Room not found") }
            .toDomain()
    }
}
