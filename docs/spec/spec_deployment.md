# 배포 스펙

> 작성일: 2026-04-03
> 상태: In Progress

## 1. 개요

Subtly 앱의 백엔드 서버 배포, 법적 페이지 호스팅, 카카오 OAuth 연동, Android 앱 빌드 및 Play Store 출시를 진행한다.

## 2. 인프라 구성

### 2.1 백엔드 (Railway)
- 플랫폼: Railway (무료 티어, 월 $5 크레딧)
- URL: https://subtly-production.up.railway.app
- Root Directory: backend
- Dockerfile: 멀티 스테이지 빌드 (JDK 21 → JRE 21, -Xmx256m)
- 포트: 8080

### 2.2 데이터베이스 (Railway MySQL)
- 호스트: mysql.railway.internal:3306
- DB명: railway
- Flyway 마이그레이션 V1~V4 자동 적용

### 2.3 법적 페이지 (GitHub Pages)
- Source: main 브랜치, /docs 폴더
- 개인정보처리방침: /legal/privacy.html
- 이용약관: /legal/terms.html
- OAuth 콜백: /auth/callback.html

## 3. 카카오 OAuth 연동

### 3.1 설정
- 앱 이름: Subtly
- REST API 키: .env 참조
- Client Secret: .env 참조 (활성화 상태: 사용함)
- 플랫폼: iOS (com.subtly.app), Android (com.subtly.app)
- 동의항목: 닉네임(필수), 프로필사진(선택)

### 3.2 리디렉트 흐름
카카오 개발자 콘솔이 커스텀 스킴(subtly://)을 거부하여 HTTPS 우회 방식 사용:

```
[앱] → 카카오 로그인 페이지 (WebBrowser)
  → 카카오 인증 완료
  → https://min-seon-gyu.github.io/subtly/auth/callback.html?code=xxx
  → callback.html이 subtly://auth?code=xxx 로 리디렉트
  → [앱] WebBrowser가 subtly:// 스킴 감지 → 인가코드 추출
  → POST /api/auth/kakao { code, redirectUri }
  → 백엔드가 카카오 토큰 교환 → JWT 발급
```

### 3.3 Redirect URI
- 로그인: https://min-seon-gyu.github.io/subtly/auth/callback.html
- WebBrowser 콜백 수신: subtly://auth

## 4. 앱 빌드 (EAS Build)

### 4.1 설정
- Expo 계정: seongyumin
- Project ID: 38059196-2887-4a86-aefc-28abcc962915
- eas.json: preview (APK), production (AAB)

### 4.2 빌드 프로필

| 프로필 | 출력 형식 | 용도 |
|--------|----------|------|
| preview | APK | 테스트 배포 (직접 설치) |
| production | AAB (App Bundle) | Play Store 제출 |

### 4.3 빌드 명령어
```bash
# 테스트 APK
EXPO_TOKEN=xxx eas build -p android --profile preview --non-interactive

# Play Store 제출용 AAB
EXPO_TOKEN=xxx eas build -p android --profile production --non-interactive
```

## 5. Play Store 출시

### 5.1 사전 요구사항
- [x] Google Play Console 계정 생성 ($25)
- [ ] 본인인증 완료 (대기 중)
- [ ] 앱 정보 등록 (스크린샷, 설명문, 카테고리)
- [ ] production AAB 빌드
- [ ] Play Store 제출 + 심사

### 5.2 앱 정보 (예정)
- 앱 이름: Subtly - 구독 관리
- 카테고리: 금융 > 예산 관리
- 타겟 연령: 만 14세 이상

## 6. iOS 출시 (미진행)
- Apple Developer Program 가입 필요 (연 $99)
- EAS Build iOS 프로필 설정
- App Store Connect 등록
