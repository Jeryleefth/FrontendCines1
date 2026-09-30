import { NavLink } from 'react-router-dom';
import './Navbar.css';

// COMPONENTE: una función que recibe "props" (sus datos de entrada) y devuelve
// Aquí la única prop es `enlaces`.
export default function Navbar({ enlaces }) {
  return (
    <header className="navbar">
      <div className="navbar__contenido">
        <NavLink to="/" className="navbar__marca" aria-label="CineMatch, ir a la cartelera">
          <span className="navbar__logo" aria-hidden="true">CM</span>
          <span>
            <span className="navbar__nombre">CineMatch</span>
            <span className="navbar__lema">Encuentra tu función ideal</span>
          </span>
        </NavLink>

        <nav aria-label="Principal">
          <ul className="navbar__enlaces">
            {/* .map convierte cada objeto del arreglo en un <li>.
                `key` ayuda a React a identificar cada elemento de la lista. */}
            {enlaces.map((enlace) => (
              <li key={enlace.ruta}>
                {/* NavLink añade la clase "activo" cuando la URL coincide */}
                <NavLink
                  to={enlace.ruta}
                  end={enlace.exacto}
                  className={({ isActive }) =>
                    isActive ? 'navbar__enlace navbar__enlace--activo' : 'navbar__enlace'
                  }
                >
                  {enlace.texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
