import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexto/AuthContext';
import { useClienteAuth } from '../../clientes/contexto/ClienteAuthContext';

// Se usa como elemento "envoltorio" de una ruta en App.jsx (ver ahí). Si hay
// sesión, deja pasar con <Outlet /> (el hueco donde React Router dibuja la
// ruta hija real, por ejemplo <PanelAdmin />). Si no hay sesión, redirige a
// /ingresar y le avisa a dónde quería ir, para volver justo ahí después de
// iniciar sesión en vez de mandarlo siempre a la misma pantalla fija.
//
// Es la MISMA puerta (/ingresar) a la que manda RutaProtegidaCliente: ya no
// hay una pantalla de login aparte para administración — Acceso.jsx prueba
// las credenciales como admin y, si no corresponden, como cliente (ver ese
// archivo).
export default function RutaProtegida() {
  const { estaAutenticado } = useAuth();
  const { estaAutenticado: clienteAutenticado } = useClienteAuth();
  const ubicacion = useLocation();

  // Un cliente no puede entrar al panel incluso si el navegador conserva
  // por error una sesión vieja de administrador.
  if (!estaAutenticado || clienteAutenticado) {
    return <Navigate to="/ingresar" replace state={{ desde: ubicacion.pathname }} />;
  }

  return <Outlet />;
}
