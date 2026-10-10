import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Banner from '../../../compartido/componentes/Banner';
import Boton from '../../../compartido/componentes/Boton';
import BotonPill from '../../../compartido/componentes/BotonPill';
import { reservaServicio } from '../../../servicios';
import { useClienteAuth } from '../../clientes/contexto/ClienteAuthContext';
import { formatearFecha, formatearPrecio } from '../../../compartido/utilidades/formato';

export default function Pago() {
  const { funcionId } = useParams();
  const { state } = useLocation();
  const navegar = useNavigate();
  const { cliente } = useClienteAuth();

  if (!state) {
    return <div className="contenedor"><p className="mensaje-estado mensaje-estado--error">No hay una reserva pendiente de pago.</p><BotonPill to="/">Volver a cartelera</BotonPill></div>;
  }

  const confirmar = async () => {
    try {
      await reservaServicio.crear({ ...state, funcionId, correoCliente: cliente.correo });
      navegar('/mis-reservas', { replace: true });
    } catch (error) {
      window.alert(`No se pudo completar el pago: ${error.message}`);
    }
  };

  return (
    <>
      <Banner titulo="Confirmar pago" subtitulo={state.peliculaTitulo} imagenFondo={state.peliculaImagen} superponerTexto />
      <main className="contenedor">
        <h1>Resumen de reserva</h1>
        <p>{state.cineNombre} · {state.salaNombre} · {state.formato}</p>
        <p>{formatearFecha(state.fecha)} · {state.horaInicio}</p>
        <p>Asientos seleccionados: {state.asientos.length}</p>
        <p><strong>Total: {formatearPrecio(state.total)}</strong></p>
        <Boton onClick={confirmar}>Pagar y confirmar reserva</Boton>
      </main>
    </>
  );
}
