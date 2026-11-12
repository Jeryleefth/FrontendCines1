import { createContext, useContext, useState } from 'react';
import { clienteAuthServicio } from '../../../servicios';

const ClienteAuthContexto = createContext(null);

// La sesión se guarda en localStorage (no solo en memoria) para que al
// recargar la página, o volver mañana, el navegador "recuerde" que ya
// habías iniciado sesión.
const CLAVE_SESION_CLIENTE = 'cinematch_sesion_cliente';

function leerSesionGuardada() {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION_CLIENTE);
    return guardada ? JSON.parse(guardada) : null;
  } catch {
    return null;
  }
}

// El hook `useClienteAuth` (más abajo) existe para que los componentes no
// tengan que importar el contexto ni usar useContext directamente.
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
