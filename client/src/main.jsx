import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a2e',
                color: '#b8b8d0',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#34d399', secondary: '#0a0a0f' },
              },
              error: {
                iconTheme: { primary: '#fb7185', secondary: '#0a0a0f' },
              },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
