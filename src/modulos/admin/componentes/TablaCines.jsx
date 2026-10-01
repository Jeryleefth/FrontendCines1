import { useState } from 'react';
import Boton from '../../../compartido/componentes/Boton';
import './TablaCines.css';

export default function TablaCines({ cines, onEditar, onEliminar }) {
  const [confirmandoId, setConfirmandoId] = useState(null);

  if (cines.length === 0) {
    return <p className="mensaje-estado">Todavía no hay cines registrados.</p>;
  }

  return (
    <div className="tabla-cines__envoltorio">
      <table className="tabla-cines">
        <thead>
          <tr>
            <th>Cadena</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Salas</th>
            <th aria-label="Acciones" />
          </tr>
        </thead>
        <tbody>
          {cines.map((cine) => (
            <tr key={cine.id}>
              <td>{cine.cadena}</td>
              <td>{cine.nombre}</td>
              <td>{cine.direccion}</td>
              <td>{cine.ciudad}</td>
              <td>{cine.salas.length}</td>
              <td className="tabla-cines__acciones">
                {confirmandoId === cine.id ? (
                  <>
                    <span className="tabla-cines__pregunta">¿Eliminar?</span>
                    <Boton
                      variante="peligro"
                      onClick={() => {
                        setConfirmandoId(null);
                        onEliminar(cine.id);
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
                    <Boton variante="secundario" onClick={() => onEditar(cine)}>
                      Editar
                    </Boton>
                    <Boton variante="peligro" onClick={() => setConfirmandoId(cine.id)}>
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
