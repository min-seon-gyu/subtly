# 배포 실행 계획

> 스펙 문서: docs/spec/spec_deployment.md
> 작성일: 2026-04-03
> 상태: In Progress

## 1. 작업 개요

Subtly 앱을 실제 사용 가능한 상태로 배포한다. 백엔드 서버, 카카오 연동, Android 빌드, Play Store 출시까지 진행한다.

## 2. 단계별 작업 목록

### Step 1: 카카오 개발자 앱 설정

- [x] 카카오 개발자 사이트에서 앱 생성 (Subtly)
- [x] REST API 키 + Client Secret 발급
- [x] 카카오 로그인 활성화
- [x] Redirect URI 등록 (HTTPS 콜백 페이지)
- [x] 동의항목 설정 (닉네임 필수, 프로필 선택)
- [x] 플랫폼 등록 (iOS/Android: com.subtly.app)

---

### Step 2: GitHub Pages 법적 페이지

- [x] 개인정보처리방침 작성 (개인정보보호법 제30조 준수)
- [x] 이용약관 작성
- [x] OAuth 콜백 리디렉트 페이지 작성
- [x] GitHub Pages 활성화 (main, /docs)

---

### Step 3: 백엔드 배포 (Railway)

- [x] Dockerfile 작성 (멀티 스테이지, JDK 21)
- [x] Railway 프로젝트 생성 + GitHub 연결
- [x] MySQL 플러그인 추가
- [x] 환경변수 설정 (DB JDBC URL 직접 입력)
- [x] Root Directory를 backend로 설정
- [x] Networking 포트 8080 설정
- [x] 서버 기동 확인 (Started SubtlyApplicationKt)

---

### Step 4: 프론트엔드 연결

- [x] .env의 API_BASE_URL을 Railway URL로 변경
- [x] 카카오 로그인 → 백엔드 → JWT 발급 흐름 확인
- [x] SecureStore null 방어 코드 추가
- [x] WebBrowser 콜백 스킴 수정 (subtly://auth)

---

### Step 5: EAS Build 설정

- [x] EAS CLI 설치
- [x] Expo 계정 로그인 (토큰 방식)
- [x] Expo 프로젝트 생성 + Project ID 연결
- [x] eas.json 생성 (preview/production 프로필)
- [x] slug 대소문자 수정
- [x] react-native-reanimated 제거 (빌드 충돌)

---

### Step 6: Android APK 빌드

- [x] preview 프로필로 APK 빌드 성공
- [x] Expo 대시보드에서 다운로드 가능

---

### Step 7: Play Store 제출 (대기 중)

- [x] Google Play Console 계정 생성
- [ ] 본인인증 완료
- [ ] production AAB 빌드
- [ ] 앱 정보 등록 (스크린샷, 설명문)
- [ ] 심사 제출

---

### Step 8: iOS 출시 (미진행)

- [ ] Apple Developer Program 가입 ($99)
- [ ] EAS Build iOS 설정
- [ ] App Store Connect 등록
- [ ] 심사 제출

## 3. 커밋 히스토리 (배포 관련)

| 커밋 | 내용 |
|------|------|
| `feat: 카카오 OAuth HTTPS 리디렉트 페이지 추가` | callback.html, REDIRECT_URI 변경 |
| `docs: 개인정보처리방침·이용약관 전면 보완` | 법적 필수 요건 충족 |
| `chore: Railway 배포용 Dockerfile 추가` | 멀티 스테이지 빌드 |
| `chore: API_BASE_URL을 Railway 프로덕션 서버로 변경` | 프론트-백엔드 연결 |
| `fix: 카카오 로그인 디버깅 코드 제거 + null 안전 처리` | SecureStore 에러 수정 |
| `fix: react-native-reanimated 제거 + EAS Build 설정` | 빌드 충돌 해결 |
