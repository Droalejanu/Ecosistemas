#!/bin/sh
# Sube los cambios a GitHub. La primera vez pide la URL del repositorio. Uso: sh publicar.sh
cd "$(dirname "$0")"
command -v git >/dev/null || { echo "Instala Git desde https://git-scm.com"; exit 1; }
if [ ! -d .git ]; then
  git init && git branch -M main
  printf "Pega la URL de tu repositorio (https://github.com/USUARIO/monitoreo-ecosistemas.git): "
  read URL
  git remote add origin "$URL"
fi
printf "Describe el cambio (ej. Etapa 2: mediciones): "
read MSG
git add . && git commit -m "$MSG" && git push -u origin main
echo "Listo. Espera 1-2 minutos y recarga tu pagina de GitHub Pages."
