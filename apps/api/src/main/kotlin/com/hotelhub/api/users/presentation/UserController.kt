package com.hotelhub.api.users.presentation

import com.hotelhub.api.shared.security.SecurityUtils
import com.hotelhub.api.users.application.UserService
import com.hotelhub.api.users.presentation.dto.UpdateProfileRequest
import com.hotelhub.api.users.presentation.dto.UserProfileResponse
import com.hotelhub.api.users.presentation.dto.toProfileResponse
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/users")
class UserController(
    private val userService: UserService
) {

    @GetMapping("/me")
    fun me(): ResponseEntity<UserProfileResponse> {
        val userId = SecurityUtils.requireCurrentUserId()
        return ResponseEntity.ok(userService.getById(userId).toProfileResponse())
    }

    @PutMapping("/me")
    fun updateMe(@Valid @RequestBody request: UpdateProfileRequest): ResponseEntity<UserProfileResponse> {
        val userId = SecurityUtils.requireCurrentUserId()
        return ResponseEntity.ok(userService.updateProfile(userId, request).toProfileResponse())
    }
}
