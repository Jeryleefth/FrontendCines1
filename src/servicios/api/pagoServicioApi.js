import { clienteHttp } from '../clienteHttp';

// Spring recibe esta solicitud y la entrega al microservicio Django de pagos.
export const pagoServicioApi = {
  crear: (datos) => clienteHttp.crear('/pagos', datos),
};
