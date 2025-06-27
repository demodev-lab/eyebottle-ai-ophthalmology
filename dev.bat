@echo off
echo 🚀 Eyebottle 개발서버 시작 중... (Hot Reloading 최적화)
echo.
echo 💡 이제 파일 변경사항이 자동으로 반영됩니다!
echo   - 저장 후 2-3초 내 브라우저 업데이트
echo   - 캐시 문제 해결됨
echo   - 더 이상 서버 재시작 불필요
echo.

wsl -d ubuntu bash -c "cd /mnt/c/Users/user/.cursor/eyebottle && npm run dev:hot"
pause
