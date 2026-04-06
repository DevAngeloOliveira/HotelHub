package com.hotelhub.api.catalog

import com.hotelhub.api.destinations.infrastructure.persistence.entity.DestinationEntity
import com.hotelhub.api.destinations.infrastructure.persistence.repository.DestinationJpaRepository
import com.hotelhub.api.hotels.infrastructure.persistence.entity.HotelEntity
import com.hotelhub.api.hotels.infrastructure.persistence.mapper.encodeAmenities
import com.hotelhub.api.hotels.infrastructure.persistence.repository.HotelJpaRepository
import com.hotelhub.api.reservations.infrastructure.persistence.entity.ReservationEntity
import com.hotelhub.api.reservations.infrastructure.persistence.repository.ReservationJpaRepository
import com.hotelhub.api.rooms.infrastructure.persistence.entity.RoomEntity
import com.hotelhub.api.rooms.infrastructure.persistence.repository.RoomJpaRepository
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.domain.ReservationStatus
import com.hotelhub.api.shared.domain.Role
import com.hotelhub.api.support.BaseIntegrationTest
import com.hotelhub.api.users.infrastructure.persistence.entity.UserEntity
import com.hotelhub.api.users.infrastructure.persistence.repository.UserJpaRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.get
import java.math.BigDecimal
import java.time.LocalDate
import java.util.UUID

class CatalogIntegrationTest : BaseIntegrationTest() {

    @Autowired
    private lateinit var destinationRepository: DestinationJpaRepository

    @Autowired
    private lateinit var hotelRepository: HotelJpaRepository

    @Autowired
    private lateinit var roomRepository: RoomJpaRepository

    @Autowired
    private lateinit var reservationRepository: ReservationJpaRepository

    @Autowired
    private lateinit var userRepository: UserJpaRepository

    @Test
    fun `public catalog returns only active resources and honors availability`() {
        val activeDestinationA = destinationRepository.save(
            DestinationEntity(
                id = UUID.randomUUID(),
                name = "Aracaju",
                slug = "aracaju",
                description = "Praia",
                city = "Aracaju",
                state = "SE",
                country = "Brasil",
                category = "Praia",
                featuredImageUrl = "https://example.com/a.jpg",
                status = EntityStatus.ACTIVE
            )
        )
        val activeDestinationB = destinationRepository.save(
            DestinationEntity(
                id = UUID.randomUUID(),
                name = "Bonito",
                slug = "bonito",
                description = "Ecoturismo",
                city = "Bonito",
                state = "MS",
                country = "Brasil",
                category = "Natureza",
                featuredImageUrl = "https://example.com/b.jpg",
                status = EntityStatus.ACTIVE
            )
        )
        val inactiveDestination = destinationRepository.save(
            DestinationEntity(
                id = UUID.randomUUID(),
                name = "Curitiba",
                slug = "curitiba",
                description = "Cidade",
                city = "Curitiba",
                state = "PR",
                country = "Brasil",
                category = "Urbano",
                featuredImageUrl = "https://example.com/c.jpg",
                status = EntityStatus.INACTIVE
            )
        )

        val activeHotel = hotelRepository.save(
            HotelEntity(
                id = UUID.randomUUID(),
                destinationId = activeDestinationA.id,
                name = "Hotel Azul",
                description = "Confortável",
                address = "Rua 1",
                category = "3 estrelas",
                amenities = encodeAmenities(listOf("wifi")),
                contactPhone = "+55 11 11111-1111",
                contactEmail = "azul@example.com",
                status = EntityStatus.ACTIVE
            )
        )
        hotelRepository.save(
            HotelEntity(
                id = UUID.randomUUID(),
                destinationId = inactiveDestination.id,
                name = "Hotel Invisível",
                description = "Não deve aparecer",
                address = "Rua 2",
                category = "3 estrelas",
                amenities = encodeAmenities(listOf("wifi")),
                contactPhone = "+55 11 22222-2222",
                contactEmail = "hide@example.com",
                status = EntityStatus.ACTIVE
            )
        )

        val room = roomRepository.save(
            RoomEntity(
                id = UUID.randomUUID(),
                hotelId = activeHotel.id,
                name = "Quarto Standard",
                type = "STANDARD",
                description = "Confortável",
                capacity = 2,
                pricePerNight = BigDecimal("100.00"),
                quantity = 1,
                status = EntityStatus.ACTIVE
            )
        )

        val user = userRepository.save(
            UserEntity(
                id = UUID.randomUUID(),
                name = "Client",
                email = "catalog-user@example.com",
                passwordHash = "hash",
                phone = "+55 11 99999-0000",
                role = Role.CLIENT,
                status = EntityStatus.ACTIVE
            )
        )

        val checkIn = LocalDate.now().plusDays(7)
        val checkOut = checkIn.plusDays(2)
        reservationRepository.save(
            ReservationEntity(
                id = UUID.randomUUID(),
                userId = user.id,
                hotelId = activeHotel.id,
                roomId = room.id,
                checkInDate = checkIn,
                checkOutDate = checkOut,
                guestCount = 2,
                totalAmount = BigDecimal("200.00"),
                status = ReservationStatus.CONFIRMED
            )
        )

        val destinationsResult = mockMvc.get("/destinations") {
            param("size", "10")
            param("sort", "name,asc")
        }.andExpect {
            status { isOk() }
        }.andReturn()
        val destinationsJson = objectMapper.readTree(destinationsResult.response.contentAsString)
        assertEquals(2, destinationsJson.path("content").size())
        assertEquals("Aracaju", destinationsJson.path("content")[0].path("name").asText())
        assertEquals("Bonito", destinationsJson.path("content")[1].path("name").asText())

        val hotelsResult = mockMvc.get("/hotels") {
            param("size", "10")
            param("sort", "name,asc")
        }.andExpect {
            status { isOk() }
        }.andReturn()
        val hotelsJson = objectMapper.readTree(hotelsResult.response.contentAsString)
        assertEquals(1, hotelsJson.path("content").size())
        assertEquals(activeHotel.id.toString(), hotelsJson.path("content")[0].path("id").asText())

        val roomsAvailabilityResult = mockMvc.get("/hotels/${activeHotel.id}/rooms") {
            param("checkInDate", checkIn.toString())
            param("checkOutDate", checkOut.toString())
            param("guestCount", "2")
        }.andExpect {
            status { isOk() }
        }.andReturn()
        val roomsJson = objectMapper.readTree(roomsAvailabilityResult.response.contentAsString)
        assertEquals(0, roomsJson.size())

        // Use activeDestinationB to satisfy compiler/static analysis for all created entities.
        assertEquals("Bonito", activeDestinationB.name)
    }
}
