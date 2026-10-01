import { useState } from 'react';
import Boton from '../../../compartido/componentes/Boton';
import './FormularioFuncion.css';

const TIPOS_FUNCION = ['Doblada', 'Subtitulada', 'Original'];

const VALORES_VACIOS = {
  peliculaId: '',
  cineId: '',
  salaId: '',
  tipoFuncion: 'Doblada',
  formato: '',
  fecha: '',
  horaInicio: '',
  horaFin: '',
  precio: '',
};

// El formulario recibe `funcionInicial` con la forma que devuelve el
// servicio (cine y sala ya resueltos como objetos, para mostrarlos en la
// tabla), pero sus <select> necesitan los IDS planos (cineId, salaId) para
// marcar la opción correcta. Esta función hace esa conversión una sola vez,
// al abrir el formulario.
function aplanar(funcion) {
  if (!funcion) return VALORES_VACIOS;
  return {
    peliculaId: funcion.peliculaId,
    cineId: funcion.cine.id,
    salaId: funcion.sala.id,
    tipoFuncion: funcion.tipoFuncion,
    formato: funcion.formato,
    fecha: funcion.fecha,
    horaInicio: funcion.horaInicio,
    horaFin: funcion.horaFin,
    precio: funcion.precio,
  };
}

export default function FormularioFuncion({ funcionInicial, peliculas, cines, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(() => aplanar(funcionInicial));
  const [guardando, setGuardando] = useState(false);

  const cineSeleccionado = cines.find((cine) => cine.id === valores.cineId);
  const salasDisponibles = cineSeleccionado?.salas ?? [];

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setValores((actual) => ({ ...actual, [name]: value }));
  };

  // Cambiar de cine invalida la sala que estuviera elegida (es de OTRO
  // cine), así que se limpia salaId y formato en el mismo cambio en vez de
  // dejar seleccionada una sala que ya no aparece en la lista.
  const cambiarCine = (evento) => {
    const cineId = evento.target.value;
    setValores((actual) => ({ ...actual, cineId, salaId: '', formato: '' }));
  };

  // El formato de la función es el mismo tipo de la sala (2D/3D/VIP) — no
  // tiene sentido vender un puesto "VIP" en una sala "2D". Por eso no es un
  // campo que el usuario llene aparte: se copia solo al elegir la sala.
  const cambiarSala = (evento) => {
    const salaId = evento.target.value;
    const sala = salasDisponibles.find((s) => s.id === salaId);
    setValores((actual) => ({ ...actual, salaId, formato: sala?.tipo ?? '' }));
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    try {
      await onGuardar({ ...valores, precio: Number(valores.precio) || 0 });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="formulario-funcion" onSubmit={manejarEnvio}>
      <div className="formulario-funcion__fila">
        <div className="formulario-funcion__campo">
          <label htmlFor="peliculaId">Película</label>
          <select id="peliculaId" name="peliculaId" value={valores.peliculaId} onChange={manejarCambio} required>
            <option value="" disabled>
              Selecciona una película
            </option>
            {peliculas.map((pelicula) => (
              <option key={pelicula.id} value={pelicula.id}>
                {pelicula.titulo}
              </option>
            ))}
          </select>
        </div>
        <div className="formulario-funcion__campo">
          <label htmlFor="tipoFuncion">Tipo</label>
          <select id="tipoFuncion" name="tipoFuncion" value={valores.tipoFuncion} onChange={manejarCambio}>
            {TIPOS_FUNCION.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="formulario-funcion__fila">
        <div className="formulario-funcion__campo">
          <label htmlFor="cineId">Cine</label>
          <select id="cineId" name="cineId" value={valores.cineId} onChange={cambiarCine} required>
            <option value="" disabled>
              Selecciona un cine
            </option>
            {cines.map((cine) => (
              <option key={cine.id} value={cine.id}>
                {cine.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="formulario-funcion__campo">
          <label htmlFor="salaId">Sala</label>
          <select
            id="salaId"
            name="salaId"
            value={valores.salaId}
            onChange={cambiarSala}
            disabled={!valores.cineId}
            required
          >
            <option value="" disabled>
              {valores.cineId ? 'Selecciona una sala' : 'Primero elige un cine'}
            </option>
            {salasDisponibles.map((sala) => (
              <option key={sala.id} value={sala.id}>
                {sala.nombre} · {sala.tipo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="formulario-funcion__fila">
        <div className="formulario-funcion__campo">
          <label htmlFor="fecha">Fecha</label>
          <input id="fecha" name="fecha" type="date" value={valores.fecha} onChange={manejarCambio} required />
        </div>
        <div className="formulario-funcion__campo">
          <label htmlFor="horaInicio">Hora de inicio</label>
          <input
            id="horaInicio"
            name="horaInicio"
            type="time"
            value={valores.horaInicio}
            onChange={manejarCambio}
            required
          />
        </div>
        <div className="formulario-funcion__campo">
          <label htmlFor="horaFin">Hora de fin</label>
          <input
            id="horaFin"
            name="horaFin"
            type="time"
            value={valores.horaFin}
            onChange={manejarCambio}
            required
          />
        </div>
      </div>

      <div className="formulario-funcion__fila">
        <div className="formulario-funcion__campo">
          <label htmlFor="precio">Precio (COP)</label>
          <input
            id="precio"
            name="precio"
            type="number"
            min="0"
            step="500"
            value={valores.precio}
            onChange={manejarCambio}
            required
          />
        </div>
        <div className="formulario-funcion__campo">
          <span className="formulario-funcion__etiqueta">Formato</span>
          <p className="formulario-funcion__formato">
            {valores.formato || 'Se completa al elegir la sala'}
          </p>
        </div>
      </div>

      <div className="formulario-funcion__acciones">
        <Boton variante="secundario" type="button" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </Boton>
        <Boton type="submit" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </Boton>
      </div>
    </form>
  );
}
