package com.hotelhub.api

import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableCaching
class HotelHubApplication

fun main(args: Array<String>) {
	runApplication<HotelHubApplication>(*args)
}
