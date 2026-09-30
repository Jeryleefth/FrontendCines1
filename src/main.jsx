import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './estilos/variables.css';
import './estilos/global.css';
import App from './App';

// Punto de entrada: monta <App /> dentro del <div id="root"> de index.html.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
