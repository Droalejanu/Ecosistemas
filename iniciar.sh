#!/bin/sh
# Enciende el servidor local y abre la app. Uso: sh iniciar.sh
cd "$(dirname "$0")"
command -v python3 >/dev/null || { echo "Instala Python 3 desde https://www.python.org/downloads/"; exit 1; }
echo "App en http://localhost:8000  (Ctrl+C para detener)"
(sleep 1; open http://localhost:8000 2>/dev/null || xdg-open http://localhost:8000 2>/dev/null) &
python3 -m http.server 8000
