# CineMatch — Portal de clientes
React + Vite + React Router.

Portal público de CineMatch: cartelera, comparador de tarifas y horarios,
selección de asientos, pago y reservas del cliente. El **panel de
administración** (CRUD de películas, cines y funciones) esta en otro
repositorio: [FrontdCinesAdmin](https://github.com/Jeryleefth/FrontdCinesAdmin),
hecho en Angular.

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
│  ├─ publico/               Cartelera, comparador, selección de asientos y pago
│  │  ├─ paginas/
│  │  └─ componentes/        TarjetaPelicula, DetallePeliculaModal, MapaAsientos…
│  └─ clientes/              Cuenta del cliente: acceso, perfil y mis reservas
│     ├─ contexto/           ClienteAuthContext (sesión)
│     ├─ componentes/        RutaProtegidaCliente
│     └─ paginas/            Acceso, Perfil, MisReservas
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

## Cuentas

Aquí solo inician sesión **clientes** (`POST /api/clientes/login`) y cualquiera
puede crear una cuenta. Las cuentas de administrador no entran a este portal:
usan el panel de administración (Angular, puerto 4200).

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

El portal solo **lee** el catálogo (películas, cines, funciones); crear,
editar y eliminar contenido se hace desde el panel de administración.

## Puertos en desarrollo

| Aplicación | Puerto |
| --- | --- |
| Portal de clientes (este repo) | 5173 |
| Panel de administración (Angular) | 4200 |
| Core API (Spring Boot) | 8081 |
| Microservicio de pagos (Django) | 8000 |
