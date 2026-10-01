import { simularLatencia } from './utilidades';

// Igual que `clientesRegistrados`: empieza vacío, vive solo en memoria del
// navegador mientras dure la sesión. `SeleccionAsientos.jsx` es quien
// arma el objeto `reserva` completo (con título, cine, sala, fecha... ya
// resueltos) ANTES de llamar a `crear`, así este mock no necesita volver a
// consultar películas ni funciones para guardarla — simula cómo se vería
// el "snapshot" que una reserva real guardaría en su propia tabla.
const reservas = [];

export const reservaServicioMock = {
  /** @returns {Promise<Object>} La reserva ya creada, con su id. */
  async crear(reserva) {
    const nueva = { ...reserva, id: `res-${Date.now()}`, creadaEn: new Date().toISOString() };
    reservas.push(nueva);
    return simularLatencia(nueva);
  },

  /**
   * Reservas de un cliente, más recientes primero.
   * @returns {Promise<Object[]>}
   */
  async listarPorCliente(correoCliente) {
    const resultado = reservas
      .filter((r) => r.correoCliente === correoCliente)
      .sort((a, b) => b.creadaEn.localeCompare(a.creadaEn));
    return simularLatencia(resultado);
  },
};
