// Service worker: estrategia "caché primero" para el armazón de la app (funciona sin conexión).
// IMPORTANTE: al cambiar cualquier archivo de ARCHIVOS, sube VERSION para que se actualice.
const VERSION = 'v2';
const CACHE = `ecosistema-${VERSION}`;
const ARCHIVOS = [
  './', 'index.html', 'manifest.webmanifest',
  'css/base.css', 'css/layout.css', 'icons/icon.svg',
  'js/app.js', 'js/router.js',
  'js/db/schema.js', 'js/db/parametros.js', 'js/db/db.js',
  'js/db/repos/ecosistema.js', 'js/db/repos/meta.js', 'js/db/repos/mediciones.js',
  'js/ui/dom.js', 'js/ui/shell.js',
  'js/utils/fechas.js', 'js/utils/almacenamiento.js', 'js/utils/validacion.js', 'js/utils/estado.js',
  'js/views/bienvenida.js', 'js/views/ecosistemaForm.js', 'js/views/dashboard.js',
  'js/views/miEcosistema.js', 'js/views/medicion.js', 'js/views/pendiente.js', 'js/views/registrar.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;
  e.respondWith(caches.match(request).then((hit) => hit || fetch(request)));
});
