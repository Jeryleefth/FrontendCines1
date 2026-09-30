import { clienteHttp } from '../clienteHttp';

export const cineServicioApi = {
  listar: () => clienteHttp.obtener('/cines'),
  buscarPorId: (id) => clienteHttp.obtener(`/cines/${id}`),
};
