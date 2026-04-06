package com.hotelhub.api.shared.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.hotelhub.api.shared.error.ApiErrorCode
import com.hotelhub.api.shared.error.ErrorResponse
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class SecurityErrorResponseWriter(
    private val objectMapper: ObjectMapper
) {
    fun write(
        response: HttpServletResponse,
        request: HttpServletRequest,
        status: HttpStatus,
        code: ApiErrorCode,
        message: String
    ) {
        response.status = status.value()
        response.contentType = "application/json"
        response.characterEncoding = Charsets.UTF_8.name()
        val payload = ErrorResponse(
            timestamp = Instant.now(),
            status = status.value(),
            error = code.name,
            message = message,
            path = request.requestURI
        )
        response.writer.write(objectMapper.writeValueAsString(payload))
    }
}
