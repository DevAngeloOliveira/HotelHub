package com.hotelhub.api.shared.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.domain.PageRequest
import org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer

@Configuration
class PageableConfig {

    @Bean
    fun pageableCustomizer(): PageableHandlerMethodArgumentResolverCustomizer {
        return PageableHandlerMethodArgumentResolverCustomizer {
            it.setOneIndexedParameters(false)
            it.setMaxPageSize(100)
            it.setFallbackPageable(PageRequest.of(0, 20))
        }
    }
}
