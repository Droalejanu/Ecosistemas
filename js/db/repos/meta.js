// Pares clave/valor: último respaldo, versión de esquema, preferencias.
import { STORES } from '../schema.js';
import { obtener, guardar } from '../db.js';

export async function leerMeta(clave, porDefecto = null) {
  return (await obtener(STORES.META, clave))?.valor ?? porDefecto;
}
export const escribirMeta = (clave, valor) => guardar(STORES.META, { clave, valor });
