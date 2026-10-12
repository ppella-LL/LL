@echo off
REM ============================================================
REM  LuggageLess - one-click local test launcher (Windows)
REM  Double-click this file to start the app and open it in the browser.
REM  It uses the mock backend automatically if no Supabase .env is set,
REM  so you can test with zero configuration.
REM ============================================================

cd /d "%~dp0"
title LuggageLess - Test Server

echo.
echo ==========================================
echo   Starting LuggageLess (local test mode)
echo ==========================================
echo.

REM Install dependencies the first time (if node_modules is missing).
if not exist "node_modules" (
  echo First run: installing dependencies, please wait...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed. Make sure Node.js is installed: https://nodejs.org
    pause
    exit /b 1
  )
)

REM Open the browser shortly after the server starts.
start "" cmd /c "timeout /t 4 >nul & start http://localhost:5173/"

echo.
echo The app will open at http://localhost:5173/
echo Keep this window open while testing. Close it or press Ctrl+C to stop.
echo.

call npm run dev

echo.
echo Server stopped. You can close this window.
pause
