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
import { peliculaServicioApi } from './api/peliculaServicioApi';
import { cineServicioApi } from './api/cineServicioApi';
import { funcionServicioApi } from './api/funcionServicioApi';

export const peliculaServicio = USAR_MOCKS ? peliculaServicioMock : peliculaServicioApi;
export const cineServicio = USAR_MOCKS ? cineServicioMock : cineServicioApi;
export const funcionServicio = USAR_MOCKS ? funcionServicioMock : funcionServicioApi;
