# 서비스 품질 개선 스펙

> 작성일: 2026-04-03
> 완료일: 2026-04-03
> 상태: Completed

## 1. 개요

Subtly 앱의 서비스 품질을 대폭 개선한다. 프리셋 고도화, 핵심 UX 개선, 신규 기능 추가, UI/UX 폴리시, 오프라인 지원, 리텐션 장치를 포함한다.

## 2. 요구사항

### 2.1 프리셋 고도화

- [x] 12개 → 44개 프리셋 확장 (요금제 변형, 국내/해외 서비스)
- [x] 프리셋 검색 + 카테고리 필터 UI
- [x] 프리셋 선택 시 가격 표시
- [x] 프리셋의 color/icon이 폼에 전달되도록 수정

### 2.2 핵심 개선 (A 항목)

- [x] A-1: 알림 생존성 — 앱 시작/설정 변경 시 전체 알림 자동 재스케줄링
- [x] A-2: 에러 복구 UI — 홈/구독 목록에 재시도 버튼 추가
- [x] A-3: 입력 검증 — 금액 양수, 결제일 1~31 범위, 에러 메시지 표시
- [x] A-4: 구독 일시정지 — 1개월/3개월/기한 없이 선택, pausedUntil 필드, 재개 예정일 표시
- [x] A-5: 알림 시간대 — 6~22시 알림 수신 시간 설정
- [x] A-6: 접근성 — 탭/구독 카드에 accessibilityLabel 추가

### 2.3 신규 기능 (B 항목)

- [x] B-1: 월 예산 설정 + 홈 화면 진행률 바
- [x] B-2: 구독 시작일/종료일 (약정 관리)
- [x] B-3: 결제 수단 기록
- [x] B-4: CSV 데이터 내보내기
- [x] B-5: 지난달 비교 통계 (금액/증감률)
- [x] B-6: 비용 TOP 5 순위

### 2.4 출시 전 필수 개선

- [x] 온보딩 화면 (3단계 앱 소개)
- [x] 네이티브 날짜 피커
- [x] 가짜 다중 통화 제거 → 구독별 통화(KRW/USD) 지원
- [x] 구독 목록 정렬 (이름순/금액순/결제일순)
- [x] 개인정보처리방침/이용약관 링크
- [x] React import 위치 수정

### 2.5 UI/UX 폴리시

- [x] 스켈레톤 로더 (펄스 애니메이션)
- [x] 스와이프 삭제 (react-native-gesture-handler)
- [x] 햅틱 피드백 (expo-haptics)
- [x] 리스트 순차 페이드인
- [x] 폼 자동 포커스 + 다음 필드 이동
- [x] 빈 상태 개선 (타이틀+설명+CTA)
- [x] 버튼 스케일 효과 (PressableScale)
- [x] 탭 바 결제 임박 배지
- [x] 커스텀 토스트 (앱 테마)
- [x] 금액 카운트업 애니메이션
- [x] 금액 천단위 포맷 + 원/달러 접미사
- [x] 결제일 칩 그리드
- [x] 결제 주기 강조 (라벨+설명)

### 2.6 안정성·리텐션

- [x] 오프라인 캐시 (AsyncStorage, 오프라인 배너)
- [x] 월간 리포트 (총 지출, 절약액, 최고가, 약정 종료 인사이트)
- [x] 버튼 로딩 상태 + 더블 탭 방지

### 2.7 백엔드 동기화

- [x] Subscription 엔티티: pausedUntil, startDate, endDate, paymentMethod, currency 추가
- [x] DTO 동기화 (Create/Update/Response)
- [x] Flyway V2, V3 마이그레이션
- [x] 서비스 테스트 3건 추가 (생성, 일시정지, 재개)

## 3. 데이터 모델 변경사항

### Subscription (최종)

```typescript
interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  billingDate: number;        // 1-31
  category: string;
  color: string;
  icon: string;
  memo?: string;
  isActive: boolean;
  pausedUntil?: string;       // 일시정지 해제 예정일
  startDate?: string;         // 구독 시작일
  endDate?: string;           // 약정 종료일
  paymentMethod?: string;     // 결제 수단
  currency: 'KRW' | 'USD';   // 구독별 통화
  createdAt: string;
  updatedAt: string;
}
```

## 4. 신규 컴포넌트

| 컴포넌트 | 용도 |
|----------|------|
| Skeleton.tsx | 스켈레톤 로더 (SkeletonBox, SkeletonCard, SkeletonList) |
| PressableScale.tsx | 스케일 애니메이션 + 햅틱 버튼 |
| SwipeableRow.tsx | 스와이프 삭제 |
| AnimatedListItem.tsx | 순차 페이드인 |
| CountUp.tsx | 숫자 카운트업 |
| DateInput.tsx | 네이티브 날짜 피커 (iOS/Android) |
| MonthlyReport.tsx | 월간 인사이트 리포트 |

## 5. 신규 Store

| Store | 용도 |
|-------|------|
| useBudgetStore.ts | 월 예산 설정/로드 |

## 6. 추가 패키지

| 패키지 | 용도 |
|--------|------|
| expo-haptics | 햅틱 피드백 |
| react-native-gesture-handler | 스와이프 제스처 |
| react-native-reanimated | 애니메이션 (설치됨, 플러그인 미사용) |
| @react-native-community/datetimepicker | 네이티브 날짜 피커 |
| @react-native-async-storage/async-storage | 오프라인 캐시 |
