@echo off
setlocal

set "ROOT=%~dp0"
cd /d "%ROOT%"

echo Starting TechFix backend...
start "TechFix Backend" cmd /k "cd /d ""%ROOT%backend"" && npm install && npm run prisma:generate && npm run prisma:deploy && npm run seed && npm run dev"

echo Starting TechFix frontend...
start "TechFix Frontend" cmd /k "cd /d ""%ROOT%"" && npm install && npm run dev -- --host"

echo.
echo TechFix start commands launched.
echo Backend:  http://localhost:4000/api/health
echo Frontend: http://localhost:5173
echo.
echo You can close this window.

endlocal
