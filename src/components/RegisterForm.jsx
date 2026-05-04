import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { registerSchema } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import { getCroppedImg } from '../utils/cropImage';
import Swal from 'sweetalert2';
import logo from '../assets/imagenes/logos/Logo.png';

const initialFormState = { username: '', surname: '', email: '', password: '', confirmPassword: '' };

const RegisterForm = () => {
    const { registerWithEmail } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState(initialFormState);
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onCropComplete = useCallback((_, pixels) => { setCroppedAreaPixels(pixels); }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => { setImage(reader.result); setShowCropper(true); };
        }
    };

    const handleConfirmCrop = async () => {
        try {
            const { file, url } = await getCroppedImg(image, croppedAreaPixels);
            setCroppedImage(file);
            setPreview(url);
            setShowCropper(false);
        } catch (e) { console.error("Error al recortar:", e); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        try {
            registerSchema.parse(formData);
            const dataToSend = new FormData();
            dataToSend.append('name', formData.username);
            dataToSend.append('surname', formData.surname);
            dataToSend.append('email', formData.email);
            dataToSend.append('password', formData.password);
            if (croppedImage) dataToSend.append('profilePic', croppedImage);
            await registerWithEmail(dataToSend);
            navigate('/verify-email', { state: { email: formData.email } });
        } catch (error) {
            if (error.name === 'ZodError' || error.issues) {
                const newErrors = {};
                error.issues.forEach(iss => { newErrors[iss.path[0]] = iss.message; });
                setErrors(newErrors);
            } else {
                const serverMsg = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg;
                Swal.fire('Error', serverMsg || 'Error en el servidor', 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = (field) => `w-full p-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all`;
    const inputStyle = (field) => ({
        background: 'rgba(255,255,255,0.04)',
        border: errors[field] ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.08)'
    });

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

            {/* CROPPER */}
            {showCropper && (
                <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-widest text-violet-400 font-black mb-4">Ajustá tu foto</p>
                    <div className="relative w-full h-[55vh] max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                        <Cropper
                            image={image} crop={crop} zoom={zoom}
                            aspect={1} cropShape="round"
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="mt-6 w-full max-w-lg space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Zoom</span>
                            <input type="range" min={1} max={3} step={0.1} value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="flex-1 accent-violet-600" />
                            <span className="text-[10px] text-gray-500 w-8">{zoom.toFixed(1)}x</span>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowCropper(false)}
                                className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-400 hover:text-white transition-colors"
                                style={{ background: 'rgba(255,255,255,0.05)' }}>
                                Cancelar
                            </button>
                            <button onClick={handleConfirmCrop}
                                className="flex-1 py-3 rounded-xl font-bold text-sm text-white"
                                style={{ background: '#7c3aed' }}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div
                className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #060010 0%, #0a0a0a 50%, #030008 100%)' }}
            >
                {/* Decoración */}
                <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

                <div
                    className="relative w-full max-w-4xl flex flex-col md:flex-row-reverse rounded-3xl overflow-hidden fade-up"
                    style={{ border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}
                >
                    {/* ── Columna branding ── */}
                    <div
                        className="hidden md:flex flex-1 flex-col items-center justify-center p-12 text-center relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #1e0040 0%, #0d0118 100%)' }}
                    >
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 70% 40%, rgba(124,58,237,0.2) 0%, transparent 60%)' }} />
                        <img src={logo} alt="RollingPlay" className="float w-48 h-auto mb-8 drop-shadow-[0_0_30px_rgba(139,92,246,0.6)] relative z-10" />
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black text-white mb-3 leading-tight">
                                Unite a la<br />
                                <span style={{ color: '#a78bfa' }}>revolución musical.</span>
                            </h2>
                            <p className="text-gray-500 text-sm">Creá tu cuenta y empezá a escuchar.</p>
                        </div>
                        <div className="absolute bottom-8 right-8 flex gap-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? '#a78bfa' : 'rgba(255,255,255,0.15)' }} />
                            ))}
                        </div>
                    </div>

                    {/* ── Columna formulario ── */}
                    <div className="flex-1 flex flex-col justify-center p-8 md:p-12 overflow-y-auto" style={{ background: '#0f0f0f' }}>

                        {/* Logo mobile */}
                        <div className="flex justify-center mb-6 md:hidden">
                            <img src={logo} alt="RollingPlay" className="w-20 h-auto" />
                        </div>

                        <div className="mb-8">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-violet-500 font-black mb-2">Empezá gratis</p>
                            <h1 className="text-3xl font-black text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
                                Creá tu cuenta
                            </h1>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-4">

                            {/* Avatar */}
                            <div className="flex justify-center mb-2">
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    className="relative w-20 h-20 rounded-full cursor-pointer overflow-hidden group"
                                    style={{ border: '2px solid rgba(124,58,237,0.5)' }}
                                >
                                    {preview ? (
                                        <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
                                            <span className="text-xl">📷</span>
                                            <p className="text-[8px] text-violet-400 font-bold uppercase mt-1">Foto</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-black text-white uppercase" style={{ background: 'rgba(0,0,0,0.6)' }}>
                                        Cambiar
                                    </div>
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            </div>

                            {/* Nombre y apellido */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input
                                        type="text" name="username" placeholder="Nombre"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className={inputClass('username')} style={inputStyle('username')}
                                        onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                                        onBlur={e => e.target.style.borderColor = errors.username ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.08)'}
                                    />
                                    {errors.username && <p className="mt-1 text-[9px] text-red-400 font-bold">{errors.username}</p>}
                                </div>
                                <div>
                                    <input
                                        type="text" name="surname" placeholder="Apellido"
                                        value={formData.surname}
                                        onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                                        className={inputClass('surname')} style={inputStyle('surname')}
                                        onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                                        onBlur={e => e.target.style.borderColor = errors.surname ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.08)'}
                                    />
                                    {errors.surname && <p className="mt-1 text-[9px] text-red-400 font-bold">{errors.surname}</p>}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <input
                                    type="email" name="email" placeholder="Correo electrónico"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={inputClass('email')} style={inputStyle('email')}
                                    onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                                    onBlur={e => e.target.style.borderColor = errors.email ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.08)'}
                                />
                                {errors.email && <p className="mt-1 text-[9px] text-red-400 font-bold">{errors.email}</p>}
                            </div>

                            {/* Contraseñas */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <input
                                        type="password" name="password" placeholder="Contraseña"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className={inputClass('password')} style={inputStyle('password')}
                                        onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                                        onBlur={e => e.target.style.borderColor = errors.password ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.08)'}
                                    />
                                    {errors.password && <p className="mt-1 text-[9px] text-red-400 font-bold">{errors.password}</p>}
                                </div>
                                <div>
                                    <input
                                        type="password" name="confirmPassword" placeholder="Confirmar"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className={inputClass('confirmPassword')} style={inputStyle('confirmPassword')}
                                        onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                                        onBlur={e => e.target.style.borderColor = errors.confirmPassword ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.08)'}
                                    />
                                    {errors.confirmPassword && <p className="mt-1 text-[9px] text-red-400 font-bold">{errors.confirmPassword}</p>}
                                </div>
                            </div>

                            <button
                                type="submit" disabled={isSubmitting}
                                className="w-full py-3 rounded-xl font-black text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-2"
                                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 8px 24px rgba(124,58,237,0.3)' }}
                            >
                                {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
                            </button>
                        </form>

                        <p className="text-center text-gray-600 text-sm mt-6">
                            ¿Ya tenés cuenta?{' '}
                            <Link to="/login" className="text-violet-400 font-bold hover:text-violet-300 transition-colors">
                                Iniciá sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterForm;
