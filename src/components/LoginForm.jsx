import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 🛠️ Usamos Link para navegación interna
import { useAuth } from '../context/AuthContext'; 
import { loginSchema } from '../utils/validation'; 
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2'; // 🛠️ Sugerencia: Mejora la estética de los errores
import Fondo from '../assets/imagenes/logos/FondoLogo.jpg'
import logo from '../assets/imagenes/logos/Logo.png'

const LoginForm = () => {
    const { loginWithGoogle, loginWithEmail } = useAuth(); 
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    // ----------------------------------------------------
    // MANEJO DE LOGIN CON GOOGLE
    // ----------------------------------------------------
    const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
        // 🛠️ Simplemente llamamos a la función del contexto. 
        // Ella ya se encarga de todo con Firebase y el Backend.
        await loginWithGoogle();
        navigate('/'); 
    } catch (error) {
        console.error("Error en login:", error);
        Swal.fire('Error', 'No se pudo sincronizar con Google', 'error');
    } finally {
        setIsSubmitting(false);
    }
};
    
    // ----------------------------------------------------
    // MANEJO DE LOGIN CON EMAIL/PASSWORD
    // ----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); 
        setIsSubmitting(true);

        try {
            // 1. Validación con Zod
            loginSchema.parse(formData);
            
            // 2. Llama a la función de login
            await loginWithEmail(formData.email, formData.password);
            
            // Éxito: El AuthContext debería manejar el estado, nosotros solo navegamos
            navigate('/'); 
            
        } catch (error) {
            if (error.issues) {
                // Errores de validación de Zod
                const newErrors = {};
                error.issues.forEach(issue => {
                    newErrors[issue.path[0]] = issue.message; 
                });
                setErrors(newErrors);
            } else {
                // 🛠️ MEJORA: Manejo de errores del backend
                // Si el backend devuelve un mensaje específico lo usamos, sino uno genérico
                const message = error.response?.data?.message || 'Credenciales incorrectas o usuario no encontrado.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error de acceso',
                    text: message,
                    background: '#1a1a1a',
                    color: '#fff',
                    confirmButtonColor: '#7c3aed'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{background: `url(${Fondo}) no-repeat center center / cover fixed`}} className="min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/5">
                
                {/* Columna Izquierda: Logo */}
                <div className="hidden md:flex flex-1 p-8 flex-col items-center justify-center text-center bg-black/40 backdrop-blur-sm">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-64 h-64 flex items-center justify-center mb-6 animate-fade-in">
                            <img src={logo} alt="logo" className="w-full h-auto drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
                        </div>
                        <p className="text-xl font-serif italic text-violet-200">Deja que la música ruede.</p>
                        <p className="text-xl font-serif italic text-violet-400">Tú solo dale play.</p>
                    </div>
                </div>

                {/* Columna Derecha: Formulario */}
                <div className="flex-1 p-8 md:p-12 bg-neutral-800 flex flex-col justify-center">
                    <h2 className="text-3xl font-black text-white text-center mb-2 uppercase tracking-tighter">
                        ¡Hola de nuevo!
                    </h2>
                    <p className="text-gray-400 text-center mb-8 text-sm">Ingresa a tu cuenta de RollingPlayer</p>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center py-3 px-4 bg-white text-black hover:bg-gray-200 rounded-lg font-bold transition duration-200 mb-6 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                        {isSubmitting ? 'Conectando...' : 'Entrar con Google'}
                    </button>
                    
                    <div className="relative flex justify-center text-xs uppercase mb-6">
                        <div className="grow border-t border-neutral-700"></div>
                        <span className="shrink mx-4 text-gray-500">O con email</span>
                        <div className="grow border-t border-neutral-700"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleChange}
                                placeholder="Correo electrónico"
                                className={`w-full p-3 rounded-lg bg-neutral-900 border text-white placeholder-gray-500 focus:ring-2 focus:ring-violet-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-neutral-700'}`}
                            />
                            {errors.email && <p className="mt-1 text-[10px] text-red-400 uppercase font-bold">{errors.email}</p>}
                        </div>
                        
                        <div>
                            <input
                                type="password" name="password" value={formData.password} onChange={handleChange}
                                placeholder="Contraseña"
                                className={`w-full p-3 rounded-lg bg-neutral-900 border text-white placeholder-gray-500 focus:ring-2 focus:ring-violet-500 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-neutral-700'}`}
                            />
                            {errors.password && <p className="mt-1 text-[10px] text-red-400 uppercase font-bold">{errors.password}</p>}
                        </div>

                        <button
                            type="submit" disabled={isSubmitting}
                            className="w-full py-4 bg-violet-600 text-white font-black rounded-lg hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/20 mt-4 disabled:opacity-50"
                        >
                            {isSubmitting ? 'INGRESANDO...' : 'INGRESAR'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            ¿Sos nuevo? {' '}
                            <Link to="/register" className="text-violet-400 font-bold hover:underline">
                                Crea una cuenta gratis
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;