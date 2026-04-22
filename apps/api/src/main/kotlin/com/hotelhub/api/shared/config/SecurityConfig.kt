package com.hotelhub.api.shared.config

import com.hotelhub.api.shared.error.ApiErrorCode
import com.hotelhub.api.shared.security.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableMethodSecurity
class SecurityConfig(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter,
    private val securityErrorResponseWriter: SecurityErrorResponseWriter
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        return http
            .cors { it.configurationSource(corsConfigurationSource()) }
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests {
                it.requestMatchers(
                    "/auth/register",
                    "/auth/login",
                    "/destinations/**",
                    "/hotels/**",
                    "/packages/**",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()
                    .requestMatchers("/admin/**").hasRole("ADMIN")
                    .anyRequest().authenticated()
            }
            .exceptionHandling {
                it.authenticationEntryPoint { request, response, _ ->
                    securityErrorResponseWriter.write(
                        response = response,
                        request = request,
                        status = HttpStatus.UNAUTHORIZED,
                        code = ApiErrorCode.UNAUTHORIZED,
                        message = "Authentication required"
                    )
                }
                it.accessDeniedHandler { request, response, _ ->
                    securityErrorResponseWriter.write(
                        response = response,
                        request = request,
                        status = HttpStatus.FORBIDDEN,
                        code = ApiErrorCode.FORBIDDEN,
                        message = "Access denied"
                    )
                }
            }
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)
            .build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val corsConfig = CorsConfiguration().apply {
            allowedOrigins = listOf(
                "http://localhost:3000",         // Next.js dev
                "http://localhost:3001",        // Next.js alternative
                "http://localhost",             // Via Nginx proxy
                "http://localhost:8080",        // Direct to API
                "http://127.0.0.1:3000",
                "http://127.0.0.1:3001",
                "http://127.0.0.1:8080",
                "http://127.0.0.1",
                "exp://localhost:19000",        // Expo dev
                "http://localhost:19000"        // Expo dev alternative
            )
            allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD")
            allowedHeaders = listOf(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With",
                "X-CSRF-Token"
            )
            exposedHeaders = listOf(
                "Authorization",
                "Content-Type",
                "X-Total-Count",  // For pagination
                "X-Page-Count"
            )
            allowCredentials = true
            maxAge = 3600  // 1 hour
        }

        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**", corsConfig)
        }
    }
}
