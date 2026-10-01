import { useEffect, useMemo, useState } from 'react';
import Banner from '../../../compartido/componentes/Banner';
import Boton from '../../../compartido/componentes/Boton';
import Cargando from '../../../compartido/componentes/Cargando';
import FormularioPerfil from '../../../compartido/componentes/FormularioPerfil';
import FormularioPelicula from '../componentes/FormularioPelicula';
import TablaPeliculas from '../componentes/TablaPeliculas';
import FormularioCine from '../componentes/FormularioCine';
import TablaCines from '../componentes/TablaCines';
import FormularioFuncion from '../componentes/FormularioFuncion';
import TablaFunciones from '../componentes/TablaFunciones';
import { peliculaServicio, cineServicio, funcionServicio } from '../../../servicios';
import { useAuth } from '../../autenticacion/contexto/AuthContext';
import './PanelAdmin.css';

const PESTANAS = [
  { id: 'peliculas', texto: 'Películas' },
  { id: 'cines', texto: 'Cines' },
  { id: 'funciones', texto: 'Funciones' },
  { id: 'perfil', texto: 'Mi perfil' },
];

export default function PanelAdmin() {
  const { sesion, actualizarPerfil } = useAuth();
  const [pestanaActiva, setPestanaActiva] = useState('peliculas');

  // --- Películas ---
  const [peliculas, setPeliculas] = useState([]);
  const [cargandoPeliculas, setCargandoPeliculas] = useState(true);
  const [errorPeliculas, setErrorPeliculas] = useState(null);

  // `formulario` decide qué se ve, con un solo estado en vez de dos
  // (`mostrando` + `editando`) porque nunca hacen falta a la vez:
  //   null     -> no hay formulario abierto
  //   'nueva'  -> formulario vacío, para crear
  //   objeto   -> formulario con esos datos cargados, para editar
  const [formularioPelicula, setFormularioPelicula] = useState(null);

  const cargarPeliculas = () => {
    setCargandoPeliculas(true);
    setErrorPeliculas(null);
    peliculaServicio
      .listar()
      .then(setPeliculas)
      .catch((e) => setErrorPeliculas(e.message))
      .finally(() => setCargandoPeliculas(false));
  };

  useEffect(() => {
    cargarPeliculas();
  }, []);

  const guardarPelicula = async (datos) => {
    if (formularioPelicula === 'nueva') {
      await peliculaServicio.crear(datos);
    } else {
      await peliculaServicio.actualizar(formularioPelicula.id, datos);
    }
    setFormularioPelicula(null);
    cargarPeliculas();
  };

  const eliminarPelicula = async (id) => {
    await peliculaServicio.eliminar(id);
    cargarPeliculas();
  };

  // --- Cines ---
  // Mismo patrón tri-state que Películas, en su propio estado: cada sección
  // del panel necesita saber por separado si TIENE un formulario abierto
  // (y de cuál fila), así que no puede compartir `formularioPelicula`.
  const [cines, setCines] = useState([]);
  const [cargandoCines, setCargandoCines] = useState(true);
  const [errorCines, setErrorCines] = useState(null);
  const [formularioCine, setFormularioCine] = useState(null);

  const cargarCines = () => {
    setCargandoCines(true);
    setErrorCines(null);
    cineServicio
      .listar()
      .then(setCines)
      .catch((e) => setErrorCines(e.message))
      .finally(() => setCargandoCines(false));
  };

  useEffect(() => {
    cargarCines();
  }, []);

  const guardarCine = async (datos) => {
    if (formularioCine === 'nueva') {
      await cineServicio.crear(datos);
    } else {
      await cineServicio.actualizar(formularioCine.id, datos);
    }
    setFormularioCine(null);
    cargarCines();
  };

  const eliminarCine = async (id) => {
    await cineServicio.eliminar(id);
    cargarCines();
  };

  // --- Funciones ---
  const [funciones, setFunciones] = useState([]);
  const [cargandoFunciones, setCargandoFunciones] = useState(true);
  const [errorFunciones, setErrorFunciones] = useState(null);
  const [formularioFuncion, setFormularioFuncion] = useState(null);

  const cargarFunciones = () => {
    setCargandoFunciones(true);
    setErrorFunciones(null);
    funcionServicio
      .listarTodas()
      .then(setFunciones)
      .catch((e) => setErrorFunciones(e.message))
      .finally(() => setCargandoFunciones(false));
  };

  useEffect(() => {
    cargarFunciones();
  }, []);

  // Una función solo guarda `peliculaId`; para mostrar el título en la tabla
  // y en el formulario hace falta buscarlo por id. `useMemo` evita reconstruir
  // este mapa en cada render — solo cuando `peliculas` realmente cambia.
  const peliculasPorId = useMemo(() => new Map(peliculas.map((p) => [p.id, p])), [peliculas]);

  const guardarFuncion = async (datos) => {
    if (formularioFuncion === 'nueva') {
      await funcionServicio.crear(datos);
    } else {
      await funcionServicio.actualizar(formularioFuncion.id, datos);
    }
    setFormularioFuncion(null);
    cargarFunciones();
  };

  const eliminarFuncion = async (id) => {
    await funcionServicio.eliminar(id);
    cargarFunciones();
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
              {!formularioPelicula && (
                <Boton onClick={() => setFormularioPelicula('nueva')}>+ Agregar película</Boton>
              )}
            </div>

            {formularioPelicula && (
              // `key` fuerza a React a crear un FormularioPelicula NUEVO
              // cuando cambia qué película se edita (o se pasa a "crear
              // nueva"), en vez de reutilizar el mismo componente con un
              // estado interno desactualizado de la película anterior.
              <FormularioPelicula
                key={formularioPelicula === 'nueva' ? 'nueva' : formularioPelicula.id}
                peliculaInicial={formularioPelicula === 'nueva' ? null : formularioPelicula}
                onGuardar={guardarPelicula}
                onCancelar={() => setFormularioPelicula(null)}
              />
            )}

            {cargandoPeliculas && <Cargando texto="Cargando películas…" />}
            {errorPeliculas && <p className="mensaje-estado mensaje-estado--error">{errorPeliculas}</p>}
            {!cargandoPeliculas && !errorPeliculas && (
              <TablaPeliculas
                peliculas={peliculas}
                onEditar={setFormularioPelicula}
                onEliminar={eliminarPelicula}
              />
            )}
          </section>
        )}

        {pestanaActiva === 'cines' && (
          <section>
            <div className="panel-admin__encabezado">
              <h2 className="panel-admin__titulo">Cines</h2>
              {!formularioCine && <Boton onClick={() => setFormularioCine('nueva')}>+ Agregar cine</Boton>}
            </div>

            {formularioCine && (
              <FormularioCine
                key={formularioCine === 'nueva' ? 'nueva' : formularioCine.id}
                cineInicial={formularioCine === 'nueva' ? null : formularioCine}
                onGuardar={guardarCine}
                onCancelar={() => setFormularioCine(null)}
              />
            )}

            {cargandoCines && <Cargando texto="Cargando cines…" />}
            {errorCines && <p className="mensaje-estado mensaje-estado--error">{errorCines}</p>}
            {!cargandoCines && !errorCines && (
              <TablaCines cines={cines} onEditar={setFormularioCine} onEliminar={eliminarCine} />
            )}
          </section>
        )}

        {pestanaActiva === 'funciones' && (
          <section>
            <div className="panel-admin__encabezado">
              <h2 className="panel-admin__titulo">Funciones</h2>
              {!formularioFuncion && (
                <Boton
                  onClick={() => setFormularioFuncion('nueva')}
                  disabled={peliculas.length === 0 || cines.length === 0}
                >
                  + Agregar función
                </Boton>
              )}
            </div>

            {(peliculas.length === 0 || cines.length === 0) && !formularioFuncion && (
              <p className="mensaje-estado">
                Primero registra al menos una película y un cine con salas — una función necesita ambos.
              </p>
            )}

            {formularioFuncion && (
              <FormularioFuncion
                key={formularioFuncion === 'nueva' ? 'nueva' : formularioFuncion.id}
                funcionInicial={formularioFuncion === 'nueva' ? null : formularioFuncion}
                peliculas={peliculas}
                cines={cines}
                onGuardar={guardarFuncion}
                onCancelar={() => setFormularioFuncion(null)}
              />
            )}

            {cargandoFunciones && <Cargando texto="Cargando funciones…" />}
            {errorFunciones && <p className="mensaje-estado mensaje-estado--error">{errorFunciones}</p>}
            {!cargandoFunciones && !errorFunciones && (
              <TablaFunciones
                funciones={funciones}
                peliculasPorId={peliculasPorId}
                onEditar={setFormularioFuncion}
                onEliminar={eliminarFuncion}
              />
            )}
          </section>
        )}

        {/* El formulario en sí es el mismo componente que usa Mi perfil del
            lado de clientes (FormularioPerfil) — ver ese archivo. Acá no
            se le pasa `mostrarTelefono`: el administrador no tiene ese
            campo. */}
        {pestanaActiva === 'perfil' && (
          <section>
            <div className="panel-admin__encabezado">
              <h2 className="panel-admin__titulo">Mi perfil</h2>
            </div>
            <FormularioPerfil
              correo={sesion.correo}
              nombreInicial={sesion.nombre}
              onGuardar={actualizarPerfil}
            />
          </section>
        )}
      </div>
    </>
  );
}
