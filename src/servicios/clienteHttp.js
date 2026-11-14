import { URL_API } from './config';

const CLAVE_SESION_CLIENTE = 'cinematch_sesion_cliente';

function tokenDeSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION_CLIENTE))?.token ?? null;
  } catch {
    return null;
  }
}

// Pequeño envoltorio sobre fetch. Todos los servicios "api" pasan por aquí,
// así el manejo de errores y el JWT se configuran en un solo lugar.
async function solicitar(ruta, opciones = {}) {
  const token = tokenDeSesion();
  const respuesta = await fetch(`${URL_API}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opciones.headers,
    },
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
