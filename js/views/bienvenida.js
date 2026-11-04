// Flujo 0: bienvenida → crear ecosistema.
import { h } from '../ui/dom.js';
import { formularioEcosistema } from './ecosistemaForm.js';
import { guardarEcosistema } from '../db/repos/ecosistema.js';
import { pedirPersistencia } from '../utils/almacenamiento.js';

export function mostrarBienvenida(raiz, alTerminar) {
  const vista = h('div', { class: 'vista centrada' },
    h('h1', {}, 'Monitoreo de ecosistemas'),
    h('p', {}, 'Registra mediciones, fotos y observaciones de tu ecosistema y mira cómo cambia con el tiempo.'),
    h('div', { class: 'aviso' }, 'Tus datos se guardan solo en este navegador. Haz respaldos desde Más → Respaldo.'),
    h('h2', {}, 'Crea tu ecosistema'),
    formularioEcosistema({
      textoBoton: 'Crear ecosistema',
      onGuardar: async (datos) => {
        await guardarEcosistema(datos);
        await pedirPersistencia(); // se llama tras un gesto del usuario, como exigen los navegadores
        alTerminar();
      },
    }),
  );
  raiz.replaceChildren(vista);
}
