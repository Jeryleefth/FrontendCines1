import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Banner from '../../../compartido/componentes/Banner';
import Boton from '../../../compartido/componentes/Boton';
import BotonPill from '../../../compartido/componentes/BotonPill';
import Cargando from '../../../compartido/componentes/Cargando';
import MapaAsientos from '../componentes/MapaAsientos';
import { funcionServicio, peliculaServicio } from '../../../servicios';
import { useClienteAuth } from '../../clientes/contexto/ClienteAuthContext';
import { formatearFecha, formatearPrecio } from '../../../compartido/utilidades/formato';
import './SeleccionAsientos.css';

export default function SeleccionAsientos() {
  // useParams lee la parte variable de la URL: /funcion/:funcionId/asientos
  const { funcionId } = useParams();
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const { estaAutenticado } = useClienteAuth();

  const [funcion, setFuncion] = useState(null);
  const [pelicula, setPelicula] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Qué butacas tiene elegidas la persona ahora mismo. Vive aquí (en la
  // página), no en cada <Asiento>, porque hace falta verlo completo para
  // calcular el total y para saber qué asientos pintar en rojo.
  const [seleccionados, setSeleccionados] = useState([]);
  const [filas, setFilas] = useState([]);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);
    setSeleccionados([]);

    // Primero se pide la función (trae cine y sala adjuntos); solo con su
    // peliculaId se puede pedir la película después. Por eso van encadenados
    // con .then() en vez de en un Promise.all como en otras pantallas.
    funcionServicio
      .buscarPorId(funcionId)
      .then((datosFuncion) => {
        if (!activo) return undefined;
        setFuncion(datosFuncion);
        return Promise.all([peliculaServicio.buscarPorId(datosFuncion.peliculaId), funcionServicio.asientos(datosFuncion.id)]);
      })
      .then(([datosPelicula, asientos]) => {
        if (!activo) return;
        setPelicula(datosPelicula);
        const agrupados = new Map();
        asientos.forEach((asiento) => {
          if (!agrupados.has(asiento.fila)) agrupados.set(asiento.fila, []);
          agrupados.get(asiento.fila).push({ id: asiento.id, ocupado: asiento.ocupado, etiqueta: `${asiento.fila}${asiento.numero}` });
        });
        setFilas([...agrupados].map(([letra, lista]) => ({ letra, asientos: lista })));
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

  const alternarAsiento = (idAsiento) => {
    setSeleccionados((actual) =>
      actual.includes(idAsiento)
        ? actual.filter((id) => id !== idAsiento)
        : [...actual, idAsiento],
    );
  };

  const total = funcion ? seleccionados.length * funcion.precio : 0;
  // `seleccionados` conserva los id internos para enviarlos a Spring, pero
  // al usuario se le muestra la etiqueta de la butaca (por ejemplo, D3).
  const etiquetasSeleccionadas = seleccionados
    .map((id) => {
      for (const fila of filas) {
        const asiento = fila.asientos.find((item) => item.id === id);
        if (asiento) return asiento.etiqueta;
      }
      return id;
    })
    .sort();

  // Esta pantalla ya NO crea la reserva directamente: solo arma el
  // "carrito" (qué función, qué asientos, cuánto hay que pagar) y lo manda
  // a /pago por `state` de React Router. La reserva se guarda recién
  // cuando el pago (simulado) sale bien — ver Pago.jsx. Mandar los datos
  // ya resueltos (título, cine, sala…) evita que Pago.jsx tenga que volver
  // a consultar película ni función para armar el resumen.
  const irAPagar = () => {
    navegar(`/funcion/${funcion.id}/pago`, {
      state: {
        peliculaId: pelicula.id,
        peliculaTitulo: pelicula.titulo,
        peliculaImagen: pelicula.rutaImagen,
        cineNombre: funcion.cine.nombre,
        salaNombre: funcion.sala.nombre,
        formato: funcion.formato,
        fecha: funcion.fecha,
        horaInicio: funcion.horaInicio,
        asientos: seleccionados,
        total,
      },
    });
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
              onSeleccionar={alternarAsiento}
            />

            <div className="seleccion-asientos__resumen">
              <div className="seleccion-asientos__texto">
                {seleccionados.length === 0 ? (
                  <span>Elige al menos un asiento.</span>
                ) : (
                  <span>
                    {seleccionados.length} {seleccionados.length === 1 ? 'asiento' : 'asientos'}:{' '}
                    <strong>{etiquetasSeleccionadas.join(', ')}</strong>
                  </span>
                )}
              </div>

              <div className="seleccion-asientos__total">
                Total <strong>{formatearPrecio(total)}</strong>
              </div>

              {/* Se puede elegir asientos sin haber iniciado sesión — solo
                  hace falta cuenta para CONTINUAR al pago, igual que el
                  checkout de cualquier tienda en línea deja armar el
                  carrito libre. */}
              {estaAutenticado ? (
                <Boton disabled={seleccionados.length === 0} onClick={irAPagar}>
                  Continuar al pago
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
