import { simularLatencia } from './utilidades';

// A diferencia de peliculas.json o cines.json, acá NO hay datos "semilla":
// los clientes se registran durante la sesión del navegador, así que el
// arreglo empieza vacío. Al recargar la página se pierden (no hay base de
// datos en la Entrega 1) — lo mismo que ya pasa con las películas o cines
// que se crean desde el panel de administración.
const clientesRegistrados = [];

export const clienteAuthServicioMock = {
  /**
   * @returns {Promise<{token: string, nombre: string, correo: string, telefono: string}>}
   */
  async registrar({ nombre, correo, telefono, contrasena }) {
    const yaExiste = clientesRegistrados.some((c) => c.correo === correo);
    if (yaExiste) {
      throw new Error('Ya existe una cuenta con ese correo.');
    }
    // OJO (nota para la clase, no para producción): esto guarda la
    // contraseña tal cual, en memoria del navegador — está bien para
    // simular el flujo, pero una API real nunca debe guardar contraseñas
    // en texto plano; las guarda con hash (ver bcrypt, por ejemplo).
    clientesRegistrados.push({ nombre, correo, telefono, contrasena });
    return simularLatencia({ token: 'token-cliente-simulado', nombre, correo, telefono });
  },

  /**
   * @returns {Promise<{token: string, nombre: string, correo: string, telefono: string}>}
   */
  async login(correo, contrasena) {
    const cliente = clientesRegistrados.find((c) => c.correo === correo);
    if (!cliente || cliente.contrasena !== contrasena) {
      throw new Error('Correo o contraseña incorrectos.');
    }
    return simularLatencia({
      token: 'token-cliente-simulado',
      nombre: cliente.nombre,
      correo,
      telefono: cliente.telefono,
    });
  },

  /**
   * Edita el perfil del cliente. El correo NUNCA se edita aquí a propósito:
   * es la llave con la que `reservaServicioMock` encuentra las reservas de
   * cada cliente (`correoCliente`), así que cambiarlo "desconectaría" sus
   * reservas ya hechas. Cambiar la contraseña es opcional (se deja vacía
   * `contrasenaNueva` si solo se quiere editar nombre/teléfono), pero
   * siempre exige la contraseña ACTUAL correcta — igual que cualquier
   * formulario de "editar perfil" real, para que no baste con tener la
   * sesión abierta en un computador ajeno para cambiarle la contraseña a
   * otra persona.
   * @returns {Promise<{token: string, nombre: string, correo: string, telefono: string}>}
   */
  async actualizar(correo, { nombre, telefono, contrasenaActual, contrasenaNueva }) {
    const cliente = clientesRegistrados.find((c) => c.correo === correo);
    if (!cliente) {
      throw new Error('No se encontró la cuenta.');
    }
    if (cliente.contrasena !== contrasenaActual) {
      throw new Error('La contraseña actual no es correcta.');
    }
    cliente.nombre = nombre;
    cliente.telefono = telefono;
    if (contrasenaNueva) {
      cliente.contrasena = contrasenaNueva;
    }
    return simularLatencia({
      token: 'token-cliente-simulado',
      nombre: cliente.nombre,
      correo,
      telefono: cliente.telefono,
    });
  },
};
