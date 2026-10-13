# CineMatch — Frontend 
React + Vite + React Router.

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
├─ estilos/                  variables.css y global.css
├─ compartido/               
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
│  └─ api/                   Implementación contra Spring Boot
└─ mocks/                    cines.json, peliculas.json, funciones.json
```
## Variables de entorno

Configura las variables en .env.local, tomando como referencia .env.example.

Variable	Descripción
VITE_USAR_MOCKS	Activa los datos de prueba (true) o la API real (false).
VITE_URL_API	URL base del backend Spring Boot.

Ejemplo de configuración local:

VITE_USAR_MOCKS=false
VITE_URL_API=http://127.0.0.1:8081/api

Las variables que comienzan por VITE_ son accesibles desde el código del navegador. No guardes contraseñas, claves privadas ni credenciales secretas en estas variables.

Después de modificar las variables, reinicia el servidor de desarrollo.

## Conexión con el backend

La comunicación con Spring Boot se centraliza en la carpeta src/servicios/.

index.js: punto de entrada que utilizan los componentes para acceder a los servicios.
config.js: determina si se utilizan mocks o la API real.
clienteHttp.js: centraliza las solicitudes HTTP y el manejo de respuestas.
tipos.js: documenta los contratos de datos esperados.
api/: contiene las implementaciones que consumen los endpoints del backend.
mock/: contiene las implementaciones para trabajar con datos de prueba.

Los componentes de React no deben realizar solicitudes HTTP directamente ni depender de la estructura interna de los mocks. Si la respuesta de Spring Boot tiene una estructura diferente, la adaptación debe realizarse en la capa de servicios.
## Arquitectura de pagos

El frontend consume Spring Boot en `http://127.0.0.1:8081/api`. Al confirmar una reserva, Spring solicita el cobro al microservicio Django y Django confirma el resultado mediante un webhook. El navegador no llama a Django directamente.

Los precios, horarios y direcciones de `src/mocks` son ilustrativos.
