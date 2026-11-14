import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  IconCandado,
  IconCorreo,
  IconOjo,
  IconOjoCerrado,
  IconTelefono,
  IconUsuario,
} from '../../../compartido/componentes/iconos';
import { useClienteAuth } from '../contexto/ClienteAuthContext';
import './Acceso.css';

const VALORES_VACIOS = { identificador: '', nombre: '', correo: '', telefono: '', contrasena: '' };

// Puerta de acceso del PORTAL DE CLIENTES: iniciar sesión o crear cuenta.
// Las cuentas de administrador ya no entran por aquí: el panel de
// administración es una aplicación aparte (FrontdCinesAdmin, en Angular), con
// su propio login.
//
// El campo de "Iniciar sesión" se llama `identificador` (no `correo`) por
// costumbre del código, pero en la pantalla pide un correo.
export default function Acceso() {
  const ubicacion = useLocation();
  const navegar = useNavigate();

  const { iniciarSesion, registrarse } = useClienteAuth();

  const [modo, setModo] = useState('ingresar'); // 'ingresar' | 'registrar'
  const [valores, setValores] = useState(VALORES_VACIOS);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  // El panel admin es otra aplicación. Se usa el host actual para que esto
  // funcione igual en localhost y cuando se abre desde la red Wi-Fi.
  const urlPanelAdministracion = `${window.location.protocol}//${window.location.hostname}:4200/ingresar`;

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
        await registrarse(valores.nombre, valores.correo, valores.telefono, valores.contrasena);
      } else {
        await iniciarSesion(valores.identificador, valores.contrasena);
      }
      // `desde` es la página a la que la persona quería ir antes de que
      // RutaProtegidaCliente la mandara aquí; si no hay, va a sus reservas.
      navegar(desde ?? '/mis-reservas', { replace: true });
    } catch (e) {
      // La API reconoce que las credenciales son correctas, pero que
      // pertenecen a un administrador. En vez de mostrar un error confuso en
      // el portal de clientes, se lleva a esa persona a su interfaz propia.
      if (modo === 'ingresar' && e.message === 'No tienes permisos para iniciar sesión en este módulo.') {
        window.location.assign(urlPanelAdministracion);
        return;
      }
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
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
