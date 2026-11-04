// Router por hash (#/ruta): funciona en GitHub Pages sin configuración del servidor.
import { marcarActivo } from './ui/shell.js';

const rutas = new Map();
let contenedor = null;

/** Registra una vista: función (contenedor) => void | Promise. */
export const registrar = (hash, vista) => rutas.set(hash, vista);

export const ir = (hash) => { location.hash = hash; };

async function pintar() {
  const hash = location.hash || '#/inicio';
  const vista = rutas.get(hash) ?? rutas.get('#/inicio');
  marcarActivo(hash);
  contenedor.replaceChildren();
  try { await vista(contenedor); } catch (e) { console.error(e); contenedor.textContent = 'Ocurrió un error al mostrar esta pantalla.'; }
  contenedor.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

export function iniciarRouter(main) {
  contenedor = main;
  window.addEventListener('hashchange', pintar);
  return pintar();
}
