# CHANGELOG

## [2025-01-28] - SEO 최적화 및 개발 환경 개선

### ✨ Added
- **완전한 메타데이터 시스템**: Next.js 15 기반 SEO 최적화
  - title 템플릿: "아이보틀(Eyebottle) - 안과 진료를 혁신하는 AI 웹사이트"
  - 상세한 description: 네컷안과툰, 진단서 작성, 근시진행트래커 등 14개 핵심 기능 소개
  - keywords 배열: 안과, AI, 의료, 진단서, 근시 등 14개 키워드
  - Open Graph 최적화: 소셜 미디어 공유 시 완벽한 카드 표시
  - Twitter 카드 설정: 트위터/X 플랫폼 최적화
  - JSON-LD 구조화 데이터: 검색엔진 의료 AI 소프트웨어 인식
- **PWA 지원**: manifest.json으로 모바일 앱처럼 설치 가능
- **SEO 기본 파일들**: robots.txt, sitemap.xml 생성
- **커스텀 아이콘**: eyebottle-logo.png를 파비콘으로 설정
  - src/app/icon.png, apple-icon.png 생성
  - 기존 favicon.ico 제거

### 🔧 Fixed  
- **Windows PowerShell && 연산자 에러**: PowerShell 7 설치로 완전 해결
  - 기존 PowerShell 5.1의 && 연산자 미지원 문제
  - winget으로 PowerShell 7.5.1 설치 완료
  - 개발 서버 백그라운드 실행 안정화

### 🚀 Enhanced
- **개발 워크플로우 최적화**: 
  - `pnpm dev` 백그라운드 실행 표준화
  - PowerShell 7 기반 안정적인 서버 실행
  - 포트 충돌 시 자동으로 다음 포트(3001, 3002 등) 사용
  - dev-pnpm.bat, dev.bat 배치 파일 생성

### 📁 File Changes
- `src/app/layout.tsx`: 완전한 메타데이터 시스템 구현
- `src/app/icon.png`, `src/app/apple-icon.png`: 커스텀 아이콘 추가
- `public/manifest.json`: PWA 매니페스트 생성
- `public/robots.txt`: 검색엔진 크롤링 규칙
- `public/sitemap.xml`: 사이트맵 생성
- `dev-pnpm.bat`, `dev.bat`: 개발 서버 실행 배치 파일

### 🎯 Benefits
- **검색엔진 최적화**: 구글, 네이버 등 검색 결과 향상
- **소셜 미디어**: 링크 공유 시 완벽한 미리보기 카드
- **모바일 앱**: PWA로 홈 화면에 설치 가능  
- **개발 효율성**: 에러 없는 안정적인 서버 실행
- **브랜딩**: 커스텀 로고로 일관된 브랜드 이미지

## [2024-01-XX] - Vercel 배포 최적화

### 🔧 Fixed
- **라우팅 충돌 해결**: `src/app/test/` 폴더를 `src/app/_test/`로 변경
  - Next.js App Router에서 발생하던 빌드 오류 해결
  - 테스트 페이지가 프로덕션 라우팅에서 제외됨

### ✨ Benefits
- **배포 안정성 향상**: Vercel 자동 배포 시 빌드 오류 제거
- **개발 효율성**: 테스트 컴포넌트는 유지하면서 프로덕션에서는 제외
- **SEO 최적화**: 불필요한 테스트 페이지가 검색엔진에 노출되지 않음
- **보안 강화**: 내부 테스트 페이지가 외부 접근으로부터 보호됨

### 📁 File Changes
- `src/app/test/` → `src/app/_test/`
- Shadcn/ui 테스트 컴포넌트는 개발 환경에서 계속 접근 가능

### 🚀 Deployment
- GitHub 푸시 시 Vercel 자동 배포 활성화
- Next.js 15.3.3 + TypeScript + Tailwind CSS 스택 유지

---

// ... existing code ... 