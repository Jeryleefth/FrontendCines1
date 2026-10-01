import { clienteHttp } from '../clienteHttp';

export const peliculaServicioApi = {
  listar: () => clienteHttp.obtener('/peliculas'),
  buscarPorId: (id) => clienteHttp.obtener(`/peliculas/${id}`),
};
