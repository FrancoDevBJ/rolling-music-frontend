import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './routes/AppRouter';
import { SongsProvider } from './context/SongsContext'; 
import { AuthProvider } from './context/AuthContext';
import './App.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
            {/* 2. AuthProvider: Proporciona la lógica de autenticación (login/registro/usuario) */}
      <AuthProvider>
        {/* 3. SongsProvider: Proporciona el estado global de canciones, búsqueda y reproducción. */}
        <SongsProvider>
          
          {/* 4. AppRouter: Contiene el diseño (Layout Grid) y todas las rutas (Home, Admin, etc.) */}
          <AppRouter />
          
        </SongsProvider>
      </AuthProvider>
    </StrictMode>,
)