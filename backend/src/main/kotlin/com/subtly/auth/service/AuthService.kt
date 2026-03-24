package com.subtly.auth.service

import com.subtly.auth.dto.LoginRequest
import com.subtly.auth.dto.SignupRequest
import com.subtly.auth.dto.TokenResponse
import com.subtly.auth.entity.Member
import com.subtly.auth.jwt.JwtTokenProvider
import com.subtly.auth.repository.MemberRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class AuthService(
    private val memberRepository: MemberRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
) {
    @Transactional
    fun signup(request: SignupRequest): TokenResponse {
        require(!memberRepository.existsByEmail(request.email)) { "이미 가입된 이메일입니다" }

        val member = memberRepository.save(
            Member(
                email = request.email,
                password = passwordEncoder.encode(request.password),
                nickname = request.nickname,
            )
        )
        val token = jwtTokenProvider.createToken(member.id, member.email)
        return TokenResponse(accessToken = token, nickname = member.nickname)
    }

    fun login(request: LoginRequest): TokenResponse {
        val member = memberRepository.findByEmail(request.email)
            .orElseThrow { IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다") }

        require(passwordEncoder.matches(request.password, member.password)) {
            "이메일 또는 비밀번호가 올바르지 않습니다"
        }

        val token = jwtTokenProvider.createToken(member.id, member.email)
        return TokenResponse(accessToken = token, nickname = member.nickname)
    }
}
