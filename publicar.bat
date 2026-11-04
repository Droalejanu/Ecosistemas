@echo off
setlocal enabledelayedexpansion
rem Sube los cambios a GitHub. La primera vez pide la URL del repositorio.
cd /d "%~dp0"
where git >nul 2>nul
if errorlevel 1 (
  echo No se encontro Git. Instalalo desde https://git-scm.com y vuelve a ejecutar este archivo.
  pause
  exit /b
)
if not exist .git (
  git init
  git branch -M main
  echo.
  set /p URL=Pega la URL de tu repositorio ^(ej. https://github.com/USUARIO/monitoreo-ecosistemas.git^): 
  git remote add origin !URL!
)
echo.
set /p MSG=Describe el cambio ^(ej. Etapa 2: mediciones^): 
git add .
git commit -m "!MSG!"
git push -u origin main
echo.
echo Listo. Espera 1-2 minutos y recarga tu pagina de GitHub Pages.
pause
