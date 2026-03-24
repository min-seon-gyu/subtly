package com.subtly.auth.service

import com.subtly.auth.dto.LoginRequest
import com.subtly.auth.dto.SignupRequest
import com.subtly.auth.repository.MemberRepository
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceTest {

    @Autowired
    lateinit var authService: AuthService

    @Autowired
    lateinit var memberRepository: MemberRepository

    @BeforeEach
    fun setUp() {
        memberRepository.deleteAll()
    }

    @Test
    fun `회원가입 성공`() {
        val request = SignupRequest(
            email = "test@subtly.com",
            password = "password123",
            nickname = "테스터",
        )

        val response = authService.signup(request)

        assertThat(response.accessToken).isNotBlank()
        assertThat(response.nickname).isEqualTo("테스터")
        assertThat(memberRepository.existsByEmail("test@subtly.com")).isTrue()
    }

    @Test
    fun `중복 이메일 회원가입 실패`() {
        val request = SignupRequest(
            email = "test@subtly.com",
            password = "password123",
            nickname = "테스터",
        )
        authService.signup(request)

        assertThatThrownBy {
            authService.signup(request.copy(nickname = "테스터2"))
        }.isInstanceOf(IllegalArgumentException::class.java)
            .hasMessageContaining("이미 가입된 이메일")
    }

    @Test
    fun `로그인 성공`() {
        authService.signup(
            SignupRequest(
                email = "test@subtly.com",
                password = "password123",
                nickname = "테스터",
            )
        )

        val response = authService.login(
            LoginRequest(email = "test@subtly.com", password = "password123")
        )

        assertThat(response.accessToken).isNotBlank()
        assertThat(response.nickname).isEqualTo("테스터")
    }

    @Test
    fun `존재하지 않는 이메일 로그인 실패`() {
        assertThatThrownBy {
            authService.login(LoginRequest(email = "none@subtly.com", password = "password123"))
        }.isInstanceOf(IllegalArgumentException::class.java)
            .hasMessageContaining("이메일 또는 비밀번호")
    }

    @Test
    fun `잘못된 비밀번호 로그인 실패`() {
        authService.signup(
            SignupRequest(
                email = "test@subtly.com",
                password = "password123",
                nickname = "테스터",
            )
        )

        assertThatThrownBy {
            authService.login(LoginRequest(email = "test@subtly.com", password = "wrongpass"))
        }.isInstanceOf(IllegalArgumentException::class.java)
            .hasMessageContaining("이메일 또는 비밀번호")
    }
}
