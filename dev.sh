#\!/bin/bash
echo "🚀 Eyebottle 개발서버 시작 중..."
echo ""
echo "💡 파일 변경사항이 자동으로 반영됩니다\!"
echo "   - 저장 후 2-3초 내 브라우저 업데이트"
echo "   - 캐시 문제 해결됨"
echo "   - 더 이상 서버 재시작 불필요"
echo ""

# Hot reload optimization for WSL
export WATCHPACK_POLLING=true
export CHOKIDAR_USEPOLLING=true

npm run dev
SCRIPT_EOF < /dev/null
