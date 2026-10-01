import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Banner from '../../../compartido/componentes/Banner';
import Boton from '../../../compartido/componentes/Boton';
import BotonPill from '../../../compartido/componentes/BotonPill';
import MapaAsientos from '../componentes/MapaAsientos';
import { funcionServicio, peliculaServicio } from '../../../servicios';
import { construirAsientos } from '../../../compartido/utilidades/asientos';
import { formatearFecha, formatearPrecio } from '../../../compartido/utilidades/formato';
import './SeleccionAsientos.css';

export default function SeleccionAsientos() {
  // useParams lee la parte variable de la URL: /funcion/:funcionId/asientos
  const { funcionId } = useParams();

  const [funcion, setFuncion] = useState(null);
  const [pelicula, setPelicula] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Qué butacas tiene elegidas la persona ahora mismo. Vive aquí (en la
  // página), no en cada <Asiento>, porque hace falta verlo completo para
  // calcular el total y para saber qué asientos pintar en rojo.
  const [seleccionados, setSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState('');

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

  const confirmar = () => {
    setMensaje(
      `Reserva lista: ${seleccionados.length} asiento(s) por ${formatearPrecio(total)}. ` +
        'El pago se conecta en el siguiente paso del proyecto (microservicio de Django).',
    );
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
        {cargando && <p className="mensaje-estado">Cargando la sala…</p>}
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
              onSeleccionar={alternarAsiento}
            />

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

              <Boton disabled={seleccionados.length === 0} onClick={confirmar}>
                Continuar
              </Boton>
            </div>

            {mensaje && <p className="seleccion-asientos__mensaje">{mensaje}</p>}
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
