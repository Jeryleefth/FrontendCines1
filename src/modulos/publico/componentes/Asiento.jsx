import './Asiento.css';

// Una butaca individual. No sabe nada del resto de la sala ni guarda su
// propio estado: solo dibuja lo que le dicen por props (`ocupado`,
// `seleccionado`) y avisa al padre con `onClick` cuando la tocan. Es el
// padre (MapaAsientos → SeleccionAsientos) quien decide qué significa ese
// clic — el mismo reparto de responsabilidades de los componentes
// controlados que ya usamos en los filtros de la cartelera.
export default function Asiento({ id, ocupado, seleccionado, onClick }) {
  const clases = ['asiento'];
  if (ocupado) clases.push('asiento--ocupado');
  if (seleccionado) clases.push('asiento--seleccionado');

  let descripcion = 'disponible';
  if (ocupado) descripcion = 'ocupado';
  else if (seleccionado) descripcion = 'seleccionado';

  return (
    <button
      type="button"
      className={clases.join(' ')}
      disabled={ocupado}
      aria-pressed={seleccionado}
      aria-label={`Asiento ${id}, ${descripcion}`}
      onClick={() => onClick(id)}
    >
      {id}
    </button>
  );
}
