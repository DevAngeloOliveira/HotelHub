package com.hotelhub.api.auth

import com.hotelhub.api.support.BaseIntegrationTest
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import kotlin.test.assertEquals

class AuthIntegrationTest : BaseIntegrationTest() {

    @Test
    fun `register login and me flow works`() {
        val registerBody = """
            {
              "name": "Alice Client",
              "email": "alice@example.com",
              "password": "secret123",
              "phone": "+55 11 99999-9999"
            }
        """.trimIndent()

        val registerResult = mockMvc.post("/auth/register") {
            contentType = MediaType.APPLICATION_JSON
            content = registerBody
        }.andExpect {
            status { isOk() }
        }.andReturn()

        val registerJson = objectMapper.readTree(registerResult.response.contentAsString)
        val token = registerJson.path("accessToken").asText()
        assertNotNull(token)

        val loginBody = """
            {
              "email": "alice@example.com",
              "password": "secret123"
            }
        """.trimIndent()

        val loginResult = mockMvc.post("/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = loginBody
        }.andExpect {
            status { isOk() }
        }.andReturn()

        val loginToken = objectMapper.readTree(loginResult.response.contentAsString).path("accessToken").asText()
        assertNotNull(loginToken)

        val meResult = mockMvc.get("/auth/me") {
            header("Authorization", "Bearer $loginToken")
        }.andExpect {
            status { isOk() }
        }.andReturn()

        val meJson = objectMapper.readTree(meResult.response.contentAsString)
        assertEquals("alice@example.com", meJson.path("email").asText())
        assertEquals("CLIENT", meJson.path("role").asText())
    }
}
