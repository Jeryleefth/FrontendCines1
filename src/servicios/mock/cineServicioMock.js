import cines from '../../mocks/cines.json';
import { simularLatencia, noEncontrado } from './utilidades';

export const cineServicioMock = {
  /** @returns {Promise<import('../tipos').Cine[]>} */
  async listar() {
    return simularLatencia(cines);
  },

  /** @returns {Promise<import('../tipos').Cine>} */
  async buscarPorId(id) {
    const cine = cines.find((c) => c.id === id);
    if (!cine) throw noEncontrado('el cine', id);
    return simularLatencia(cine);
  },

  /** @returns {Promise<import('../tipos').Cine>} */
  async crear(datos) {
    const nuevo = { ...datos, id: `cine-${Date.now()}` };
    cines.push(nuevo);
    return simularLatencia(nuevo);
  },

  /** @returns {Promise<import('../tipos').Cine>} */
  async actualizar(id, datos) {
    const indice = cines.findIndex((c) => c.id === id);
    if (indice === -1) throw noEncontrado('el cine', id);
    cines[indice] = { ...cines[indice], ...datos, id };
    return simularLatencia(cines[indice]);
  },

  /** @returns {Promise<void>} */
  async eliminar(id) {
    const indice = cines.findIndex((c) => c.id === id);
    if (indice === -1) throw noEncontrado('el cine', id);
    cines.splice(indice, 1);
    return simularLatencia(undefined);
  },
};
