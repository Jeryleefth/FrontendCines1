import { useEffect } from 'react';
import Boton from '../../../compartido/componentes/Boton';
import { formatearFecha } from '../../../compartido/utilidades/formato';
import './DetallePeliculaModal.css';


export default function DetallePeliculaModal({ pelicula, alCerrar }) {
  // La función que devolvemos es la LIMPIEZA: se ejecuta al cerrar el modal
  // para no dejar el listener activo.
  useEffect(() => {
    function alPresionarTecla(evento) {
      if (evento.key === 'Escape') alCerrar();
    }
    document.addEventListener('keydown', alPresionarTecla);
    return () => document.removeEventListener('keydown', alPresionarTecla);
  }, [alCerrar]);

  return (
    <div className="modal-fondo" onClick={alCerrar}>
      {/* stopPropagation: un clic dentro del cuadro no debe cerrar el modal */}
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="modal__contenido">
          <img className="modal__imagen" src={pelicula.rutaImagen} alt={`Póster de ${pelicula.titulo}`} />

          <div className="modal__info">
            <h2 id="modal-titulo" className="modal__titulo">{pelicula.titulo}</h2>
            <p className="modal__ficha">
              {pelicula.genero} · {pelicula.duracion} min · {pelicula.clasificacion}
              <br />
              Idioma: {pelicula.idioma}
              <br />
              Estreno: {formatearFecha(pelicula.fechaEstreno)}
            </p>
            <h3 className="modal__subtitulo">Sinopsis</h3>
            <p className="modal__sinopsis">{pelicula.sinopsis || 'Sin sinopsis disponible.'}</p>
          </div>
        </div>

        <div className="modal__pie">
          <Boton variante="secundario" onClick={alCerrar}>Cerrar</Boton>
        </div>
      </div>
    </div>
  );
}
