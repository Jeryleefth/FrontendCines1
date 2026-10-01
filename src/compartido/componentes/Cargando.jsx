import './Cargando.css';

// Reemplaza el típico "Cargando…" en texto plano por un spinner animado.
// Se usa en todas las pantallas que esperan datos (cartelera, comparador,
// asientos, panel de administración) para que la espera se sienta parte
// del diseño de la app y no un mensaje de depuración.
export default function Cargando({ texto = 'Cargando…' }) {
  return (
    <div className="cargando" role="status" aria-live="polite">
      <span className="cargando__anillo" aria-hidden="true" />
      <p className="cargando__texto">{texto}</p>
    </div>
  );
}
