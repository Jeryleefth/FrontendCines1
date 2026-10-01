// CONTRATO DE DATOS entre el frontend y la API de Spring Boot.
//
// Estos "typedef" son solo documentación (JSDoc): describen la forma exacta
// del JSON que devuelven los servicios, tanto los mock como los reales.
// Si el backend devuelve algo distinto, se corrige en `servicios/api/*`
// (mapeando), no en los componentes.
//
// Los ids son texto (String) para que encajen con MongoDB en la Entrega 2.

/**
 * @typedef {Object} Pelicula
 * @property {string} id
 * @property {string} titulo
 * @property {string} sinopsis
 * @property {number} duracion        Minutos.
 * @property {string} genero
 * @property {string} clasificacion
 * @property {string} idioma
 * @property {string} fechaEstreno    ISO 8601 (AAAA-MM-DD).
 * @property {string} rutaImagen      URL del póster.
 */

/**
 * @typedef {Object} Sala
 * @property {string} id
 * @property {string} nombre
 * @property {number} capacidad
 * @property {string} tipo            "2D" | "3D" | "VIP".
 */

/**
 * @typedef {Object} Cine
 * @property {string} id
 * @property {string} cadena          "Cinemark" | "Cine Colombia" | "Royal Films".
 * @property {string} nombre
 * @property {string} direccion
 * @property {string} ciudad
 * @property {Sala[]} salas
 */

/**
 * @typedef {Object} Funcion
 * @property {string} id
 * @property {string} peliculaId
 * @property {string} fecha           ISO 8601 (AAAA-MM-DD).
 * @property {string} horaInicio      "HH:mm".
 * @property {string} horaFin         "HH:mm".
 * @property {string} tipoFuncion     "Doblada" | "Subtitulada" | "Original".
 * @property {string} formato         "2D" | "3D" | "VIP".
 * @property {number} precio          Pesos colombianos (COP).
 * @property {{id: string, nombre: string, cadena: string}} cine
 * @property {{id: string, nombre: string, tipo: string, capacidad: number}} sala
 */

/**
 * Resultado del comparador: un elemento por cine donde se proyecta la película.
 * @typedef {Object} ComparacionCine
 * @property {Cine} cine
 * @property {number} precioDesde     Precio más bajo entre sus funciones.
 * @property {Funcion[]} funciones    Ordenadas por fecha y hora.
 */

export {};
