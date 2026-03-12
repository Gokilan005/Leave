@echo off
setlocal

set "FRONTEND_DIR=%~dp0frontend"

echo.
echo ==============================================
echo Smart Leave System - Frontend Diagnostic
echo ==============================================
echo.
echo Directory: %FRONTEND_DIR%
echo.

if not exist "%FRONTEND_DIR%\node_modules" (
    echo [ERROR] node_modules NO FOUND in frontend folder.
    echo Running npm install...
    cd /d "%FRONTEND_DIR%"
    npm install
)

echo.
echo Checking for other processes on port 8081...
netstat -ano | findstr :8081
if %errorlevel% equ 0 (
    echo [WARNING] Port 8081 is already in use. 
    echo Trying to kill it...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8081') do taskkill /f /pid %%a
) else (
    echo Port 8081 is free.
)

echo.
echo Starting Frontend on 8081...
cd /d "%FRONTEND_DIR%"
npx vite --port 8081 --strictPort --host 0.0.0.0

pause
