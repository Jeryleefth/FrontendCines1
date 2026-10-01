import { IconBurbuja, IconChevronDerecha, IconReloj } from '../../../compartido/componentes/iconos';
import './TarjetaFuncion.css';

const formatoMoneda = (valor) =>
  valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

// Tarjeta "hoja": no recibe children, solo pinta un objeto Funcion (ver
// servicios/tipos.js). La flecha de la derecha queda lista para cuando se
// construya la selección de asientos (próximo paso del roadmap): por ahora
// es solo visual, todavía no navega a ningún lado.
export default function TarjetaFuncion({ funcion }) {
  return (
    <div className="tarjeta-funcion">
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
      <span className="tarjeta-funcion__precio">{formatoMoneda(funcion.precio)}</span>
      <IconChevronDerecha className="tarjeta-funcion__flecha" />
    </div>
  );
}
