// Pantalla provisional para secciones que se construyen en etapas posteriores.
import { h } from '../ui/dom.js';

export const vistaPendiente = (titulo, etapa, enlaces = []) => (cont) =>
  cont.append(h('div', { class: 'vista' }, h('h1', {}, titulo),
    h('p', { class: 'valor-vacio' }, `Esta sección se construye en la ${etapa}.`),
    h('div', { class: 'lista-opciones' }, enlaces.map(([href, txt]) => h('a', { class: 'opcion', href }, txt)))));
