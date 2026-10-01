import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../modulos/autenticacion/contexto/AuthContext';
import { useClienteAuth } from '../../modulos/clientes/contexto/ClienteAuthContext';
import ConfirmacionModal from './ConfirmacionModal';
import './Navbar.css';

// COMPONENTE: una función que recibe "props" (sus datos de entrada) y devuelve
// Aquí la única prop es `enlaces`.
export default function Navbar({ enlaces }) {
  // `useAuth()` lee el contexto de sesión directamente, en vez de recibirlo
  // como prop desde Layout -> App: así, "¿hay sesión iniciada?" no tiene que
  // viajar por cada componente intermedio que no lo necesita para nada más.
  // Son DOS sesiones independientes (admin y cliente), así que son DOS
  // hooks distintos — nunca se mezclan en un solo "¿hay alguien logueado?".
  const { estaAutenticado, cerrarSesion } = useAuth();
  const { estaAutenticado: clienteAutenticado, cerrarSesion: cerrarSesionCliente } = useClienteAuth();

  // Qué botón de "Cerrar sesión" se está confirmando, no SI hay sesión
  // iniciada: 'admin' | 'cliente' | null. Las dos sesiones son
  // independientes (ver comentario de arriba), así que un solo booleano no
  // alcanzaría para saber cuál de las dos hay que cerrar al confirmar.
  const [confirmandoSalida, setConfirmandoSalida] = useState(null);

  const confirmarSalida = () => {
    if (confirmandoSalida === 'admin') cerrarSesion();
    else if (confirmandoSalida === 'cliente') cerrarSesionCliente();
    setConfirmandoSalida(null);
  };

  // No se navega "a mano" después de cerrar sesión: si la persona estaba en
  // /admin, RutaProtegida ya se encarga de mandarla a /ingresar apenas
  // `estaAutenticado` se vuelve falso (ver RutaProtegida.jsx) — así no hay
  // dos redirecciones compitiendo por quién decide la URL final. Si estaba
  // en una página pública (cartelera, comparador…), no hace falta moverla
  // de ahí: solo desaparece el botón "Cerrar sesión" del menú.
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
            {/* "Administración" ya no es un enlace fijo del menú (ver
                navegacion.js): solo aparece cuando ya hay sesión de admin,
                como la puerta de vuelta al panel — a esa sesión se llega
                iniciando sesión con credenciales de admin en /ingresar, no
                eligiendo una opción "entrar como admin". */}
            {estaAutenticado && (
              <>
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      isActive ? 'navbar__enlace navbar__enlace--activo' : 'navbar__enlace'
                    }
                  >
                    Administración
                  </NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="navbar__enlace navbar__salir"
                    onClick={() => setConfirmandoSalida('admin')}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}

            {/* Enlaces de CLIENTE: "Mis reservas" + "Cerrar sesión" cuando
                hay sesión de cliente. Es independiente de la sesión de
                admin de arriba — las dos pueden coexistir. */}
            {clienteAutenticado && (
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
                    onClick={() => setConfirmandoSalida('cliente')}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}

            {/* "Login" es la ÚNICA puerta de entrada, para cualquiera de
                los dos roles: solo se muestra si no hay NINGUNA sesión
                iniciada todavía (ver Acceso.jsx para cómo decide el rol a
                partir de las credenciales). */}
            {!estaAutenticado && !clienteAutenticado && (
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
          onCancelar={() => setConfirmandoSalida(null)}
        />
      )}
    </header>
  );
}
