import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  (window as any).deferredPrompt = e;
  window.dispatchEvent(new Event('pwa_install_ready'));
});

window.addEventListener('appinstalled', () => {
  console.log('MGJ Monde Admin installed successfully');
  (window as any).deferredPrompt = null;
  window.dispatchEvent(new Event('pwa_app_installed'));
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
