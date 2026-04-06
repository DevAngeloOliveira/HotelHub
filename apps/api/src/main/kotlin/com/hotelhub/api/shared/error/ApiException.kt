package com.hotelhub.api.shared.error

import org.springframework.http.HttpStatus

open class ApiException(
    val status: HttpStatus,
    val code: ApiErrorCode,
    message: String
) : RuntimeException(message)

class ResourceNotFoundException(message: String) : ApiException(
    status = HttpStatus.NOT_FOUND,
    code = ApiErrorCode.RESOURCE_NOT_FOUND,
    message = message
)

class ConflictException(message: String) : ApiException(
    status = HttpStatus.CONFLICT,
    code = ApiErrorCode.CONFLICT,
    message = message
)

class ForbiddenException(message: String) : ApiException(
    status = HttpStatus.FORBIDDEN,
    code = ApiErrorCode.FORBIDDEN,
    message = message
)

class UnauthorizedException(message: String) : ApiException(
    status = HttpStatus.UNAUTHORIZED,
    code = ApiErrorCode.UNAUTHORIZED,
    message = message
)

class BusinessRuleException(message: String) : ApiException(
    status = HttpStatus.BAD_REQUEST,
    code = ApiErrorCode.BUSINESS_RULE_VIOLATION,
    message = message
)
