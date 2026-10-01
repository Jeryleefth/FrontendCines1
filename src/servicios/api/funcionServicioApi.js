import { clienteHttp } from '../clienteHttp';

export const funcionServicioApi = {
  listarTodas: () => clienteHttp.obtener('/funciones'),
  buscarPorId: (id) => clienteHttp.obtener(`/funciones/${id}`),
  listarPorPelicula: (peliculaId) => clienteHttp.obtener(`/peliculas/${peliculaId}/funciones`),
  comparar: (peliculaId) => clienteHttp.obtener(`/peliculas/${peliculaId}/comparador`),
  crear: (datos) => clienteHttp.crear('/funciones', datos),
  actualizar: (id, datos) => clienteHttp.actualizar(`/funciones/${id}`, datos),
  eliminar: (id) => clienteHttp.eliminar(`/funciones/${id}`),
};
