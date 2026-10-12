import { simularLatencia } from './utilidades';

export const pagoServicioMock = {
  crear: ({ reservaId, metodoPago }) => simularLatencia({ reservaId, metodoPago, estado: 'APROBADO' }),
};
