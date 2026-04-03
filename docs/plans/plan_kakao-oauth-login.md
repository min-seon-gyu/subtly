# 카카오 소셜 로그인 전환 실행 계획

> 스펙 문서: docs/spec/spec_kakao-oauth-login.md
> 작성일: 2026-03-27
> 완료일: 2026-03-27
> 상태: Completed

## 1. 작업 개요

기존 이메일/비밀번호 인증을 완전히 제거하고, 카카오 OAuth 인가코드 방식 로그인으로 교체한다. 백엔드에서 카카오 API를 호출하여 토큰 교환 및 사용자 정보 조회를 수행하고, 프론트엔드에서는 expo-web-browser로 카카오 로그인 페이지를 연다.

**전제조건**:
- 카카오 개발자 콘솔에서 앱 생성 및 REST API 키 발급
- Redirect URI `subtly://auth` 등록

## 2. 단계별 작업 목록

### Step 1: 백엔드 의존성 & 설정

**구현**:
- [x] `build.gradle.kts`: `spring-boot-starter-webflux` 의존성 추가
- [x] `application.yml`: 카카오 REST API 키, 클라이언트 시크릿 설정 추가

**커밋**: `feat: 카카오 OAuth 의존성 및 설정 추가`

---

### Step 2: 도메인 모델 변경 (Member 엔티티)

**테스트 먼저**:
- [x] `AuthServiceTest.kt`: 기존 테스트 전체 삭제 (email/password 기반이므로)

**구현**:
- [x] `Member.kt`: email/password 제거, kakaoId(Long, unique) + profileImageUrl(String?) 추가
- [x] `MemberRepository.kt`: findByEmail/existsByEmail 제거, findByKakaoId 추가
- [x] `AuthDtos.kt`: SignupRequest/LoginRequest 제거, KakaoLoginRequest(code, redirectUri) 추가

**커밋**: `feat: Member 엔티티를 카카오 OAuth 기반으로 변경`

---

### Step 3: 카카오 API 클라이언트 & 서비스 로직

**테스트 먼저**:
- [x] `AuthServiceTest.kt`: `카카오 로그인 성공 - 신규 회원 자동 가입` 테스트
- [x] `AuthServiceTest.kt`: `카카오 로그인 성공 - 기존 회원 로그인` 테스트
- [x] `AuthServiceTest.kt`: `카카오 토큰 교환 실패 시 예외` 테스트

**구현**:
- [x] `KakaoOAuthClient.kt`: 카카오 API 호출 클래스 (토큰 교환 + 사용자 정보 조회)
- [x] `KakaoUserInfo.kt`: 카카오 사용자 정보 DTO
- [x] `AuthService.kt`: signup/login 제거, kakaoLogin(code, redirectUri) 추가
- [x] `SecurityConfig.kt`: PasswordEncoder Bean 제거

**커밋**: `feat: 카카오 OAuth 클라이언트 및 로그인 서비스 구현`

---

### Step 4: 컨트롤러 & API 테스트

**테스트 먼저**:
- [x] `AuthControllerTest.kt`: 기존 테스트 전체 교체
- [x] `AuthControllerTest.kt`: `카카오 로그인 성공 - 200 반환` 테스트
- [x] `AuthControllerTest.kt`: `인가코드 누락 - 400 반환` 테스트

**구현**:
- [x] `AuthController.kt`: /signup, /login 제거, POST /kakao 추가

**커밋**: `feat: 카카오 로그인 API 엔드포인트 구현`

---

### Step 5: 프론트엔드 - 의존성 & 설정

**구현**:
- [x] `expo-web-browser` 패키지 설치
- [x] `constants/config.ts`: KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI 추가
- [x] `app.config.ts`: expo-web-browser 플러그인 추가 (필요 시)

**커밋**: `feat: 프론트엔드 카카오 OAuth 의존성 추가`

---

### Step 6: 프론트엔드 - 인증 로직 & 화면

**구현**:
- [x] `useAuthStore.ts`: login/signup 제거, kakaoLogin(code) 추가
- [x] `login.tsx`: 이메일 폼 제거, 카카오 로그인 버튼 (WebBrowser로 카카오 인증 → 인가코드 → 백엔드 호출)
- [x] `signup.tsx`: 파일 삭제
- [x] `_layout.tsx`: signup 라우트 제거, PREVIEW_MODE 카카오 대응
- [x] `services/api.ts`: mockApi에 카카오 로그인 mock 추가 (PREVIEW_MODE용)

