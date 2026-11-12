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
};
