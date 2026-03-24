package com.subtly.subscription.controller

import com.subtly.subscription.dto.*
import com.subtly.subscription.service.SubscriptionService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/subscriptions")
class SubscriptionController(
    private val subscriptionService: SubscriptionService,
) {
    @GetMapping
    fun getSubscriptions(auth: Authentication): List<SubscriptionResponse> {
        return subscriptionService.getSubscriptions(auth.principal as Long)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createSubscription(
        auth: Authentication,
        @Valid @RequestBody request: CreateSubscriptionRequest,
    ): SubscriptionResponse {
        return subscriptionService.createSubscription(auth.principal as Long, request)
    }

    @PutMapping("/{id}")
    fun updateSubscription(
        auth: Authentication,
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateSubscriptionRequest,
    ): SubscriptionResponse {
        return subscriptionService.updateSubscription(auth.principal as Long, id, request)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteSubscription(auth: Authentication, @PathVariable id: Long) {
        subscriptionService.deleteSubscription(auth.principal as Long, id)
    }

    @GetMapping("/summary")
    fun getSummary(auth: Authentication): SubscriptionSummaryResponse {
        return subscriptionService.getSummary(auth.principal as Long)
    }
}
