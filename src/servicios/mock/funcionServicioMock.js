import cines from '../../mocks/cines.json';
import funciones from '../../mocks/funciones.json';
import { simularLatencia, fechaDesdeHoy } from './utilidades';

// Convierte una fila "cruda" del JSON en una Funcion con la forma del contrato
// (ver ../tipos.js): calcula la fecha real y adjunta los datos del cine y la sala.
function armarFuncion(fila) {
  const cine = cines.find((c) => c.id === fila.cineId);
  const sala = cine.salas.find((s) => s.id === fila.salaId);
  return {
    id: fila.id,
    peliculaId: fila.peliculaId,
    fecha: fechaDesdeHoy(fila.diasDesdeHoy),
    horaInicio: fila.horaInicio,
    horaFin: fila.horaFin,
    tipoFuncion: fila.tipoFuncion,
    formato: fila.formato,
    precio: fila.precio,
    cine: { id: cine.id, nombre: cine.nombre, cadena: cine.cadena },
    sala: { id: sala.id, nombre: sala.nombre, tipo: sala.tipo },
  };
}

const porFechaYHora = (a, b) =>
  `${a.fecha} ${a.horaInicio}`.localeCompare(`${b.fecha} ${b.horaInicio}`);

export const funcionServicioMock = {
  /** @returns {Promise<import('../tipos').Funcion[]>} */
  async listarPorPelicula(peliculaId) {
    const resultado = funciones
      .filter((f) => f.peliculaId === peliculaId)
      .map(armarFuncion)
      .sort(porFechaYHora);
    return simularLatencia(resultado);
  },

  /**
   * Comparador: agrupa las funciones de una película por cine y ordena los
   * cines del más barato al más caro.
   * @returns {Promise<import('../tipos').ComparacionCine[]>}
   */
  async comparar(peliculaId) {
    const lista = funciones
      .filter((f) => f.peliculaId === peliculaId)
      .map(armarFuncion)
      .sort(porFechaYHora);

    const comparacion = cines
      .map((cine) => {
        const delCine = lista.filter((f) => f.cine.id === cine.id);
        return {
          cine: { ...cine },
          precioDesde: Math.min(...delCine.map((f) => f.precio)),
          funciones: delCine,
        };
      })
      .filter((c) => c.funciones.length > 0)
      .sort((a, b) => a.precioDesde - b.precioDesde);

    return simularLatencia(comparacion);
  },
};
