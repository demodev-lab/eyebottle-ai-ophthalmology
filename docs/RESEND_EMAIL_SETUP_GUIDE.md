# 📧 Resend 이메일 설정 가이드

이 문서는 아이보틀 웹사이트의 이메일 문의 기능을 활성화하는 방법을 안내합니다.

## 📋 목차
1. [Resend 계정 생성](#1-resend-계정-생성)
2. [API Key 발급](#2-api-key-발급)
3. [환경변수 설정](#3-환경변수-설정)
4. [도메인 인증 (선택사항)](#4-도메인-인증-선택사항)
5. [테스트 및 확인](#5-테스트-및-확인)
6. [Vercel 배포 설정](#6-vercel-배포-설정)

---

## 1. Resend 계정 생성

1. **Resend 웹사이트 접속**
   - https://resend.com 으로 이동
   
2. **Sign up 클릭**
   - 우측 상단의 "Sign up" 버튼 클릭
   
3. **계정 정보 입력**
   - 이메일 주소 입력
   - 비밀번호 설정
   - "Create account" 클릭

4. **이메일 인증**
   - 가입한 이메일로 인증 메일이 옴
   - "Verify email" 버튼 클릭

---

## 2. API Key 발급

1. **Dashboard 접속**
   - 로그인 후 자동으로 Dashboard로 이동
   
2. **API Keys 메뉴 클릭**
   - 왼쪽 사이드바에서 "API Keys" 클릭
   
3. **새 API Key 생성**
   - "Create API Key" 버튼 클릭
   - Key 이름 입력 (예: "Eyebottle Production")
   - "Create" 클릭

4. **API Key 복사**
   - 생성된 API Key가 화면에 표시됨
   - `re_` 로 시작하는 긴 문자열
   - **⚠️ 중요: 이 Key는 다시 볼 수 없으니 안전한 곳에 복사해두세요!**

---

## 3. 환경변수 설정

### 로컬 개발 환경 설정

1. **`.env.local.example` 파일 복사**
   ```bash
   cp .env.local.example .env.local
   ```

2. **`.env.local` 파일 편집**
   - 텍스트 에디터로 `.env.local` 파일 열기
   - `RESEND_API_KEY=` 뒤에 복사한 API Key 붙여넣기
   
   예시:
   ```
   RESEND_API_KEY=re_123456789abcdefghijklmnopqrstuvwxyz
   ```

3. **개발 서버 재시작**
   ```bash
   npm run dev
   ```

---

## 4. 도메인 인증 (선택사항)

기본적으로 `onboarding@resend.dev`에서 메일이 발송됩니다.
`noreply@eyebottle.kr`처럼 자체 도메인에서 발송하려면:

1. **Domains 메뉴 접속**
   - Dashboard에서 "Domains" 클릭
   
2. **도메인 추가**
   - "Add Domain" 클릭
   - `eyebottle.kr` 입력
   
3. **DNS 레코드 추가**
   - Resend가 제공하는 DNS 레코드를 도메인 관리 페이지에 추가
   - SPF, DKIM, DMARC 레코드 설정
   
4. **인증 확인**
   - DNS 전파 후 (보통 5-30분)
   - "Verify DNS Records" 클릭

---

## 5. 테스트 및 확인

1. **로컬에서 테스트**
   - http://localhost:3000 접속
   - Contact 섹션 또는 About 페이지에서 "이메일 문의" 클릭
   - 폼 작성 후 전송
   
2. **이메일 확인**
   - `lee@eyebottle.kr`로 메일이 도착했는지 확인
   - 발신자, 제목, 내용이 올바른지 확인

3. **Resend Dashboard 확인**
   - https://resend.com/emails 에서 발송 내역 확인 가능
   - 발송 상태, 오픈율 등 통계 제공

---

## 6. Vercel 배포 설정

### Vercel에 환경변수 추가

1. **Vercel Dashboard 접속**
   - https://vercel.com 로그인
   - `eyebottle-ai-ophthalmology` 프로젝트 선택
   
2. **Settings 탭 클릭**
   - 상단 메뉴에서 "Settings" 선택
   
3. **Environment Variables 선택**
   - 왼쪽 메뉴에서 "Environment Variables" 클릭
   
4. **환경변수 추가**
   - Key: `RESEND_API_KEY`
   - Value: 발급받은 API Key
   - Environment: Production, Preview, Development 모두 체크
   - "Save" 클릭

5. **재배포**
   - 환경변수 추가 후 자동으로 재배포됨
   - 또는 "Deployments" 탭에서 수동으로 "Redeploy" 클릭

---

## 🔍 문제 해결

### 메일이 전송되지 않을 때

1. **API Key 확인**
   - `.env.local` 파일에 API Key가 올바르게 입력되었는지 확인
   - Key 앞뒤에 공백이 없는지 확인

2. **서버 재시작**
   - 환경변수 변경 후 개발 서버를 재시작했는지 확인
   ```bash
   # Ctrl+C로 서버 중지 후
   npm run dev
   ```

3. **브라우저 콘솔 확인**
   - F12 → Console 탭에서 에러 메시지 확인
   
4. **네트워크 탭 확인**
   - F12 → Network 탭에서 `/api/send-email` 요청 상태 확인

### Vercel에서 작동하지 않을 때

1. **환경변수 설정 확인**
   - Vercel Dashboard에서 환경변수가 올바르게 설정되었는지 확인
   
2. **Function Logs 확인**
   - Vercel Dashboard → Functions 탭
   - `send-email` 함수의 로그 확인

---

## 📞 추가 지원

문제가 지속되면:
- Resend 문서: https://resend.com/docs
- Resend 지원: support@resend.com
- 아이보틀 개발팀: lee@eyebottle.kr