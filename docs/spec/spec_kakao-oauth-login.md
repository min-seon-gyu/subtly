# 카카오 소셜 로그인 전환 스펙

> 작성일: 2026-03-27
> 완료일: 2026-03-27
> 상태: Completed

## 1. 개요

기존 이메일/비밀번호 기반 인증을 제거하고, 카카오 OAuth 로그인만 지원하도록 인증 시스템을 전환한다.

## 2. 배경

- 사용자 편의성 향상: 별도 회원가입 없이 카카오 계정으로 즉시 로그인
- 비밀번호 관리 부담 제거

## 3. 요구사항

### 3.1 기능 요구사항

- [x] FR-1: 프론트엔드에서 카카오 로그인 페이지를 열고, 인가코드를 획득한다
- [x] FR-2: 백엔드에서 인가코드로 카카오 액세스 토큰을 교환한다
- [x] FR-3: 카카오 액세스 토큰으로 사용자 정보(kakaoId, 닉네임, 프로필 이미지)를 조회한다
- [x] FR-4: kakaoId 기반으로 기존 회원이면 로그인, 신규면 자동 가입 후 로그인한다
- [x] FR-5: JWT(accessToken + refreshToken)를 발급하여 프론트에 반환한다
- [x] FR-6: 기존 이메일/비밀번호 회원가입·로그인을 완전히 제거한다
- [x] FR-7: 리프레시 토큰 갱신 플로우는 기존과 동일하게 유지한다

### 3.2 비기능 요구사항

- [x] NFR-1: REST API 키는 백엔드에만 보관 (프론트 노출 금지)
- [x] NFR-2: 카카오 API 호출 실패 시 적절한 에러 응답 반환

## 4. 도메인 모델 변경사항

### 4.1 기존 엔티티 변경: Member

**Before:**
```kotlin
class Member(
    val email: String,
    val password: String,
    val nickname: String,
)
```

**After:**
```kotlin
class Member(
    val kakaoId: Long,          // 카카오 고유 사용자 ID
    val nickname: String,
    val profileImageUrl: String? = null,
)
```

- `email`, `password` 제거
- `kakaoId` 추가 (unique, indexed)
- `profileImageUrl` 추가 (nullable)

### 4.2 RefreshToken 엔티티

변경 없음. 기존 그대로 유지.

## 5. API 변경사항

### 5.1 제거되는 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| POST | /api/auth/signup | 이메일 회원가입 |
| POST | /api/auth/login | 이메일 로그인 |

### 5.2 새로운 엔드포인트

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | /api/auth/kakao | 카카오 인가코드로 로그인/가입 | 불필요 |

### 5.3 요청/응답 스펙

#### POST /api/auth/kakao

**Request:**
```json
{
  "code": "카카오_인가코드",
  "redirectUri": "subtly://auth"
}
```

**Response (200):**
```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "refresh_token_uuid",
  "nickname": "카카오닉네임"
}
```

**Error (401):**
```json
{
  "message": "카카오 인증에 실패했습니다"
}
```

### 5.4 기존 유지 엔드포인트

| Method | Path | 설명 | 변경사항 |
|--------|------|------|---------|
| POST | /api/auth/refresh | 토큰 갱신 | 없음 |

## 6. 비즈니스 로직

### 6.1 카카오 로그인 플로우

```
[프론트엔드]                        [백엔드]                      [카카오 API]
    │                                │                              │
    │── WebBrowser로 카카오 로그인 ───→│                              │
    │                                │                              │
    │←── 카카오 redirect (인가코드) ──│                              │
    │                                │                              │
    │── POST /api/auth/kakao ────────→│                              │
    │   { code, redirectUri }        │                              │
    │                                │── POST /oauth/token ─────────→│
    │                                │←── { access_token } ─────────│
    │                                │                              │
    │                                │── GET /v2/user/me ───────────→│
    │                                │←── { id, nickname, image } ──│
    │                                │                              │
    │                                │── findOrCreate Member ───────│
    │                                │── JWT + RefreshToken 발급 ───│
    │                                │                              │
    │←── { accessToken, refresh, nickname } ─│                      │
```

### 6.2 핵심 규칙

1. 인가코드 → 카카오 액세스 토큰 교환 (POST https://kauth.kakao.com/oauth/token)
2. 카카오 액세스 토큰 → 사용자 정보 조회 (GET https://kapi.kakao.com/v2/user/me)
3. `kakaoId`로 Member 조회 → 없으면 신규 생성 (자동 가입)
4. JWT accessToken(24시간) + refreshToken(30일) 발급

### 6.3 예외 처리

| 상황 | 메시지 | HTTP 상태 |
|------|--------|-----------|
| 카카오 토큰 교환 실패 | 카카오 인증에 실패했습니다 | 401 |
| 카카오 사용자 정보 조회 실패 | 카카오 사용자 정보를 가져올 수 없습니다 | 401 |
| 인가코드 누락 | 인가코드가 필요합니다 | 400 |

## 7. 데이터 마이그레이션

- `members` 테이블 DDL 변경: email/password 컬럼 제거, kakaoId/profileImageUrl 추가
- 기존 이메일 가입 사용자 데이터는 삭제됨 (스터디 프로젝트이므로 허용)
- `ddl-auto: update`로 자동 처리 (local 프로필)

## 8. 영향 범위

### 8.1 백엔드

| 파일 | 변경 내용 |
|------|----------|
| Member.kt | email/password → kakaoId/profileImageUrl |
| AuthService.kt | signup/login 제거 → kakaoLogin 추가 |
| AuthController.kt | /signup, /login 제거 → /kakao 추가 |
| AuthDtos.kt | SignupRequest/LoginRequest 제거 → KakaoLoginRequest 추가 |
| MemberRepository.kt | findByEmail 제거 → findByKakaoId 추가 |
| SecurityConfig.kt | permitAll 경로 변경 |
| build.gradle.kts | spring-boot-starter-webflux 추가 (WebClient용) |
| application.yml | 카카오 REST API 키 설정 추가 |

### 8.2 프론트엔드

| 파일 | 변경 내용 |
|------|----------|
| login.tsx | 이메일 폼 제거 → 카카오 로그인 버튼 |
| signup.tsx | 삭제 |
| useAuthStore.ts | login/signup 제거 → kakaoLogin 추가 |
| _layout.tsx | signup 라우트 제거 |
| package.json | expo-web-browser 추가 |

## 9. 제약사항 & 가정

- 카카오 개발자 콘솔에서 앱이 생성되어 있고, REST API 키가 준비되어 있다고 가정
- Redirect URI: `subtly://auth` (app.config.ts에 scheme: 'subtly' 이미 설정됨)
- 카카오 API에서 닉네임은 항상 제공된다고 가정 (프로필 이미지는 optional)
