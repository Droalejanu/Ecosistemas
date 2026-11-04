// Acceso a datos del ecosistema. MVP: un solo registro con id fijo.
import { STORES } from '../schema.js';
import { obtener, guardar } from '../db.js';

const ID = 'principal';

export const obtenerEcosistema = () => obtener(STORES.ECOSISTEMA, ID);

/** Crea o actualiza el ecosistema conservando id y fecha de creación del registro. */
export async function guardarEcosistema(datos) {
  const previo = await obtenerEcosistema();
  const ahora = Date.now();
  return guardar(STORES.ECOSISTEMA, { ...datos, id: ID, creadoEn: previo?.creadoEn ?? ahora, actualizadoEn: ahora });
}
