# 🏥 아이보틀 (Eyebottle) - AI 안과 진료 워크플로우 자동화

**AI 기반 안과 진료 도구로 반복 작업을 3배 빠르게!**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)](https://tailwindcss.com)
[![Shadcn/ui](https://img.shields.io/badge/Shadcn/ui-Latest-000000)](https://ui.shadcn.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717)](https://github.com/Eyebottle/eyebottle-ai-ophthalmology)

## ✨ 주요 기능

### 🎯 핵심 AI 도구 8가지

1. **🎬 네컷 안과툰** - 만화 업로드 & PDF 다운로드, NotebookLM 팟캐스트 연동
2. **🤖 아이보틀 챗봇** - 수술확인서·진단서 자동 작성 (업데이트 예정)
3. **📊 근시케어 차트** - MyoCare Chart (업데이트 예정)
4. **📋 검진결과 작성** - DM,HTN,눈종검 회신서류 실시간 작성 ✅
5. **🎙️ 진료녹음 메모** - STT 전사 & 클라우드 저장
6. **📖 환자 안내자료** - 수술 전후 안내자료 PDF 제공
7. **📝 문진 도우미** - 증상별 검사 플로차트/챗봇
8. **❤️ 진료 도우미** - 보험코드, 주사 트래커, 청구 자동화

### 🔧 하단 관리 도구

- **✨ 업데이트 노트** - Notion 연동 기능 업데이트 기록
- **👤 About Me** - 의사 경력 및 철학 소개
- **📧 Contact** - 이메일, SNS, Threads 연결

## 🚀 기술 스택

### **Frontend Framework**
- **Next.js 15**: App Router, 최신 React 19 지원
- **TypeScript 5**: 타입 안전성과 개발 생산성

### **UI/Design System**
- **Tailwind CSS 4**: 유틸리티 퍼스트 CSS 프레임워크
- **Shadcn/ui**: 모던 컴포넌트 라이브러리 (접근성 최적화)
- **Heroicons**: React 아이콘 라이브러리
- **글래스모피즘**: 최신 디자인 트렌드 적용

### **Development Tools**
- **ESLint**: 코드 품질 관리
- **Turbopack**: 빠른 개발 서버 (Next.js 15)
- **Git**: 버전 관리 및 협업

### **Deployment**
- **Vercel Ready**: 원클릭 배포 지원
- **GitHub Integration**: 자동 CI/CD

### **Backend & API**
- **Next.js API Routes**: RESTful API 엔드포인트
- **Resend**: 이메일 전송 서비스 📧

## 💻 로컬 개발 환경 설정

1.  **저장소 클론**
    ```bash
    git clone https://github.com/Eyebottle/eyebottle-ai-ophthalmology.git
    cd eyebottle-ai-ophthalmology
    ```

2.  **의존성 설치**
    ```bash
    npm install
    ```

3.  **환경변수 설정**
    ```bash
    cp .env.local.example .env.local
    ```
    `.env.local` 파일을 열어 필요한 API 키를 설정하세요:
    - `RESEND_API_KEY`: 이메일 기능을 위한 Resend API 키
    
    자세한 설정 방법은 `docs/RESEND_EMAIL_SETUP_GUIDE.md`를 참조하세요.

4.  **개발 서버 실행**
    ```bash
    npm run dev
    ```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📱 화면 구성

### 메인 랜딩 페이지
- **3열 균형 레이아웃**: 메인 콘텐츠 / 공지사항 / 로그인 폼
- **8개 기능 카드**: 핵심 AI 도구들을 직관적으로 소개
- **글래스모피즘 디자인**: 현대적이고 전문적인 UI/UX
- **완전 반응형**: 모바일부터 데스크톱까지 최적화

### 디자인 특징
- ✨ 최신 디자인 트렌드 적용 (그라데이션, 백드롭 블러)
- 🎨 의료진 맞춤 색상 팔레트 (Slate & Blue)
- 🔄 부드러운 호버 애니메이션
- 📱 완벽한 반응형 레이아웃

## 🏗️ 프로젝트 구조

```
eyebottle/
├── src/
│   ├── app/
│   │   ├── globals.css       # 글로벌 스타일 + Tailwind CSS
│   │   ├── layout.tsx        # 루트 레이아웃
│   │   ├── page.tsx          # 메인 랜딩 페이지 (홈)
│   │   ├── about/
│   │   │   └── page.tsx      # About Me 페이지 (이메일 문의 기능 포함) 📧
│   │   ├── api/
│   │   │   └── send-email/
│   │   │       └── route.ts  # 이메일 전송 API Route 📧
│   │   ├── exam-results/
│   │   │   └── page.tsx      # 검진결과 작성 시스템 ✅
│   │   ├── myocare/
│   │   │   ├── dashboard/    # 근시케어 대시보드
│   │   │   ├── patients/     # 환자 관리
│   │   │   └── settings/     # 설정
│   │   └── _test/
│   │       └── page.tsx      # Shadcn/ui 테스트 페이지
│   ├── components/
│   │   ├── common/           # 공통 컴포넌트 ✨
│   │   │   ├── demo-video-button.tsx   # YouTube 스타일 데모영상 버튼
│   │   │   └── quick-nav-menu.tsx      # 퀵 네비게이션 메뉴
│   │   ├── myocare/          # 근시케어 전용 컴포넌트
│   │   │   ├── charts/       # 차트 컴포넌트들
│   │   │   ├── common/       # 공통 컴포넌트 (헤더 등)
│   │   │   ├── dashboard/    # 대시보드 컴포넌트
│   │   │   ├── patients/     # 환자 관리 컴포넌트
│   │   │   └── settings/     # 설정 컴포넌트
│   │   └── ui/               # Shadcn/ui 컴포넌트들
│   ├── contexts/             # React Context
│   ├── lib/
│   │   ├── utils.ts          # Tailwind + clsx 유틸리티
│   │   ├── calculations.ts   # 계산 로직
│   │   └── storage.ts        # 로컬스토리지 관리
│   └── types/
│       ├── chart.ts          # 차트 관련 타입
│       └── database.ts       # 데이터베이스 타입
├── public/
│   ├── eyebottle-logo.png          # 커스텀 로고
│   ├── lee-eyeclinic-logo.png      # 병원 로고
│   ├── diabeticretinopathy_exam_report.html  # 당뇨망막병증 템플릿
│   ├── htn_retinopathy_report.html           # 고혈압망막병증 템플릿
│   └── comprehensive_exam_report.html        # 눈종합검진 템플릿
├── .env.local              # 환경변수 파일 (Git 무시)
├── .env.local.example      # 환경변수 예제 파일 📧
├── components.json         # Shadcn/ui 설정
├── package.json            # 의존성 (Shadcn/ui 포함)
├── docs/
│   ├── prd/                # 제품 요구사항 문서
│   ├── dev-eyebottle-md/   # 개발 관련 문서
│   ├── DEMO_VIDEO_BUTTON_GUIDE.md  # 데모영상 버튼 & 퀵 네비게이션 가이드 ✨
│   └── RESEND_EMAIL_SETUP_GUIDE.md # 이메일 기능 설정 가이드 📧
├── CLAUDE_CODE_GUIDE.md    # Claude Code 사용 가이드
├── DEVELOPMENT_LOG.md      # 개발 이력 및 변경사항
├── PROJECT_HISTORY.md      # 프로젝트 전체 히스토리
└── README.md
```

## 🎯 사용 대상

- **안과 의료진**: 반복적인 진료 업무 자동화
- **병원 관리자**: 효율적인 워크플로우 관리
- **의료 스타트업**: AI 기반 헬스케어 솔루션

## 📈 개발 현황 & 로드맵

### **✅ 완료된 기능**
- [x] **MyoCare 차트 안정성 개선** (2024.06.29): 🔧
  - [x] 차트 렌더링 에러 및 숫자 입력 필드 사용성 개선
  - [x] EMR 템플릿 초기화 오류 해결
- [x] **홈페이지 리뉴얼**: 글래스모피즘 디자인 적용
- [x] **반응형 디자인**: 모바일부터 데스크톱까지 최적화
- [x] **About Me 페이지**: 전문의 소개 페이지 완성
- [x] **이메일 기능 완전 구현** (2025.01.02): 📧
  - [x] Resend 서비스 통합 및 API 키 설정 완료
  - [x] Vercel 환경변수 설정 및 배포 환경 구축
  - [x] 이메일 발송 시스템 정상 작동 확인
- [x] **검진결과 작성 시스템**: 3가지 검진(DM/HTN/종합) 실시간 작성 ✅
  - [x] 좌우 분할 UI (입력 폼 40% + 실시간 미리보기 60%)
  - [x] 당뇨망막병증 자동 멘트 시스템 (5단계 기반)
  - [x] 브라우저 네이티브 인쇄 기능
  - [x] A4 최적화 레이아웃
  - [x] **검진결과 인쇄 최적화**: 웹 UI가 함께 인쇄되는 문제 해결
  - [x] **병원 로고 통합** (2025.01.02): `lee_eye_symbol.png`로 브랜딩 통일 🏥
  - [x] **눈종합검진 인쇄 중복 문제 해결** (2025.01.02): 2페이지 정확 출력 🔧
- [x] **눈종합검진 대규모 개선** (2025.01.02): 🔄
  - [x] 위험도 시스템 개편 (정상/경미한/중등도/심각한)
  - [x] 자동연동 시스템 구현 (위험도별 멘트 자동입력)
  - [x] 기본검사 선택지 UI 추가 (직접입력 옵션 포함)
  - [x] 정밀검사 항목 변경 (안구초음파 추가)
  - [x] 종합소견 위치 변경 (요약 바로 아래)
- [x] **MyoCare 근시케어 차트 시스템 MVP** (2024.06.28): 📊
  - [x] 대시보드: 환자 통계, 위험도 분포, 치료방법 차트
  - [x] 환자 관리: CRUD, 검색, 필터링, 진행상태 추적
  - [x] 진행 그래프: S.E./안축장 차트, 치료구간 시각화, 위험도 표시
  - [x] 검사 기록: 양안 데이터 입력, 진행속도 자동 계산
  - [x] 설정 관리: 임계값 설정, 치료색상 커스터마이징, EMR 템플릿
  - [x] **EMR 복사 기능**: 설정 기반 템플릿으로 최신 검사데이터 복사
  - [x] **안경처방 변수 추가**: EMR 템플릿에 당일 안경처방 여부 포함
  - [x] **UI/UX 개선**: 버튼 디자인 향상, 툴팁 추가, 반응형 최적화
- [x] **홈페이지 내비게이션 오류 해결**:
  - `div`로 잘못 만들어져 있던 기능 카드를 `Next.js <Link>` 컴포넌트로 수정
  - Playwright 테스트를 통해 라이브 환경에서의 링크 이동 검증 완료
- [x] **카드 UI 디자인 개선**:
  - 기능 카드들의 깨진 레이아웃 복구 및 디자인 통일성 확보
  - '검진결과 작성' 카드에 `NEW!` 배지를 추가하여 시각적 강조
- [x] **UI 개선 및 코드 정리** (2025.06.23):
  - 베타테스터 신청 기능 완전 제거
  - 하단 메뉴 구성 단순화 (4개 → 3개)
  - UI 균형성을 위한 카드 높이 균일화
- [x] **데모영상 버튼 통일성 구축** (2025.12.30): ✨
  - [x] YouTube 스타일 빨간색 버튼으로 모든 페이지 통일
  - [x] 공통 컴포넌트(`DemoVideoButton`) 생성 및 표준화
  - [x] 영상 리스트 모달 구현 (검진결과, 근시케어, AI챗봇)
  - [x] 썸네일 16:9 비율 최적화 (480×270)
- [x] **퀵 네비게이션 메뉴 시스템** (2025.12.30): 🧭
  - [x] 모든 페이지에 햄버거 메뉴 통합 적용
  - [x] 10개 주요 기능으로 원클릭 접근
  - [x] 현재 페이지 하이라이트 및 Beta 배지 시스템
  - [x] React Portal 기반 z-index 충돌 해결
  - [x] ESC 키 지원 및 완벽한 이벤트 차단
- [x] **Contact 메일 팝업 기능** (2025.12.30):
  - [x] About 페이지와 동일한 메일 작성 팝업을 랜딩 페이지에 적용
  - [x] 메일 폼 상태 관리 및 전송 시뮬레이션
  - [x] 팝업 크기 최적화로 가독성 개선
- [x] **검진결과 인쇄 스타일 대규모 개선** (2025.01.03): 🖨️
  - [x] 인쇄 전용 CSS 완전 재설계 (pt 단위 사용)
  - [x] 제목 가시성 문제 해결 (모든 검진 타입)
  - [x] 한 페이지 인쇄 최적화 (여백, 간격, 폰트 크기 조정)
  - [x] 당뇨망막병증 소견 제거 (단계별 비전형적)
  - [x] 증식 당뇨망막병증도 한 페이지에 수납
  - [x] 고혈압망막병증 제목 잘림 현상 해결
- [x] **안과만화 기능 완성** (2025.07.04): 🎨
  - [x] 4컷/8컷 안과 건강 정보 만화 갤러리
  - [x] PDF 내보내기 및 인쇄 기능
  - [x] 댓글 시스템 (관리자 삭제 가능)
  - [x] 태그 기반 분류 (백내장, 녹내장, 망막질환 등)
  - [x] 드래그 앤 드롭 이미지 정렬
- [x] **환자 안내자료 기능 완성** (2025.07.04): 📖
  - [x] 공개 목록 페이지: 카테고리별 필터링, 검색, 정렬
  - [x] 상세 보기 페이지: PDF 다운로드, YouTube 동영상 임베드
  - [x] 관리자 페이지: CRUD 작업, 파일 업로드, 통계 대시보드
  - [x] 6가지 카테고리 분류 시스템
  - [x] LocalStorage 기반 데이터 저장

### **🚧 진행 중**
- [ ] **고혈압망막병증 자동 멘트**: 1~4기 단계별 시스템
- [ ] **눈종합검진 위험도별 멘트**: Low/Moderate/High Risk 자동화
- [ ] **Supabase 데이터베이스 연동**: LocalStorage → Cloud 마이그레이션

### **📋 예정 기능**
- [ ] **사용자 인증 시스템**: Supabase Auth 통합
- [ ] **데이터 백업/복원**: 클라우드 동기화
- [ ] **Excel 내보내기**: 환자 데이터 및 통계 다운로드
- [ ] **인쇄 기능 개선**: 그래프 선/배경색 렌더링 문제 해결
- [ ] **챗봇 Eye Bottle**: AI 기반 진료 어시스턴트

### **🎯 6개월 목표 ( ~ 2025년 12월)**

1.  **핵심 기능 3-4개 MVP 완성:**
    -   [ ] **🤖 아이보틀 챗봇:** 수술확인서·진단서 자동 작성 기능 구현
    -   [x] **📋 검진결과 작성:** DM, HTN, 눈종검 회신 서류 자동 생성 기능 구현 ✅
    -   [x] **📖 환자 안내자료:** 주요 수술/질환 안내자료 PDF 제공 기능 구현 ✅
    -   [ ] **✨ 기능 우선순위:** 가장 반복적인 업무부터 자동화하여 즉각적인 효율성 증대

2.  **병원 내 파일럿 테스트 및 검증 (3개월):**
    -   [ ] 완성된 기능을 실제 병원 워크플로우에 적용하여 3개월간 테스트
    -   [ ] 간호사, 원무과 직원 대상 피드백 수집 및 UX/UI 개선
    -   [ ] 업무 시간 단축 효과 정량적 데이터 측정 및 분석

3.  **베타 테스트 확장 및 커뮤니티 피드백 확보:**
    -   [ ] 검증된 도구를 동네 안과 의원 3-5곳에 무료 제공
    -   [ ] 외부 사용자 피드백을 통해 기능 안정성 및 확장성 모색
    -   [ ] '안과 진료 AI 도구 가이드' 초안 작성 및 공유

4.  **지속 가능한 개발 역량 확보:**
    -   [ ] 신규 기능 독립적 구현 및 기존 코드 유지보수 능력 강화
    -   [ ] 기술 블로그 또는 개발 로그를 통해 학습 과정 기록 및 회고

## 🚀 배포 프로세스

### 자동 배포 설정
- **GitHub**: `Eyebottle/eyebottle-ai-ophthalmology` (포크 저장소)
- **Vercel**: main 브랜치 푸시 시 자동 배포
- **도메인**: https://eyebottle.kr

### 배포 방법
```bash
# 1. 변경사항 커밋
git add .
git commit -m "feat: 새 기능 추가"

# 2. main 브랜치에 푸시
git push origin main

# 3. 자동 배포 (2-3분 소요)
# Vercel이 자동으로 감지하여 eyebottle.kr에 배포
```

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📚 개발 문서

- **[Claude 사용 가이드](.claude/CLAUDE.md)** - AI 협업 시 주의사항 및 안전 수칙
- **[개발 로그](DEVELOPMENT_LOG.md)** - 주요 변경사항 및 개발 이력
- **[프로젝트 히스토리](PROJECT_HISTORY.md)** - 전체 프로젝트 이벤트 시간순 기록
- **[PRD 문서](docs/prd/)** - 제품 요구사항 문서
- **[데모영상 버튼 가이드](docs/DEMO_VIDEO_BUTTON_GUIDE.md)** - 데모영상 버튼 & 퀵 네비게이션 가이드 ✨
- **[UI 컴포넌트 가이드](docs/UI_COMPONENTS_GUIDE.md)** - 전체 UI 컴포넌트 종합 가이드 ✨
- **[업데이트 관리 가이드](docs/UPDATE_MANAGEMENT_GUIDE.md)** - 업데이트 노트 관리 방법 📋

## 📞 연락처

**아이보틀 팀**
- 이메일: lee@eyebottle.kr
- 웹사이트: [eyebottle.kr](https://eyebottle.kr)

---

**© 2025 아이보틀(Eyebottle). 안과 진료의 새로운 경험.**