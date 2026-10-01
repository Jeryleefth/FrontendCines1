import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './compartido/componentes/Layout';
import { ENLACES_NAVEGACION } from './configuracion/navegacion';
import Cartelera from './modulos/publico/paginas/Cartelera';
import Comparador from './modulos/publico/paginas/Comparador';
import SeleccionAsientos from './modulos/publico/paginas/SeleccionAsientos';
import PanelAdmin from './modulos/admin/paginas/PanelAdmin';

// Tabla de rutas: qué componente se muestra para cada URL.

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout enlaces={ENLACES_NAVEGACION} />}>
          <Route index element={<Cartelera />} />
          <Route path="comparador" element={<Comparador />} />
          <Route path="comparador/:peliculaId" element={<Comparador />} />
          <Route path="funcion/:funcionId/asientos" element={<SeleccionAsientos />} />
          <Route path="admin" element={<PanelAdmin />} />
          <Route
            path="*"
            element={<p className="mensaje-estado">La página que buscas no existe.</p>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
