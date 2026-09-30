import './Boton.css';

// Equivale a Estilos.crearBotonPrincipal / crearBotonSecundario del proyecto Swing.
// `children` es lo que se escribe entre las etiquetas: <Boton>Volver</Boton>.
// `...resto` reenvía cualquier otra prop (onClick, disabled, type...) al <button>.
export default function Boton({ variante = 'principal', children, ...resto }) {
  return (
    <button type="button" className={`boton boton--${variante}`} {...resto}>
      {children}
    </button>
  );
}
