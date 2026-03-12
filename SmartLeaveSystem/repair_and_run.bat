@echo off
setlocal enabledelayedexpansion

set "BASE_DIR=%~dp0"
set "BACKEND_DIR=%BASE_DIR%backend"
set "FRONTEND_DIR=%BASE_DIR%frontend"

echo ======================================================
echo Smart Leave System - Repair & Startup Script
echo ======================================================
echo.

echo [1/4] Checking Node.js and NPM...
node -v || (echo Node.js not found! Please install it. && pause && exit /b)
npm -v || (echo NPM not found! Please install it. && pause && exit /b)
echo Node.js and NPM are present.
echo.

echo [2/4] Verifying Backend dependencies...
if not exist "%BACKEND_DIR%\node_modules" (
    echo node_modules missing in backend. Running npm install...
    cd /d "%BACKEND_DIR%"
    npm install
) else (
    echo Backend node_modules exist.
)
echo.

echo [3/4] Verifying Frontend dependencies...
if not exist "%FRONTEND_DIR%\node_modules" (
    echo node_modules missing in frontend. Running npm install...
    cd /d "%FRONTEND_DIR%"
    npm install
) else (
    echo Frontend node_modules exist.
)
echo.

echo [4/4] Starting Servers in separate windows...
echo Opening Backend in a new window (Port 5002)...
start "SmartLeave Backend" cmd /k "cd /d "%BACKEND_DIR%" && echo Starting Backend... && node server.js"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Opening Frontend in a new window (Port 3004)...
start "SmartLeave Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && echo Starting Frontend... && npm run dev"

echo.
echo ======================================================
echo BOTH WINDOWS SHOULD REMAIN OPEN.
echo If any window closes, check for error messages.
echo Once running, access: http://localhost:3004
echo ======================================================
pause
