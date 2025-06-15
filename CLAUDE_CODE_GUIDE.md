# 🤖 Claude Code 사용 가이드

이 문서는 아이보틀 프로젝트에서 Claude Code를 안전하고 효율적으로 사용하기 위한 가이드입니다.

---

## 📋 **프로젝트 개요 (Claude Code가 알아야 할 정보)**

### **🏗️ 기술 스택**
- **Frontend**: Next.js 15.3.3 + React 19 + TypeScript 5
- **스타일링**: Tailwind CSS 4 + Shadcn/ui
- **패키지 매니저**: **npm** (⚠️ pnpm 사용 금지)
- **개발 서버**: Turbopack (Next.js 15 내장)
- **아이콘**: Heroicons + Lucide React

### **📁 프로젝트 구조**
```
eyebottle/
├── src/app/                 # Next.js App Router
│   ├── page.tsx            # 메인 랜딩 페이지
│   ├── about/page.tsx      # About Me 페이지 (모바일 최적화 완료)
│   └── globals.css         # 글로벌 스타일
├── public/                 # 정적 파일
├── package.json            # npm 의존성 (439개 패키지)
├── package-lock.json       # npm 락 파일 (중요!)
└── dev.bat                 # 개발 서버 실행 스크립트
```

### **🎯 현재 완성된 기능**
- ✅ 메인 랜딩 페이지 (8개 기능 카드)
- ✅ About Me 페이지 (모바일 최적화 완료)
- ✅ 반응형 디자인 (모바일~데스크톱)
- ✅ Notion API 연동 (베타테스터 신청)

---

## ⚠️ **중요한 제약사항 및 주의사항**

### **🚫 절대 금지사항**

#### **1. pnpm 사용 금지**
```bash
# ❌ 절대 사용하지 마세요
pnpm install
pnpm add [package]

# ✅ 반드시 npm 사용
npm install
npm install [package]
```
**이유**: 2025년 6월 16일 pnpm 사용 시 Next.js SWC 모듈 누락 및 Turbopack 크래시 발생

#### **2. 위험한 명령어 주의**
```bash
# ⚠️ 매우 신중하게 사용
rm -rf node_modules
Remove-Item -Recurse -Force node_modules

# ✅ 안전한 대안
npm ci  # package-lock.json 기반 클린 설치
```

#### **3. 복잡한 패키지 동시 설치 금지**
```bash
# ❌ 한 번에 여러 복잡한 패키지 설치 금지
npm install jspdf html2canvas @types/jspdf react-pdf

# ✅ 하나씩 단계별 설치
npm install jspdf
# 테스트 후 문제없으면
npm install html2canvas
```

### **📦 패키지 설치 안전 수칙**

#### **1. 설치 전 체크리스트**
- [ ] 현재 개발 서버가 정상 작동하는가?
- [ ] package-lock.json이 존재하는가?
- [ ] Git 상태를 확인했는가? (`git status`)
- [ ] 작업 중인 중요한 내용을 stash로 보관했는가?
- [ ] 깨끗한 상태에서 시작하는가?

#### **2. 안전한 패키지 설치 절차**
```bash
# 1단계: 현재 상태 확인 및 정리
git status  # 현재 변경사항 확인
git stash   # 작업 중인 내용이 있다면 임시 저장

# 2단계: 깨끗한 상태에서 시작
git checkout .  # 추적된 파일의 변경사항 되돌리기
git clean -fd   # 추적되지 않은 파일 정리

# 3단계: 개발 서버 정상 작동 확인
npm run dev

# 4단계: 패키지 하나씩 설치
npm install [package-name]

# 5단계: 즉시 테스트
npm run dev

# 6단계: 문제 발생 시 즉시 롤백
git checkout .
npm ci
git stash pop  # 임시 저장한 작업 복원 (필요시)
```

#### **3. 위험도별 패키지 분류**

**🟢 안전 (Core Dependencies)**
- React, Next.js 관련 패키지
- Tailwind CSS, Heroicons
- TypeScript 관련

**🟡 주의 (UI Libraries)**
- Shadcn/ui 컴포넌트
- 새로운 아이콘 라이브러리
- CSS 관련 라이브러리

**🔴 위험 (Complex Dependencies)**
- PDF 생성 라이브러리 (jsPDF, react-pdf)
- Canvas 조작 (html2canvas)
- 파일 처리 라이브러리
- 네이티브 모듈이 필요한 패키지

---

## 🛠️ **개발 환경 설정**

### **Windows + WSL 환경**
```bash
# WSL Ubuntu에서 Claude Code 실행
cd /mnt/c/Users/user/.cursor/eyebottle
claude code

# Windows PowerShell에서 개발 서버
cd C:\Users\user\.cursor\eyebottle
npm run dev
# 또는
.\dev.bat
```

