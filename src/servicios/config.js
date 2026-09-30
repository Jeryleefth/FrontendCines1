// Único lugar donde se decide de dónde vienen los datos.
//
// Para usar la API real de Spring Boot crea un archivo `.env.local` con:
//   VITE_USAR_MOCKS=false
//   VITE_URL_API=http://localhost:8080/api
// y reinicia `npm run dev`. Ningún componente cambia.

export const USAR_MOCKS = import.meta.env.VITE_USAR_MOCKS !== 'false';
export const URL_API = import.meta.env.VITE_URL_API ?? 'http://localhost:8080/api';
