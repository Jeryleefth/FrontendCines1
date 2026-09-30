import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

// Estructura común a todas las pantallas: la barra arriba y, debajo,
// la página que corresponda a la URL (<Outlet /> es ese "hueco").
export default function Layout({ enlaces }) {
  return (
    <>
      <Navbar enlaces={enlaces} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
