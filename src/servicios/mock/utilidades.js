// Simula lo que hace una API real: tarda un poco y devuelve una COPIA de los
// datos (así ningún componente puede modificar por error el JSON original).
export function simularLatencia(valor, milisegundos = 0) {
  return new Promise((resolver) => {
    setTimeout(() => resolver(structuredClone(valor)), milisegundos);
  });
}

// Un error como el que lanzaría la API cuando algo no existe.
export function noEncontrado(recurso, id) {
  return new Error(`No se encontró ${recurso} con id ${id}.`);
}

// Fecha ISO (AAAA-MM-DD) de "hoy + n días", en hora local.
export function fechaDesdeHoy(dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}
