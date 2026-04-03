# Subtly

은근히 새는 구독, 한눈에 — 구독 서비스 관리 모바일 앱

## 프로젝트 개요

Subtly는 넷플릭스, 유튜브 프리미엄, ChatGPT 등 흩어진 구독 서비스를 한 곳에서 관리할 수 있는 앱입니다.
월별 지출 통계, 다가오는 결제 알림, 예산 관리, 월간 리포트 등을 제공합니다.

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
| expo-haptics | - | 햅틱 피드백 |
| react-native-gesture-handler | - | 스와이프 제스처 |
| AsyncStorage | - | 오프라인 캐시 |

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

### 핵심 기능
- **카카오 소셜 로그인** — 별도 회원가입 없이 카카오 계정으로 즉시 이용
- **온보딩** — 첫 로그인 시 3단계 앱 소개
- **구독 CRUD** — 구독 서비스 등록, 조회, 수정, 삭제 (스와이프 삭제 지원)
- **44개 프리셋** — 넷플릭스, 유튜브, ChatGPT 등 주요 서비스 원탭 등록
- **구독별 통화** — KRW/USD 지원 (해외 서비스 달러 가격 입력 가능)
- **구독 일시정지** — 1개월/3개월/기한 없이 선택, 재개 예정일 표시

### 통계·분석
- **월별 지출 통계** — 바 차트, 파이 차트로 지출 현황 시각화
- **지난달 비교** — 전월 대비 증감률 표시
- **비용 TOP 5** — 가장 비싼 구독 순위
- **월간 리포트** — 총 지출, 절약액, 최고가 구독, 약정 종료 임박 인사이트

### 관리·설정
- **예산 설정** — 월 구독 예산 한도 + 홈 화면 진행률 바
- **결제 수단 기록** — 어떤 카드로 결제하는지 기록
- **구독 시작일/종료일** — 약정 기간 관리 (네이티브 날짜 피커)
- **알림** — 결제일 사전 알림 (1~7일 전, 6~22시 시간 설정)
- **카테고리 필터·검색·정렬** — 이름순/금액순/결제일순
- **다크모드** — 시스템 테마 연동
- **CSV 내보내기** — 구독 데이터 공유
- **오프라인 캐시** — 서버 연결 없이도 마지막 데이터 표시
- **프리뷰 모드** — mock 데이터로 백엔드 없이 전체 화면 확인

### UI/UX
- 스켈레톤 로더 (펄스 애니메이션)
- 금액 카운트업 애니메이션
- 리스트 순차 페이드인
- 버튼 스케일 + 햅틱 피드백
- 스와이프 삭제
- 탭 바 결제 임박 배지
- 커스텀 토스트 메시지
- 폼 자동 포커스 + 다음 필드 이동
- 접근성 라벨

## 프로젝트 구조

```
subtly-project/
├── app/                    # Expo Router 페이지
│   ├── (tabs)/             # 탭 네비게이션 (홈, 구독, 통계, 설정)
│   ├── auth/               # 로그인 화면
│   ├── onboarding.tsx      # 온보딩 화면
│   ├── add.tsx             # 구독 추가
│   ├── detail.tsx          # 구독 상세
│   └── edit.tsx            # 구독 수정
├── components/             # 재사용 컴포넌트
│   ├── Skeleton.tsx        # 스켈레톤 로더
│   ├── PressableScale.tsx  # 스케일 + 햅틱 버튼
│   ├── SwipeableRow.tsx    # 스와이프 삭제
│   ├── AnimatedListItem.tsx # 리스트 페이드인
│   ├── CountUp.tsx         # 숫자 카운트업
│   ├── DateInput.tsx       # 네이티브 날짜 피커
│   ├── MonthlyReport.tsx   # 월간 리포트
│   └── ...                 # 차트, 폼, 카드 등
├── stores/                 # Zustand 상태 관리
├── services/               # API 클라이언트 + 오프라인 캐시
├── constants/              # 프리셋(44개), 색상, 설정
├── types/                  # TypeScript 타입 정의
├── hooks/                  # 알림, 테마 훅
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

`services/api.ts`와 `app/_layout.tsx`의 `PREVIEW_MODE`를 `true`로 변경하면 mock 데이터로 전체 화면을 확인할 수 있습니다.

## API 엔드포인트

### 인증

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/auth/kakao` | 카카오 로그인/가입 | 불필요 |
| POST | `/api/auth/refresh` | 토큰 갱신 | 불필요 |
| POST | `/api/auth/logout` | 로그아웃 | 필요 |
| DELETE | `/api/auth/account` | 계정 삭제 | 필요 |

### 구독

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| GET | `/api/subscriptions` | 구독 목록 조회 | 필요 |
| POST | `/api/subscriptions` | 구독 등록 | 필요 |
| PUT | `/api/subscriptions/{id}` | 구독 수정 | 필요 |
| DELETE | `/api/subscriptions/{id}` | 구독 삭제 | 필요 |
| GET | `/api/subscriptions/summary` | 요약 (월간 지출, 다가오는 결제) | 필요 |

## DB 마이그레이션

| 버전 | 파일 | 설명 |
|------|------|------|
| V1 | `V1__init_schema.sql` | 초기 스키마 (members, refresh_tokens, subscriptions) |
| V2 | `V2__add_subscription_fields.sql` | 일시정지, 시작일, 종료일, 결제수단 필드 추가 |
| V3 | `V3__add_currency_field.sql` | 구독별 통화(currency) 필드 추가 |

## 문서

| 문서 | 설명 |
|------|------|
| [카카오 OAuth 스펙](docs/spec/spec_kakao-oauth-login.md) | 카카오 소셜 로그인 전환 기술 스펙 |
| [카카오 OAuth 실행 계획](docs/plans/plan_kakao-oauth-login.md) | 카카오 소셜 로그인 전환 단계별 작업 목록 |
| [서비스 개선 스펙](docs/spec/spec_service-improvement.md) | 프리셋 고도화, 핵심 개선, 신규 기능 스펙 |
| [서비스 개선 실행 계획](docs/plans/plan_service-improvement.md) | 서비스 개선 단계별 작업 목록 |
