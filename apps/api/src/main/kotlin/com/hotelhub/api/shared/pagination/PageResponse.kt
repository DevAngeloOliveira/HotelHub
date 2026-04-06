package com.hotelhub.api.shared.pagination

import org.springframework.data.domain.Page

data class PageResponse<T>(
    val content: List<T>,
    val page: Int,
    val size: Int,
    val totalElements: Long,
    val totalPages: Int,
    val sort: String
) {
    companion object {
        fun <T> from(page: Page<T>): PageResponse<T> {
            val sortText = page.sort
                .map { "${it.property},${it.direction.name.lowercase()}" }
                .joinToString(",")
            return PageResponse(
                content = page.content,
                page = page.number,
                size = page.size,
                totalElements = page.totalElements,
                totalPages = page.totalPages,
                sort = sortText
            )
        }
    }
}
