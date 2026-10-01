import { IconCalendario, IconReloj, IconTicket } from '../../../compartido/componentes/iconos';
import './TarjetaCine.css';

const formatoMoneda = (valor) =>
  valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

// COMPOSICIÓN CON `children`: este componente no sabe nada de "funciones" ni
// de cómo dibujarlas. Solo dibuja el encabezado del cine (poster, nombre,
// insignias, precio) y deja un hueco — `children` — donde se acomoda lo que
// quien lo use le pase por dentro de las etiquetas:
//
//   <TarjetaCine cine={...} pelicula={...} precioDesde={...}>
//     <TarjetaFuncion .../>
//     <TarjetaFuncion .../>
//   </TarjetaCine>
export default function TarjetaCine({ cine, pelicula, formatos, precioDesde, esElMasBarato, children }) {
  return (
    <article className="tarjeta-cine">
      <header className="tarjeta-cine__cabecera">
        {pelicula?.rutaImagen && (
          <img
            className="tarjeta-cine__miniatura"
            src={pelicula.rutaImagen}
            alt=""
            aria-hidden="true"
          />
        )}

        <div className="tarjeta-cine__info">
          <p className="tarjeta-cine__cadena">{cine.cadena}</p>
          <h3 className="tarjeta-cine__nombre">{cine.nombre}</h3>

          <div className="tarjeta-cine__insignias">
            {pelicula?.clasificacion && (
              <span className="tarjeta-cine__insignia tarjeta-cine__insignia--borde">
                {pelicula.clasificacion}
              </span>
            )}
            {pelicula?.duracion && (
              <span className="tarjeta-cine__insignia tarjeta-cine__insignia--texto">
                <IconReloj className="tarjeta-cine__insignia-icono" />
                {pelicula.duracion} min
              </span>
            )}
            {formatos?.length > 0 && (
              <span className="tarjeta-cine__insignia tarjeta-cine__insignia--texto">
                {formatos.join(' / ')}
              </span>
            )}
          </div>
        </div>

        <div className="tarjeta-cine__precio">
          <IconTicket className="tarjeta-cine__precio-icono" />
          <div className="tarjeta-cine__precio-texto">
            {esElMasBarato && <span className="tarjeta-cine__etiqueta">Más barato</span>}
            <span className="tarjeta-cine__desde">Desde</span>
            <span className="tarjeta-cine__monto">{formatoMoneda(precioDesde)}</span>
          </div>
        </div>
      </header>

      <div className="tarjeta-cine__cuerpo">
        <div className="tarjeta-cine__seccion">
          <IconCalendario className="tarjeta-cine__seccion-icono" />
          <span>Funciones</span>
          <span className="tarjeta-cine__linea" aria-hidden="true" />
        </div>

        <div className="tarjeta-cine__funciones">{children}</div>
      </div>
    </article>
  );
}
