import { useState } from 'react';
import Boton from '../../../compartido/componentes/Boton';
import './FormularioPelicula.css';

const VALORES_VACIOS = {
  titulo: '',
  sinopsis: '',
  duracion: '',
  genero: '',
  clasificacion: '',
  idioma: '',
  fechaEstreno: '',
  rutaImagen: '',
};

// FORMULARIO CONTROLADO: cada <input> no guarda su propio valor — lo lee de
// `valores` (useState) y, al escribir, dispara `manejarCambio`. Un solo
// manejador sirve para los 8 campos: identifica cuál cambió por su atributo
// `name` (`evento.target.name`), así no hay que escribir un `useState` y un
// `onChange` por cada campo del formulario.
export default function FormularioPelicula({ peliculaInicial, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(peliculaInicial ?? VALORES_VACIOS);
  const [guardando, setGuardando] = useState(false);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setValores((actual) => ({ ...actual, [name]: value }));
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    try {
      // `duracion` viaja como texto en el input; se convierte a número solo
      // al guardar, no en cada tecla (si no, borrar el campo para reescribir
      // sería incómodo: "" -> Number("") -> 0 en cada pulsación).
      await onGuardar({ ...valores, duracion: Number(valores.duracion) || 0 });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="formulario-pelicula" onSubmit={manejarEnvio}>
      <div className="formulario-pelicula__campo">
        <label htmlFor="titulo">Título</label>
        <input id="titulo" name="titulo" value={valores.titulo} onChange={manejarCambio} required />
      </div>

      <div className="formulario-pelicula__campo">
        <label htmlFor="sinopsis">Sinopsis</label>
        <textarea
          id="sinopsis"
          name="sinopsis"
          rows={3}
          value={valores.sinopsis}
          onChange={manejarCambio}
        />
      </div>

      <div className="formulario-pelicula__fila">
        <div className="formulario-pelicula__campo">
          <label htmlFor="genero">Género</label>
          <input id="genero" name="genero" value={valores.genero} onChange={manejarCambio} required />
        </div>
        <div className="formulario-pelicula__campo">
          <label htmlFor="duracion">Duración (min)</label>
          <input
            id="duracion"
            name="duracion"
            type="number"
            min="1"
            value={valores.duracion}
            onChange={manejarCambio}
            required
          />
        </div>
      </div>

      <div className="formulario-pelicula__fila">
        <div className="formulario-pelicula__campo">
          <label htmlFor="clasificacion">Clasificación</label>
          <input
            id="clasificacion"
            name="clasificacion"
            placeholder="PG-13"
            value={valores.clasificacion}
            onChange={manejarCambio}
          />
        </div>
        <div className="formulario-pelicula__campo">
          <label htmlFor="idioma">Idioma</label>
          <input id="idioma" name="idioma" value={valores.idioma} onChange={manejarCambio} />
        </div>
      </div>

      <div className="formulario-pelicula__fila">
        <div className="formulario-pelicula__campo">
          <label htmlFor="fechaEstreno">Fecha de estreno</label>
          <input
            id="fechaEstreno"
            name="fechaEstreno"
            type="date"
            value={valores.fechaEstreno}
            onChange={manejarCambio}
          />
        </div>
        <div className="formulario-pelicula__campo">
          <label htmlFor="rutaImagen">URL del póster</label>
          <input
            id="rutaImagen"
            name="rutaImagen"
            placeholder="https://…"
            value={valores.rutaImagen}
            onChange={manejarCambio}
          />
        </div>
      </div>

      <div className="formulario-pelicula__acciones">
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
