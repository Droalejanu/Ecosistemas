// Formulario reutilizable: lo usan "Bienvenida" (crear) y "Mi ecosistema" (editar).
import { h } from '../ui/dom.js';
import { aInputFecha, deInputFecha } from '../utils/fechas.js';

const TIPOS = ['Acuático natural', 'Acuario', 'Estanque', 'Humedal', 'Terrario', 'Otro'];
const num = (txt) => (txt === '' || txt == null ? null : Number(txt));

/** valores: ecosistema existente o {}. onGuardar(datos) recibe el objeto listo para guardar. */
export function formularioEcosistema({ valores = {}, textoBoton, onGuardar }) {
  const dim = valores.dimensiones ?? {};
  const campo = (id, props) => h('input', { id, name: id, ...props });
  const nombre = campo('nombre', { type: 'text', required: true, maxlength: 80, value: valores.nombre ?? '', autocomplete: 'off' });
  const tipo = h('select', { id: 'tipo', name: 'tipo' }, TIPOS.map((t) => h('option', { value: t, selected: t === (valores.tipo ?? TIPOS[0]) }, t)));
  const fecha = campo('fecha', { type: 'date', required: true, max: aInputFecha(), value: aInputFecha(valores.fechaCreacion ?? Date.now()) });
  const largo = campo('largo', { type: 'number', min: 0, step: 'any', inputmode: 'decimal', value: dim.largo ?? '' });
  const ancho = campo('ancho', { type: 'number', min: 0, step: 'any', inputmode: 'decimal', value: dim.ancho ?? '' });
  const alto = campo('alto', { type: 'number', min: 0, step: 'any', inputmode: 'decimal', value: dim.alto ?? '' });
  const vol = campo('volumen', { type: 'number', min: 0, step: 'any', inputmode: 'decimal', value: valores.volumenLitros ?? '' });
  const desc = h('textarea', { id: 'descripcion', name: 'descripcion', maxlength: 1000 }, valores.descripcion ?? '');
  const error = h('p', { class: 'error-campo', role: 'alert' });

  const form = h('form', { novalidate: true },
    h('label', { for: 'nombre' }, 'Nombre'), nombre,
    h('label', { for: 'tipo' }, 'Tipo de ecosistema'), tipo,
    h('label', { for: 'fecha' }, 'Fecha de creación'), fecha,
    h('label', {}, 'Dimensiones (cm, opcional)'),
    h('div', { class: 'fila' }, largo, ancho, alto),
    h('p', { class: 'ayuda' }, 'Largo · ancho · alto'),
    h('label', { for: 'volumen' }, 'Volumen aproximado (litros, opcional)'), vol,
    h('p', { class: 'ayuda' }, 'Si lo dejas vacío y llenas las dimensiones, se calcula un estimado y se marca como estimado.'),
    h('label', { for: 'descripcion' }, 'Descripción del montaje (opcional)'), desc,
    error,
    h('p', {}, h('button', { class: 'boton', type: 'submit' }, textoBoton)),
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';
    if (!nombre.value.trim()) { error.textContent = 'Escribe un nombre para tu ecosistema.'; nombre.focus(); return; }
    if (!fecha.value) { error.textContent = 'Indica la fecha de creación.'; fecha.focus(); return; }

    const [l, a, al] = [num(largo.value), num(ancho.value), num(alto.value)];
    const tieneDim = [l, a, al].every((v) => v != null && v > 0);
    let volumen = num(vol.value);
    let estimado = false;
    if (volumen == null && tieneDim) { volumen = Math.round((l * a * al) / 1000); estimado = true; } // cm³ → litros
    else if (volumen != null) estimado = valores.volumenEsEstimado && volumen === valores.volumenLitros; // conserva marca si no se tocó

    try {
      await onGuardar({
        nombre: nombre.value.trim(), tipo: tipo.value, fechaCreacion: deInputFecha(fecha.value),
        dimensiones: [l, a, al].some((v) => v != null) ? { largo: l, ancho: a, alto: al, unidad: 'cm' } : null,
        volumenLitros: volumen, volumenEsEstimado: estimado, descripcion: desc.value.trim(),
      });
    } catch (err) { error.textContent = `No se pudo guardar: ${err.message}`; }
  });
  return form;
}
