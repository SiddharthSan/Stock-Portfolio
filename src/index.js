// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PriceProvider } from './context/priceContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PriceProvider>
      <App />
    </PriceProvider>
  </React.StrictMode>
);

reportWebVitals();