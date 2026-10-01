import { useState } from 'react';
import './Banner.css';


// superponerTexto: la imagen NO trae el título ya dibujado adentro (como sí
// pasa con encabezadoPeliculas.png), así que hay que escribirlo nosotros
// encima, con un velo oscuro para que se lea bien. Úsalo, por ejemplo,
// cuando `imagenFondo` es el póster de una película.
export default function Banner({ titulo, subtitulo, imagenFondo, etiqueta, superponerTexto = false }) {
  const [imagenFallida, setImagenFallida] = useState(false);
  const hayImagen = Boolean(imagenFondo) && !imagenFallida;
  // Se muestra texto si no hay imagen (fallback con degradado + palomitas),
  // o si hay imagen pero se pidió explícitamente superponerlo.
  const mostrarTexto = Boolean(titulo || subtitulo) && (!hayImagen || superponerTexto);

  const clases = ['banner'];
  if (hayImagen) clases.push('banner--con-imagen');
  if (mostrarTexto) clases.push('banner--con-texto');
  if (hayImagen && superponerTexto) clases.push('banner--imagen-difusa');

  return (
    <section className={clases.join(' ')} aria-label={hayImagen ? etiqueta : undefined}>
      {hayImagen && (
        <img
          className="banner__imagen"
          src={imagenFondo}
          alt=""
          aria-hidden="true"
          onError={() => setImagenFallida(true)}
        />
      )}

      {/* Palomitas decorativas: solo en el fallback "con texto" (degradado +
          título, cuando no hay imagen). Si tampoco hay texto todavía —por
          ejemplo mientras se están cargando los datos de la película— el
          banner se queda en un degradado liso, sin decoraciones que luego
          desaparezcan de golpe al llegar la imagen real. */}
      {!hayImagen && mostrarTexto && (
        <>
          <span className="banner__palomita banner__palomita--1" aria-hidden="true">🍿</span>
          <span className="banner__palomita banner__palomita--2" aria-hidden="true">🍿</span>
          <span className="banner__palomita banner__palomita--3" aria-hidden="true">🍿</span>
          <span className="banner__palomita banner__palomita--4" aria-hidden="true">🍿</span>
        </>
      )}

      {mostrarTexto && titulo && <h1 className="banner__titulo">{titulo}</h1>}
      {mostrarTexto && subtitulo && <p className="banner__subtitulo">{subtitulo}</p>}
    </section>
  );
}
