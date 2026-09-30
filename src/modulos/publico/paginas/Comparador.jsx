import { Link, useParams } from 'react-router-dom';
import Banner from '../../../compartido/componentes/Banner';

// PLACEHOLDER: xd
export default function Comparador() {
  // useParams lee la parte variable de la URL: /comparador/:peliculaId
  const { peliculaId } = useParams();

  return (
    <>
      <Banner titulo="Comparador de precios" />
      <div className="contenedor">
        <p className="mensaje-estado">
          {peliculaId
            ? `Aquí se compararán las funciones de la película "${peliculaId}".`
            : 'En proceso'}
        </p>
        <p className="mensaje-estado">
          <Link to="/">Volver a la cartelera</Link>
        </p>
      </div>
    </>
  );
}
