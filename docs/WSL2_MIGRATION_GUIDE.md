# 🐧 WSL2 마이그레이션 가이드

이 문서는 Eyebottle 프로젝트를 Windows 파일 시스템에서 WSL2로 마이그레이션한 과정과 새로운 개발 환경 사용법을 설명합니다.

## 📅 마이그레이션 일자
**2025년 7월 2일**

## 🎯 마이그레이션 이유

### 기존 Windows 환경의 문제점
1. **pnpm 호환성 문제**: Windows PowerShell에서 pnpm 실행 시 "'next' is not an internal or external command" 오류
2. **File Watching 성능 이슈**: Windows 파일 시스템에서 느린 파일 변경 감지
3. **Hot Reload 불안정**: 코드 변경 시 자동 새로고침이 제대로 작동하지 않음
4. **Cross-platform 호환성**: Windows 경로와 Unix 경로 간 충돌

### WSL2의 장점
- Native Linux 파일 시스템 성능
- 더 나은 Node.js 호환성
- 빠른 파일 변경 감지
- Docker 및 기타 개발 도구와의 원활한 통합

## 🔧 새로운 개발 환경

### 시스템 정보
- **OS**: Ubuntu 24.04.2 LTS (WSL2)
- **Node.js**: v22.17.0 (nvm으로 관리)
- **npm**: v10.8.1
- **프로젝트 위치**: `~/projects/eyebottle`

### 프로젝트 구조
```
~/projects/eyebottle/
├── src/                    # 소스 코드
├── public/                 # 정적 파일
├── node_modules/           # npm 패키지 (512개)
├── package.json            # npm 설정
├── package-lock.json       # npm 락 파일
├── .env.local             # 환경 변수
├── dev.sh                 # 개발 서버 실행 스크립트
└── .gitattributes         # 줄 끝 문자 정규화
```

## 🚀 개발 서버 실행

### 방법 1: dev.sh 스크립트 사용 (권장)
```bash
cd ~/projects/eyebottle
./dev.sh
```

### 방법 2: 직접 실행
```bash
cd ~/projects/eyebottle
export WATCHPACK_POLLING=true
export CHOKIDAR_USEPOLLING=true
npm run dev
```

### 접속 주소
- 기본: http://localhost:3000
- 포트 충돌 시: http://localhost:3001

Windows 브라우저에서 직접 접속 가능합니다.

## 💻 VS Code 설정

### Remote-WSL 확장 설치
1. VS Code에서 Extensions 탭 열기
2. "Remote - WSL" 검색 및 설치
3. WSL에서 프로젝트 열기:
   ```bash
   cd ~/projects/eyebottle
   code .
   ```

### 통합 터미널 사용
- VS Code 내장 터미널이 자동으로 WSL bash로 연결됨
- PowerShell 대신 WSL 터미널 사용

## 📝 주요 변경사항

### 1. Line Ending 정규화
`.gitattributes` 파일 추가:
```
* text=auto eol=lf
*.js text eol=lf
*.jsx text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.json text eol=lf
*.md text eol=lf
*.css text eol=lf
*.html text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

# Windows 배치 파일은 CRLF 유지
*.bat text eol=crlf
*.cmd text eol=crlf
```

### 2. 개발 스크립트
`dev.sh` 파일 생성:
```bash
#!/bin/bash
echo "🚀 Starting Eyebottle development server with hot reload optimization..."
export WATCHPACK_POLLING=true
export CHOKIDAR_USEPOLLING=true
npm run dev
```

### 3. Git 브랜치
현재 브랜치: `restore-july1-9pm` (commit: 0cc23dd)

## ⚠️ 주의사항

### 파일 경로
- Windows 경로 사용 금지: `C:\Users\user\.cursor\eyebottle`
- WSL2 경로 사용: `~/projects/eyebottle`

### 패키지 관리
- **npm만 사용**: pnpm 사용 금지
- `package-lock.json` 파일 유지 필수

### 성능 최적화
- WATCHPACK_POLLING 환경변수 설정 필수
- 대용량 node_modules는 WSL2 파일 시스템에 위치

## 🔄 일일 워크플로우

### 1. 프로젝트 시작
```bash
# WSL2 터미널 열기
cd ~/projects/eyebottle
git pull origin restore-july1-9pm
./dev.sh
```

### 2. 코드 작업
- VS Code Remote-WSL로 편집
- 브라우저에서 실시간 확인
- Hot reload 자동 적용

### 3. 작업 종료
```bash
# Ctrl+C로 개발 서버 중지
git add .
git commit -m "작업 내용"
git push origin restore-july1-9pm
```

## 🆘 트러블슈팅

### 개발 서버가 시작되지 않을 때
```bash
# node_modules 재설치
rm -rf node_modules
npm ci
```

### Hot reload가 작동하지 않을 때
```bash
# 환경변수 확인
echo $WATCHPACK_POLLING
echo $CHOKIDAR_USEPOLLING

# dev.sh 스크립트 사용
./dev.sh
```

### 포트 충돌 시
- 자동으로 3001번 포트로 변경됨
- 수동 지정: `npm run dev -- -p 3002`

## 📚 참고 자료
- [WSL2 공식 문서](https://docs.microsoft.com/en-us/windows/wsl/)
- [Next.js WSL 가이드](https://nextjs.org/docs/advanced-features/using-wsl)
- [VS Code Remote Development](https://code.visualstudio.com/docs/remote/wsl)

---

**마이그레이션 완료! 🎉** 이제 WSL2에서 더 빠르고 안정적인 개발 환경을 사용할 수 있습니다.