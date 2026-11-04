// Manejo del límite de almacenamiento del navegador.

/** Pide al navegador que no borre los datos automáticamente. Llamar tras una acción del usuario. */
export async function pedirPersistencia() {
  try { return (await navigator.storage?.persist?.()) ?? false; } catch { return false; }
}

/** Devuelve { usadoMB, cuotaMB, porcentaje } o null si el navegador no lo soporta. */
export async function estimarUso() {
  try {
    const { usage, quota } = await navigator.storage.estimate();
    return { usadoMB: usage / 1048576, cuotaMB: quota / 1048576, porcentaje: (usage / quota) * 100 };
  } catch { return null; }
}
