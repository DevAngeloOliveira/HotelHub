package com.hotelhub.api.users.presentation

import com.hotelhub.api.shared.domain.EntityStatus
import com.hotelhub.api.shared.pagination.PageResponse
import com.hotelhub.api.users.application.UserService
import com.hotelhub.api.users.presentation.dto.UserProfileResponse
import com.hotelhub.api.users.presentation.dto.toProfileResponse
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/admin/users")
class AdminUserController(
    private val userService: UserService
) {

    @GetMapping
    fun listUsers(
        @RequestParam(required = false) status: EntityStatus?,
        @PageableDefault(size = 20) pageable: Pageable
    ): ResponseEntity<PageResponse<UserProfileResponse>> {
        val page = userService.listUsers(status, pageable).map { it.toProfileResponse() }
        return ResponseEntity.ok(PageResponse.from(page))
    }
}
