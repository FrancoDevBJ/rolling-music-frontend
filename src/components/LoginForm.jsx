import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../utils/validation';
import Swal from 'sweetalert2';
import logo from '../assets/imagenes/logos/Logo.png';

const LoginForm = () => {
    const { loginWithGoogle, loginWithEmail } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    const handleGoogleLogin = async () => {
        setIsSubmitting(true);
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (error) {
            Swal.fire('Error', 'No se pudo sincronizar con Google', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);
        try {
            loginSchema.parse(formData);
            await loginWithEmail(formData.email, formData.password);
            navigate('/');
        } catch (error) {
            if (error.issues) {
                const newErrors = {};
                error.issues.forEach(issue => { newErrors[issue.path[0]] = issue.message; });
                setErrors(newErrors);
            } else {
                const message = error.response?.data?.message || 'Credenciales incorrectas o usuario no encontrado.';
                Swal.fire({ icon: 'error', title: 'Error de acceso', text: message, background: '#0a0a0a', color: '#fff', confirmButtonColor: '#7c3aed' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-10px); }
                }
                .fade-up { animation: fadeSlideUp 0.6s ease both; }
                .float   { animation: float 4s ease-in-out infinite; }
            `}</style>

            <div
                className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #060010 0%, #0a0a0a 50%, #030008 100%)' }}
            >
                {/* Decoración fondo */}
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

                <div className="relative w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden fade-up" style={{ border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>

                    {/* ── Columna izquierda: branding ── */}
                    <div
                        className="hidden md:flex flex-1 flex-col items-center justify-center p-12 text-center relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #1e0040 0%, #0d0118 100%)' }}
                    >
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 40%, rgba(124,58,237,0.2) 0%, transparent 60%)' }} />

                        <img src={logo} alt="RollingPlay" className="float w-48 h-auto mb-8 drop-shadow-[0_0_30px_rgba(139,92,246,0.6)] relative z-10" />

                        <div className="relative z-10">
                            <h2 className="text-2xl font-black text-white mb-3 leading-tight">
                                Deja que la música<br />
                                <span style={{ color: '#a78bfa' }}>ruede contigo.</span>
                            </h2>
                            <p className="text-gray-500 text-sm">Millones de canciones. Tu playlist. Tu ritmo.</p>
                        </div>

                        {/* Decoración puntos */}
                        <div className="absolute bottom-8 left-8 flex gap-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? '#a78bfa' : 'rgba(255,255,255,0.15)' }} />
                            ))}
                        </div>
                    </div>

                    {/* ── Columna derecha: formulario ── */}
                    <div className="flex-1 flex flex-col justify-center p-8 md:p-12" style={{ background: '#0f0f0f' }}>

                        {/* Logo mobile */}
                        <div className="flex justify-center mb-8 md:hidden">
                            <img src={logo} alt="RollingPlay" className="w-24 h-auto" />
                        </div>

                        <div className="mb-8">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-violet-500 font-black mb-2">Bienvenido de nuevo</p>
                            <h1 className="text-3xl font-black text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
                                Iniciá sesión
                            </h1>
                        </div>

                        {/* Google */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mb-6"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                            </svg>
                            {isSubmitting ? 'Conectando...' : 'Continuar con Google'}
                        </button>

                        {/* Divisor */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                            <span className="text-[11px] text-gray-600 uppercase tracking-wider font-bold">o con email</span>
                            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="email" name="email" value={formData.email}
                                    onChange={handleChange} placeholder="Correo electrónico"
                                    className="w-full p-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: errors.email ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.08)'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                                    onBlur={e => e.target.style.borderColor = errors.email ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.08)'}
                                />
                                {errors.email && <p className="mt-1 text-[10px] text-red-400 font-bold uppercase">{errors.email}</p>}
                            </div>

                            <div>
                                <input
                                    type="password" name="password" value={formData.password}
                                    onChange={handleChange} placeholder="Contraseña"
                                    className="w-full p-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: errors.password ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.08)'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                                    onBlur={e => e.target.style.borderColor = errors.password ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.08)'}
                                />
                                {errors.password && <p className="mt-1 text-[10px] text-red-400 font-bold uppercase">{errors.password}</p>}
                            </div>

                            <button
                                type="submit" disabled={isSubmitting}
                                className="w-full py-3 rounded-xl font-black text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-2"
                                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}
                            >
                                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                            </button>
                        </form>

                        <p className="text-center text-gray-600 text-sm mt-8">
                            ¿Sos nuevo?{' '}
                            <Link to="/register" className="text-violet-400 font-bold hover:text-violet-300 transition-colors">
                                Creá una cuenta gratis
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
