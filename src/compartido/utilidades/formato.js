const formatoPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** 16500 -> "$ 16.500" */
export function formatearPrecio(valor) {
  return formatoPesos.format(valor);
}

/** "2024-03-01" -> "01/03/2024" (formato dd/MM/yyyy) */
export function formatearFecha(fechaIso) {
  const [anio, mes, dia] = fechaIso.split('-');
  return `${dia}/${mes}/${anio}`;
}
