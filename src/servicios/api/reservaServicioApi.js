import { clienteHttp } from '../clienteHttp';

export const reservaServicioApi = {
  crear: (reserva) => clienteHttp.crear('/reservas', reserva),
  // En la API real, "¿de quién son estas reservas?" normalmente lo dice el
  // JWT del header de autenticación, no un parámetro en la URL — pero el
  // componente que llama a este servicio no necesita saber esa diferencia,
  // por eso la firma sigue aceptando `correoCliente` igual que el mock.
  listarPorCliente: (correoCliente) =>
    clienteHttp.obtener(`/clientes/${encodeURIComponent(correoCliente)}/reservas`),
};
