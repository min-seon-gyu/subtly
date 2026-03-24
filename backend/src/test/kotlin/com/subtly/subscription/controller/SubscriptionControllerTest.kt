package com.subtly.subscription.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.subtly.auth.dto.SignupRequest
import com.subtly.auth.dto.TokenResponse
import com.subtly.auth.repository.MemberRepository
import com.subtly.auth.repository.RefreshTokenRepository
import com.subtly.auth.service.AuthService
import com.subtly.subscription.dto.CreateSubscriptionRequest
import com.subtly.subscription.dto.UpdateSubscriptionRequest
import com.subtly.subscription.entity.BillingCycle
import com.subtly.subscription.repository.SubscriptionRepository
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SubscriptionControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var authService: AuthService

    @Autowired
    lateinit var subscriptionRepository: SubscriptionRepository

    @Autowired
    lateinit var refreshTokenRepository: RefreshTokenRepository

    @Autowired
    lateinit var memberRepository: MemberRepository

    private lateinit var tokenResponse: TokenResponse

    @BeforeEach
    fun setUp() {
        subscriptionRepository.deleteAll()
        refreshTokenRepository.deleteAll()
        memberRepository.deleteAll()
        tokenResponse = authService.signup(
            SignupRequest(email = "test@subtly.com", password = "password123", nickname = "테스터")
        )
    }

    private fun createRequest(
        name: String = "Netflix",
        price: Int = 17000,
    ) = CreateSubscriptionRequest(
        name = name, price = price,
        billingCycle = BillingCycle.MONTHLY, billingDate = 15,
        category = "video", color = "#E50914", icon = "🎬",
    )

    @Test
    fun `인증 없이 구독 조회 - 403 반환`() {
        mockMvc.get("/api/subscriptions").andExpect {
            status { isForbidden() }
        }
    }

    @Test
    fun `유효하지 않은 토큰 - 403 반환`() {
        mockMvc.get("/api/subscriptions") {
            header("Authorization", "Bearer invalid-token")
        }.andExpect {
            status { isForbidden() }
        }
    }

    @Test
    fun `구독 생성 - 201 반환`() {
        mockMvc.post("/api/subscriptions") {
            header("Authorization", "Bearer ${tokenResponse.accessToken}")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(createRequest())
        }.andExpect {
            status { isCreated() }
            jsonPath("$.name") { value("Netflix") }
            jsonPath("$.price") { value(17000) }
            jsonPath("$.isActive") { value(true) }
        }
    }

    @Test
    fun `구독 목록 조회 - 200 반환`() {
        mockMvc.post("/api/subscriptions") {
            header("Authorization", "Bearer ${tokenResponse.accessToken}")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(createRequest())
        }

        mockMvc.get("/api/subscriptions") {
            header("Authorization", "Bearer ${tokenResponse.accessToken}")
        }.andExpect {
            status { isOk() }
            jsonPath("$.length()") { value(1) }
            jsonPath("$[0].name") { value("Netflix") }
        }
    }

    @Test
    fun `구독 수정 - 200 반환`() {
        val result = mockMvc.post("/api/subscriptions") {
            header("Authorization", "Bearer ${tokenResponse.accessToken}")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(createRequest())
        }.andReturn()

        val id = objectMapper.readTree(result.response.contentAsString)["id"].asLong()

        mockMvc.put("/api/subscriptions/$id") {
            header("Authorization", "Bearer ${tokenResponse.accessToken}")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(UpdateSubscriptionRequest(name = "Netflix Premium"))
        }.andExpect {
            status { isOk() }
            jsonPath("$.name") { value("Netflix Premium") }
        }
    }

    @Test
    fun `구독 삭제 - 204 반환`() {
        val result = mockMvc.post("/api/subscriptions") {
            header("Authorization", "Bearer ${tokenResponse.accessToken}")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(createRequest())
        }.andReturn()

        val id = objectMapper.readTree(result.response.contentAsString)["id"].asLong()

        mockMvc.delete("/api/subscriptions/$id") {
            header("Authorization", "Bearer ${tokenResponse.accessToken}")
        }.andExpect {
            status { isNoContent() }
        }
    }

    @Test
    fun `존재하지 않는 구독 수정 - 404 반환`() {
        mockMvc.put("/api/subscriptions/99999") {
            header("Authorization", "Bearer ${tokenResponse.accessToken}")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(UpdateSubscriptionRequest(name = "없는구독"))
        }.andExpect {
            status { isNotFound() }
        }
    }

    @Test
    fun `존재하지 않는 구독 삭제 - 404 반환`() {
        mockMvc.delete("/api/subscriptions/99999") {
            header("Authorization", "Bearer ${tokenResponse.accessToken}")
        }.andExpect {
            status { isNotFound() }
        }
    }

    @Test
    fun `다른 사용자 구독 수정 - 404 반환`() {
        val result = mockMvc.post("/api/subscriptions") {
            header("Authorization", "Bearer ${tokenResponse.accessToken}")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(createRequest())
        }.andReturn()

        val id = objectMapper.readTree(result.response.contentAsString)["id"].asLong()

        val otherToken = authService.signup(
            SignupRequest(email = "other@subtly.com", password = "password123", nickname = "다른유저")
        )

        mockMvc.put("/api/subscriptions/$id") {
            header("Authorization", "Bearer ${otherToken.accessToken}")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(UpdateSubscriptionRequest(name = "해킹"))
        }.andExpect {
            status { isNotFound() }
        }
    }

    @Test
    fun `요약 조회 - 200 반환`() {
        mockMvc.post("/api/subscriptions") {
            header("Authorization", "Bearer ${tokenResponse.accessToken}")
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(createRequest())
        }

        mockMvc.get("/api/subscriptions/summary") {
            header("Authorization", "Bearer ${tokenResponse.accessToken}")
        }.andExpect {
            status { isOk() }
            jsonPath("$.totalMonthly") { value(17000) }
            jsonPath("$.activeCount") { value(1) }
        }
    }
}
