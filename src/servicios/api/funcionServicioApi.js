import { clienteHttp } from '../clienteHttp';

export const funcionServicioApi = {
  listarTodas: () => clienteHttp.obtener('/funciones'),
  listarPorPelicula: (peliculaId) => clienteHttp.obtener(`/peliculas/${peliculaId}/funciones`),
  comparar: (peliculaId) => clienteHttp.obtener(`/peliculas/${peliculaId}/comparador`),
};
