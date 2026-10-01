import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  IconCandado,
  IconCorreo,
  IconFlechaDerecha,
  IconOjo,
  IconOjoCerrado,
  IconTelefono,
  IconUsuario,
} from '../../../compartido/componentes/iconos';
import { useAuth } from '../contexto/AuthContext';
import { useClienteAuth } from '../../clientes/contexto/ClienteAuthContext';
import './Acceso.css';

const VALORES_VACIOS = { identificador: '', nombre: '', correo: '', telefono: '', contrasena: '' };

// `ubicacion.state.desde` queda "pegado" a la URL /ingresar mientras no se
// navegue a otra: si el admin cierra sesión, RutaProtegida deja desde:
// '/admin' ahí aunque la persona después, SIN recargar, decida crear una
// cuenta de cliente en esa misma pantalla — sin este chequeo, terminaría
// mandada de vuelta a /admin (que rebota a /ingresar porque no es admin) en
// vez de a /mis-reservas. Por eso un `desde` solo se usa si es coherente
// con el rol que acaba de autenticarse.
const esRutaDeAdmin = (ruta) => ruta === '/admin' || Boolean(ruta?.startsWith('/admin/'));

// UNA sola puerta de acceso para TODA la aplicación: no existe un botón ni
// una ruta separada para "entrar como administrador". Al iniciar sesión se
// prueban las credenciales primero contra la cuenta de admin y, si no
// corresponden, contra las cuentas de cliente — quien entra con el correo
// del admin termina en el panel de administración, y cualquier otra
// persona con su cuenta de cliente termina en sus reservas. La persona que
// llena el formulario nunca elige "soy admin" o "soy cliente": eso lo
// decide, en silencio, cuál de las dos credenciales coincide.
//
// El campo de "Iniciar sesión" se llama `identificador` (no `correo`) por
// costumbre del código, pero en la pantalla pide un correo para los dos
// roles: admin y cliente inician sesión de la misma forma. El modo "Crear
// cuenta", en cambio, SOLO es para clientes — las cuentas de administrador
// no son de autoservicio.
export default function Acceso() {
  const ubicacion = useLocation();
  const navegar = useNavigate();

  const { iniciarSesion: iniciarSesionAdmin } = useAuth();
  const { iniciarSesion: iniciarSesionCliente, registrarse } = useClienteAuth();

  const [modo, setModo] = useState('ingresar'); // 'ingresar' | 'registrar'
  const [valores, setValores] = useState(VALORES_VACIOS);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo);
    setError(null);
    setValores(VALORES_VACIOS);
  };

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setValores((actual) => ({ ...actual, [name]: value }));
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    const desde = ubicacion.state?.desde;

    try {
      if (modo === 'registrar') {
        // Crear cuenta SIEMPRE es de cliente: no hace falta probar nada más.
        await registrarse(valores.nombre, valores.correo, valores.telefono, valores.contrasena);
        navegar(!esRutaDeAdmin(desde) && desde ? desde : '/mis-reservas', { replace: true });
        return;
      }

      // "Iniciar sesión": se prueba primero como admin. Si la cuenta de
      // admin rechaza esas credenciales, NO es necesariamente un error — es
      // la señal para intentarlas como cliente antes de rendirse. Solo si
      // las dos fallan se muestra un mensaje de error.
      try {
        await iniciarSesionAdmin(valores.identificador, valores.contrasena);
        navegar(esRutaDeAdmin(desde) ? desde : '/admin', { replace: true });
      } catch {
        await iniciarSesionCliente(valores.identificador, valores.contrasena);
        navegar(!esRutaDeAdmin(desde) && desde ? desde : '/mis-reservas', { replace: true });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };

  const titulo = modo === 'ingresar' ? 'Iniciar sesión' : 'Crear cuenta';
  const subtitulo =
    modo === 'ingresar'
      ? 'Accede a tu cuenta y sigue disfrutando de la mejor experiencia de cine.'
      : 'Crea tu cuenta para reservar tus funciones favoritas.';
  const textoBoton = enviando
    ? 'Un momento…'
    : modo === 'ingresar'
      ? 'Ingresar'
      : 'Crear cuenta';

  return (
    // La foto de fondo cubre TODA la pantalla (ver Acceso.css); la tarjeta
    // va centrada encima, "flotando" sobre ella gracias a su propia sombra
    // y fondo blanco opaco.
    <div className="acceso-pagina">
      <div className="acceso-pagina__formulario">
        <div className="acceso-tarjeta">
          <div className="acceso-tarjeta__icono">
            <IconCandado />
          </div>
          <h1 className="acceso-tarjeta__titulo">{titulo}</h1>
          <p className="acceso-tarjeta__subtitulo">{subtitulo}</p>

          <div className="acceso-tarjeta__pestanas" role="tablist" aria-label="Iniciar sesión o crear cuenta">
            <button
              type="button"
              role="tab"
              aria-selected={modo === 'ingresar'}
              className={
                modo === 'ingresar'
                  ? 'acceso-tarjeta__pestana acceso-tarjeta__pestana--activa'
                  : 'acceso-tarjeta__pestana'
              }
              onClick={() => cambiarModo('ingresar')}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={modo === 'registrar'}
              className={
                modo === 'registrar'
                  ? 'acceso-tarjeta__pestana acceso-tarjeta__pestana--activa'
                  : 'acceso-tarjeta__pestana'
              }
              onClick={() => cambiarModo('registrar')}
            >
              Crear cuenta
            </button>
          </div>

          <form className="acceso-tarjeta__formulario" onSubmit={manejarEnvio}>
            {modo === 'ingresar' ? (
              <label className="acceso-tarjeta__campo">
                <IconCorreo className="acceso-tarjeta__campo-icono" />
                <input
                  name="identificador"
                  type="email"
                  value={valores.identificador}
                  onChange={manejarCambio}
                  placeholder="Correo"
                  autoFocus
                  required
                />
              </label>
            ) : (
              <>
                <label className="acceso-tarjeta__campo">
                  <IconUsuario className="acceso-tarjeta__campo-icono" />
                  <input
                    name="nombre"
                    value={valores.nombre}
                    onChange={manejarCambio}
                    placeholder="Nombre"
                    autoFocus
                    required
                  />
                </label>

                <label className="acceso-tarjeta__campo">
                  <IconCorreo className="acceso-tarjeta__campo-icono" />
                  <input
                    name="correo"
                    type="email"
                    value={valores.correo}
                    onChange={manejarCambio}
                    placeholder="Correo"
                    required
                  />
                </label>

                <label className="acceso-tarjeta__campo">
                  <IconTelefono className="acceso-tarjeta__campo-icono" />
                  <input
                    name="telefono"
                    type="tel"
                    value={valores.telefono}
                    onChange={manejarCambio}
                    placeholder="Teléfono"
                    required
                  />
                </label>
              </>
            )}

            <label className="acceso-tarjeta__campo">
              <IconCandado className="acceso-tarjeta__campo-icono" />
              <input
                name="contrasena"
                type={mostrarContrasena ? 'text' : 'password'}
                value={valores.contrasena}
                onChange={manejarCambio}
                placeholder="Contraseña"
                minLength={modo === 'registrar' ? 4 : undefined}
                required
              />
              <button
                type="button"
                className="acceso-tarjeta__ojo"
                onClick={() => setMostrarContrasena((actual) => !actual)}
                aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarContrasena ? <IconOjoCerrado /> : <IconOjo />}
              </button>
            </label>

            {error && <p className="mensaje-estado mensaje-estado--error">{error}</p>}

            <button type="submit" className="acceso-tarjeta__enviar" disabled={enviando}>
              {textoBoton}
              <IconFlechaDerecha />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
