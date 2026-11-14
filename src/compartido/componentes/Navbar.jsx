import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useClienteAuth } from '../../modulos/clientes/contexto/ClienteAuthContext';
import ConfirmacionModal from './ConfirmacionModal';
import './Navbar.css';

// COMPONENTE: una función que recibe "props" (sus datos de entrada) y devuelve
// JSX. Aquí la única prop es `enlaces`.
export default function Navbar({ enlaces }) {
  // `useClienteAuth()` lee el contexto de sesión directamente, en vez de
  // recibirlo como prop desde Layout -> App: así, "¿hay sesión iniciada?" no
  // tiene que viajar por cada componente intermedio que no lo necesita.
  const { estaAutenticado, cerrarSesion } = useClienteAuth();
  const [confirmandoSalida, setConfirmandoSalida] = useState(false);
  // Conserva el host actual: en desarrollo puede ser localhost y por Wi-Fi
  // puede ser una IP local. El panel administrativo vive en el puerto 4200.
  const urlPanelAdministracion = `${window.location.protocol}//${window.location.hostname}:4200/ingresar`;

  const confirmarSalida = () => {
    cerrarSesion();
    setConfirmandoSalida(false);
  };

  // No se navega "a mano" después de cerrar sesión: si la persona estaba en
  // una página protegida (/mis-reservas, /perfil), RutaProtegidaCliente la
  // manda a /ingresar apenas `estaAutenticado` se vuelve falso. Si estaba en
  // una página pública, se queda ahí y solo cambian los enlaces del menú.
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
            <li>
              <a className="navbar__enlace" href={urlPanelAdministracion}>
                Administración
              </a>
            </li>
            {/* Con sesión: "Mis reservas", "Mi perfil" y "Cerrar sesión". */}
            {estaAutenticado && (
              <>
                <li>
                  <NavLink
                    to="/mis-reservas"
                    className={({ isActive }) =>
                      isActive ? 'navbar__enlace navbar__enlace--activo' : 'navbar__enlace'
                    }
                  >
                    Mis reservas
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/perfil"
                    className={({ isActive }) =>
                      isActive ? 'navbar__enlace navbar__enlace--activo' : 'navbar__enlace'
                    }
                  >
                    Mi perfil
                  </NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="navbar__enlace navbar__salir"
                    onClick={() => setConfirmandoSalida(true)}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}

            {/* "Login" solo se muestra si todavía no hay sesión iniciada. */}
            {!estaAutenticado && (
              <li>
                <NavLink
                  to="/ingresar"
                  className={({ isActive }) =>
                    isActive ? 'navbar__enlace navbar__enlace--activo' : 'navbar__enlace'
                  }
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {confirmandoSalida && (
        <ConfirmacionModal
          titulo="Cerrar sesión"
          mensaje="¿Seguro que quieres cerrar sesión?"
          textoConfirmar="Cerrar sesión"
          onConfirmar={confirmarSalida}
          onCancelar={() => setConfirmandoSalida(false)}
        />
      )}
    </header>
  );
}
