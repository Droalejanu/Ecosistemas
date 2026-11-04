// Catálogo de parámetros del agua. Vive en código, no en la BD:
// añadir un parámetro aquí lo agrega al formulario automáticamente, sin migrar IndexedDB.
// "origen": medido (instrumento/kit) u observado (a simple vista). "min/max": solo para detectar errores de tipeo.
export const PARAMETROS = {
  ph:            { etiqueta: 'pH',             tipo: 'numero', unidad: '',    origen: 'medido', min: 0,  max: 14 },
  temperaturaC:  { etiqueta: 'Temperatura',    tipo: 'numero', unidad: '°C',  origen: 'medido', min: -5, max: 50 },
  amoniacoPpm:   { etiqueta: 'Amoníaco (NH₃)', tipo: 'numero', unidad: 'ppm', origen: 'medido', min: 0,  max: 100 },
  nitritosPpm:   { etiqueta: 'Nitritos (NO₂)', tipo: 'numero', unidad: 'ppm', origen: 'medido', min: 0,  max: 100 },
  nitratosPpm:   { etiqueta: 'Nitratos (NO₃)', tipo: 'numero', unidad: 'ppm', origen: 'medido', min: 0,  max: 1000 },
  nivelAgua:     { etiqueta: 'Nivel de agua',  tipo: 'lista',  origen: 'observado', opciones: ['bajo', 'normal', 'alto'] },
  transparencia: { etiqueta: 'Transparencia',  tipo: 'lista',  origen: 'observado', opciones: ['cristalina', 'ligeramente turbia', 'turbia', 'muy turbia'] },
  color:         { etiqueta: 'Color',          tipo: 'texto',  origen: 'observado' },
  olor:          { etiqueta: 'Olor',           tipo: 'lista',  origen: 'observado', opciones: ['ninguno', 'tierra/húmedo', 'desagradable'] },
};

/** Texto para mostrar un valor; sin dato → "—" (nunca 0). */
export function formatearValor(clave, valor) {
  if (valor == null || valor === '') return '—';
  const u = PARAMETROS[clave]?.unidad;
  return u ? `${valor} ${u}` : String(valor);
}
