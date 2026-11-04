// Pantalla de inicio. Sin dato = "—", nunca 0. Medido y observado se muestran por separado.
import { h } from '../ui/dom.js';
import { obtenerEcosistema } from '../db/repos/ecosistema.js';
import { leerMeta } from '../db/repos/meta.js';
import { ultimaMedicion, contarMedicionesDesde } from '../db/repos/mediciones.js';
import { PARAMETROS, formatearValor } from '../db/parametros.js';
import { calcularEstado, REGLA_ESTADO } from '../utils/estado.js';
import { diaN, diasDesde, haceCuanto, formatoFechaHora } from '../utils/fechas.js';

const DIAS_AVISO_RESPALDO = 14;
const RESUMEN = { ph: 'pH', temperaturaC: 'Temp.', amoniacoPpm: 'NH₃', nitritosPpm: 'NO₂', nitratosPpm: 'NO₃' };
const OBSERVADOS = ['nivelAgua', 'transparencia', 'color', 'olor'];

function tarjetaUltimaMedicion(ultima) {
  if (!ultima) return h('section', { class: 'tarjeta' }, h('h2', {}, 'Última medición'), h('p', { class: 'valor-vacio' }, 'Sin mediciones todavía.'));
  const medidos = h('dl', { class: 'rejilla-valores' }, Object.entries(RESUMEN).map(([k, txt]) =>
    h('div', {}, h('dt', {}, txt), h('dd', { class: ultima.valores[k] == null ? 'valor-vacio' : '' }, formatearValor(k, ultima.valores[k])))));
  const obs = OBSERVADOS.filter((k) => ultima.valores[k]).map((k) => `${PARAMETROS[k].etiqueta}: ${ultima.valores[k]}`);
  return h('section', { class: 'tarjeta' },
    h('h2', {}, 'Última medición'),
    h('p', { class: 'ayuda' }, `${haceCuanto(ultima.fechaHora)} · ${formatoFechaHora(ultima.fechaHora)}`),
    h('p', {}, h('span', { class: 'etiqueta' }, 'medido')), medidos,
    obs.length ? h('p', {}, h('span', { class: 'etiqueta' }, 'observado'), ' ', obs.join(' · ')) : null,
    ultima.notas ? h('p', { class: 'ayuda' }, `Notas: ${ultima.notas}`) : null,
    h('p', {}, h('a', { href: '#/mas/historial' }, 'Ver historial')));
}

export async function vistaDashboard(cont) {
  const hace7 = Date.now() - 7 * 86400000;
  const [eco, ultimoRespaldo, ultima, recientes] = await Promise.all([
    obtenerEcosistema(), leerMeta('ultimoRespaldo'), ultimaMedicion(), contarMedicionesDesde(hace7)]);
  const estado = calcularEstado(ultima);
  const dias = diasDesde(ultimoRespaldo ?? eco.fechaCreacion); // sin respaldo previo, cuenta desde la creación

  cont.append(h('div', { class: 'vista' },
    h('header', { class: 'encabezado' }, h('h1', {}, eco.nombre), h('p', {}, `Día ${diaN(eco.fechaCreacion)} desde la creación`)),
    dias > DIAS_AVISO_RESPALDO ? h('div', { class: 'aviso' }, `Hace ${dias} días que no exportas una copia. `, h('a', { href: '#/mas/respaldo' }, 'Hacer respaldo')) : null,
    h('section', { class: `tarjeta estado ${estado.nivel}` }, h('h2', {}, 'Estado general'),
      h('p', {}, h('strong', {}, estado.titulo), ultima ? ` · última medición ${haceCuanto(ultima.fechaHora)}` : ' · aún no hay mediciones'),
      h('p', { class: 'ayuda' }, REGLA_ESTADO)),
    tarjetaUltimaMedicion(ultima),
    h('section', { class: 'tarjeta' }, h('h2', {}, 'Actividad reciente'),
      h('p', {}, `${recientes} ${recientes === 1 ? 'medición' : 'mediciones'} en los últimos 7 días`)),
    ultima ? null : h('section', { class: 'tarjeta' }, h('h2', {}, 'Para empezar'),
      h('ul', { class: 'sugerencias' },
        h('li', {}, h('a', { href: '#/registrar/medicion' }, '🧪 Registra tu primera medición')),
        h('li', {}, h('a', { href: '#/registrar' }, '📷 Sube tu primera foto')),
        h('li', {}, h('a', { href: '#/inventario' }, '🌿 Añade tus plantas')))),
  ));
}
