import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../../../compartido/componentes/Banner';
import Cargando from '../../../compartido/componentes/Cargando';
import FiltrosCartelera from '../componentes/FiltrosCartelera';
import TarjetaPelicula from '../componentes/TarjetaPelicula';
import DetallePeliculaModal from '../componentes/DetallePeliculaModal';
import { cineServicio, funcionServicio, peliculaServicio } from '../../../servicios';
import './Cartelera.css';

export default function Cartelera() {
  const navegar = useNavigate();

  // Los tres momentos de toda carga de datos:
  const [peliculas, setPeliculas] = useState([]);
  const [cines, setCines] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Película cuyo detalle se muestra en el modal (null = modal cerrado)
  const [peliculaDetalle, setPeliculaDetalle] = useState(null);

  // Estado de los FILTROS: son del padre (Cartelera), no de FiltrosCartelera,
  // porque aquí es donde se usan para decidir qué tarjetas se muestran.
  const [texto, setTexto] = useState('');
  const [genero, setGenero] = useState('');
  const [cine, setCine] = useState('');

  // El arreglo vacío [] significa: "ejecuta esto UNA sola vez, al aparecer la página".
  useEffect(() => {
    let activo = true; // evita actualizar el estado si la página ya se cerró

    // Promise.all pide las tres cosas en paralelo (no una tras otra) y espera
    // a que las tres respondan antes de seguir.
    Promise.all([peliculaServicio.listar(), cineServicio.listar(), funcionServicio.listarTodas()])
      .then(([datosPeliculas, datosCines, datosFunciones]) => {
        if (!activo) return;
        setPeliculas(datosPeliculas);
        setCines(datosCines);
        setFunciones(datosFunciones);
      })
      .catch((e) => activo && setError(e.message))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, []);

  // useCallback mantiene la misma función entre renderizados para que el
  // efecto del modal no se reinicie en cada dibujado.
  const cerrarDetalle = useCallback(() => setPeliculaDetalle(null), []);

  // ---------- Datos derivados de los filtros ----------
  // Nada de esto se guarda en useState: se recalcula en cada render a partir
  // de `peliculas` y `funciones`. Evita tener dos fuentes de verdad que
  // podrían desincronizarse (la lista completa y "la lista filtrada").

  // Géneros únicos, en el orden en que aparecen, para llenar el <select>.
  const generos = useMemo(
    () => [...new Set(peliculas.map((p) => p.genero))],
    [peliculas],
  );

  // Por cada película, en qué cines tiene al menos una función. Se calcula
  // una sola vez (no una vez por película) recorriendo `funciones` una vez.
  const cinesPorPelicula = useMemo(() => {
    const mapa = new Map();
    for (const f of funciones) {
      if (!mapa.has(f.peliculaId)) mapa.set(f.peliculaId, new Set());
      mapa.get(f.peliculaId).add(f.cine.id);
    }
    return mapa;
  }, [funciones]);

  // useMemo evita recalcular el filtrado en cada render si ninguno de estos
  // valores cambió (por ejemplo, cuando el usuario abre el modal de detalles).
  const peliculasFiltradas = useMemo(() => {
    const textoNormalizado = texto.trim().toLowerCase();

    return peliculas.filter((p) => {
      const coincideTexto = !textoNormalizado || p.titulo.toLowerCase().includes(textoNormalizado);
      const coincideGenero = !genero || p.genero === genero;
      const coincideCine = !cine || cinesPorPelicula.get(p.id)?.has(cine);
      return coincideTexto && coincideGenero && coincideCine;
    });
  }, [peliculas, texto, genero, cine, cinesPorPelicula]);

  const hayFiltrosActivos = Boolean(texto || genero || cine);

  const limpiarFiltros = useCallback(() => {
    setTexto('');
    setGenero('');
    setCine('');
  }, []);

  return (
    <>
      <Banner
        titulo="Películas disponibles"
        subtitulo="Ibagué"
        imagenFondo="/banners/encabezadoPeliculas.png"
        etiqueta="Películas disponibles en Ibagué"
      />

      <div className="contenedor">
        {!cargando && !error && peliculas.length > 0 && (
          <FiltrosCartelera
            texto={texto}
            onTextoChange={setTexto}
            genero={genero}
            onGeneroChange={setGenero}
            cine={cine}
            onCineChange={setCine}
            generos={generos}
            cines={cines}
            onLimpiar={limpiarFiltros}
            hayFiltrosActivos={hayFiltrosActivos}
          />
        )}

        {cargando && <Cargando texto="Cargando cartelera…" />}
        {error && <p className="mensaje-estado mensaje-estado--error">{error}</p>}
        {!cargando && !error && peliculas.length === 0 && (
          <p className="mensaje-estado">No hay películas disponibles.</p>
        )}
        {!cargando && !error && peliculas.length > 0 && peliculasFiltradas.length === 0 && (
          <p className="mensaje-estado">Ninguna película coincide con los filtros.</p>
        )}

        <div className="cartelera__lista">
          {peliculasFiltradas.map((pelicula) => (
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
