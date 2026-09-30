import { useState } from 'react';
import './Banner.css';


export default function Banner({ titulo, subtitulo, imagenFondo, etiqueta }) {
  const [imagenFallida, setImagenFallida] = useState(false);
  const hayImagen = imagenFondo && !imagenFallida;
  const mostrarTexto = !hayImagen && Boolean(titulo || subtitulo);

  const clases = ['banner'];
  if (hayImagen) clases.push('banner--con-imagen');
  if (mostrarTexto) clases.push('banner--con-texto');

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

    </section>
  );
}
