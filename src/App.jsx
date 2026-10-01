import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './compartido/componentes/Layout';
import { ENLACES_NAVEGACION } from './configuracion/navegacion';
import { AuthProvider } from './modulos/autenticacion/contexto/AuthContext';
import RutaProtegida from './modulos/autenticacion/componentes/RutaProtegida';
import Acceso from './modulos/autenticacion/paginas/Acceso';
import { ClienteAuthProvider } from './modulos/clientes/contexto/ClienteAuthContext';
import RutaProtegidaCliente from './modulos/clientes/componentes/RutaProtegidaCliente';
import MisReservas from './modulos/clientes/paginas/MisReservas';
import Perfil from './modulos/clientes/paginas/Perfil';
import Cartelera from './modulos/publico/paginas/Cartelera';
import Comparador from './modulos/publico/paginas/Comparador';
import SeleccionAsientos from './modulos/publico/paginas/SeleccionAsientos';
import PanelAdmin from './modulos/admin/paginas/PanelAdmin';

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
        <BrowserRouter>
          <Routes>
            <Route element={<Layout enlaces={ENLACES_NAVEGACION} />}>
              <Route index element={<Cartelera />} />
              <Route path="comparador" element={<Comparador />} />
              <Route path="comparador/:peliculaId" element={<Comparador />} />
              <Route path="funcion/:funcionId/asientos" element={<SeleccionAsientos />} />
              {/* UNA sola puerta para administración y clientes: Acceso.jsx
                  prueba las credenciales como admin y, si no corresponden,
                  como cliente (ver ese archivo). Por eso ya no hace falta
                  una ruta /login separada. */}
              <Route path="ingresar" element={<Acceso />} />

              {/* RutaProtegida es la "puerta" de administración: todo lo
                  que esté anidado adentro exige sesión de admin. */}
              <Route element={<RutaProtegida />}>
                <Route path="admin" element={<PanelAdmin />} />
              </Route>

              {/* RutaProtegidaCliente es la puerta equivalente, pero para
                  la sesión de cliente — una puerta distinta, porque son
                  sesiones distintas. */}
              <Route element={<RutaProtegidaCliente />}>
                <Route path="mis-reservas" element={<MisReservas />} />
                <Route path="perfil" element={<Perfil />} />
              </Route>

              <Route
                path="*"
                element={<p className="mensaje-estado">La página que buscas no existe.</p>}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ClienteAuthProvider>
    </AuthProvider>
  );
}
