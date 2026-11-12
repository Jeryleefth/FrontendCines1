import peliculas from '../../mocks/peliculas.json';
import { simularLatencia, noEncontrado } from './utilidades';

export const peliculaServicioMock = {
  /** @returns {Promise<import('../tipos').Pelicula[]>} */
  async listar() {
    return simularLatencia(peliculas);
  },

  /** @returns {Promise<import('../tipos').Pelicula>} */
  async buscarPorId(id) {
    const pelicula = peliculas.find((p) => p.id === id);
    if (!pelicula) throw noEncontrado('la película', id);
    return simularLatencia(pelicula);
  },
};
