import { useState } from 'react';
import Boton from '../../../compartido/componentes/Boton';
import { formatearFecha, formatearPrecio } from '../../../compartido/utilidades/formato';
import './TablaFunciones.css';

// `peliculasPorId` llega del panel (ya tiene las películas cargadas para su
// propia pestaña) para no volver a pedirlas: una función solo trae
// `peliculaId`, así que hace falta ese mapa para mostrar el título.
export default function TablaFunciones({ funciones, peliculasPorId, onEditar, onEliminar }) {
  const [confirmandoId, setConfirmandoId] = useState(null);

  if (funciones.length === 0) {
    return <p className="mensaje-estado">Todavía no hay funciones programadas.</p>;
  }

  return (
    <div className="tabla-funciones__envoltorio">
      <table className="tabla-funciones">
        <thead>
          <tr>
            <th>Película</th>
            <th>Cine</th>
            <th>Sala</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Tipo</th>
            <th>Precio</th>
            <th aria-label="Acciones" />
          </tr>
        </thead>
        <tbody>
          {funciones.map((funcion) => (
            <tr key={funcion.id}>
              <td>{peliculasPorId.get(funcion.peliculaId)?.titulo ?? '—'}</td>
              <td>{funcion.cine.nombre}</td>
              <td>
                {funcion.sala.nombre} · {funcion.formato}
              </td>
              <td>{formatearFecha(funcion.fecha)}</td>
              <td>
                {funcion.horaInicio} – {funcion.horaFin}
              </td>
              <td>{funcion.tipoFuncion}</td>
              <td>{formatearPrecio(funcion.precio)}</td>
              <td className="tabla-funciones__acciones">
                {confirmandoId === funcion.id ? (
                  <>
                    <span className="tabla-funciones__pregunta">¿Eliminar?</span>
                    <Boton
                      variante="peligro"
                      onClick={() => {
                        setConfirmandoId(null);
                        onEliminar(funcion.id);
                      }}
                    >
                      Sí
                    </Boton>
                    <Boton variante="secundario" onClick={() => setConfirmandoId(null)}>
                      No
                    </Boton>
                  </>
                ) : (
                  <>
                    <Boton variante="secundario" onClick={() => onEditar(funcion)}>
                      Editar
                    </Boton>
                    <Boton variante="peligro" onClick={() => setConfirmandoId(funcion.id)}>
                      Eliminar
                    </Boton>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
