@echo off
echo Eyebottle 개발 서버를 PowerShell 7에서 실행합니다...
"C:\Program Files\PowerShell\7\pwsh.exe" -Command "cd '%~dp0' && npm run dev"
pause 