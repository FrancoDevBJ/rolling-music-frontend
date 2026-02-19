import axios from 'axios';

// 🛠️ Usamos la variable de entorno que definimos antes
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const musicApi = axios.create({
    baseURL: API_URL,
});

// INTERCEPTOR: Agrega el Token de seguridad automáticamente
musicApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- FUNCIONES ESPECÍFICAS ---

// Obtener canciones de MongoDB
export const getMySongs = async () => {
    const response = await musicApi.get('/song');
    return response.data;
};

// Subir nueva canción (Admin)
export const uploadSong = async (formData) => {
    const response = await musicApi.post('/song', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// 🛠️ Agregamos una exportación por defecto y las funciones nombradas
export default musicApi;