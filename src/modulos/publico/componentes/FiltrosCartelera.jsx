import './FiltrosCartelera.css';

// COMPONENTE CONTROLADO: los tres campos (texto, género, cine) no guardan su
// propio valor — lo reciben del padre (`Cartelera`) por props y, cuando el
// usuario escribe o elige algo, avisan al padre con `onTextoChange`,
// `onGeneroChange` y `onCineChange` en vez de manejar su propio useState.
// Así el padre es siempre la única fuente de verdad, y puede usar esos
// valores para filtrar la lista de películas.
export default function FiltrosCartelera({
  texto,
  onTextoChange,
  genero,
  onGeneroChange,
  cine,
  onCineChange,
  generos,
  cines,
  onLimpiar,
  hayFiltrosActivos,
}) {
  return (
    <div className="filtros-cartelera">
      <input
        type="search"
        className="filtros-cartelera__campo filtros-cartelera__buscar"
        placeholder="Buscar película por título…"
        value={texto}
        onChange={(evento) => onTextoChange(evento.target.value)}
        aria-label="Buscar película por título"
      />

      <select
        className="filtros-cartelera__campo"
        value={genero}
        onChange={(evento) => onGeneroChange(evento.target.value)}
        aria-label="Filtrar por género"
      >
        <option value="">Todos los géneros</option>
        {generos.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <select
        className="filtros-cartelera__campo"
        value={cine}
        onChange={(evento) => onCineChange(evento.target.value)}
        aria-label="Filtrar por cine"
      >
        <option value="">Todos los cines</option>
        {cines.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>

      {/* Renderizado condicional: el botón solo aparece si hay algo que limpiar */}
      {hayFiltrosActivos && (
        <button type="button" className="filtros-cartelera__limpiar" onClick={onLimpiar}>
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
