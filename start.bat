@echo off
cd /d "%~dp0"
title Mahoney Design ^& Build - Local Website

echo ============================================
echo   Mahoney Design ^& Build - Local Website
echo ============================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js is not installed on this computer.
  echo.
  echo   1. Go to https://nodejs.org
  echo   2. Download the LTS version (v20 or newer)
  echo   3. Install it, then double-click this file again
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies (first run only - takes a few minutes)...
  call npm install
  if %errorlevel% neq 0 (
    echo Install failed - check your internet connection and try again.
    pause
    exit /b 1
  )
)

if not exist dist (
  echo Building the website...
  call npm run build
  if %errorlevel% neq 0 (
    echo Build failed.
    pause
    exit /b 1
  )
)

echo Preparing the database...
call npx tsx db/seed.ts

echo.
echo ============================================
echo   Website:   http://localhost:3000
echo   Admin:     http://localhost:3000/#/admin/login
echo   Password:  mahoney1985
echo.
echo   Close this window to stop the site.
echo ============================================
echo.

set NODE_ENV=production
node dist/boot.js
pause
