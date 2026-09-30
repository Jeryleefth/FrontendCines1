import { URL_API } from './config';

// Pequeño envoltorio sobre fetch. Todos los servicios "api" pasan por aquí,
// así el manejo de errores, cabeceras y (más adelante) el token JWT
// se configuran en un solo lugar.
async function solicitar(ruta, opciones = {}) {
  const respuesta = await fetch(`${URL_API}${ruta}`, {
    headers: { 'Content-Type': 'application/json', ...opciones.headers },
    ...opciones,
  });

  if (!respuesta.ok) {
    // Spring Boot devolverá un ProblemDetail con { title, detail }.
    const problema = await respuesta.json().catch(() => ({}));
    throw new Error(problema.detail ?? problema.title ?? `Error ${respuesta.status}`);
  }
  return respuesta.status === 204 ? null : respuesta.json();
}

export const clienteHttp = {
  obtener: (ruta) => solicitar(ruta),
  crear: (ruta, cuerpo) => solicitar(ruta, { method: 'POST', body: JSON.stringify(cuerpo) }),
  actualizar: (ruta, cuerpo) => solicitar(ruta, { method: 'PUT', body: JSON.stringify(cuerpo) }),
  eliminar: (ruta) => solicitar(ruta, { method: 'DELETE' }),
};
