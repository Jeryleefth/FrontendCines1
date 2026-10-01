import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Banner from '../../../compartido/componentes/Banner';
import BotonPill from '../../../compartido/componentes/BotonPill';
import Cargando from '../../../compartido/componentes/Cargando';
import TarjetaCine from '../componentes/TarjetaCine';
import TarjetaFuncion from '../componentes/TarjetaFuncion';
import { funcionServicio, peliculaServicio } from '../../../servicios';
import './Comparador.css';

export default function Comparador() {
  // useParams lee la parte variable de la URL: /comparador/:peliculaId
  const { peliculaId } = useParams();

  const [pelicula, setPelicula] = useState(null);
  const [comparacion, setComparacion] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // El arreglo de dependencias es [peliculaId]: si el usuario navega de esta
  // pantalla a la misma pantalla pero con OTRA película, React no la vuelve
  // a "montar" (sigue siendo el mismo componente Comparador), así que hay
  // que decirle explícitamente que repita la búsqueda cuando cambie el id.
  useEffect(() => {
    if (!peliculaId) {
      setCargando(false);
      return;
    }

    let activo = true;
    setCargando(true);
    setError(null);

    Promise.all([peliculaServicio.buscarPorId(peliculaId), funcionServicio.comparar(peliculaId)])
      .then(([datosPelicula, datosComparacion]) => {
        if (!activo) return;
        setPelicula(datosPelicula);
        setComparacion(datosComparacion);
      })
      .catch((e) => activo && setError(e.message))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, [peliculaId]);

  // El servicio `comparar` ya entrega los cines ordenados del más barato al
  // más caro, así que el primero de la lista es siempre el más barato.
  const precioMasBarato = useMemo(
    () => (comparacion.length ? comparacion[0].precioDesde : null),
    [comparacion],
  );

  return (
    <>
      {/* Sin `peliculaId` no hay nada que cargar, así que el banner genérico
          es un estado estable: se queda ahí. Pero CON `peliculaId`, mientras
          `pelicula` todavía es null (se está cargando), no le pasamos texto
          de relleno — así el banner se queda en blanco un instante en vez de
          mostrar "Comparador de precios" para enseguida reemplazarlo por el
          título real, que es el parpadeo que se veía. */}
      <Banner
        titulo={!peliculaId ? 'Comparador de precios' : pelicula?.titulo}
        subtitulo={pelicula ? `${pelicula.genero} · ${pelicula.duracion} min` : undefined}
        imagenFondo={pelicula?.rutaImagen}
        superponerTexto
        etiqueta={pelicula ? `Comparador de precios de ${pelicula.titulo}` : undefined}
      />

      <div className="contenedor">
        {!peliculaId && (
          <p className="mensaje-estado">
            Elige una película desde la cartelera para comparar sus funciones.
          </p>
        )}

        {peliculaId && cargando && <Cargando texto="Buscando funciones…" />}
        {peliculaId && error && <p className="mensaje-estado mensaje-estado--error">{error}</p>}

        {peliculaId && !cargando && !error && comparacion.length === 0 && (
          <p className="mensaje-estado">
            Esta película no tiene funciones programadas en ningún cine por ahora.
          </p>
        )}

        {peliculaId && !cargando && !error && comparacion.length > 0 && (
          <div className="comparador__lista">
            {comparacion.map((item) => (
              <TarjetaCine
                key={item.cine.id}
                cine={item.cine}
                pelicula={pelicula}
                formatos={[...new Set(item.funciones.map((funcion) => funcion.formato))]}
                precioDesde={item.precioDesde}
                esElMasBarato={item.precioDesde === precioMasBarato}
              >
                {/* Aquí se ve la composición en acción: TarjetaCine no sabe
                    que esto son "funciones" — solo recibe estos elementos
                    como children y los acomoda en su hueco. */}
                {item.funciones.map((funcion) => (
                  <TarjetaFuncion key={funcion.id} funcion={funcion} />
                ))}
              </TarjetaCine>
            ))}
          </div>
        )}

        {/* `className="comparador__volver"` se suma a la clase base
            `boton-pill` del componente — así este botón queda centrado y
            con margen de separación, sin tocar el estilo que comparte con
            cualquier otro <BotonPill> de la app. */}
        <div className="comparador__pie">
          <BotonPill to="/" className="comparador__volver">
            Volver a la cartelera
          </BotonPill>
        </div>
      </div>
    </>
  );
}
