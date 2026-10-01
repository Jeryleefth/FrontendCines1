import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useClienteAuth } from '../contexto/ClienteAuthContext';

// Mismo mecanismo que RutaProtegida (la del panel de administración), pero
// mirando la sesión de CLIENTE y redirigiendo a /ingresar en vez de /login
// — son dos puertas distintas porque son dos tipos de sesión distintos.
export default function RutaProtegidaCliente() {
  const { estaAutenticado } = useClienteAuth();
  const ubicacion = useLocation();

  if (!estaAutenticado) {
    return <Navigate to="/ingresar" replace state={{ desde: ubicacion.pathname }} />;
  }

  return <Outlet />;
}
