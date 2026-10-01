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

  /**
   * Agrega una película nueva al arreglo en memoria. El id se genera acá
   * (en la API real lo generaría el backend). Como todavía no hay base de
   * datos, esto solo dura mientras no recargues la página: al refrescar,
   * `peliculas.json` vuelve a ser la única fuente.
   * @returns {Promise<import('../tipos').Pelicula>}
   */
  async crear(datos) {
    const nueva = { ...datos, id: `pel-${Date.now()}` };
    peliculas.push(nueva);
    return simularLatencia(nueva);
  },

  /** @returns {Promise<import('../tipos').Pelicula>} */
  async actualizar(id, datos) {
    const indice = peliculas.findIndex((p) => p.id === id);
    if (indice === -1) throw noEncontrado('la película', id);
    peliculas[indice] = { ...peliculas[indice], ...datos, id };
    return simularLatencia(peliculas[indice]);
  },

  /** @returns {Promise<void>} */
  async eliminar(id) {
    const indice = peliculas.findIndex((p) => p.id === id);
    if (indice === -1) throw noEncontrado('la película', id);
    peliculas.splice(indice, 1);
    return simularLatencia(undefined);
  },
};
