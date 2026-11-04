@echo off
rem Enciende el servidor local y abre la app en el navegador.
cd /d "%~dp0"
where python >nul 2>nul
if %errorlevel%==0 ( set PY=python ) else ( set PY=py )
%PY% --version >nul 2>nul
if errorlevel 1 (
  echo No se encontro Python. Instalalo desde https://www.python.org/downloads/
  echo y marca la casilla "Add Python to PATH" durante la instalacion.
  pause
  exit /b
)
echo.
echo App en http://localhost:8000   (para detener: cierra esta ventana o pulsa Ctrl+C)
echo.
start "" http://localhost:8000
%PY% -m http.server 8000
pause
