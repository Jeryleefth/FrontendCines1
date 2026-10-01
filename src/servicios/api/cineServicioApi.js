import { clienteHttp } from '../clienteHttp';

export const cineServicioApi = {
  listar: () => clienteHttp.obtener('/cines'),
  buscarPorId: (id) => clienteHttp.obtener(`/cines/${id}`),
  crear: (datos) => clienteHttp.crear('/cines', datos),
  actualizar: (id, datos) => clienteHttp.actualizar(`/cines/${id}`, datos),
  eliminar: (id) => clienteHttp.eliminar(`/cines/${id}`),
};
