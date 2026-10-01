// Arma la cuadrícula de asientos de una sala y decide (sin backend, sin
// base de datos todavía) cuáles ya están "ocupados". El resultado depende
// únicamente del id de la función: la misma función siempre genera los
// mismos asientos ocupados, para que no cambien solos al refrescar la
// página. Cuando el equipo conecte las reservas reales, esta función se
// reemplaza por datos que vengan del backend — el resto de la pantalla
// (MapaAsientos, Asiento) no tiene que cambiar.

const COLUMNAS = 6;
const PROPORCION_OCUPADOS = 0.3;

// "Hash" simple: convierte un texto en un número, siempre el mismo número
// para el mismo texto. Sirve como semilla para elegir asientos ocupados de
// forma repetible.
function semillaDesdeTexto(texto) {
  let semilla = 0;
  for (let i = 0; i < texto.length; i += 1) {
    semilla = (semilla * 31 + texto.charCodeAt(i)) >>> 0;
  }
  return semilla;
}

/**
 * @param {string} funcionId
 * @param {number} capacidad
 * @returns {{ letra: string, asientos: { id: string, ocupado: boolean }[] }[]}
 */
export function construirAsientos(funcionId, capacidad) {
  let semilla = semillaDesdeTexto(funcionId) || 1;
  const cantidadOcupados = Math.round(capacidad * PROPORCION_OCUPADOS);
  const ocupados = new Set();

  while (ocupados.size < cantidadOcupados) {
    // Generador congruencial simple: produce la "siguiente" semilla a
    // partir de la anterior. Siempre en el mismo orden para la misma
    // función, por eso los asientos ocupados no cambian entre recargas.
    semilla = (semilla * 1103515245 + 12345) & 0x7fffffff;
    ocupados.add(semilla % capacidad);
  }

  const filas = [];
  for (let indice = 0; indice < capacidad; indice += 1) {
    const numeroFila = Math.floor(indice / COLUMNAS);
    const letra = String.fromCharCode(65 + numeroFila);
    const numero = (indice % COLUMNAS) + 1;

    if (!filas[numeroFila]) filas[numeroFila] = { letra, asientos: [] };
    filas[numeroFila].asientos.push({
      id: `${letra}${numero}`,
      ocupado: ocupados.has(indice),
    });
  }

  return filas;
}
