import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './compartido/componentes/Layout';
import { ENLACES_NAVEGACION } from './configuracion/navegacion';
import { AuthProvider, useAuth } from './modulos/autenticacion/contexto/AuthContext';
import RutaProtegida from './modulos/autenticacion/componentes/RutaProtegida';
import Acceso from './modulos/autenticacion/paginas/Acceso';
import { ClienteAuthProvider, useClienteAuth } from './modulos/clientes/contexto/ClienteAuthContext';
import RutaProtegidaCliente from './modulos/clientes/componentes/RutaProtegidaCliente';
import MisReservas from './modulos/clientes/paginas/MisReservas';
import Perfil from './modulos/clientes/paginas/Perfil';
import Cartelera from './modulos/publico/paginas/Cartelera';
import Comparador from './modulos/publico/paginas/Comparador';
import SeleccionAsientos from './modulos/publico/paginas/SeleccionAsientos';
import Pago from './modulos/publico/paginas/Pago';
import PanelAdmin from './modulos/admin/paginas/PanelAdmin';

function ContenidoApp() {
  const { estaAutenticado: adminAutenticado, cerrarSesion: cerrarSesionAdmin } = useAuth();
  const { estaAutenticado: clienteAutenticado } = useClienteAuth();

  // Migración de seguridad: antes se permitía guardar ambos roles al mismo
  // tiempo. Si una versión anterior dejó ese estado en localStorage,
  // conservamos la sesión de cliente y eliminamos el acceso administrativo.
  useEffect(() => {
    if (adminAutenticado && clienteAutenticado) cerrarSesionAdmin();
  }, [adminAutenticado, clienteAutenticado, cerrarSesionAdmin]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout enlaces={ENLACES_NAVEGACION} />}>
          <Route index element={<Cartelera />} />
          <Route path="comparador" element={<Comparador />} />
          <Route path="comparador/:peliculaId" element={<Comparador />} />
          <Route path="funcion/:funcionId/asientos" element={<SeleccionAsientos />} />
          <Route path="ingresar" element={<Acceso />} />
          <Route element={<RutaProtegida />}>
            <Route path="admin" element={<PanelAdmin />} />
          </Route>
          <Route element={<RutaProtegidaCliente />}>
            <Route path="mis-reservas" element={<MisReservas />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="funcion/:funcionId/pago" element={<Pago />} />
          </Route>
          <Route path="*" element={<p className="mensaje-estado">La página que buscas no existe.</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Tabla de rutas: qué componente se muestra para cada URL.

export default function App() {
  return (
    // AuthProvider (sesión de administración) y ClienteAuthProvider (sesión
    // de cliente) envuelven TODA la app, por fuera de las rutas, para que
    // cualquier pantalla pueda preguntar "¿hay sesión iniciada?" con
    // useAuth() / useClienteAuth() — son dos sesiones independientes, así
    // que son dos providers separados, no uno compartido.
    <AuthProvider>
      <ClienteAuthProvider>
        <ContenidoApp />
      </ClienteAuthProvider>
    </AuthProvider>
  );
}
