// Enlaces de la barra de navegación.

// El comparador ya no tiene enlace propio en el menú: a él se llega siempre
// desde una tarjeta de la cartelera (hace falta elegir una película antes),
// así que no tiene sentido como destino de navegación suelto.
//
// "Administración" tampoco aparece acá: no es una sección a la que cualquier
// visitante pueda entrar por el menú, sino algo a lo que se llega iniciando
// sesión con credenciales de administrador (ver Navbar.jsx — ese enlace solo
// se muestra, de forma condicional, cuando ya hay sesión de admin).
export const ENLACES_NAVEGACION = [{ ruta: '/', texto: 'Cartelera', exacto: true }];
