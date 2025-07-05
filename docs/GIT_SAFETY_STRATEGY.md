# 🛡️ Git 안전 전략 가이드

이 문서는 Supabase 통합 작업이나 기타 위험한 변경 작업 시 프로젝트를 안전하게 보호하고 복구하는 방법을 설명합니다.

## 📅 작성일: 2025년 7월 4일

## 🎯 목적
- 프로젝트가 망가질 위험이 있는 작업 시 안전장치 마련
- 문제 발생 시 빠른 복구 방법 제공
- 현재 안정 버전: `v1.4.1-stable` (d899996)

## 1. 🏷️ 현재 안정 버전 태그

```bash
# 태그 생성 (2025년 7월 4일 완료)
git tag -a v1.4.1-stable -m "Stable version before Supabase integration"
git push origin v1.4.1-stable
```

## 2. 🌿 Feature Branch 전략

### 새로운 위험한 작업 시작할 때:
```bash
# 1. main 브랜치가 최신인지 확인
git checkout main
git pull origin main

# 2. feature 브랜치 생성
git checkout -b feature/supabase-integration

# 3. 백업 브랜치도 생성 (선택사항)
git branch backup/main-before-supabase
```

## 3. 🔄 복구 방법

### 🚨 경우 1: 작은 문제 발생 (특정 파일만 복구)
```bash
# 특정 파일만 이전 상태로 복구
git checkout d899996 -- src/specific-file.ts
```

### 🚨 경우 2: 중간 문제 발생 (최근 커밋 취소)
```bash
# 마지막 커밋 취소 (작업 내용은 유지)
git reset --soft HEAD~1

# 마지막 커밋 완전 취소 (작업 내용도 삭제)
git reset --hard HEAD~1
```

### 🚨 경우 3: 심각한 문제 발생 (전체 복구)
```bash
# Option A: 안정 버전으로 강제 리셋
git checkout main
git reset --hard v1.4.1-stable

# Option B: feature 브랜치 삭제하고 다시 시작
git checkout main
git branch -D feature/supabase-integration
git checkout -b feature/supabase-integration-v2
```

### 🚨 경우 4: 완전 초기화 필요
```bash
# 깨끗한 상태로 다시 클론
cd ..
mv eyebottle eyebottle-backup
git clone https://github.com/Eyebottle/eyebottle-ai-ophthalmology.git eyebottle
cd eyebottle
npm install
```

## 4. 📦 중요 파일 백업

### 백업해야 할 파일들:
- `.env.local` - 환경 변수
- `package.json` & `package-lock.json` - 의존성
- `next.config.ts` - Next.js 설정
- `tsconfig.json` - TypeScript 설정

### 백업 방법:
```bash
# 백업 디렉토리 생성
mkdir -p ../eyebottle-backup-files
cp .env.local ../eyebottle-backup-files/
cp package*.json ../eyebottle-backup-files/
cp next.config.ts ../eyebottle-backup-files/
cp tsconfig.json ../eyebottle-backup-files/
```

## 5. 🔍 상태 확인 명령어

```bash
# 현재 브랜치 확인
git branch

# 커밋 히스토리 확인
git log --oneline -10

# 변경사항 확인
git status
git diff

# 태그 목록 확인
git tag -l

# 원격 저장소 상태 확인
git remote -v
```

## 6. 💡 작업 팁

1. **자주 커밋하기**: 작은 단위로 자주 커밋
2. **의미 있는 커밋 메시지**: 나중에 찾기 쉽도록
3. **테스트 후 커밋**: 작동 확인 후 커밋
4. **원격 푸시**: 중요한 작업은 원격에도 백업

## 7. 🆘 비상 연락처

문제 발생 시:
1. 이 문서의 복구 방법 시도
2. `git reflog` 명령으로 이전 상태 확인
3. GitHub의 커밋 히스토리 확인

## 8. 📝 작업 기록

- 2025년 7월 4일: 초기 문서 작성, v1.4.1-stable 태그 생성
- Supabase 통합 작업 시작 예정

---

**⚠️ 중요**: 이 문서는 프로젝트의 안전을 위한 것입니다. 위험한 작업 전에 반드시 이 가이드를 참고하세요.