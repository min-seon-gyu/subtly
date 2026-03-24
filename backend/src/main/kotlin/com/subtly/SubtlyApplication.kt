package com.subtly

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SubtlyApplication

fun main(args: Array<String>) {
    runApplication<SubtlyApplication>(*args)
}
