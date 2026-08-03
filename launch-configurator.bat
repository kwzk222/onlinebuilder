@echo off
title Luxe Luthiers Configurator Launcher
echo ==========================================================
echo           LUXE LUTHIERS BESPOKE CONFIGURATOR
echo     Rick Owens Brutalism x Lando Norris Precision
echo ==========================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your system.
    echo Please install Node.js (v18+) to run this configurator.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Check if pnpm is installed, fallback to npm if not
where pnpm >nul 2>nul
if %errorlevel% equ 0 (
    set PKG_MANAGER=pnpm
) else (
    set PKG_MANAGER=npm
)

echo [INFO] Detected package manager: %PKG_MANAGER%

REM Check if node_modules exists, install dependencies if missing
if not exist node_modules (
    echo [INFO] node_modules not found. Installing dependencies...
    call %PKG_MANAGER% install
    if %errorlevel% neq 0 (
        echo [ERROR] Dependency installation failed.
        pause
        exit /b 1
    )
)

echo [INFO] Starting the local production-ready development server...
echo [INFO] Automatically opening browser to http://localhost:5173/ ...
echo.

REM Spawn browser launch after a brief delay to let Vite spin up
start "" "http://localhost:5173"

REM Start Vite server
call %PKG_MANAGER% run dev

pause
