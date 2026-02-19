import { z } from 'zod';

// Schema para el Login (asumo que ya lo tienes o lo necesitarás)
export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Schema para el Registro (asumo que ya lo tienes o lo necesitarás)
export const registerSchema = z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coínciden',
    path: ['confirmPassword']
});

// SCHEMA PARA EL CRUD DE CANCIONES

export const songSchema = z.object({
    title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
    artist: z.string().min(3, 'El artista debe tener al menos 3 caracteres'),
    genre: z.string().min(3, 'El género es requerido'),
});