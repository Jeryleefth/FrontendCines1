import Asiento from './Asiento';
import './MapaAsientos.css';

// Aquí la composición es de DATOS, no de `children` como en TarjetaCine:
// este componente recibe `filas` (un arreglo de objetos) y es él mismo
// quien decide cómo dibujar cada asiento. Tiene sentido al revés que en
// TarjetaCine porque las butacas son todas iguales entre sí — no hace falta
// que SeleccionAsientos arme cada una a mano, solo que le pase los datos.
export default function MapaAsientos({ filas, seleccionados, onSeleccionar }) {
  return (
    <div className="mapa-asientos">
      <div className="mapa-asientos__pantalla" aria-hidden="true" />
      <p className="mapa-asientos__etiqueta-pantalla">Pantalla</p>

      <div className="mapa-asientos__filas">
        {filas.map((fila) => (
          <div className="mapa-asientos__fila" key={fila.letra}>
            <span className="mapa-asientos__letra">{fila.letra}</span>
            <div className="mapa-asientos__asientos">
              {fila.asientos.map((asiento) => (
                <Asiento
                  key={asiento.id}
                  id={asiento.id}
                  ocupado={asiento.ocupado}
                  seleccionado={seleccionados.includes(asiento.id)}
                  onClick={onSeleccionar}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mapa-asientos__leyenda">
        <span className="mapa-asientos__item">
          <span className="mapa-asientos__muestra" /> Disponible
        </span>
        <span className="mapa-asientos__item">
          <span className="mapa-asientos__muestra mapa-asientos__muestra--seleccionado" /> Seleccionado
        </span>
        <span className="mapa-asientos__item">
          <span className="mapa-asientos__muestra mapa-asientos__muestra--ocupado" /> Ocupado
        </span>
      </div>
    </div>
  );
}
