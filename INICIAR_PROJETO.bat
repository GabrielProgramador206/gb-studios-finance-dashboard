@echo off
cd /d "%~dp0"
title Enterprise Finance Dashboard

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado.
  echo Instale o Node.js e tente novamente.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando dependencias...
  call npm install
  if errorlevel 1 (
    echo Erro ao instalar as dependencias.
    pause
    exit /b 1
  )
)

echo Iniciando projeto...
call npm run dev
pause
