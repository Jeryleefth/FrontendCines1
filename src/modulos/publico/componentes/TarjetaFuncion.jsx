import { useNavigate } from 'react-router-dom';
import { IconBurbuja, IconChevronDerecha, IconReloj } from '../../../compartido/componentes/iconos';
import { formatearPrecio } from '../../../compartido/utilidades/formato';
import './TarjetaFuncion.css';

// Tarjeta "hoja": no recibe children, solo pinta un objeto Funcion (ver
// servicios/tipos.js). Al tocarla, navega a la selección de asientos de
// ESTA función — por eso le basta con conocer `funcion.id`, no hace falta
// que nadie le pase una función `onClick` desde afuera.
export default function TarjetaFuncion({ funcion }) {
  const navegar = useNavigate();

  return (
    <button
      type="button"
      className="tarjeta-funcion"
      onClick={() => navegar(`/funcion/${funcion.id}/asientos`)}
    >
      <span className="tarjeta-funcion__icono">
        <IconReloj />
      </span>

      <span className="tarjeta-funcion__datos">
        <span className="tarjeta-funcion__fila">
          <span className="tarjeta-funcion__hora">{funcion.horaInicio}</span>
          <span className="tarjeta-funcion__formato">{funcion.formato}</span>
        </span>
        <span className="tarjeta-funcion__tipo">
          <IconBurbuja />
          {funcion.tipoFuncion}
        </span>
      </span>

      <span className="tarjeta-funcion__divisor" aria-hidden="true" />
      <span className="tarjeta-funcion__precio">{formatearPrecio(funcion.precio)}</span>
      <IconChevronDerecha className="tarjeta-funcion__flecha" />
    </button>
  );
}
