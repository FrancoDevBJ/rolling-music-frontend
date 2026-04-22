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
import MainLayout from "../layouts/MainLayout";
import AdminUsers from '../pages/AdminUsers';

const AppRouter = () => {
    return (
        <Router>
            <div className="app-layout">

                <Routes>

                    {/* RUTAS PÚBLICAS */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />

                    {/* RUTAS PROTEGIDAS */}
                    <Route element={<ProtectedRoute requiredRole="user" />}>

                    <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/nosotros" element={<About />} />
                    <Route path="/songdetail" element={<SongDetail />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/favoritos" element={<Favorites />} />
                    <Route path="/my-playlists" element={<MyPlaylists />} />
                    <Route path="/playlist/:id" element={<PlayList />} />
                    </Route>

                    </Route>

                    {/* ADMIN */}
                    <Route element={<ProtectedRoute requiredRole="admin" />}>
                    
                    <Route element={<MainLayout />}>
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/admin/usuarios" element={<AdminUsers />} />
                    </Route>
                    
                    </Route>

                    <Route path="*" element={<NotFound />} />

                </Routes>

            </div>
        </Router>
    );
};

export default AppRouter;