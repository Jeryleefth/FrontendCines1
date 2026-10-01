// Enlaces de la barra de navegación.

// El comparador ya no tiene enlace propio en el menú: a él se llega siempre
// desde una tarjeta de la cartelera (hace falta elegir una película antes),
// así que no tiene sentido como destino de navegación suelto.
export const ENLACES_NAVEGACION = [
  { ruta: '/', texto: 'Cartelera', exacto: true },
  { ruta: '/admin', texto: 'Administración' },
];
