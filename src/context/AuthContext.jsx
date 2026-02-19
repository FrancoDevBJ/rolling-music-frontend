import React, { createContext, useContext, useState, useEffect } from 'react';
import musicApi from '../services/musicApi'; 
import googleAuthService from '../services/googleAuth'; 
import Swal from 'sweetalert2';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const saveSession = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const loginWithEmail = async (email, password) => {
        try {
            const response = await musicApi.post('/auth/login', { email, password });
            const { token, data } = response.data;

            saveSession({
                id: data.id || data._id, // Normalizamos el ID
                email: data.email,
                displayName: data.name,
                role: data.role,
                avatar: data.img // Guardamos la imagen de perfil que viene del server
            }, token);
            
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al iniciar sesión';
            // Dejamos que el componente maneje el Swal si prefieres, 
            // pero lo mantenemos aquí por seguridad.
            throw error; 
        }
    };

    const loginWithGoogle = async () => {
    try {
        const firebaseUser = await googleAuthService.loginWithGoogle();
        
        const fullName = firebaseUser.displayName || "Usuario Google";
        const [firstName, ...lastNameParts] = fullName.split(" ");
        const lastName = lastNameParts.join(" ") || "Google";

        // 🛠️ Enviamos 'isGoogleLogin' como string para asegurar compatibilidad
        const response = await musicApi.post('/auth/login', { 
            email: firebaseUser.email,
            name: firstName,
            surname: lastName,
            isGoogleLogin: "true" 
        });

        const { token, data } = response.data;
        saveSession({
            id: data.id || data._id,
            email: data.email,
            displayName: data.name,
            role: data.role,
            avatar: data.photoURL || data.profilePic
        }, token);

        return response.data; // 🛠️ IMPORTANTE: Retorna la data para que el Form sepa que terminó
    } catch (error) {
        console.error('Detalle error backend:', error.response?.data);
        throw error; 
    }
    };

    const updateUserData = async (updatedData) => {
    try {
        // Solo mandamos name y surname
        const dataToSend = {
            name: updatedData.name,
            surname: updatedData.surname
        };

        const response = await musicApi.put('/auth/profile/update', dataToSend);
        const { data } = response.data;

        // Actualizamos el estado local manteniendo el mismo email
        const newUserState = { 
            ...user, 
            displayName: `${data.name} ${data.surname || ''}`.trim()
        };
        
        saveSession(newUserState, localStorage.getItem('token'));
        return data;
    } catch (error) {
        throw error;
    }
};

    // --- 🛠️ REGISTRO ACTUALIZADO PARA FORMDATA ---
    const registerWithEmail = async (formData) => {
        try {
            // Importante: No desestructuramos (email, password...), 
            // recibimos el objeto FormData completo que viene del componente.
            await musicApi.post('/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            Swal.fire({
                title: '¡Registro exitoso!',
                text: 'Te enviamos un código de verificación. Revisa tu email para activar tu cuenta.',
                icon: 'success'
            });
        } catch (error) {
            console.error("Error en registro:", error);
            throw error; // Lanzamos el error para que el componente lo muestre con Swal
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.clear();
        googleAuthService.logout(); 
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if (storedUser && token) setUser(storedUser);
        setIsLoading(false);
    }, []);

    const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

    const value = {
        user,
        isAdmin, 
        isLogged: !!user,
        isLoading,
        loginWithEmail,
        loginWithGoogle,
        updateUserData,
        registerWithEmail,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};