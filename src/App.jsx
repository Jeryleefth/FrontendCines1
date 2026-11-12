import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './compartido/componentes/Layout';
import { ENLACES_NAVEGACION } from './configuracion/navegacion';
import { ClienteAuthProvider } from './modulos/clientes/contexto/ClienteAuthContext';
import RutaProtegidaCliente from './modulos/clientes/componentes/RutaProtegidaCliente';
import Acceso from './modulos/clientes/paginas/Acceso';
import MisReservas from './modulos/clientes/paginas/MisReservas';
import Perfil from './modulos/clientes/paginas/Perfil';
import Cartelera from './modulos/publico/paginas/Cartelera';
import Comparador from './modulos/publico/paginas/Comparador';
import SeleccionAsientos from './modulos/publico/paginas/SeleccionAsientos';
import Pago from './modulos/publico/paginas/Pago';

// Tabla de rutas: qué componente se muestra para cada URL.
export default function App() {
  return (
    // ClienteAuthProvider envuelve TODA la app, por fuera de las rutas, para
    // que cualquier pantalla pueda preguntar "¿hay sesión iniciada?" con
    // useClienteAuth() sin pasar el dato como prop de componente en componente.
    <ClienteAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout enlaces={ENLACES_NAVEGACION} />}>
            <Route index element={<Cartelera />} />
            <Route path="comparador" element={<Comparador />} />
            <Route path="comparador/:peliculaId" element={<Comparador />} />
            <Route path="funcion/:funcionId/asientos" element={<SeleccionAsientos />} />
            <Route path="ingresar" element={<Acceso />} />
            <Route element={<RutaProtegidaCliente />}>
              <Route path="mis-reservas" element={<MisReservas />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="funcion/:funcionId/pago" element={<Pago />} />
            </Route>
            <Route path="*" element={<p className="mensaje-estado">La página que buscas no existe.</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ClienteAuthProvider>
  );
}
