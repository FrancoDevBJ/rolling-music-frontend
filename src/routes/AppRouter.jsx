import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

// Páginas y Componentes
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Admin from '../pages/Admin';
import NotFound from "../pages/NotFound"; 
import ProtectedRoute from '../components/ProtectedRoute';
import SongDetail from '../pages/SongDetail';
import About from '../pages/About';
import PlayList from '../pages/PlayList'; // Detalle de UNA playlist
import MyPlaylists from '../pages/MyPlaylists'; // Vista general de TODAS las playlists
import Search from '../pages/Search';
import Favorites from '../components/Favorites';
import VerifyEmail from '../pages/VerifyEmail';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* RUTAS PÚBLICAS */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                
                
                {/* RUTAS PROTEGIDAS (Requieren Login) */}
                <Route element={<ProtectedRoute requiredRole="user" />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/nosotros" element={<About/>}/>
                    <Route path="/songdetail" element={<SongDetail />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/favoritos" element={<Favorites />} />
                    
                    {/* 🛠️ RUTAS DE PLAYLISTS */}
                    <Route path="/mis-playlists" element={<MyPlaylists />} /> 
                    <Route path="/playlist/:id" element={<PlayList />} /> {/* Ruta dinámica para ver el contenido de una lista */}
                </Route>

                {/* RUTAS DE ADMINISTRADOR */}
                <Route element={<ProtectedRoute requiredRole="admin" />}>
                    <Route path="/admin" element={<Admin />} />
                    {/* 🛠️ NOTA: El admin hereda acceso a las rutas de usuario por jerarquía, 
                        pero puedes duplicar o dejar solo las específicas de gestión aquí */}
                </Route>

                {/* Ruta de Fallback (404) */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;