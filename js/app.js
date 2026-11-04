// Punto de entrada: abre la BD, decide entre bienvenida o app y registra el service worker.
import { bd } from './db/db.js';
import { obtenerEcosistema } from './db/repos/ecosistema.js';
import { montarShell } from './ui/shell.js';
import { registrar, iniciarRouter, ir } from './router.js';
import { h } from './ui/dom.js';
import { mostrarBienvenida } from './views/bienvenida.js';
import { vistaDashboard } from './views/dashboard.js';
import { vistaMiEcosistema } from './views/miEcosistema.js';
import { vistaRegistrar } from './views/registrar.js';
import { vistaMedicion } from './views/medicion.js';
import { vistaPendiente } from './views/pendiente.js';

const raiz = document.getElementById('app');

function iniciarApp() {
  const main = montarShell(raiz);
  registrar('#/inicio', vistaDashboard);
  registrar('#/registrar', vistaRegistrar);
  registrar('#/registrar/medicion', vistaMedicion);
  registrar('#/diario', vistaPendiente('Diario', 'etapa 3'));
  registrar('#/inventario', vistaPendiente('Inventario', 'etapa 4'));
  registrar('#/mas', vistaPendiente('Más', 'etapa 1', [
    ['#/mas/ecosistema', '⚙️ Mi ecosistema'], ['#/mas/historial', '📈 Historial y gráficas'], ['#/mas/respaldo', '💾 Respaldo']]));
  registrar('#/mas/ecosistema', vistaMiEcosistema);
  registrar('#/mas/historial', vistaPendiente('Historial y gráficas', 'etapa 5'));
  registrar('#/mas/respaldo', vistaPendiente('Respaldo', 'etapa 6'));
  if (!location.hash || location.hash === '#/') location.hash = '#/inicio';
  iniciarRouter(main);
}

async function arrancar() {
  try { await bd(); } catch (e) {
    raiz.replaceChildren(h('p', { class: 'vista aviso' }, `No se pudo abrir el almacenamiento local: ${e.message}. Revisa que el navegador no esté en modo privado.`));
    return;
  }
  const eco = await obtenerEcosistema();
  if (eco) iniciarApp();
  else mostrarBienvenida(raiz, () => { ir('#/inicio'); iniciarApp(); });

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW no registrado:', e));
}
arrancar();