**커밋**: `feat: 프론트엔드 카카오 로그인 화면 및 인증 플로우 구현`

---

## 3. 파일 변경 요약

### 3.1 새로 생성하는 파일

| 파일 경로 | 용도 | Step |
|----------|------|------|
| `backend/.../auth/client/KakaoOAuthClient.kt` | 카카오 API 호출 | Step 3 |
| `backend/.../auth/dto/KakaoUserInfo.kt` | 카카오 사용자 정보 DTO | Step 3 |

### 3.2 수정하는 파일

| 파일 경로 | 변경 내용 | Step |
|----------|----------|------|
| `build.gradle.kts` | webflux 의존성 추가 | Step 1 |
| `application.yml` | 카카오 설정 추가 | Step 1 |
| `Member.kt` | email/password → kakaoId/profileImageUrl | Step 2 |
| `MemberRepository.kt` | findByKakaoId | Step 2 |
| `AuthDtos.kt` | KakaoLoginRequest | Step 2 |
| `AuthService.kt` | kakaoLogin | Step 3 |
| `SecurityConfig.kt` | PasswordEncoder 제거 | Step 3 |
| `AuthController.kt` | POST /kakao | Step 4 |
| `constants/config.ts` | 카카오 설정 | Step 5 |
| `useAuthStore.ts` | kakaoLogin | Step 6 |
| `login.tsx` | 카카오 로그인 UI | Step 6 |
| `_layout.tsx` | signup 라우트 제거 | Step 6 |

### 3.3 삭제하는 파일

| 파일 경로 | 이유 | Step |
|----------|------|------|
| `signup.tsx` | 이메일 회원가입 제거 | Step 6 |

### 3.4 테스트 파일

| 파일 경로 | 테스트 유형 | Step |
|----------|-----------|------|
| `AuthServiceTest.kt` | 서비스 단위 (Kakao mock) | Step 2-3 |
| `AuthControllerTest.kt` | API 통합 | Step 4 |

## 4. 테스트 계획

### 4.1 테스트 커버리지

| 테스트 유형 | 파일 | 테스트 케이스 수 |
|-----------|------|--------------|
| 서비스 테스트 | AuthServiceTest.kt | 3 |
| API 테스트 | AuthControllerTest.kt | 2 |

### 4.2 테스트 전략

- KakaoOAuthClient는 `@MockBean`으로 모킹하여 외부 API 의존성 제거
- 신규 가입 / 기존 회원 로그인 / 카카오 API 실패 케이스 커버

## 5. 의존성

### 5.1 외부 의존성

| 대상 | 유형 | 설명 |
|------|------|------|
| `spring-boot-starter-webflux` | Gradle 추가 | WebClient로 카카오 API 호출 |
| `expo-web-browser` | npm 추가 | 카카오 로그인 페이지 오픈 |

## 6. 커밋 계획

| 순서 | 커밋 메시지 | 포함 내용 |
|------|-----------|----------|
| 1 | `feat: 카카오 OAuth 의존성 및 설정 추가` | build.gradle, application.yml |
| 2 | `feat: Member 엔티티를 카카오 OAuth 기반으로 변경` | Member, Repository, DTOs |
| 3 | `feat: 카카오 OAuth 클라이언트 및 로그인 서비스 구현` | KakaoOAuthClient, AuthService |
| 4 | `feat: 카카오 로그인 API 엔드포인트 구현` | AuthController, Controller 테스트 |
| 5 | `feat: 프론트엔드 카카오 OAuth 의존성 추가` | package.json, config |
| 6 | `feat: 프론트엔드 카카오 로그인 화면 및 인증 플로우 구현` | login.tsx, useAuthStore, _layout |

## 7. 리스크 & 주의사항

| 리스크 | 영향 | 대응 방안 |
|--------|------|----------|
| 카카오 개발자 앱 미설정 | 전체 플로우 동작 불가 | PREVIEW_MODE로 UI 확인 가능하도록 mock 유지 |
| Expo WebBrowser 딥링크 미작동 | 인가코드 콜백 실패 | scheme: 'subtly' 이미 설정됨, 시뮬레이터 테스트 필요 |
| 기존 members 데이터 유실 | DDL 변경으로 기존 데이터 호환 불가 | 스터디 프로젝트이므로 허용, DB 초기화 |
