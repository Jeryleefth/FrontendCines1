// PUNTO DE ENTRADA de la capa de servicios.
//
// Los componentes SIEMPRE importan desde aquí:
//     import { peliculaServicio } from '../../../servicios';
// y nunca desde /mock ni /api. Así el cambio a la API real es una variable de
// entorno (ver config.js), no una edición de componentes.

import { USAR_MOCKS } from './config';
import { peliculaServicioMock } from './mock/peliculaServicioMock';
import { cineServicioMock } from './mock/cineServicioMock';
import { funcionServicioMock } from './mock/funcionServicioMock';
import { authServicioMock } from './mock/authServicioMock';
import { clienteAuthServicioMock } from './mock/clienteAuthServicioMock';
import { reservaServicioMock } from './mock/reservaServicioMock';
import { peliculaServicioApi } from './api/peliculaServicioApi';
import { cineServicioApi } from './api/cineServicioApi';
import { funcionServicioApi } from './api/funcionServicioApi';
import { authServicioApi } from './api/authServicioApi';
import { clienteAuthServicioApi } from './api/clienteAuthServicioApi';
import { reservaServicioApi } from './api/reservaServicioApi';

export const peliculaServicio = USAR_MOCKS ? peliculaServicioMock : peliculaServicioApi;
export const cineServicio = USAR_MOCKS ? cineServicioMock : cineServicioApi;
export const funcionServicio = USAR_MOCKS ? funcionServicioMock : funcionServicioApi;
// `authServicio` es el login del PANEL DE ADMINISTRACIÓN (un usuario fijo).
// `clienteAuthServicio` es el login de los CLIENTES que hacen reservas
// (cualquiera puede registrarse). Son dos roles distintos, con sus propias
// pantallas y su propio contexto de sesión — por eso son dos servicios
// separados en vez de uno con un campo "rol".
export const authServicio = USAR_MOCKS ? authServicioMock : authServicioApi;
export const clienteAuthServicio = USAR_MOCKS ? clienteAuthServicioMock : clienteAuthServicioApi;
export const reservaServicio = USAR_MOCKS ? reservaServicioMock : reservaServicioApi;
