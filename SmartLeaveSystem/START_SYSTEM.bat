@echo off
setlocal enabledelayedexpansion

:: ======================================================
:: Smart Leave System - Master Repair & Startup
:: ======================================================

set "BASE_DIR=%~dp0"
set "BACKEND_DIR=%BASE_DIR%backend"
set "FRONTEND_DIR=%BASE_DIR%frontend"

echo.
echo [1/5] Checking Environment...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    pause
    exit /b
)
echo Node.js is ready.

echo.
echo [2/5] Cleaning background processes...
echo Killing any old Node/NPM processes on 5002/3004...
taskkill /f /im node.exe /t 2>nul
taskkill /f /im npm.exe /t 2>nul

echo.
echo [3/5] Verifying Dependencies...
if not exist "%BACKEND_DIR%\node_modules" (
    echo node_modules missing in BACKEND. Installing...
    cd /d "%BACKEND_DIR%"
    npm install
) else (
    echo Backend dependencies look okay.
)

if not exist "%FRONTEND_DIR%\node_modules" (
    echo node_modules missing in FRONTEND. Installing...
    cd /d "%FRONTEND_DIR%"
    npm install
) else (
    echo Frontend dependencies look okay.
)

echo.
echo [4/5] Starting Backend (Port 5002)...
start "SmartLeave-Backend" cmd /c "cd /d "%BACKEND_DIR%" && echo Starting Backend... && node server.js || pause"

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak > nul

echo.
echo [5/5] Starting Frontend (Port 3004)...
start "SmartLeave-Frontend" cmd /c "cd /d "%FRONTEND_DIR%" && echo Starting Frontend... && npx vite --port 8081 --strictPort --host 0.0.0.0 || pause"

echo.
echo ======================================================
echo REPAIR COMPLETE. THE TWO NEW WINDOWS MUST STAY OPEN.
echo 1. Backend: http://localhost:5002
echo 2. Frontend: http://localhost:8081
echo.
echo [IMPORTANT] If you cannot reach the site:
echo - Check if your Firewall is blocking Node.js
echo - Ensure MongoDB is running (if using local)
echo ======================================================
pause
