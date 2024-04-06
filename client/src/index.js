import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SocketProvider } from './Helpers/SocketContext';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SocketProvider>
    <App />
  </SocketProvider>
);
 