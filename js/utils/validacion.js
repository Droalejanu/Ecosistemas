// Validación de una medición. Funciones puras (sin DOM).
import { PARAMETROS } from '../db/parametros.js';

/** Acepta coma o punto decimal (teclados en español). */
export function parsearNumero(txt) {
  const t = String(txt ?? '').trim().replace(',', '.');
  if (t === '') return { vacio: true };
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return { error: 'Escribe un número válido (ej. 7.2).' };
  return { valor: Number(t) };
}

/** crudo: { clave: texto }. Devuelve solo los valores presentes y válidos, más los errores por campo. */
export function validarMedicion(crudo) {
  const valores = {}, errores = {};
  for (const [clave, p] of Object.entries(PARAMETROS)) {
    const t = String(crudo[clave] ?? '').trim();
    if (t === '') continue; // vacío = no medido: no se guarda nada
    if (p.tipo === 'numero') {
      const r = parsearNumero(t);
      if (r.error) { errores[clave] = r.error; continue; }
      if (r.valor < p.min || r.valor > p.max) { errores[clave] = `Debe estar entre ${p.min} y ${p.max}.`; continue; }
      valores[clave] = r.valor;
    } else if (p.tipo === 'lista') {
      if (!p.opciones.includes(t)) { errores[clave] = 'Elige una opción de la lista.'; continue; }
      valores[clave] = t;
    } else valores[clave] = t.slice(0, 60);
  }
  return { valores, errores };
}
