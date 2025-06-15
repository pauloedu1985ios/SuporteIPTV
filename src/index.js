import React from 'react';
import ReactDOM from 'react-dom/client'; // Importe createRoot para React 18
import App from './App'; // Importe o componente App

// Para React 18 e superior
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Para React 17 e anterior (se ainda estiver usando)
/*
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
*/