package com.hotelhub.api.users

import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.domain.Role
import com.hotelhub.api.support.BaseIntegrationTest
import com.hotelhub.api.users.infrastructure.persistence.entity.UserEntity
import com.hotelhub.api.users.infrastructure.persistence.repository.UserJpaRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import java.util.UUID

class AdminAccessIntegrationTest : BaseIntegrationTest() {

    @Autowired
    private lateinit var userRepository: UserJpaRepository

    @Autowired
    private lateinit var passwordEncoder: PasswordEncoder

    @Test
    fun `admin routes are protected and admin can list users`() {
        val clientToken = registerAndGetToken("client@example.com", "secret123")

        mockMvc.get("/admin/users") {
            header("Authorization", "Bearer $clientToken")
        }.andExpect {
            status { isForbidden() }
        }

        userRepository.save(
            UserEntity(
                id = UUID.randomUUID(),
                name = "Admin User",
                email = "admin@example.com",
                passwordHash = passwordEncoder.encode("secret123"),
                phone = "+55 11 99999-1111",
                role = Role.ADMIN,
                status = EntityStatus.ACTIVE
            )
        )

        val adminToken = loginAndGetToken("admin@example.com", "secret123")

        val result = mockMvc.get("/admin/users") {
            header("Authorization", "Bearer $adminToken")
        }.andExpect {
            status { isOk() }
        }.andReturn()

        val json = objectMapper.readTree(result.response.contentAsString)
        assertEquals(true, json.path("content").isArray)
    }

    private fun registerAndGetToken(email: String, password: String): String {
        val body = """
            {
              "name": "User",
              "email": "$email",
              "password": "$password",
              "phone": "+55 11 99999-9999"
            }
        """.trimIndent()
        val result = mockMvc.post("/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = body
        }.andExpect {
            status { isOk() }
        }.andReturn()
        return objectMapper.readTree(result.response.contentAsString).path("accessToken").asText()
    }

    private fun loginAndGetToken(email: String, password: String): String {
        val body = """
            {
              "email": "$email",
              "password": "$password"
            }
        """.trimIndent()
        val result = mockMvc.post("/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = body
        }.andExpect {
            status { isOk() }
        }.andReturn()
        return objectMapper.readTree(result.response.contentAsString).path("accessToken").asText()
    }
}
