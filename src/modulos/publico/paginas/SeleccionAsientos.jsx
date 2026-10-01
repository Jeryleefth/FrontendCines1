import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Banner from '../../../compartido/componentes/Banner';
import Boton from '../../../compartido/componentes/Boton';
import BotonPill from '../../../compartido/componentes/BotonPill';
import Cargando from '../../../compartido/componentes/Cargando';
import MapaAsientos from '../componentes/MapaAsientos';
import { funcionServicio, peliculaServicio, reservaServicio } from '../../../servicios';
import { useClienteAuth } from '../../clientes/contexto/ClienteAuthContext';
import { construirAsientos } from '../../../compartido/utilidades/asientos';
import { formatearFecha, formatearPrecio } from '../../../compartido/utilidades/formato';
import './SeleccionAsientos.css';

export default function SeleccionAsientos() {
  // useParams lee la parte variable de la URL: /funcion/:funcionId/asientos
  const { funcionId } = useParams();
  const ubicacion = useLocation();
  const { cliente, estaAutenticado } = useClienteAuth();

  const [funcion, setFuncion] = useState(null);
  const [pelicula, setPelicula] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Qué butacas tiene elegidas la persona ahora mismo. Vive aquí (en la
  // página), no en cada <Asiento>, porque hace falta verlo completo para
  // calcular el total y para saber qué asientos pintar en rojo.
  const [seleccionados, setSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [reservando, setReservando] = useState(false);
  const [reservaHecha, setReservaHecha] = useState(false);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);
    setSeleccionados([]);
    setMensaje('');

    // Primero se pide la función (trae cine y sala adjuntos); solo con su
    // peliculaId se puede pedir la película después. Por eso van encadenados
    // con .then() en vez de en un Promise.all como en otras pantallas.
    funcionServicio
      .buscarPorId(funcionId)
      .then((datosFuncion) => {
        if (!activo) return undefined;
        setFuncion(datosFuncion);
        return peliculaServicio.buscarPorId(datosFuncion.peliculaId);
      })
      .then((datosPelicula) => {
        if (activo && datosPelicula) setPelicula(datosPelicula);
      })
      .catch((e) => activo && setError(e.message))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, [funcionId]);

  // Se recalcula solo si cambia la función, no en cada clic sobre un
  // asiento: los asientos "ocupados" dependen de qué función es, no de qué
  // haya seleccionado la persona en este momento.
  const filas = useMemo(
    () => (funcion ? construirAsientos(funcion.id, funcion.sala.capacidad) : []),
    [funcion],
  );

  const alternarAsiento = (idAsiento) => {
    setSeleccionados((actual) =>
      actual.includes(idAsiento)
        ? actual.filter((id) => id !== idAsiento)
        : [...actual, idAsiento],
    );
  };

  const total = funcion ? seleccionados.length * funcion.precio : 0;

  // El "snapshot" de todo lo necesario para mostrar esta reserva después en
  // "Mis reservas" (título, cine, sala…) se arma AQUÍ, con los datos que ya
  // están cargados en esta pantalla — así reservaServicio.crear() no tiene
  // que volver a consultar película ni función para guardarla.
  const confirmar = async () => {
    setReservando(true);
    try {
      await reservaServicio.crear({
        correoCliente: cliente.correo,
        funcionId: funcion.id,
        peliculaId: pelicula.id,
        peliculaTitulo: pelicula.titulo,
        cineNombre: funcion.cine.nombre,
        salaNombre: funcion.sala.nombre,
        formato: funcion.formato,
        fecha: funcion.fecha,
        horaInicio: funcion.horaInicio,
        asientos: seleccionados,
        total,
      });
      setReservaHecha(true);
      setMensaje(
        `Reserva lista: ${seleccionados.length} asiento(s) por ${formatearPrecio(total)}. ` +
          'El pago se conecta en el siguiente paso del proyecto (microservicio de Django).',
      );
    } catch (e) {
      setMensaje(`No se pudo guardar la reserva: ${e.message}`);
    } finally {
      setReservando(false);
    }
  };

  return (
    <>
      {/* Igual que en el comparador: mientras `pelicula` es null (se está
          cargando), no le pasamos texto al banner, para no mostrar un
          título genérico que un instante después se reemplaza por el real. */}
      <Banner
        titulo={pelicula?.titulo}
        subtitulo={funcion ? `${funcion.cine.nombre} · ${funcion.sala.nombre}` : undefined}
        imagenFondo={pelicula?.rutaImagen}
        superponerTexto
        etiqueta={pelicula ? `Selección de asientos de ${pelicula.titulo}` : undefined}
      />

      <div className="contenedor">
        {cargando && <Cargando texto="Cargando la sala…" />}
        {error && <p className="mensaje-estado mensaje-estado--error">{error}</p>}

        {!cargando && !error && funcion && (
          <>
            <p className="seleccion-asientos__detalle">
              {formatearFecha(funcion.fecha)} · {funcion.horaInicio} · {funcion.formato} ·{' '}
              {funcion.tipoFuncion}
            </p>

            <MapaAsientos
              filas={filas}
              seleccionados={seleccionados}
              // Una vez la reserva queda hecha, los asientos ya no se pueden
              // tocar: `undefined` en vez de la función hace que <Asiento>
              // no reciba onClick, y por eso deja de responder a los clics.
              onSeleccionar={reservaHecha ? undefined : alternarAsiento}
            />

            {!reservaHecha && (
              <div className="seleccion-asientos__resumen">
                <div className="seleccion-asientos__texto">
                  {seleccionados.length === 0 ? (
                    <span>Elige al menos un asiento.</span>
                  ) : (
                    <span>
                      {seleccionados.length} {seleccionados.length === 1 ? 'asiento' : 'asientos'}:{' '}
                      <strong>{[...seleccionados].sort().join(', ')}</strong>
                    </span>
                  )}
                </div>

                <div className="seleccion-asientos__total">
                  Total <strong>{formatearPrecio(total)}</strong>
                </div>

                {/* Se puede elegir asientos sin haber iniciado sesión — solo
                    hace falta cuenta para CONFIRMAR, igual que el checkout de
                    cualquier tienda en línea deja armar el carrito libre. */}
                {estaAutenticado ? (
                  <Boton disabled={seleccionados.length === 0 || reservando} onClick={confirmar}>
                    {reservando ? 'Reservando…' : 'Continuar'}
                  </Boton>
                ) : (
                  <BotonPill
                    to="/ingresar"
                    state={{ desde: ubicacion.pathname }}
                    className="seleccion-asientos__ingresar"
                  >
                    Inicia sesión para reservar
                  </BotonPill>
                )}
              </div>
            )}

            {mensaje && <p className="seleccion-asientos__mensaje">{mensaje}</p>}

            {reservaHecha && (
              <div className="comparador__pie">
                <BotonPill to="/mis-reservas" className="comparador__volver">
                  Ver mis reservas
                </BotonPill>
              </div>
            )}
          </>
        )}

        <div className="comparador__pie">
          <BotonPill
            to={pelicula ? `/comparador/${pelicula.id}` : '/'}
            className="comparador__volver"
          >
            Volver al comparador
          </BotonPill>
        </div>
      </div>
    </>
  );
}
