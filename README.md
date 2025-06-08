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
3. **📊 마이오가드 그래프** - 근시 진행도 차트 (업데이트 예정)
4. **📋 검진결과 작성** - DM,HTN,눈종검 회신서류 자동 생성
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

## 💻 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/Eyebottle/eyebottle-ai-ophthalmology.git
cd eyebottle-ai-ophthalmology

# 의존성 설치
npm install

# 개발 서버 실행
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
│   │   ├── globals.css     # 글로벌 스타일 + Tailwind CSS
│   │   ├── layout.tsx      # 루트 레이아웃
│   │   ├── page.tsx        # 메인 랜딩 페이지 (홈)
│   │   └── test/
│   │       └── page.tsx    # Shadcn/ui 테스트 페이지
├── components/
│   └── ui/                 # Shadcn/ui 컴포넌트들
│       ├── button.tsx      # 커스텀 Button (아이보틀 변형 포함)
│       └── card.tsx        # 커스텀 Card (글래스모피즘 포함)
├── lib/
│   └── utils.ts           # Tailwind + clsx 유틸리티
├── public/
│   └── eyebottle-logo.png # 커스텀 로고
├── components.json        # Shadcn/ui 설정
├── package.json          # 의존성 (Shadcn/ui 포함)
├── tailwind.config.js    # Tailwind CSS 설정
└── README.md
```

## 🎯 사용 대상

- **안과 의료진**: 반복적인 진료 업무 자동화
- **병원 관리자**: 효율적인 워크플로우 관리
- **의료 스타트업**: AI 기반 헬스케어 솔루션

## 📈 개발 현황 & 로드맵

### **✅ 완료된 기능**
- [x] **홈페이지 리뉴얼**: 글래스모피즘 디자인 적용
- [x] **Shadcn/ui 통합**: 모던 컴포넌트 라이브러리 도입
- [x] **반응형 디자인**: 모바일부터 데스크톱까지 최적화
- [x] **테스트 페이지**: 새로운 컴포넌트 시연 (/test)
- [x] **GitHub 연동**: 소스코드 관리 및 버전 관리

### **🚧 진행 중**
- [ ] 사용자 인증 시스템 구현
- [ ] 챗봇 Eye Bottle 기능 완성

### **📋 향후 계획**
- [ ] 마이오가드 그래프 데이터 시각화
- [ ] 실시간 진료 녹음 & STT 기능
- [ ] 보험청구 자동화 시스템
- [ ] 추가 Shadcn/ui 컴포넌트 도입 (Form, Dialog, Table)

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

**아이보틀 팀**
- 이메일: contact@eyebottle.com
- 웹사이트: [eyebottle.com](https://eyebottle.com)

---

**© 2025 아이보틀(Eyebottle). 안과 진료의 새로운 경험.**
