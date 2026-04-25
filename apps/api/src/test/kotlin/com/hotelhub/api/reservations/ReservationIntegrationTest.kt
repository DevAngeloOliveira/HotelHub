package com.hotelhub.api.reservations

import com.hotelhub.api.destinations.infrastructure.persistence.entity.DestinationEntity
import com.hotelhub.api.destinations.infrastructure.persistence.repository.DestinationJpaRepository
import com.hotelhub.api.hotels.infrastructure.persistence.entity.HotelEntity
import com.hotelhub.api.hotels.infrastructure.persistence.mapper.encodeAmenities
import com.hotelhub.api.hotels.infrastructure.persistence.repository.HotelJpaRepository
import com.hotelhub.api.rooms.infrastructure.persistence.entity.RoomEntity
import com.hotelhub.api.rooms.infrastructure.persistence.repository.RoomJpaRepository
import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.support.BaseIntegrationTest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.patch
import org.springframework.test.web.servlet.post
import java.math.BigDecimal
import java.time.LocalDate
import java.util.UUID

class ReservationIntegrationTest : BaseIntegrationTest() {

    @Autowired
    private lateinit var destinationRepository: DestinationJpaRepository

    @Autowired
    private lateinit var hotelRepository: HotelJpaRepository

    @Autowired
    private lateinit var roomRepository: RoomJpaRepository

    @Test
    fun `reservation flow enforces no overbooking and ownership`() {
        val destination = destinationRepository.save(
            DestinationEntity(
                id = UUID.randomUUID(),
                name = "Porto Seguro",
                slug = "porto-seguro",
                description = "Praias e passeio",
                city = "Porto Seguro",
                state = "BA",
                country = "Brasil",
                category = "Praia",
                featuredImageUrl = "https://example.com/destination.jpg",
                status = EntityStatus.ACTIVE
            )
        )
        val hotel = hotelRepository.save(
            HotelEntity(
                id = UUID.randomUUID(),
                destinationId = destination.id,
                name = "Hotel Atlântico",
                description = "Hotel central",
                address = "Rua A, 123",
                category = "4 estrelas",
                amenities = encodeAmenities(listOf("wifi", "pool")),
                contactPhone = "+55 11 11111-1111",
                contactEmail = "hotel@example.com",
                status = EntityStatus.ACTIVE
            )
        )
        val room = roomRepository.save(
            RoomEntity(
                id = UUID.randomUUID(),
                hotelId = hotel.id,
                name = "Suíte Luxo",
                type = "SUITE",
                description = "Vista para o mar",
                capacity = 2,
                pricePerNight = BigDecimal("200.00"),
                quantity = 1,
                status = EntityStatus.ACTIVE
            )
        )

        val ownerToken = registerAndGetToken("owner@example.com")
        val otherToken = registerAndGetToken("other@example.com")

        val checkIn = LocalDate.now().plusDays(10)
        val checkOut = checkIn.plusDays(2)

        val createBody = """
            {
              "hotelId": "${hotel.id}",
              "roomId": "${room.id}",
              "checkInDate": "$checkIn",
              "checkOutDate": "$checkOut",
              "guestCount": 2
            }
        """.trimIndent()

        val firstReservationResult = mockMvc.post("/reservations") {
            contentType = MediaType.APPLICATION_JSON
            header("Authorization", "Bearer $ownerToken")
            content = createBody
        }.andExpect {
            status { isOk() }
        }.andReturn()

        val firstReservationJson = objectMapper.readTree(firstReservationResult.response.contentAsString)
        val reservationId = firstReservationJson.path("id").asText()
        assertNotNull(reservationId)
        assertEquals("CONFIRMED", firstReservationJson.path("status").asText())
        assertEquals(0, BigDecimal("400.00").compareTo(firstReservationJson.path("totalAmount").decimalValue()))

        mockMvc.post("/reservations") {
            contentType = MediaType.APPLICATION_JSON
            header("Authorization", "Bearer $ownerToken")
            content = createBody
        }.andExpect {
            status { isConflict() }
            jsonPath("$.error") { value("CONFLICT") }
        }

        mockMvc.get("/reservations/$reservationId") {
            header("Authorization", "Bearer $otherToken")
        }.andExpect {
            status { isNotFound() }
        }

        mockMvc.patch("/reservations/$reservationId/cancel") {
            header("Authorization", "Bearer $ownerToken")
        }.andExpect {
            status { isOk() }
            jsonPath("$.status") { value("CANCELLED") }
        }

        mockMvc.post("/reservations") {
            contentType = MediaType.APPLICATION_JSON
            header("Authorization", "Bearer $ownerToken")
            content = createBody
        }.andExpect {
            status { isOk() }
            jsonPath("$.status") { value("CONFIRMED") }
        }
    }

    private fun registerAndGetToken(email: String): String {
        val registerBody = """
            {
              "name": "Test User",
              "email": "$email",
              "password": "secret123",
              "phone": "+55 11 99999-1234"
            }
        """.trimIndent()
        val response = mockMvc.post("/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = registerBody
        }.andExpect {
            status { isOk() }
        }.andReturn()
        return objectMapper.readTree(response.response.contentAsString).path("accessToken").asText()
    }
}
