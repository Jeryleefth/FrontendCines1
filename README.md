# CineMatch — Frontend (Entrega 1)

React + Vite + React Router. Trabaja con datos simulados hasta que la API de Spring Boot esté lista.

## Ejecutar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera /dist
```

Requiere Node 20 o superior.

## Estructura

```
src/
├─ main.jsx                  Punto de entrada
├─ App.jsx                   Tabla de rutas (React Router)
├─ configuracion/            Datos de configuración (enlaces de la barra)
├─ estilos/                  variables.css (paleta del proyecto Swing) y global.css
├─ compartido/               Lo que usarán AMBAS apps en la Entrega 2
│  ├─ componentes/           Navbar, Layout, Banner, Boton
│  └─ utilidades/            formato.js (precios en COP, fechas)
├─ modulos/
│  ├─ publico/               Portal de clientes (cartelera, comparador, reservas)
│  │  ├─ paginas/
│  │  └─ componentes/        TarjetaPelicula, DetallePeliculaModal
│  └─ admin/                 Panel de administración (CRUD)
│     └─ paginas/
├─ servicios/                Capa de acceso a datos
│  ├─ index.js               Los componentes importan SOLO desde aquí
│  ├─ config.js              Interruptor mock / API real
│  ├─ tipos.js               Contrato de datos (JSDoc) para el equipo de backend
│  ├─ clienteHttp.js         fetch centralizado
│  ├─ mock/                  Implementación con JSON
│  └─ api/                   Implementación contra Spring Boot (misma forma)
└─ mocks/                    cines.json, peliculas.json, funciones.json
```

Regla de oro: `modulos/publico` y `modulos/admin` nunca se importan entre sí; ambos pueden
importar de `compartido/` y `servicios/`. Así, en la Entrega 2 cada módulo se convierte en una app.

## Pasar a la API real

1. Copia `.env.example` a `.env.local`.
2. Cambia `VITE_USAR_MOCKS=false` y ajusta `VITE_URL_API`.
3. Reinicia `npm run dev`. Si el JSON del backend difiere de `servicios/tipos.js`,
   se adapta en `servicios/api/*`, nunca en los componentes.

Los precios, horarios y direcciones de `src/mocks` son ilustrativos.
