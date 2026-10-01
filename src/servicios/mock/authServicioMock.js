import { simularLatencia } from './utilidades';

// Usuario y contraseña "sembrados" a mano, porque la Entrega 1 no tiene base
// de datos todavía. En la Entrega 2 esto se reemplaza por un login real
// contra Spring Boot (que valida contra la tabla de usuarios y devuelve un
// JWT) — el resto de la app nunca cambia porque siempre habla con
// `authServicio` (ver servicios/index.js), nunca con este archivo directamente.
//
// Se identifica por CORREO (no por un "usuario" aparte): así el formulario
// de acceso puede ser uno solo para admin y clientes (ver Acceso.jsx), sin
// un campo distinto según el rol.
const USUARIO_ADMIN = {
  correo: 'admin@cinematch.com',
  contrasena: 'admin123',
  nombre: 'Administrador',
};

export const authServicioMock = {
  /**
   * @returns {Promise<{token: string, nombre: string, correo: string}>}
   */
  async login(correo, contrasena) {
    if (correo !== USUARIO_ADMIN.correo || contrasena !== USUARIO_ADMIN.contrasena) {
      throw new Error('Correo o contraseña incorrectos.');
    }
    // "token-simulado" hace las veces del JWT que devolverá Spring Boot más
    // adelante. Nada en el resto de la app lee su contenido, así que para
    // la Entrega 1 un string cualquiera cumple el mismo papel.
    return simularLatencia({ token: 'token-simulado', nombre: USUARIO_ADMIN.nombre, correo: USUARIO_ADMIN.correo });
  },

  /**
   * Edita el perfil del administrador (nombre y, opcionalmente,
   * contraseña). El correo no se edita aquí — es la cuenta con la que se
   * identifica el rol de admin, igual que para un cliente (ver
   * clienteAuthServicioMock.actualizar, mismo patrón).
   * @returns {Promise<{token: string, nombre: string, correo: string}>}
   */
  async actualizar(correo, { nombre, contrasenaActual, contrasenaNueva }) {
    if (correo !== USUARIO_ADMIN.correo) {
      throw new Error('No se encontró la cuenta.');
    }
    if (contrasenaActual !== USUARIO_ADMIN.contrasena) {
      throw new Error('La contraseña actual no es correcta.');
    }
    USUARIO_ADMIN.nombre = nombre;
    if (contrasenaNueva) {
      USUARIO_ADMIN.contrasena = contrasenaNueva;
    }
    return simularLatencia({ token: 'token-simulado', nombre: USUARIO_ADMIN.nombre, correo: USUARIO_ADMIN.correo });
  },
};
