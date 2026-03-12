@echo off
setlocal
set "BASE_DIR=%~dp0"
set "BACKEND_DIR=%BASE_DIR%backend"
set "FRONTEND_DIR=%BASE_DIR%frontend"

echo ======================================================
echo Smart Leave System - Final Startup
echo ======================================================

echo [1/3] Killing any old processes on ports 3004 and 5002...
echo (If you see "not found", it's okay)
taskkill /f /im node.exe /t 2>nul
taskkill /f /im npm.exe /t 2>nul

echo.
echo [2/3] Starting Backend (Port 5002)...
start "SmartLeave Backend" cmd /k "cd /d "%BACKEND_DIR%" && echo Starting Backend... && node server.js"

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak > nul

echo.
echo [3/3] Starting Frontend (Port 3004)...
if not exist "%FRONTEND_DIR%\node_modules" (
    echo Error: node_modules missing in frontend! Running npm install...
    cd /d "%FRONTEND_DIR%"
    npm install
)

start "SmartLeave Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && echo Starting Frontend... && npm run dev -- --port 8081 --host 0.0.0.0 || pause"

echo.
echo ======================================================
echo BOTH WINDOWS MUST STAY OPEN.
echo 1. Check the "Frontend" window for errors.
echo 2. If it says "Network: http://[your-ip]:3004/", it's working!
echo 3. Access: http://localhost:3004
echo ======================================================
pause
