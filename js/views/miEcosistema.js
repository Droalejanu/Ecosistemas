// Más → Mi ecosistema: edición de los datos del ecosistema.
import { h } from '../ui/dom.js';
import { formularioEcosistema } from './ecosistemaForm.js';
import { obtenerEcosistema, guardarEcosistema } from '../db/repos/ecosistema.js';
import { ir } from '../router.js';

export async function vistaMiEcosistema(cont) {
  const eco = await obtenerEcosistema();
  cont.append(h('div', { class: 'vista' },
    h('p', {}, h('a', { href: '#/mas' }, '← Más')),
    h('h1', {}, 'Mi ecosistema'),
    formularioEcosistema({
      valores: eco, textoBoton: 'Guardar cambios',
      onGuardar: async (datos) => { await guardarEcosistema(datos); ir('#/inicio'); },
    }),
  ));
}
