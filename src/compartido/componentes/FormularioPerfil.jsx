import { useState } from 'react';
import { IconCandado, IconCorreo, IconOjo, IconOjoCerrado, IconTelefono, IconUsuario } from './iconos';
import './FormularioPerfil.css';

// Formulario de "editar mis datos", compartido entre el cliente
// (Perfil.jsx) y el administrador (dentro de PanelAdmin.jsx): las dos
// pantallas editan lo mismo (nombre y, si quieren, contraseña) de la misma
// forma, así que viven en un solo componente en vez de duplicar el
// formulario dos veces. `mostrarTelefono` es la única diferencia real: el
// cliente tiene teléfono (se pide al registrarse) y el administrador no.
//
// El correo SIEMPRE llega fijo por prop, nunca editable: es la llave con la
// que se identifica la cuenta (y, para clientes, con la que
// reservaServicio.listarPorCliente encuentra sus reservas), así que
// cambiarlo rompería esa relación — ver clienteAuthServicioMock.js.
export default function FormularioPerfil({
  correo,
  nombreInicial,
  telefonoInicial = '',
  mostrarTelefono = false,
  onGuardar,
}) {
  const [nombre, setNombre] = useState(nombreInicial);
  const [telefono, setTelefono] = useState(telefonoInicial);
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setError(null);
    setExito(false);
    setGuardando(true);
    try {
      await onGuardar({ nombre, telefono, contrasenaActual, contrasenaNueva });
      setExito(true);
      // La contraseña ACTUAL se vuelve a pedir en cada envío (no queda en
      // el formulario): si alguien deja esta pantalla abierta, no puede
      // reenviarse sin volver a escribirla. La nueva se limpia porque ya
      // quedó guardada.
      setContrasenaActual('');
      setContrasenaNueva('');
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="perfil-tarjeta">
      <form className="perfil-tarjeta__formulario" onSubmit={manejarEnvio}>
        {/* El ícono viaja JUNTO a la etiqueta (no dentro de la caja de
            texto) y la entrada es una simple línea, no una caja con borde
            completo — así cada campo ocupa una sola franja compacta en vez
            de "etiqueta arriba, caja abajo". */}
        <label className="perfil-tarjeta__campo">
          <span className="perfil-tarjeta__etiqueta">
            <IconUsuario className="perfil-tarjeta__campo-icono" />
            Nombre
          </span>
          <input
            className="perfil-tarjeta__entrada"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            required
          />
        </label>

        {mostrarTelefono && (
          <label className="perfil-tarjeta__campo">
            <span className="perfil-tarjeta__etiqueta">
              <IconTelefono className="perfil-tarjeta__campo-icono" />
              Teléfono
            </span>
            <input
              className="perfil-tarjeta__entrada"
              type="tel"
              value={telefono}
              onChange={(evento) => setTelefono(evento.target.value)}
              required
            />
          </label>
        )}

        {/* Deshabilitado, no solo de solo-lectura: así ni el teclado ni un
            intento de pegar texto lo tocan, y queda visualmente claro que
            no es un campo editable. */}
        <label className="perfil-tarjeta__campo">
          <span className="perfil-tarjeta__etiqueta">
            <IconCorreo className="perfil-tarjeta__campo-icono" />
            Correo
          </span>
          <input className="perfil-tarjeta__entrada perfil-tarjeta__entrada--deshabilitada" value={correo} disabled />
        </label>
        <p className="perfil-tarjeta__ayuda">El correo no se puede cambiar.</p>

        <hr className="perfil-tarjeta__separador" />

        <label className="perfil-tarjeta__campo">
          <span className="perfil-tarjeta__etiqueta">
            <IconCandado className="perfil-tarjeta__campo-icono" />
            Contraseña actual
          </span>
          {/* Acá la línea va en este contenedor (no en el <input>): el ojo
              de mostrar/ocultar necesita compartir la misma franja. */}
          <span className="perfil-tarjeta__entrada perfil-tarjeta__entrada--con-boton">
            <input
              type={mostrarActual ? 'text' : 'password'}
              value={contrasenaActual}
              onChange={(evento) => setContrasenaActual(evento.target.value)}
              placeholder="Necesaria para guardar cualquier cambio"
              required
            />
            <button
              type="button"
              className="perfil-tarjeta__ojo"
              onClick={() => setMostrarActual((actual) => !actual)}
              aria-label={mostrarActual ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {mostrarActual ? <IconOjoCerrado /> : <IconOjo />}
            </button>
          </span>
        </label>

        <label className="perfil-tarjeta__campo">
          <span className="perfil-tarjeta__etiqueta">
            <IconCandado className="perfil-tarjeta__campo-icono" />
            Contraseña nueva (opcional)
          </span>
          <span className="perfil-tarjeta__entrada perfil-tarjeta__entrada--con-boton">
            <input
              type={mostrarNueva ? 'text' : 'password'}
              value={contrasenaNueva}
              onChange={(evento) => setContrasenaNueva(evento.target.value)}
              placeholder="Déjalo vacío para no cambiarla"
              minLength={4}
            />
            <button
              type="button"
              className="perfil-tarjeta__ojo"
              onClick={() => setMostrarNueva((actual) => !actual)}
              aria-label={mostrarNueva ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {mostrarNueva ? <IconOjoCerrado /> : <IconOjo />}
            </button>
          </span>
        </label>

        {error && <p className="mensaje-estado mensaje-estado--error">{error}</p>}
        {exito && <p className="perfil-tarjeta__exito">Los cambios se guardaron correctamente.</p>}

        <button type="submit" className="perfil-tarjeta__enviar" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
