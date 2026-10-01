import { clienteHttp } from '../clienteHttp';

export const clienteAuthServicioApi = {
  registrar: (datos) => clienteHttp.crear('/clientes/registro', datos),
  login: (correo, contrasena) => clienteHttp.crear('/clientes/login', { correo, contrasena }),
  // La API real identifica al cliente por su sesión (el token JWT), no por
  // un correo en la URL — por eso acá SÍ se manda `correo` en el cuerpo,
  // aunque el mock lo reciba como primer parámetro por fuera: es el mismo
  // ajuste que ya hace reservaServicioApi.listarPorCliente.
  actualizar: (correo, datos) => clienteHttp.actualizar('/clientes/perfil', { correo, ...datos }),
};
