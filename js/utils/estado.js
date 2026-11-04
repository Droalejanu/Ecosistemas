// "Estado general" del MVP: regla simple y explicable, SIN evaluar si los valores son buenos o malos
// (eso requeriría criterios biológicos que dependen del tipo de ecosistema). Solo mira la antigüedad.
export const DIAS_MAX_SIN_MEDIR = 7;
export const REGLA_ESTADO = `Regla: "Al día" si la última medición tiene ${DIAS_MAX_SIN_MEDIR} días o menos. No evalúa si los valores son buenos o malos.`;

export function calcularEstado(ultima, ahora = Date.now()) {
  if (!ultima) return { nivel: 'sin_datos', titulo: 'Sin datos' };
  const dias = Math.floor((ahora - ultima.fechaHora) / 86400000);
  return dias <= DIAS_MAX_SIN_MEDIR ? { nivel: 'al_dia', titulo: 'Al día' } : { nivel: 'desactualizado', titulo: 'Desactualizado' };
}
