import { clienteHttp } from '../clienteHttp';

export const funcionServicioApi = {
  listarPorPelicula: (peliculaId) => clienteHttp.obtener(`/peliculas/${peliculaId}/funciones`),
  comparar: (peliculaId) => clienteHttp.obtener(`/peliculas/${peliculaId}/comparador`),
};
