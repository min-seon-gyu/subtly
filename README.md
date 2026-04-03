# Subtly

구독 서비스를 한눈에 관리하는 모바일 앱

## 프로젝트 개요

Subtly는 넷플릭스, 유튜브 프리미엄 등 흩어진 구독 서비스를 한 곳에서 관리할 수 있는 앱입니다.
월별 지출 통계, 다가오는 결제 알림, 카테고리별 분석 등을 제공합니다.

## 기술 스택

### 프론트엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| React Native | 0.83.2 | 크로스플랫폼 모바일 |
| Expo | 55 | 빌드·배포 |
| TypeScript | 5.9 | 타입 안정성 |
| Zustand | 5.0 | 상태 관리 |
| Axios | 1.13 | HTTP 클라이언트 |
| dayjs | 1.11 | 날짜 처리 |

### 백엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| Spring Boot | 3.4.5 | 서버 프레임워크 |
| Kotlin | 1.9.25 | 언어 |
| Java | 21 | JDK |
| Spring Security + JWT | - | 인증·인가 |
| Spring Data JPA | - | ORM |
| Flyway | - | DB 마이그레이션 |
| MySQL | - | 운영 DB |
| H2 | - | 테스트 DB |

## 주요 기능

- **카카오 소셜 로그인** — 별도 회원가입 없이 카카오 계정으로 즉시 이용
- **구독 CRUD** — 구독 서비스 등록, 조회, 수정, 삭제
- **프리셋** — 주요 구독 서비스 프리셋으로 빠르게 등록
- **월별 지출 통계** — 바 차트, 파이 차트로 지출 현황 시각화
- **카테고리 필터·검색** — 카테고리별 분류 및 검색
- **다가오는 결제 알림** — 결제 예정일 알림
- **다크모드** — 시스템 테마 연동
- **통화 설정** — 다중 통화 지원
- **계정 삭제** — 회원 탈퇴 기능
- **프리뷰 모드** — mock 데이터로 백엔드 없이 전체 화면 확인 가능

## 프로젝트 구조

```
subtly-project/
├── app/                    # Expo Router 페이지
│   ├── (tabs)/             # 탭 네비게이션 (홈, 구독, 통계, 설정)
│   ├── auth/               # 로그인 화면
│   ├── add.tsx             # 구독 추가
│   ├── detail.tsx          # 구독 상세
│   └── edit.tsx            # 구독 수정
├── components/             # 재사용 컴포넌트
├── stores/                 # Zustand 상태 관리
├── services/               # API 클라이언트
├── constants/              # 설정 상수
├── types/                  # TypeScript 타입 정의
├── backend/                # Spring Boot 백엔드
│   └── src/main/kotlin/com/subtly/
│       ├── auth/           # 인증 (카카오 OAuth, JWT)
│       ├── subscription/   # 구독 CRUD
│       └── config/         # 보안, 예외 처리, Rate Limit
└── docs/                   # 프로젝트 문서
    ├── spec/               # 기능 스펙 문서
    └── plans/              # 실행 계획 문서
```

## 시작하기

### 사전 요구사항

- Node.js 18+
- JDK 21
- MySQL 8.0+
- 카카오 개발자 앱 (REST API 키)

### 환경 변수 설정

`.env.example`을 참고하여 `.env` 파일을 생성합니다.

```bash
cp .env.example .env
```

### 프론트엔드 실행

```bash
npm install
npm start
```

### 백엔드 실행

```bash
cd backend
./gradlew bootRun
```

### 프리뷰 모드 (백엔드 없이)

환경 변수에서 프리뷰 모드를 활성화하면 mock 데이터로 전체 화면을 확인할 수 있습니다.

## API 엔드포인트

### 인증

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/auth/kakao` | 카카오 로그인/가입 | 불필요 |
| POST | `/api/auth/refresh` | 토큰 갱신 | 불필요 |
| DELETE | `/api/auth/account` | 계정 삭제 | 필요 |

### 구독

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| GET | `/api/subscriptions` | 구독 목록 조회 | 필요 |
| POST | `/api/subscriptions` | 구독 등록 | 필요 |
| GET | `/api/subscriptions/{id}` | 구독 상세 조회 | 필요 |
| PUT | `/api/subscriptions/{id}` | 구독 수정 | 필요 |
| DELETE | `/api/subscriptions/{id}` | 구독 삭제 | 필요 |

## 문서

| 문서 | 설명 |
|------|------|
| [카카오 OAuth 스펙](docs/spec/spec_kakao-oauth-login.md) | 카카오 소셜 로그인 전환 기술 스펙 |
| [카카오 OAuth 실행 계획](docs/plans/plan_kakao-oauth-login.md) | 카카오 소셜 로그인 전환 단계별 작업 목록 |
