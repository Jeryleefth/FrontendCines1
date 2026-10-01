import { createContext, useContext, useState } from 'react';
import { authServicio } from '../../../servicios';

const AuthContexto = createContext(null);

// La sesión se guarda en localStorage (no solo en memoria) para que al
// recargar la página, o volver mañana, el navegador "recuerde" que ya
// habías iniciado sesión — igual que hace cualquier app real.
const CLAVE_SESION = 'cinematch_sesion';

function leerSesionGuardada() {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION);
    return guardada ? JSON.parse(guardada) : null;
  } catch {
    // localStorage puede fallar (modo incógnito estricto, cuota llena…);
    // si pasa, simplemente se empieza sin sesión en vez de romper la app.
    return null;
  }
}

// `AuthProvider` envuelve toda la app (ver App.jsx) para que cualquier
// componente, en cualquier nivel, pueda saber si hay sesión iniciada con
// el hook `useAuth()` de abajo — sin tener que pasar esa información como
// prop de componente en componente.
export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesionGuardada);

  const guardarSesion = (datos) => {
    setSesion(datos);
    localStorage.setItem(CLAVE_SESION, JSON.stringify(datos));
  };

  const iniciarSesion = async (correo, contrasena) => {
    const datos = await authServicio.login(correo, contrasena);
    guardarSesion(datos);
  };

  // El correo no se edita (es la cuenta con la que se identifica el rol de
  // admin, igual que para un cliente — ver ClienteAuthContext.actualizarPerfil
  // para el mismo patrón), así que siempre se manda el de la sesión actual.
  const actualizarPerfil = async ({ nombre, contrasenaActual, contrasenaNueva }) => {
    const datos = await authServicio.actualizar(sesion.correo, {
      nombre,
      contrasenaActual,
      contrasenaNueva,
    });
    guardarSesion(datos);
  };

  const cerrarSesion = () => {
    setSesion(null);
    localStorage.removeItem(CLAVE_SESION);
  };

  const valor = {
    sesion,
    estaAutenticado: Boolean(sesion),
    iniciarSesion,
    actualizarPerfil,
    cerrarSesion,
  };

  return <AuthContexto.Provider value={valor}>{children}</AuthContexto.Provider>;
}

// Hook de conveniencia: en vez de que cada componente escriba
// `useContext(AuthContexto)` y tenga que importar AuthContexto directamente,
// importan este hook. También avisa con un error claro si alguien lo usa
// por fuera de <AuthProvider> (un olvido fácil de cometer).
export function useAuth() {
  const contexto = useContext(AuthContexto);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  }
  return contexto;
}
