@echo off
title Luxe Luthiers Configurator Launcher
echo ==========================================================
echo           LUXE LUTHIERS BESPOKE CONFIGURATOR
echo ==========================================================
echo.

echo [1/3] Verifying and installing local dependencies...
call npm install

echo [2/3] Preparing browser at http://localhost:5173 ...
start "" "http://localhost:5173"

echo [3/3] Starting Vite development server...
call npm run dev

pause
