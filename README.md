# Proyecto de monitoreo de ecosistemas

PWA gratuita, sin backend. Los datos viven en IndexedDB (solo en tu navegador).
Stack: HTML5, CSS3, JavaScript vanilla (módulos ES), IndexedDB, Chart.js (etapa 5), GitHub Pages.

## Estado por etapas
- [x] Etapa 1: estructura, BD (esquema v1), navegación, crear/editar ecosistema, dashboard base, PWA base
- [x] Etapa 2: mediciones (formulario, última medición y estado general en Inicio)
- [ ] Etapa 3: diario y fotos
- [ ] Etapa 4: inventario (con cantidad en organismos)
- [ ] Etapa 5: historial y gráficas (Chart.js local)
- [ ] Etapa 6: respaldo (exportar/importar)
- [ ] Etapa 7: pulido PWA

## Atajos
- Windows: doble clic en `iniciar.bat` (probar) y `publicar.bat` (subir a GitHub).
- Mac/Linux: `sh iniciar.sh` y `sh publicar.sh`.

## Probar en local
Los módulos ES y el service worker necesitan un servidor (no abrir con doble clic):
```
cd monitoreo-ecosistemas
python3 -m http.server 8000
```
Abre http://localhost:8000. (En Windows: `python -m http.server 8000`.)

## Publicar en GitHub Pages
1. Crea un repositorio vacío en GitHub (ej. `monitoreo-ecosistemas`).
2. En la carpeta del proyecto:
```
git init
git add .
git commit -m "Etapa 1: estructura base y ecosistema"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/monitoreo-ecosistemas.git
git push -u origin main
```
3. En GitHub: Settings → Pages → Source: "Deploy from a branch" → rama `main`, carpeta `/ (root)`.
4. En 1–2 minutos queda en `https://TU_USUARIO.github.io/monitoreo-ecosistemas/`.

## Al modificar archivos
Sube `VERSION` en `sw.js` (v1 → v2) para que los celulares reciban la versión nueva.

## Estructura
- `js/db/` esquema, helpers de IndexedDB y repositorios (único lugar que toca la BD)
- `js/views/` una pantalla por archivo · `js/ui/` navegación y utilidades de DOM
- `js/utils/` fechas y almacenamiento · `docs/` decisiones de diseño
