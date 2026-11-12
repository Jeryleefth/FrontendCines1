import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useClienteAuth } from '../contexto/ClienteAuthContext';

// Envoltorio de las rutas que exigen sesión de cliente. Si hay sesión, deja
// pasar con <Outlet /> (el hueco donde React Router dibuja la ruta hija). Si
// no, redirige a /ingresar y le avisa a dónde quería ir (`desde`), para
// volver justo ahí después de iniciar sesión.
export default function RutaProtegidaCliente() {
  const { estaAutenticado } = useClienteAuth();
  const ubicacion = useLocation();

  if (!estaAutenticado) {
    return <Navigate to="/ingresar" replace state={{ desde: ubicacion.pathname }} />;
  }

  return <Outlet />;
}
