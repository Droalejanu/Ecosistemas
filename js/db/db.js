// Capa mínima sobre IndexedDB: convierte las peticiones en promesas.
// Los "repos" (js/db/repos/*) usan estas funciones; las vistas nunca tocan IndexedDB directamente.
import { abrirBD } from './schema.js';

let conexion = null;
/** Conexión única y reutilizable. */
export async function bd() { return (conexion ??= await abrirBD()); }

const pedir = (req) => new Promise((ok, fallo) => { req.onsuccess = () => ok(req.result); req.onerror = () => fallo(req.error); });

export async function obtener(store, clave) {
  return pedir((await bd()).transaction(store).objectStore(store).get(clave));
}

export async function listar(store) {
  return pedir((await bd()).transaction(store).objectStore(store).getAll());
}

/** Inserta o reemplaza. Resuelve cuando la transacción termina (datos realmente guardados). */
export async function guardar(store, valor) {
  const tx = (await bd()).transaction(store, 'readwrite');
  tx.objectStore(store).put(valor);
  return new Promise((ok, fallo) => {
    tx.oncomplete = () => ok(valor);
    tx.onerror = tx.onabort = () => fallo(tx.error);
  });
}

export async function eliminar(store, clave) {
  const tx = (await bd()).transaction(store, 'readwrite');
  tx.objectStore(store).delete(clave);
  return new Promise((ok, fallo) => { tx.oncomplete = () => ok(); tx.onerror = tx.onabort = () => fallo(tx.error); });
}

/** Lee registros por un índice, con rango (IDBKeyRange), orden y límite opcionales. */
export async function consultarIndice(store, indice, { rango = null, descendente = false, limite = Infinity } = {}) {
  const idx = (await bd()).transaction(store).objectStore(store).index(indice);
  return new Promise((ok, fallo) => {
    const res = [];
    const req = idx.openCursor(rango, descendente ? 'prev' : 'next');
    req.onsuccess = () => {
      const c = req.result;
      if (!c) return ok(res);
      res.push(c.value);
      if (res.length >= limite) return ok(res);
      c.continue();
    };
    req.onerror = () => fallo(req.error);
  });
}

/** Cuenta registros de un índice dentro de un rango, sin cargarlos. */
export async function contarIndice(store, indice, rango = null) {
  return pedir((await bd()).transaction(store).objectStore(store).index(indice).count(rango));
}
