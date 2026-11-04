// Armazón de navegación: barra inferior (celular) y lateral (computador). Mismos destinos.
import { h } from './dom.js';

export const DESTINOS = [
  { ruta: '#/inicio',     icono: '🏠', texto: 'Inicio' },
  { ruta: '#/diario',     icono: '📖', texto: 'Diario' },
  { ruta: '#/registrar',  icono: '＋', texto: 'Registrar', central: true },
  { ruta: '#/inventario', icono: '🌿', texto: 'Inventario' },
  { ruta: '#/mas',        icono: '⋯',  texto: 'Más' },
];

const enlace = (d) => h('a', { class: `destino${d.central ? ' central' : ''}`, href: d.ruta, 'data-ruta': d.ruta },
  h('span', { class: 'icono', 'aria-hidden': 'true' }, d.icono), h('span', {}, d.texto));

/** Monta la navegación y devuelve el <main> donde se pintan las vistas. */
export function montarShell(raiz) {
  const main = h('main', { class: 'contenido', id: 'contenido', tabindex: '-1' });
  raiz.replaceChildren(
    h('nav', { class: 'lateral', 'aria-label': 'Principal' }, h('div', { class: 'marca' }, 'Mi ecosistema'), DESTINOS.map(enlace)),
    main,
    h('nav', { class: 'barra-inferior', 'aria-label': 'Principal' }, DESTINOS.map(enlace)),
  );
  return main;
}

/** Marca el destino activo según el hash actual (#/mas/respaldo activa "Más"). */
export function marcarActivo(hash) {
  document.querySelectorAll('[data-ruta]').forEach((a) => {
    const r = a.dataset.ruta;
    if (hash === r || hash.startsWith(r + '/')) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}
