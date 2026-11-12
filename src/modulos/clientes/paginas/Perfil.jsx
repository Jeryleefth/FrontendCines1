import Banner from '../../../compartido/componentes/Banner';
import FormularioPerfil from '../../../compartido/componentes/FormularioPerfil';
import { useClienteAuth } from '../contexto/ClienteAuthContext';

// El formulario en sí (nombre, teléfono, correo fijo, contraseña) vive en
// FormularioPerfil. Esta página solo le pasa los datos de la sesión del
// cliente y qué hacer al guardar.
export default function Perfil() {
  const { cliente, actualizarPerfil } = useClienteAuth();

  return (
    <>
      {/* Igual que MisReservas.jsx: la foto de fondo YA trae el título
          "MI PERFIL" dibujado adentro, así que NO se manda `titulo` aquí,
          solo `subtitulo` (el "Hola, {nombre}", que sí es dinámico y no se
          puede hornear en la imagen). `conVelo={false}` + `subtituloAbajo`
          para que ese subtítulo no quede encima del título de la imagen
          (ver el comentario de Banner.jsx). */}
      <Banner
        subtitulo={`Hola, ${cliente.nombre}`}
        imagenFondo="/banners/fondoPerfil.jpg"
        forzarTexto
        conVelo={false}
        subtituloAbajo
        etiqueta="Mi perfil"
      />

      <div className="contenedor">
        <FormularioPerfil
          correo={cliente.correo}
          nombreInicial={cliente.nombre}
          telefonoInicial={cliente.telefono}
          onGuardar={actualizarPerfil}
        />
      </div>
    </>
  );
}
