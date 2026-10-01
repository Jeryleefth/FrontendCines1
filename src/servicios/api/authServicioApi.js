import { clienteHttp } from '../clienteHttp';

export const authServicioApi = {
  // Spring Boot deberá devolver { token, nombre, correo } con el mismo
  // formato que usa el mock, para que AuthContext no tenga que distinguir
  // de dónde vino.
  login: (correo, contrasena) => clienteHttp.crear('/auth/login', { correo, contrasena }),
  // Igual que clienteAuthServicioApi.actualizar: la API real identifica al
  // administrador por su sesión (el token JWT), pero acá se manda `correo`
  // en el cuerpo porque el mock lo recibe como primer parámetro por fuera.
  actualizar: (correo, datos) => clienteHttp.actualizar('/auth/perfil', { correo, ...datos }),
};
