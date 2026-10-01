import { useEffect, useState } from 'react';
import Banner from '../../../compartido/componentes/Banner';
import Boton from '../../../compartido/componentes/Boton';
import FormularioPelicula from '../componentes/FormularioPelicula';
import TablaPeliculas from '../componentes/TablaPeliculas';
import { peliculaServicio } from '../../../servicios';
import './PanelAdmin.css';

const PESTANAS = [
  { id: 'peliculas', texto: 'Películas' },
  { id: 'cines', texto: 'Cines' },
  { id: 'funciones', texto: 'Funciones' },
];

export default function PanelAdmin() {
  const [pestanaActiva, setPestanaActiva] = useState('peliculas');

  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // `formulario` decide qué se ve, con un solo estado en vez de dos
  // (`mostrando` + `editando`) porque nunca hacen falta a la vez:
  //   null     -> no hay formulario abierto
  //   'nueva'  -> formulario vacío, para crear
  //   objeto   -> formulario con esos datos cargados, para editar
  const [formulario, setFormulario] = useState(null);

  const cargarPeliculas = () => {
    setCargando(true);
    setError(null);
    peliculaServicio
      .listar()
      .then(setPeliculas)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarPeliculas();
  }, []);

  const guardarPelicula = async (datos) => {
    if (formulario === 'nueva') {
      await peliculaServicio.crear(datos);
    } else {
      await peliculaServicio.actualizar(formulario.id, datos);
    }
    setFormulario(null);
    cargarPeliculas();
  };

  const eliminarPelicula = async (id) => {
    await peliculaServicio.eliminar(id);
    cargarPeliculas();
  };

  return (
    <>
      <Banner
        titulo="Panel de administración"
        subtitulo="Cines, películas y funciones"
        imagenFondo="/banners/encabezadoAdmin.png"
        etiqueta="Panel de administración"
      />

      <div className="contenedor">
        <div className="panel-admin__pestanas" role="tablist" aria-label="Secciones del panel">
          {PESTANAS.map((pestana) => (
            <button
              key={pestana.id}
              type="button"
              role="tab"
              aria-selected={pestanaActiva === pestana.id}
              className={
                pestanaActiva === pestana.id
                  ? 'panel-admin__pestana panel-admin__pestana--activa'
                  : 'panel-admin__pestana'
              }
              onClick={() => setPestanaActiva(pestana.id)}
            >
              {pestana.texto}
            </button>
          ))}
        </div>

        {pestanaActiva === 'peliculas' && (
          <section>
            <div className="panel-admin__encabezado">
              <h2 className="panel-admin__titulo">Películas</h2>
              {!formulario && <Boton onClick={() => setFormulario('nueva')}>+ Agregar película</Boton>}
            </div>

            {formulario && (
              // `key` fuerza a React a crear un FormularioPelicula NUEVO
              // cuando cambia qué película se edita (o se pasa a "crear
              // nueva"), en vez de reutilizar el mismo componente con un
              // estado interno desactualizado de la película anterior.
              <FormularioPelicula
                key={formulario === 'nueva' ? 'nueva' : formulario.id}
                peliculaInicial={formulario === 'nueva' ? null : formulario}
                onGuardar={guardarPelicula}
                onCancelar={() => setFormulario(null)}
              />
            )}

            {cargando && <p className="mensaje-estado">Cargando películas…</p>}
            {error && <p className="mensaje-estado mensaje-estado--error">{error}</p>}
            {!cargando && !error && (
              <TablaPeliculas
                peliculas={peliculas}
                onEditar={setFormulario}
                onEliminar={eliminarPelicula}
              />
            )}
          </section>
        )}

        {pestanaActiva === 'cines' && (
          <p className="mensaje-estado">
            Gestión de cines — próximo paso, con el mismo patrón que Películas.
          </p>
        )}

        {pestanaActiva === 'funciones' && (
          <p className="mensaje-estado">
            Gestión de funciones — próximo paso, con el mismo patrón que Películas.
          </p>
        )}
      </div>
    </>
  );
}
