// Menú del botón ＋. Los destinos pendientes se activan en las etapas 3 y 4.
import { h } from '../ui/dom.js';

export function vistaRegistrar(cont) {
  const pendiente = (ico, titulo, etapa) => h('div', { class: 'opcion', 'aria-disabled': 'true' },
    h('strong', {}, `${ico} ${titulo}`), h('small', {}, `Disponible en la ${etapa}`));
  cont.append(h('div', { class: 'vista' }, h('h1', {}, '¿Qué quieres registrar?'),
    h('div', { class: 'lista-opciones' },
      h('a', { class: 'opcion', href: '#/registrar/medicion' }, h('strong', {}, '🧪 Medición de parámetros'), h('small', {}, 'pH, temperatura, amoníaco… todo opcional')),
      pendiente('📖', 'Entrada de diario', 'etapa 3'),
      pendiente('🌿', 'Planta u organismo', 'etapa 4'))));
}
