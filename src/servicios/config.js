// Único lugar donde se decide de dónde vienen los datos.
//
// Para usar la API real de Spring Boot crea un archivo `.env.local` con:
//   VITE_USAR_MOCKS=false
// De forma predeterminada se usa el mismo host desde donde se abre el sitio,
// para que también funcione desde otro computador de la red local.

export const USAR_MOCKS = import.meta.env.VITE_USAR_MOCKS !== 'false';
export const URL_API = import.meta.env.VITE_URL_API ?? `http://${window.location.hostname}:8081/api`;
