package com.subtly.auth.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.subtly.auth.dto.LoginRequest
import com.subtly.auth.dto.SignupRequest
import com.subtly.auth.repository.MemberRepository
import com.subtly.auth.repository.RefreshTokenRepository
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var memberRepository: MemberRepository

    @Autowired
    lateinit var refreshTokenRepository: RefreshTokenRepository

    @BeforeEach
    fun setUp() {
        refreshTokenRepository.deleteAll()
        memberRepository.deleteAll()
    }

    @Test
    fun `회원가입 성공 - 201 반환`() {
        val request = SignupRequest(email = "test@subtly.com", password = "password123", nickname = "테스터")

        mockMvc.post("/api/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isCreated() }
            jsonPath("$.accessToken") { isNotEmpty() }
            jsonPath("$.refreshToken") { isNotEmpty() }
            jsonPath("$.nickname") { value("테스터") }
        }
    }

    @Test
    fun `중복 이메일 회원가입 - 400 반환`() {
        val request = SignupRequest(email = "test@subtly.com", password = "password123", nickname = "테스터")
        mockMvc.post("/api/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }

        mockMvc.post("/api/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request.copy(nickname = "테스터2"))
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `유효하지 않은 이메일 형식 - 400 반환`() {
        val request = SignupRequest(email = "invalid-email", password = "password123", nickname = "테스터")

        mockMvc.post("/api/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `짧은 비밀번호 - 400 반환`() {
        val request = SignupRequest(email = "test@subtly.com", password = "12345", nickname = "테스터")

        mockMvc.post("/api/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(request)
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `로그인 성공 - 200 반환`() {
        val signup = SignupRequest(email = "test@subtly.com", password = "password123", nickname = "테스터")
        mockMvc.post("/api/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(signup)
        }

        mockMvc.post("/api/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(LoginRequest(email = "test@subtly.com", password = "password123"))
        }.andExpect {
            status { isOk() }
            jsonPath("$.accessToken") { isNotEmpty() }
            jsonPath("$.nickname") { value("테스터") }
        }
    }

    @Test
    fun `잘못된 비밀번호 로그인 - 400 반환`() {
        val signup = SignupRequest(email = "test@subtly.com", password = "password123", nickname = "테스터")
        mockMvc.post("/api/auth/signup") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(signup)
        }

        mockMvc.post("/api/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(LoginRequest(email = "test@subtly.com", password = "wrongpass"))
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `존재하지 않는 이메일 로그인 - 400 반환`() {
        mockMvc.post("/api/auth/login") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsString(LoginRequest(email = "none@subtly.com", password = "password123"))
        }.andExpect {
            status { isBadRequest() }
        }
    }
}
