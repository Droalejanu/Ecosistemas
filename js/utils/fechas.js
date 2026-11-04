// Utilidades de fecha. Todo se guarda como timestamp (ms) y se muestra en hora local.
const DIA_MS = 86400000;

/** Inicio del día (00:00 local) de un timestamp. */
const inicioDia = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };

/** "Día N": el día de creación cuenta como Día 1. */
export const diaN = (ts) => Math.floor((inicioDia(Date.now()) - inicioDia(ts)) / DIA_MS) + 1;

/** Días completos transcurridos desde un timestamp. */
export const diasDesde = (ts) => Math.floor((inicioDia(Date.now()) - inicioDia(ts)) / DIA_MS);

/** 'YYYY-MM-DD' (valor de <input type="date">) → timestamp local a medianoche. */
export const deInputFecha = (txt) => { const [y, m, d] = txt.split('-').map(Number); return new Date(y, m - 1, d).getTime(); };

/** timestamp → 'YYYY-MM-DD' para <input type="date">. */
export const aInputFecha = (ts = Date.now()) => {
  const d = new Date(ts); const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export const formatoFecha = (ts) => new Date(ts).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });

/** "hace 5 min", "hace 3 h", "ayer", "hace 4 días". */
export function haceCuanto(ts) {
  const min = Math.round((Date.now() - ts) / 60000);
  if (min < 1) return 'ahora mismo';
  if (min < 60) return `hace ${min} min`;
  if (min < 1440) return `hace ${Math.floor(min / 60)} h`;
  const d = diasDesde(ts);
  return d === 1 ? 'ayer' : `hace ${d} días`;
}
export const formatoFechaHora = (ts) => new Date(ts).toLocaleString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

/** Para <input type="datetime-local">: 'YYYY-MM-DDTHH:mm' en hora local. */
export const aInputFechaHora = (ts = Date.now()) => {
  const d = new Date(ts); const p = (n) => String(n).padStart(2, '0');
  return `${aInputFecha(ts)}T${p(d.getHours())}:${p(d.getMinutes())}`;
};
export const deInputFechaHora = (txt) => new Date(txt).getTime();
