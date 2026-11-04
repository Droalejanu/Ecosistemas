// Flujo 1: nueva medición. Los campos salen del catálogo PARAMETROS; todos son opcionales.
import { h } from '../ui/dom.js';
import { PARAMETROS } from '../db/parametros.js';
import { validarMedicion } from '../utils/validacion.js';
import { aInputFechaHora, deInputFechaHora } from '../utils/fechas.js';
import { crearMedicion } from '../db/repos/mediciones.js';
import { ir } from '../router.js';

export function vistaMedicion(cont) {
  const controles = {}, mensajes = {};

  const filas = Object.entries(PARAMETROS).map(([clave, p]) => {
    controles[clave] = p.tipo === 'lista'
      ? h('select', { id: clave }, h('option', { value: '' }, 'Sin dato'), p.opciones.map((o) => h('option', { value: o }, o)))
      : h('input', { id: clave, type: 'text', autocomplete: 'off', inputmode: p.tipo === 'numero' ? 'decimal' : 'text', 'aria-describedby': `err-${clave}` });
    mensajes[clave] = h('p', { class: 'error-campo', id: `err-${clave}`, role: 'alert' });
    // La etiqueta "medido/observado" deja claro el origen del dato desde el formulario.
    return h('div', {},
      h('label', { for: clave }, p.etiqueta + (p.unidad ? ` (${p.unidad})` : ''), ' ', h('span', { class: 'etiqueta' }, p.origen)),
      controles[clave], mensajes[clave]);
  });

  const fecha = h('input', { id: 'fechaHora', type: 'datetime-local', max: aInputFechaHora(), value: aInputFechaHora(), required: true });
  const notas = h('textarea', { id: 'notas', maxlength: 500 });
  const errorGeneral = h('p', { class: 'error-campo', role: 'alert' });
  const boton = h('button', { class: 'boton', type: 'submit' }, 'Guardar medición');

  const form = h('form', { novalidate: true },
    h('label', { for: 'fechaHora' }, 'Fecha y hora'), fecha,
    h('p', { class: 'ayuda' }, 'Déjalo vacío si no mediste ese parámetro.'),
    filas,
    h('label', { for: 'notas' }, 'Notas (opcional)'), notas,
    errorGeneral,
    h('p', {}, boton));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorGeneral.textContent = '';
    const crudo = Object.fromEntries(Object.entries(controles).map(([k, el]) => [k, el.value]));
    const { valores, errores } = validarMedicion(crudo);
    Object.entries(mensajes).forEach(([k, el]) => { el.textContent = errores[k] ?? ''; });
    const primero = Object.keys(errores)[0];
    if (primero) { controles[primero].focus(); return; }

    const ts = deInputFechaHora(fecha.value);
    if (!fecha.value || Number.isNaN(ts)) { errorGeneral.textContent = 'Indica la fecha y hora.'; return; }
    if (ts > Date.now() + 60000) { errorGeneral.textContent = 'La fecha no puede ser futura.'; return; }
    const nota = notas.value.trim();
    if (!Object.keys(valores).length && !nota) { errorGeneral.textContent = 'Llena al menos un parámetro o escribe una nota.'; return; }

    boton.disabled = true; // evita guardar dos veces con un doble toque
    try { await crearMedicion({ fechaHora: ts, valores, notas: nota }); ir('#/inicio'); }
    catch (err) { errorGeneral.textContent = `No se pudo guardar: ${err.message}`; boton.disabled = false; }
  });

  cont.append(h('div', { class: 'vista' },
    h('p', {}, h('a', { href: '#/registrar' }, '← Registrar')),
    h('h1', {}, 'Nueva medición'), form));
}
