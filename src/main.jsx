import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './routes/AppRouter';
import { SongsProvider } from './context/SongsContext'; 
import { AuthProvider } from './context/AuthContext';
import './App.css';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
        <SongsProvider>
          <AppRouter />
        </SongsProvider>
      </AuthProvider>
)