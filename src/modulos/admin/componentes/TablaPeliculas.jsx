import { useState } from 'react';
import Boton from '../../../compartido/componentes/Boton';
import { formatearFecha } from '../../../compartido/utilidades/formato';
import './TablaPeliculas.css';

// Confirmación de borrado EN LA MISMA fila, en vez de un confirm() nativo
// del navegador: `confirmandoId` guarda el id de la fila que está pidiendo
// confirmación (o null si ninguna). Al pulsar "Eliminar" en una fila, esa
// fila cambia sus botones por "¿Eliminar? Sí / No" — las demás no se tocan.
export default function TablaPeliculas({ peliculas, onEditar, onEliminar }) {
  const [confirmandoId, setConfirmandoId] = useState(null);

  if (peliculas.length === 0) {
    return <p className="mensaje-estado">Todavía no hay películas cargadas.</p>;
  }

  return (
    <div className="tabla-peliculas__envoltorio">
      <table className="tabla-peliculas">
        <thead>
          <tr>
            <th>Título</th>
            <th>Género</th>
            <th>Duración</th>
            <th>Clasificación</th>
            <th>Estreno</th>
            <th aria-label="Acciones" />
          </tr>
        </thead>
        <tbody>
          {peliculas.map((pelicula) => (
            <tr key={pelicula.id}>
              <td>{pelicula.titulo}</td>
              <td>{pelicula.genero}</td>
              <td>{pelicula.duracion} min</td>
              <td>{pelicula.clasificacion || '—'}</td>
              <td>{pelicula.fechaEstreno ? formatearFecha(pelicula.fechaEstreno) : '—'}</td>
              <td className="tabla-peliculas__acciones">
                {confirmandoId === pelicula.id ? (
                  <>
                    <span className="tabla-peliculas__pregunta">¿Eliminar?</span>
                    <Boton
                      variante="peligro"
                      onClick={() => {
                        setConfirmandoId(null);
                        onEliminar(pelicula.id);
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
                    <Boton variante="secundario" onClick={() => onEditar(pelicula)}>
                      Editar
                    </Boton>
                    <Boton variante="peligro" onClick={() => setConfirmandoId(pelicula.id)}>
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
