@echo off
chcp 65001 > nul
title Anhanguera EAD - Agendamento Coordenadora Jacke
color 06

echo ======================================================
echo    ANHANGUERA EAD - COORDENADORA JACKE
echo    SISTEMA DE AGENDAMENTO PRESENCIAL (18:00 AS 20:00)
echo ======================================================
echo.

cd /d "%~dp0"

echo [1/2] Verificando dependencias...
if not exist "node_modules\" (
    echo Instalando pacotes necessarios...
    call npm install
)

echo.
echo [2/2] Abrindo navegador e iniciando servidor...
echo.
echo - Portal do Aluno:       http://localhost:3000
echo - Painel da Coordenacao: http://localhost:3000/admin.html
echo - Local:                 Sala da Coordenacao
echo - Horario:               18:00 as 20:00 (Seg a Sex)
echo - Senha de Acesso:       jacke2026
echo.
echo Pressione Ctrl+C para encerrar o sistema quando desejar.
echo ======================================================
echo.

start "" "http://localhost:3000"

node server.js
pause
