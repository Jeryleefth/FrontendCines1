import { useState } from 'react';
import './TarjetaPelicula.css';

// Props:
//   pelicula        -> objeto con { titulo, rutaImagen, ... }
//   alHacerClick    -> función que se ejecuta al pulsar la tarjeta
//   alVerDetalles   -> función que se ejecuta al pulsar el botón "i"
export default function TarjetaPelicula({ pelicula, alHacerClick, alVerDetalles }) {
  // ESTADO: un valor que, al cambiar, hace que React vuelva a dibujar el componente.
  // useState devuelve [valorActual, funciónParaCambiarlo].
  const [imagenFallida, setImagenFallida] = useState(false);

  const hayImagen = pelicula.rutaImagen && !imagenFallida;

  return (
    <article className="tarjeta-pelicula">
      {/* Acción principal de la tarjeta */}
      <button
        type="button"
        className="tarjeta-pelicula__abrir"
        onClick={() => alHacerClick?.(pelicula)}
        aria-label={`Ver funciones de ${pelicula.titulo}`}
      >
        <span className="tarjeta-pelicula__imagen">
          {hayImagen ? (
            <img
              src={pelicula.rutaImagen}
              alt={`Póster de ${pelicula.titulo}`}
              loading="lazy"
              // Si la imagen no carga, cambiamos el estado y se muestra el recuadro gris
              onError={() => setImagenFallida(true)}
            />
          ) : null}
        </span>
        <span className="tarjeta-pelicula__titulo">{pelicula.titulo}</span>
      </button>


      <button
        type="button"
        className="tarjeta-pelicula__info"
        onClick={() => alVerDetalles?.(pelicula)}
        title="Ver detalles"
        aria-label={`Ver detalles de ${pelicula.titulo}`}
      >
        i
      </button>
    </article>
  );
}
