import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import './styles/globals.css';   // <-- Put it here
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);