### **개발 서버 포트**
- 기본: `http://localhost:3000`
- 충돌 시: `http://localhost:3001` (자동 변경)

---

## 🚨 **실패 사례 및 교훈**

### **2025년 6월 16일 - 검진결과 PDF 기능 개발 실패**

#### **발생한 문제**
1. **목표**: DM(당뇨), HTN(고혈압), 눈종검 PDF 생성 기능
2. **시도한 패키지**: `jsPDF`, `html2canvas`
3. **결과**: Next.js 완전 파괴, 개발 서버 실행 불가

#### **오류 증상**
```
Error: Cannot find module '../swc'
Module not found: Can't resolve 'next/dist/compiled/react'
Turbopack crashed
```

#### **복구 과정**
```bash
# 1. Git으로 변경사항 되돌리기
git checkout .
git clean -fd

# 2. node_modules 완전 삭제
Remove-Item -Recurse -Force node_modules
Remove-Item -Force pnpm-lock.yaml

# 3. npm으로 재설치
npm install  # 439개 패키지 정상 설치

# 4. 개발 서버 정상 작동 확인
npm run dev  # ✅ 성공
```

#### **교훈**
- **복잡한 패키지는 별도 브랜치에서 테스트**
- **pnpm과 npm 혼용 절대 금지**
- **패키지 설치 전 반드시 백업 커밋**
- **한 번에 여러 패키지 설치 금지**

---

## ✅ **Claude Code 작업 시 체크리스트**

### **작업 시작 전**
- [ ] 현재 Git 상태 확인 (`git status`)
- [ ] 개발 서버 정상 작동 확인
- [ ] 작업 중인 내용 안전하게 보관 (`git stash`)
- [ ] 패키지 매니저 npm 확인
- [ ] 깨끗한 작업 환경 확보

### **패키지 설치 시**
- [ ] 위험도 분류 확인 (🟢🟡🔴)
- [ ] 하나씩 단계별 설치
- [ ] 각 단계마다 테스트
- [ ] 문제 발생 시 즉시 롤백

### **작업 완료 후**
- [ ] 개발 서버 정상 작동 확인
- [ ] 모바일 반응형 테스트
- [ ] Git 커밋 및 푸시
- [ ] 문서 업데이트

---

## 🎯 **권장 개발 워크플로우**

### **새 기능 개발 시**
```bash
# 1. 현재 작업 저장
git stash  # 작업 중인 내용 임시 저장

# 2. 새 브랜치 생성 (복잡한 기능의 경우)
git checkout -b feature/new-feature

# 3. UI 먼저 개발 (패키지 설치 없이)
# 4. 기본 기능 구현
# 5. 테스트 후 패키지 필요 시 단계별 추가
# 6. 완성 후 main 브랜치에 병합
git checkout main
git merge feature/new-feature
git branch -d feature/new-feature
```

### **안전한 실험 환경**

#### **방법 1: 별도 테스트 디렉토리**
```bash
# 완전히 분리된 환경에서 테스트
mkdir ../test-packages
cd ../test-packages
npm init -y
npm install jspdf html2canvas  # 위험한 패키지들 테스트
# 문제없으면 메인 프로젝트에 적용
```

#### **방법 2: Git 브랜치 활용**
```bash
# 실험용 브랜치 생성
git checkout -b experiment/pdf-feature
npm install jspdf
# 테스트 후 문제 발생 시
git checkout main
git branch -D experiment/pdf-feature  # 브랜치 완전 삭제
```

#### **방법 3: Docker 컨테이너 (고급)**
```bash
# 완전히 격리된 환경에서 테스트
docker run -it --rm -v $(pwd):/app node:18 bash
cd /app && npm install jspdf
```

---

## 📞 **문제 발생 시 대응**

### **즉시 롤백이 필요한 상황**
- 개발 서버 실행 불가
- 빌드 오류 발생
- TypeScript 오류 대량 발생
- 모듈을 찾을 수 없다는 오류

### **롤백 명령어**
```bash
# Git으로 되돌리기
git checkout .
git clean -fd

# 패키지 재설치
Remove-Item -Recurse -Force node_modules
npm ci

# 개발 서버 재시작
npm run dev
```

---

**⚡ 핵심 원칙: "격리된 환경에서 테스트, 단계별 접근, 즉시 롤백"**

**🛡️ 안전 수칙:**
- 무분별한 `git add .` 금지
- 의미 없는 백업 커밋 금지  
- `git stash` 활용으로 작업 보호
- 실험은 별도 환경에서

이 가이드를 따라 Claude Code와 안전하게 협업하세요! 🤝 