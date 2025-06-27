@echo off
echo 🚀 Eyebottle 개발서버 시작 중... (Hot Reloading 최적화)
echo.
echo 💡 WSL 환경에서 Hot Reloading 문제 해결:
echo   - 파일 변경 감지: 폴링 모드 (1초 간격)
echo   - 자동 브라우저 새로고침 활성화
echo   - 캐시 무효화 헤더 추가
echo.

wsl -d ubuntu bash -c "cd /mnt/c/Users/user/.cursor/eyebottle && WATCHPACK_POLLING=true CHOKIDAR_USEPOLLING=true npm run dev -- --turbo"

pause 