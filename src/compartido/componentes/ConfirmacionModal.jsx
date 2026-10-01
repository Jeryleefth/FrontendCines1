import { useEffect } from 'react';
import Boton from './Boton';
import './ConfirmacionModal.css';

// Modal genérico de "¿estás seguro?" — reutilizable para cualquier acción
// que convenga confirmar antes de hacerla (acá se usa para cerrar sesión,
// ver Navbar.jsx). Mismo patrón que DetallePeliculaModal (fondo oscuro +
// cuadro centrado + Escape para cerrar), pero sin imagen ni ficha: solo un
// mensaje y dos botones.
export default function ConfirmacionModal({
  titulo = '¿Estás seguro?',
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
}) {
  useEffect(() => {
    function alPresionarTecla(evento) {
      if (evento.key === 'Escape') onCancelar();
    }
    document.addEventListener('keydown', alPresionarTecla);
    return () => document.removeEventListener('keydown', alPresionarTecla);
  }, [onCancelar]);

  return (
    <div className="modal-fondo" onClick={onCancelar}>
      <div
        className="confirmacion-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmacion-modal-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <h2 id="confirmacion-modal-titulo" className="confirmacion-modal__titulo">
          {titulo}
        </h2>
        {mensaje && <p className="confirmacion-modal__mensaje">{mensaje}</p>}

        <div className="confirmacion-modal__pie">
          <Boton variante="secundario" onClick={onCancelar}>
            {textoCancelar}
          </Boton>
          <Boton variante="principal" onClick={onConfirmar}>
            {textoConfirmar}
          </Boton>
        </div>
      </div>
    </div>
  );
}
