# Modelo de datos (IndexedDB, versión 1)

Fuente: decisiones de Fase 2 + Fase 3 punto 1. Implementado en `js/db/schema.js`.

## Principios
- IDs UUID. Fechas como timestamp (ms). Parámetro sin valor = clave ausente (nunca 0).
- Fotos separadas de los registros. Lo derivado (estado general, Día N, totales) no se guarda.
- Las relaciones apuntan en una sola dirección (la foto apunta a su dueño).

## Almacenes
| Almacén | Índices | Notas |
|---|---|---|
| ecosistema | — | Un solo registro (`id: "principal"`) |
| mediciones | fechaHora | `valores: { ph, temperaturaC, ... }` solo con lo medido |
| diario | fechaHora, tipo | tipo y origenDato según enumeraciones |
| seres | tipo, estado | Incluye cantidad (ver abajo) |
| seguimientos | [serId, fechaHora], fechaHora | Altas, seguimientos y bajas |
| fotos | [duenoTipo, duenoId], fechaHora | Metadatos + miniatura (~320 px) |
| fotos_archivos | — | Imagen comprimida (~1600 px) |
| meta | — | ultimoRespaldo, versionEsquema, etc. |

## Cantidad de organismos (decisión nueva)
`seres` añade:
- `cantidad` (entero ≥ 1): cuántos hay ahora. Para plantas se puede dejar en `null`.
- `cantidadInicial` (entero): cuántos se incorporaron.
- `cantidadEsEstimada` (bool): para poblaciones que solo se pueden estimar (ej. "unos 20 caracoles").

`seguimientos` añade:
- `cantidadNueva` (entero, nullable): cantidad resultante tras ese evento.

Reglas:
- Baja parcial ("murió 1 de 5"): seguimiento `tipo: "baja"` con `cantidadNueva: 4`; el ser sigue activo.
- Si `cantidadNueva` llega a 0 → el estado pasa a `perdido` y se rellena `fechaBaja`.
- Un aumento (nacimientos, nuevas incorporaciones) es un seguimiento con `cantidadNueva` mayor y `origenDato` según corresponda.
- La cantidad actual vive en `seres.cantidad`; el historial de cambios queda en `seguimientos` (se puede graficar).

## Importar / exportar
- Reemplazar: limpia todo e inserta. Fusionar: inserta lo que no existe por `id`; si existe, gana el mayor `actualizadoEn`.
- Los borrados no se propagan en una fusión (limitación documentada del MVP).
