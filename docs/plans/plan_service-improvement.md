# 서비스 품질 개선 실행 계획

> 스펙 문서: docs/spec/spec_service-improvement.md
> 작성일: 2026-04-03
> 완료일: 2026-04-03
> 상태: Completed

## 1. 작업 개요

Subtly 앱의 서비스 품질을 전면 개선한다. 프리셋 고도화부터 UI/UX 폴리시, 오프라인 지원, 백엔드 동기화까지 총 12단계로 진행한다.

## 2. 단계별 작업 목록

### Step 1: 프리셋 고도화 + 이모지 제거

- [x] `constants/presets.ts`: 12개 → 44개 프리셋 (요금제 변형, 국내/해외 서비스)
- [x] `components/PresetPicker.tsx`: 검색 + 카테고리 필터 + 가격 표시
- [x] `app/add.tsx`: preset의 color/icon 폼 전달
- [x] 전체 이모지 → 이니셜 아이콘으로 교체

**커밋**: `feat: 서비스 품질 대폭 개선 — 프리셋 고도화, 핵심 개선 6건, 신규 기능 6건`

---

### Step 2: 핵심 개선 A-1~A-6

- [x] 알림 생존성, 에러 복구 UI, 입력 검증, 구독 일시정지, 알림 시간대, 접근성
- [x] 예산 설정, 시작/종료일, 결제 수단, CSV 내보내기, 지난달 비교, TOP 5

**(Step 1 커밋에 포함)**

---

### Step 3: 출시 전 필수 개선

- [x] `app/onboarding.tsx`: 3단계 온보딩 화면
- [x] `components/DateInput.tsx`: 네이티브 날짜 피커
- [x] 가짜 다중 통화 제거, KRW 고정
- [x] 구독 목록 정렬 (이름/금액/결제일)
- [x] 개인정보처리방침/이용약관 링크
- [x] React import 위치 수정

**커밋**: `fix: 출시 전 필수 개선 6건`

---

### Step 4: 백엔드 동기화

- [x] Subscription 엔티티에 pausedUntil, startDate, endDate, paymentMethod 추가
- [x] DTO, Service 동기화
- [x] Flyway V2 마이그레이션
- [x] 프론트 clearPausedUntil 플래그

**커밋**: `feat: 백엔드 동기화 — 프론트 신규 필드 4건 백엔드 반영`

---

### Step 5: 네이티브 날짜 피커

- [x] @react-native-community/datetimepicker 설치
- [x] DateInput 컴포넌트를 네이티브 피커로 교체

**커밋**: `feat: 네이티브 날짜 피커로 교체`

---

### Step 6: 버튼 로딩 상태

- [x] SubscriptionForm: isSubmitting + ActivityIndicator
- [x] detail.tsx: 삭제/일시정지/재개 로딩 + disabled

**커밋**: `fix: 버튼 로딩 상태 추가`

---

### Step 7: 버그 수정

- [x] edit.tsx: 신규 필드 initialValues 누락 수정
- [x] stats.tsx: 파이차트에 active 구독만 전달
- [x] SubscriptionServiceTest: 신규 필드 테스트 3건 추가

**커밋**: `fix: 버그 3건 수정`

---

### Step 8: UI/UX 품질 대폭 개선

- [x] Skeleton, PressableScale, SwipeableRow, AnimatedListItem, CountUp 컴포넌트
- [x] 구독 목록: 스켈레톤/스와이프/페이드인/PressableScale
- [x] MonthlyChart: 카운트업 애니메이션
- [x] 탭 바: 결제 임박 배지
- [x] 커스텀 토스트
- [x] 폼: 자동 포커스 + 다음 필드 이동

**커밋**: `feat: UI/UX 품질 대폭 개선 — 애니메이션, 햅틱, 스켈레톤, 스와이프 등 10건`

---

### Step 9: 오프라인 캐시 + 월간 리포트

- [x] `services/cache.ts`: AsyncStorage 캐시 유틸
- [x] `useSubscriptionStore`: API 실패 시 캐시 폴백, isOffline 상태
- [x] `components/MonthlyReport.tsx`: 월간 인사이트 카드
- [x] 홈 화면: 오프라인 배너 + 월간 리포트

**커밋**: `feat: 오프라인 캐시 + 월간 리포트`

---

### Step 10: 폼 UI 개선

- [x] 금액: 천단위 콤마 포맷 + "원" 접미사
- [x] 결제일: 자주 쓰는 날짜 칩 + 직접 입력
- [x] 결제 주기: 라벨+설명 2줄, 선택 시 강조

**커밋**: `fix: 구독 폼 UI 개선`

---

### Step 11: 구독별 통화 지원

- [x] Subscription 타입에 currency 필드 (KRW | USD)
- [x] 폼: KRW/USD 토글 + 통화별 기호 표시
- [x] 프리셋: ChatGPT $20, Claude $20 등 USD 실제 가격
- [x] 백엔드: Entity, DTO, Service, Flyway V3 동기화

**커밋**: `feat: 구독별 통화 지원 — KRW/USD 선택`

---

### Step 12: 문서 업데이트 + Push

- [x] README.md 전면 업데이트
- [x] 서비스 개선 스펙/계획 문서 작성
- [x] Git push

**커밋**: `docs: README, 스펙, 계획 문서 업데이트`

## 3. 커밋 히스토리

| 순서 | 커밋 메시지 |
|------|-----------|
| 1 | `docs: README.md 추가 및 스펙·계획 문서 구조 정리` |
| 2 | `feat: 서비스 품질 대폭 개선 — 프리셋 고도화, 핵심 개선 6건, 신규 기능 6건` |
| 3 | `fix: 출시 전 필수 개선 6건 — 온보딩, 날짜 피커, 통화 정리, 정렬, 법적 링크, 코드 수정` |
| 4 | `feat: 백엔드 동기화 — 프론트 신규 필드 4건 백엔드 반영` |
| 5 | `feat: 네이티브 날짜 피커로 교체` |
| 6 | `fix: 버튼 로딩 상태 추가 — 더블 탭 방지 및 시각적 피드백` |
| 7 | `fix: 버그 3건 수정 — edit 필드 누락, 파이차트 비활성 포함, 테스트 미반영` |
| 8 | `feat: UI/UX 품질 대폭 개선 — 애니메이션, 햅틱, 스켈레톤, 스와이프 등 10건` |
| 9 | `feat: 오프라인 캐시 + 월간 리포트 — 리텐션·안정성 핵심 2건` |
| 10 | `fix: 구독 폼 UI 개선 — 금액 천단위 포맷, 결제일 칩, 결제 주기 강조` |
| 11 | `feat: 구독별 통화 지원 — KRW/USD 선택, 프론트·백엔드 동기화` |
| 12 | `chore: PREVIEW_MODE 원복 (false)` |
| 13 | `docs: README, 스펙, 계획 문서 업데이트` |
