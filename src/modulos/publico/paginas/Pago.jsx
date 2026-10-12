import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Banner from '../../../compartido/componentes/Banner';
import Boton from '../../../compartido/componentes/Boton';
import BotonPill from '../../../compartido/componentes/BotonPill';
import { pagoServicio, reservaServicio } from '../../../servicios';
import { useClienteAuth } from '../../clientes/contexto/ClienteAuthContext';
import { formatearFecha, formatearPrecio } from '../../../compartido/utilidades/formato';

export default function Pago() {
  const { funcionId } = useParams();
  const { state } = useLocation();
  const navegar = useNavigate();
  const { cliente } = useClienteAuth();
  const [metodoPago, setMetodoPago] = useState('TARJETA');

  if (!state) {
    return <div className="contenedor"><p className="mensaje-estado mensaje-estado--error">No hay una reserva pendiente de pago.</p><BotonPill to="/">Volver a cartelera</BotonPill></div>;
  }

  const confirmar = async () => {
    let reservaCreada = null;
    try {
      reservaCreada = await reservaServicio.crear({ ...state, funcionId, correoCliente: cliente.correo });
      await pagoServicio.crear({ reservaId: reservaCreada.id, metodoPago });
      navegar('/mis-reservas', { replace: true });
    } catch (error) {
      // Si Django está apagado o rechaza el pago, se cancela la reserva
      // temporal y Spring libera sus asientos para no dejar datos bloqueados.
      if (reservaCreada) await reservaServicio.cancelar(reservaCreada.id).catch(() => undefined);
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
        <label>
          Método de pago
          <select value={metodoPago} onChange={(evento) => setMetodoPago(evento.target.value)}>
            <option value="TARJETA">Tarjeta</option>
            <option value="PSE">PSE</option>
            <option value="EFECTIVO">Efectivo</option>
          </select>
        </label>
        <Boton onClick={confirmar}>Pagar y confirmar reserva</Boton>
      </main>
    </>
  );
}
