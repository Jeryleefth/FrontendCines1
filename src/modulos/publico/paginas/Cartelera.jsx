import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../../../compartido/componentes/Banner';
import TarjetaPelicula from '../componentes/TarjetaPelicula';
import DetallePeliculaModal from '../componentes/DetallePeliculaModal';
import { peliculaServicio } from '../../../servicios';
import './Cartelera.css';

export default function Cartelera() {
  const navegar = useNavigate();

  // Tres estados para los tres momentos de toda carga de datos:
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  // Película cuyo detalle se muestra en el modal (null = modal cerrado)
  const [peliculaDetalle, setPeliculaDetalle] = useState(null);

  // El arreglo vacío [] significa: "ejecuta esto UNA sola vez, al aparecer la página".
  useEffect(() => {
    let activo = true; // evita actualizar el estado si la página ya se cerró

    peliculaServicio
      .listar()
      .then((datos) => activo && setPeliculas(datos))
      .catch((e) => activo && setError(e.message))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, []);

  // useCallback mantiene la misma función entre renderizados para que el
  // efecto del modal no se reinicie en cada dibujado.
  const cerrarDetalle = useCallback(() => setPeliculaDetalle(null), []);

  return (
    <>
      <Banner
        titulo="Películas disponibles"
        subtitulo="Ibagué"
        imagenFondo="/banners/encabezadoPeliculas.png"
        etiqueta="Películas disponibles en Ibagué"
      />

      <div className="contenedor">
        {cargando && <p className="mensaje-estado">Cargando cartelera…</p>}
        {error && <p className="mensaje-estado mensaje-estado--error">{error}</p>}
        {!cargando && !error && peliculas.length === 0 && (
          <p className="mensaje-estado">No hay películas disponibles.</p>
        )}

        <div className="cartelera__lista">
          {peliculas.map((pelicula) => (
            <TarjetaPelicula
              key={pelicula.id}
              pelicula={pelicula}
              alHacerClick={() => navegar(`/comparador/${pelicula.id}`)}
              alVerDetalles={setPeliculaDetalle}
            />
          ))}
        </div>
      </div>

      {peliculaDetalle && (
        <DetallePeliculaModal pelicula={peliculaDetalle} alCerrar={cerrarDetalle} />
      )}
    </>
  );
}
