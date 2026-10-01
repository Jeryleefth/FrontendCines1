import { useState } from 'react';
import './Banner.css';


// superponerTexto: la imagen NO trae el título ya dibujado adentro (como sí
// pasa con encabezadoPeliculas.png), así que hay que escribirlo nosotros
// encima, con un velo oscuro para que se lea bien. Úsalo, por ejemplo,
// cuando `imagenFondo` es el póster de una película.
export default function Banner({
  titulo,
  subtitulo,
  imagenFondo,
  etiqueta,
  superponerTexto = false,
  forzarTexto = false,
  conVelo = true,
  subtituloAbajo = false,
}) {
  const [imagenFallida, setImagenFallida] = useState(false);
  const hayImagen = Boolean(imagenFondo) && !imagenFallida;
  // Tres usos de Banner, con reglas distintas para el texto:
  //
  // 1) Banner "cabecera simple" (PanelAdmin, Cartelera): no pide
  //    `superponerTexto` ni `forzarTexto`. Si no trae imagen, el título SÍ
  //    se dibuja sobre el degradado liso; si trae una imagen con el título
  //    ya dibujado adentro (encabezadoPeliculas.png, encabezadoAdmin.png),
  //    el título NO se repite por encima para no duplicarlo.
  //
  // 2) Banner que pide `superponerTexto` (Comparador, SeleccionAsientos):
  //    la imagen es el póster de la película, que nunca trae texto
  //    dibujado, así que el título se escribe encima con un velo oscuro —
  //    pero SOLO si la imagen de verdad cargó. Mientras no hay película
  //    elegida o la imagen falla, no hay nada que mostrar (así era antes:
  //    ni título, ni los emojis de palomita de relleno).
  //
  // 3) Banner que pide `forzarTexto` SIN `titulo` (MisReservas, Perfil): la
  //    imagen YA trae su propio título dibujado adentro ("MIS RESERVAS",
  //    "MI PERFIL"), igual que el caso 1 — pero el subtítulo ("Hola,
  //    {nombre}") sigue siendo dinámico, así que no puede venir horneado
  //    junto con él. Por eso esas pantallas no mandan `titulo` a este
  //    componente (solo `subtitulo`, con `forzarTexto` para que se muestre
  //    siempre, exista o no la foto) y además piden `conVelo={false}` (la
  //    foto ya se ve bien sin oscurecerla más) y `subtituloAbajo` (para que
  //    el "Hola, {nombre}" no caiga encima del título que ya trae la
  //    imagen).
  //
  // El caso 1 y el 2 son, en el fondo, una sola regla: el texto se dibuja
  // cuando `superponerTexto` y "hay imagen" COINCIDEN. `forzarTexto` es la
  // escotilla de escape para el caso 3, que no encaja en esa regla.
  const mostrarTexto = Boolean(titulo || subtitulo) && (forzarTexto || hayImagen === superponerTexto);

  const clases = ['banner'];
  if (hayImagen) clases.push('banner--con-imagen');
  if (mostrarTexto) clases.push('banner--con-texto');
  if (hayImagen && superponerTexto) clases.push('banner--imagen-difusa');
  // El velo oscuro ayuda a leer texto sobre una foto cualquiera, pero si la
  // imagen YA trae su propio título dibujado (ver `titulo` no se manda en
  // ese caso — ejemplo: Mis reservas) y solo falta superponer un subtítulo
  // dinámico, oscurecer toda la foto no hace falta y además la opaca de
  // más. `conVelo={false}` lo desactiva para ese caso.
  if (hayImagen && mostrarTexto && conVelo) clases.push('banner--con-velo');
  // Cuando el título ya viene dibujado en la imagen, el subtítulo dinámico
  // ("Hola, {nombre}") se corre hacia abajo para no chocar con ese título.
  if (subtituloAbajo) clases.push('banner--subtitulo-abajo');

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

      {mostrarTexto && titulo && <h1 className="banner__titulo">{titulo}</h1>}
      {mostrarTexto && subtitulo && <p className="banner__subtitulo">{subtitulo}</p>}
    </section>
  );
}
