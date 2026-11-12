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
import { clienteAuthServicioMock } from './mock/clienteAuthServicioMock';
import { reservaServicioMock } from './mock/reservaServicioMock';
import { pagoServicioMock } from './mock/pagoServicioMock';
import { peliculaServicioApi } from './api/peliculaServicioApi';
import { cineServicioApi } from './api/cineServicioApi';
import { funcionServicioApi } from './api/funcionServicioApi';
import { clienteAuthServicioApi } from './api/clienteAuthServicioApi';
import { reservaServicioApi } from './api/reservaServicioApi';
import { pagoServicioApi } from './api/pagoServicioApi';

export const peliculaServicio = USAR_MOCKS ? peliculaServicioMock : peliculaServicioApi;
export const cineServicio = USAR_MOCKS ? cineServicioMock : cineServicioApi;
export const funcionServicio = USAR_MOCKS ? funcionServicioMock : funcionServicioApi;
// `clienteAuthServicio` es el login de los CLIENTES que hacen reservas
// (cualquiera puede registrarse). El login del administrador ya no vive en
// este proyecto: pertenece a la aplicación del panel de administración.
export const clienteAuthServicio = USAR_MOCKS ? clienteAuthServicioMock : clienteAuthServicioApi;
export const reservaServicio = USAR_MOCKS ? reservaServicioMock : reservaServicioApi;
export const pagoServicio = USAR_MOCKS ? pagoServicioMock : pagoServicioApi;
