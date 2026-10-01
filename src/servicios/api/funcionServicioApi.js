import { clienteHttp } from '../clienteHttp';

export const funcionServicioApi = {
  listarTodas: () => clienteHttp.obtener('/funciones'),
  buscarPorId: (id) => clienteHttp.obtener(`/funciones/${id}`),
  listarPorPelicula: (peliculaId) => clienteHttp.obtener(`/peliculas/${peliculaId}/funciones`),
  comparar: (peliculaId) => clienteHttp.obtener(`/peliculas/${peliculaId}/comparador`),
};
