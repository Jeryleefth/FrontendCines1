import cines from '../../mocks/cines.json';
import funciones from '../../mocks/funciones.json';
import { simularLatencia, fechaDesdeHoy, noEncontrado } from './utilidades';

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
    sala: { id: sala.id, nombre: sala.nombre, tipo: sala.tipo, capacidad: sala.capacidad },
  };
}

const porFechaYHora = (a, b) =>
  `${a.fecha} ${a.horaInicio}`.localeCompare(`${b.fecha} ${b.horaInicio}`);

export const funcionServicioMock = {
  /**
   * Todas las funciones programadas, de todas las películas y cines.
   * La usan los filtros de la cartelera para saber "¿en qué cines dan
   * esta película?" sin tener que pedir cine por cine.
   * @returns {Promise<import('../tipos').Funcion[]>}
   */
  async listarTodas() {
    const resultado = funciones.map(armarFuncion).sort(porFechaYHora);
    return simularLatencia(resultado);
  },

  /**
   * Una función puntual, con el cine y la sala ya adjuntos — lo que necesita
   * la pantalla de selección de asientos (ahí no hace falta la lista
   * completa, solo esta función).
   * @returns {Promise<import('../tipos').Funcion>}
   */
  async buscarPorId(id) {
    const fila = funciones.find((f) => f.id === id);
    if (!fila) throw noEncontrado('la función', id);
    return simularLatencia(armarFuncion(fila));
  },

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
