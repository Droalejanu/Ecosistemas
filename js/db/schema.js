// Estructura de IndexedDB y migraciones por versión.
// `seres` y `seguimientos` incluyen CANTIDAD (ver docs/modelo-datos.md).
// Los campos nuevos no necesitan índices, por eso la v1 sigue igual.
export const DB_NOMBRE = 'monitoreo-ecosistemas';
export const DB_VERSION = 1;

export const STORES = {
  ECOSISTEMA: 'ecosistema', MEDICIONES: 'mediciones', DIARIO: 'diario', SERES: 'seres',
  SEGUIMIENTOS: 'seguimientos', FOTOS: 'fotos', FOTOS_ARCHIVOS: 'fotos_archivos', META: 'meta',
};

export const TIPOS_DIARIO = ['observacion', 'intervencion', 'cambio_positivo', 'cambio_negativo'];
export const ORIGENES_DATO = ['observado', 'medido', 'estimado'];
export const TIPOS_SER = ['planta', 'organismo'];
export const ESTADOS_ACTIVOS = ['creciendo', 'estable', 'en_observacion', 'deteriorandose'];
export const ESTADOS_BAJA = ['perdido', 'retirado'];
export const TIPOS_SEGUIMIENTO = ['incorporacion', 'seguimiento', 'baja'];

// Cada versión se aplica en orden: así se evoluciona la BD sin perder datos.
const MIGRACIONES = {
  1(db) {
    db.createObjectStore(STORES.ECOSISTEMA, { keyPath: 'id' });
    db.createObjectStore(STORES.MEDICIONES, { keyPath: 'id' }).createIndex('fechaHora', 'fechaHora');

    const dia = db.createObjectStore(STORES.DIARIO, { keyPath: 'id' });
    dia.createIndex('fechaHora', 'fechaHora');
    dia.createIndex('tipo', 'tipo');

    const seres = db.createObjectStore(STORES.SERES, { keyPath: 'id' });
    seres.createIndex('tipo', 'tipo');
    seres.createIndex('estado', 'estado');

    const seg = db.createObjectStore(STORES.SEGUIMIENTOS, { keyPath: 'id' });
    seg.createIndex('serId_fechaHora', ['serId', 'fechaHora']);
    seg.createIndex('fechaHora', 'fechaHora');

    const fotos = db.createObjectStore(STORES.FOTOS, { keyPath: 'id' });
    fotos.createIndex('dueno', ['duenoTipo', 'duenoId']);
    fotos.createIndex('fechaHora', 'fechaHora');

    db.createObjectStore(STORES.FOTOS_ARCHIVOS, { keyPath: 'id' });
    db.createObjectStore(STORES.META, { keyPath: 'clave' });
  },
  // 2(db, tx) { ... }  ← futuras migraciones
};

export function abrirBD() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NOMBRE, DB_VERSION);
    req.onupgradeneeded = (e) => {
      for (let v = e.oldVersion + 1; v <= e.newVersion; v++) MIGRACIONES[v](req.result, req.transaction);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('Cierra otras pestañas de la app y recarga.'));
  });
}

export function nuevoId() {
  return crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
