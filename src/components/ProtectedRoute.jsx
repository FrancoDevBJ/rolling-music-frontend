import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Consumimos el Contexto

// Añadimos el prop 'requiredRole' para proteger la ruta /admin
const ProtectedRoute = ({ requiredRole = 'user' }) => {
    // Obtiene el estado centralizado
    const { user, isAdmin, isLoading } = useAuth(); 
    
    // 1. Manejo de Carga
    if (isLoading) {
        return <div>Cargando sesión...</div>; 
    }
    
    // 2. Autenticación Requerida
    if (!user) {
        // Redirige al login si no está logueado
        return <Navigate to="/login" replace />;
    }

    // Si la ruta requiere superadmin, verificamos específicamente ese rol
    if (requiredRole === 'superadmin' && user.role !== 'superadmin') {
        return <Navigate to="/" replace />;
    }

    // 3. Verificación de Roles
    if (requiredRole === 'admin' && !(user.role === 'admin' || user.role === 'superadmin')) {
        // Si la ruta requiere admin, pero el usuario no lo es, redirige a Home
        if (!isAdmin) {
            return <Navigate to="/" replace />; 
        }
    }
    
    // Si pasa, permite el acceso a la ruta anidada
    return <Outlet />;
};

export default ProtectedRoute;