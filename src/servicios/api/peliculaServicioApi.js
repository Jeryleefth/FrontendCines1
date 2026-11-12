import { clienteHttp } from '../clienteHttp';

// Misma forma (mismos métodos) que peliculaServicioMock.
// Las rutas son PROVISIONALES: se ajustan cuando el equipo de Spring Boot
// publique el contrato definitivo (OpenAPI).
export const peliculaServicioApi = {
  listar: () => clienteHttp.obtener('/peliculas'),
  buscarPorId: (id) => clienteHttp.obtener(`/peliculas/${id}`),
};
