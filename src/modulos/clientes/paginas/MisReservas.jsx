import { useEffect, useState } from 'react';
import Banner from '../../../compartido/componentes/Banner';
import Cargando from '../../../compartido/componentes/Cargando';
import { formatearFecha, formatearPrecio } from '../../../compartido/utilidades/formato';
import { reservaServicio } from '../../../servicios';
import { useClienteAuth } from '../contexto/ClienteAuthContext';
import './MisReservas.css';

export default function MisReservas() {
  const { cliente } = useClienteAuth();
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);
    reservaServicio
      .listarPorCliente(cliente.correo)
      .then((datos) => activo && setReservas(datos))
      .catch((e) => activo && setError(e.message))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, [cliente.correo]);

  return (
    <>
      {/* A diferencia de Perfil.jsx, esta foto de fondo YA trae el título
          "MIS RESERVAS" dibujado adentro (como encabezadoPeliculas.png) —
          por eso NO se manda `titulo` aquí, solo `subtitulo`, que sigue
          siendo dinámico y no puede venir horneado en la imagen.
          `conVelo={false}`: la foto ya se ve bien sin oscurecerla de más.
          `subtituloAbajo`: para que "Hola, {nombre}" no quede encima del
          título que ya trae la imagen (ver Banner.jsx). */}
      <Banner
        subtitulo={`Hola, ${cliente.nombre}`}
        imagenFondo="/banners/fondoMisReservas.jpg"
        forzarTexto
        conVelo={false}
        subtituloAbajo
        etiqueta="Mis reservas"
      />

      <div className="contenedor">
        {cargando && <Cargando texto="Cargando tus reservas…" />}
        {error && <p className="mensaje-estado mensaje-estado--error">{error}</p>}

        {!cargando && !error && reservas.length === 0 && (
          <p className="mensaje-estado">
            Todavía no tienes reservas. Elige una película desde la cartelera para hacer la primera.
          </p>
        )}

        {!cargando && !error && reservas.length > 0 && (
          <ul className="mis-reservas">
            {reservas.map((reserva) => (
              <li className="mis-reservas__tarjeta" key={reserva.id}>
                <div className="mis-reservas__encabezado">
                  <h2>{reserva.peliculaTitulo}</h2>
                  <span className="mis-reservas__total">{formatearPrecio(reserva.total)}</span>
                </div>
                <p className="mis-reservas__detalle">
                  {reserva.cineNombre} · {reserva.salaNombre} · {reserva.formato}
                </p>
                <p className="mis-reservas__detalle">
                  {formatearFecha(reserva.fecha)} · {reserva.horaInicio}
                </p>
                <p className="mis-reservas__asientos">
                  Asientos: <strong>{[...reserva.asientos].sort().join(', ')}</strong>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
