import { useState } from 'react';
import Boton from '../../../compartido/componentes/Boton';
import './FormularioCine.css';

const CADENAS = ['Cinemark', 'Cine Colombia', 'Royal Films'];
const TIPOS_SALA = ['2D', '3D', 'VIP'];

const VALORES_VACIOS = {
  cadena: '',
  nombre: '',
  direccion: '',
  ciudad: 'Ibagué',
  salas: [],
};

// Crea una sala nueva y vacía para el botón "+ Agregar sala". El id temporal
// (`sala-nueva-<timestamp>`) solo sirve de `key` en la lista mientras se
// edita el formulario; el backend real asignará su propio id al guardar.
function salaVacia() {
  return { id: `sala-nueva-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, nombre: '', capacidad: '', tipo: '2D' };
}

export default function FormularioCine({ cineInicial, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(cineInicial ?? VALORES_VACIOS);
  const [guardando, setGuardando] = useState(false);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setValores((actual) => ({ ...actual, [name]: value }));
  };

  // Las salas viven en un array dentro de `valores`, así que para cambiar
  // "la capacidad de la sala 2" no se reemplaza el array entero a mano:
  // se mapea, y solo el elemento en `indice` se reemplaza por una copia con
  // el campo actualizado. Los demás elementos del array siguen siendo los
  // mismos objetos (inmutabilidad: nunca se edita un objeto de estado en el sitio).
  const cambiarSala = (indice, campo, valor) => {
    setValores((actual) => ({
      ...actual,
      salas: actual.salas.map((sala, i) => (i === indice ? { ...sala, [campo]: valor } : sala)),
    }));
  };

  const agregarSala = () => {
    setValores((actual) => ({ ...actual, salas: [...actual.salas, salaVacia()] }));
  };

  const quitarSala = (indice) => {
    setValores((actual) => ({
      ...actual,
      salas: actual.salas.filter((_, i) => i !== indice),
    }));
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    try {
      await onGuardar({
        ...valores,
        salas: valores.salas.map((sala) => ({ ...sala, capacidad: Number(sala.capacidad) || 0 })),
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="formulario-cine" onSubmit={manejarEnvio}>
      <div className="formulario-cine__fila">
        <div className="formulario-cine__campo">
          <label htmlFor="cadena">Cadena</label>
          <select id="cadena" name="cadena" value={valores.cadena} onChange={manejarCambio} required>
            <option value="" disabled>
              Selecciona una cadena
            </option>
            {CADENAS.map((cadena) => (
              <option key={cadena} value={cadena}>
                {cadena}
              </option>
            ))}
          </select>
        </div>
        <div className="formulario-cine__campo">
          <label htmlFor="nombre">Nombre del cine</label>
          <input id="nombre" name="nombre" value={valores.nombre} onChange={manejarCambio} required />
        </div>
      </div>

      <div className="formulario-cine__fila">
        <div className="formulario-cine__campo">
          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            name="direccion"
            placeholder="C.C. Multicentro"
            value={valores.direccion}
            onChange={manejarCambio}
            required
          />
        </div>
        <div className="formulario-cine__campo">
          <label htmlFor="ciudad">Ciudad</label>
          <input id="ciudad" name="ciudad" value={valores.ciudad} onChange={manejarCambio} required />
        </div>
      </div>

      <div className="formulario-cine__salas">
        <div className="formulario-cine__salas-encabezado">
          <h3>Salas</h3>
          <Boton variante="secundario" type="button" onClick={agregarSala}>
            + Agregar sala
          </Boton>
        </div>

        {valores.salas.length === 0 && (
          <p className="mensaje-estado">Este cine todavía no tiene salas registradas.</p>
        )}

        {valores.salas.map((sala, indice) => (
          <div className="formulario-cine__sala" key={sala.id}>
            <input
              className="formulario-cine__sala-nombre"
              placeholder="Nombre (Sala 1, Sala VIP…)"
              value={sala.nombre}
              onChange={(evento) => cambiarSala(indice, 'nombre', evento.target.value)}
              required
            />
            <input
              className="formulario-cine__sala-capacidad"
              type="number"
              min="1"
              placeholder="Capacidad"
              value={sala.capacidad}
              onChange={(evento) => cambiarSala(indice, 'capacidad', evento.target.value)}
              required
            />
            <select
              className="formulario-cine__sala-tipo"
              value={sala.tipo}
              onChange={(evento) => cambiarSala(indice, 'tipo', evento.target.value)}
            >
              {TIPOS_SALA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <Boton variante="peligro" type="button" onClick={() => quitarSala(indice)}>
              Quitar
            </Boton>
          </div>
        ))}
      </div>

      <div className="formulario-cine__acciones">
        <Boton variante="secundario" type="button" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </Boton>
        <Boton type="submit" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </Boton>
      </div>
    </form>
  );
}
