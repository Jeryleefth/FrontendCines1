import { Link } from 'react-router-dom';
import './BotonPill.css';

// COMPONENTE REUTILIZABLE: a este botón no le importa quién lo use ni para
// qué. Por eso no tiene una clase fija como "volver" o "limpiar" — solo pone
// la clase base `boton-pill` (la forma, el color, el hover) y deja que quien
// lo use agregue SUS propias clases extra a través de `className`. Así, el
// mismo componente sirve tanto para "Volver a la cartelera" como para
// cualquier otro botón redondeado que necesite la app, sin copiar y pegar
// el CSS cada vez.
//
// `to`: si viene, el botón navega a esa ruta (se dibuja como <Link>, sin
//       recargar la página). Si no viene, se dibuja como un <button> normal
//       para acciones que no cambian de URL (como "Limpiar filtros").
// `...resto`: cualquier otra prop (onClick, aria-label, etc.) se reenvía tal
//             cual al elemento final, sin que este componente tenga que
//             conocerla de antemano.
export default function BotonPill({ to, className = '', children, ...resto }) {
  // Si quien usa <BotonPill> pasó className="algo-propio", el resultado es
  // "boton-pill algo-propio": las dos clases conviven, no se reemplazan.
  const clases = `boton-pill ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={clases} {...resto}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={clases} {...resto}>
      {children}
    </button>
  );
}
