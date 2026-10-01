import { createContext, useContext, useState } from 'react';
import { clienteAuthServicio } from '../../../servicios';

const ClienteAuthContexto = createContext(null);

// Clave DISTINTA a la del admin ('cinematch_sesion') a propósito: son dos
// sesiones independientes. Se puede estar como cliente con reservas hechas
// Y, en otra pestaña, como administrador — una no reemplaza a la otra.
const CLAVE_SESION_CLIENTE = 'cinematch_sesion_cliente';

function leerSesionGuardada() {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION_CLIENTE);
    return guardada ? JSON.parse(guardada) : null;
  } catch {
    return null;
  }
}

// Mismo patrón que AuthContext (el de administración): ver ese archivo para
// la explicación completa de por qué la sesión vive en localStorage y por
// qué existe el hook `useClienteAuth` en vez de usar useContext directo.
export function ClienteAuthProvider({ children }) {
  const [cliente, setCliente] = useState(leerSesionGuardada);

  const guardarSesion = (datos) => {
    setCliente(datos);
    localStorage.setItem(CLAVE_SESION_CLIENTE, JSON.stringify(datos));
  };

  const iniciarSesion = async (correo, contrasena) => {
    const datos = await clienteAuthServicio.login(correo, contrasena);
    guardarSesion(datos);
  };

  const registrarse = async (nombre, correo, telefono, contrasena) => {
    const datos = await clienteAuthServicio.registrar({ nombre, correo, telefono, contrasena });
    guardarSesion(datos);
  };

  // El correo no se edita (ver Perfil.jsx y clienteAuthServicioMock para el
  // porqué), así que siempre se manda el de la sesión actual, no uno nuevo.
  const actualizarPerfil = async ({ nombre, telefono, contrasenaActual, contrasenaNueva }) => {
    const datos = await clienteAuthServicio.actualizar(cliente.correo, {
      nombre,
      telefono,
      contrasenaActual,
      contrasenaNueva,
    });
    guardarSesion(datos);
  };

  const cerrarSesion = () => {
    setCliente(null);
    localStorage.removeItem(CLAVE_SESION_CLIENTE);
  };

  const valor = {
    cliente,
    estaAutenticado: Boolean(cliente),
    iniciarSesion,
    registrarse,
    actualizarPerfil,
    cerrarSesion,
  };

  return <ClienteAuthContexto.Provider value={valor}>{children}</ClienteAuthContexto.Provider>;
}

export function useClienteAuth() {
  const contexto = useContext(ClienteAuthContexto);
  if (!contexto) {
    throw new Error('useClienteAuth debe usarse dentro de <ClienteAuthProvider>.');
  }
  return contexto;
}
