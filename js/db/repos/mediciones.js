// Acceso a datos de mediciones. "valores" solo contiene lo que se midió (clave ausente = sin dato).
import { STORES, nuevoId } from '../schema.js';
import { guardar, eliminar, consultarIndice, contarIndice } from '../db.js';

export async function crearMedicion({ fechaHora, valores, notas }) {
  const ahora = Date.now();
  const medicion = { id: nuevoId(), fechaHora, valores, creadoEn: ahora, actualizadoEn: ahora };
  if (notas) medicion.notas = notas;
  return guardar(STORES.MEDICIONES, medicion);
}

/** La más reciente según la fecha del hecho (no la de guardado). */
export async function ultimaMedicion() {
  return (await consultarIndice(STORES.MEDICIONES, 'fechaHora', { descendente: true, limite: 1 }))[0] ?? null;
}

/** Mediciones entre dos fechas, de la más antigua a la más reciente (para gráficas, etapa 5). */
export const medicionesEntre = (desde, hasta = Date.now()) =>
  consultarIndice(STORES.MEDICIONES, 'fechaHora', { rango: IDBKeyRange.bound(desde, hasta) });

export const contarMedicionesDesde = (desde) =>
  contarIndice(STORES.MEDICIONES, 'fechaHora', IDBKeyRange.lowerBound(desde));

export const eliminarMedicion = (id) => eliminar(STORES.MEDICIONES, id);
