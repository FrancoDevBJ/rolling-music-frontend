import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { registerSchema } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import { getCroppedImg } from '../utils/cropImage';
import Swal from 'sweetalert2';
import Fondo from '../assets/imagenes/logos/FondoLogo.jpg';
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

    const onCropComplete = useCallback((_ , pixels) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                setImage(reader.result);
                setShowCropper(true);
            };
        }
    };

    const handleConfirmCrop = async () => {
        try {
            const { file, url } = await getCroppedImg(image, croppedAreaPixels);
            setCroppedImage(file);
            setPreview(url);
            setShowCropper(false);
        } catch (e) {
            console.error("Error al recortar:", e);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
    // 1. Validar datos con Zod (Frontend)
    registerSchema.parse(formData);
    
    // 2. Preparar FormData para el envío
    const dataToSend = new FormData();
    
    // --- CAMBIO CLAVE AQUÍ ---
    // Tu backend probablemente espera 'name' y no 'username'
    dataToSend.append('name', formData.username); // 'name' para el validador
    dataToSend.append('surname', formData.surname); // 🛠️ AGREGADO: Obligatorio según tu validator.js
    dataToSend.append('email', formData.email);
    dataToSend.append('password', formData.password);
    
    // Tu backend usa 'uploadProfile' de Multer. 
    // Asegúrate que el nombre 'img' coincida con lo definido en config/multer.js
    if (croppedImage) {
        dataToSend.append('profilePic', croppedImage); 
    }

    // 3. Registrar
    await registerWithEmail(dataToSend);
    
    // El Swal de éxito y el navigate se mantienen igual
    navigate('/verify-email', { state: { email: formData.email } });
        } catch (error) {
            if (error.name === 'ZodError' || error.issues) {
                const newErrors = {};
                error.issues.forEach(iss => newErrors[iss.path[0]] = iss.message);
                setErrors(newErrors);
            } else {
                // Capturamos el mensaje específico del backend si existe
                const serverMsg = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg;
                Swal.fire('Error', serverMsg || 'Error en el servidor', 'error');
                console.error("Detalle del error 400:", error.response?.data);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{background: `url(${Fondo}) no-repeat center center / cover fixed`}} className="min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse border border-white/5">
                
                {/* MODAL CROPPER */}
                {showCropper && (
                    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
                        <div className="relative w-full h-[60vh] max-w-xl rounded-xl overflow-hidden shadow-2xl">
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="mt-6 flex gap-4 w-full max-w-xl">
                            <button onClick={() => setShowCropper(false)} className="flex-1 py-3 bg-neutral-800 text-white rounded-lg font-bold hover:bg-neutral-700 transition-colors">Cancelar</button>
                            <button onClick={handleConfirmCrop} className="flex-1 py-3 bg-violet-600 text-white rounded-lg font-bold hover:bg-violet-500 transition-colors">Confirmar Recorte</button>
                        </div>
                    </div>
                )}

                {/* COLUMNA LOGO */}
                <div className="hidden md:flex flex-1 p-8 flex-col items-center justify-center text-center bg-black/40 backdrop-blur-sm">
                    <img src={logo} alt="logo" className="w-64 h-auto drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] mb-4" />
                    <p className="text-xl font-serif italic text-violet-200">Únete a la revolución musical.</p>
                </div>

                {/* COLUMNA FORMULARIO */}
                <div className="flex-1 p-8 bg-neutral-800 flex flex-col justify-center overflow-y-auto">
                    <h2 className="text-3xl font-black text-white text-center mb-6 uppercase tracking-tight">Crea tu Cuenta</h2>
                    
                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Avatar */}
                        <div className="flex flex-col items-center mb-4">
                            <div onClick={() => fileInputRef.current.click()} className="relative w-24 h-24 rounded-full border-2 border-violet-500 flex items-center justify-center cursor-pointer overflow-hidden hover:scale-105 transition-transform bg-neutral-900 group">
                                {preview ? (
                                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <span className="text-2xl">📷</span>
                                        <p className="text-[9px] text-violet-400 font-bold uppercase mt-1">Subir Foto</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold">Cambiar</div>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        </div>

                        <input type="text" name="username" placeholder="Nombre" value={formData.username} 
                               onChange={(e) => setFormData({...formData, username: e.target.value})} 
                               className={`w-full p-3 rounded-lg bg-neutral-900 border ${errors.username ? 'border-red-500' : 'border-neutral-700'} text-white outline-none focus:ring-2 focus:ring-violet-600 transition-all`} />

                        <input 
                        type="text" 
                        name="surname" 
                        placeholder="Apellido" 
                        value={formData.surname} 
                        onChange={(e) => setFormData({...formData, surname: e.target.value})} 
                        className={`w-full p-3 rounded-lg bg-neutral-900 border ${errors.surname ? 'border-red-500' : 'border-neutral-700'} text-white outline-none focus:ring-2 focus:ring-violet-600 transition-all`} 
                        />
                        
                        <input type="email" name="email" placeholder="Correo electrónico" value={formData.email}
                               onChange={(e) => setFormData({...formData, email: e.target.value})} 
                               className={`w-full p-3 rounded-lg bg-neutral-900 border ${errors.email ? 'border-red-500' : 'border-neutral-700'} text-white outline-none focus:ring-2 focus:ring-violet-600 transition-all`} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="password" name="password" placeholder="Contraseña" value={formData.password}
                                   onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                   className={`w-full p-3 rounded-lg bg-neutral-900 border ${errors.password ? 'border-red-500' : 'border-neutral-700'} text-white outline-none focus:ring-2 focus:ring-violet-600 transition-all`} />
                            <input type="password" name="confirmPassword" placeholder="Confirmar" value={formData.confirmPassword}
                                   onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                                   className={`w-full p-3 rounded-lg bg-neutral-900 border ${errors.confirmPassword ? 'border-red-500' : 'border-neutral-700'} text-white outline-none focus:ring-2 focus:ring-violet-600 transition-all`} />
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-violet-600 text-white font-black rounded-lg hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/40 disabled:opacity-50 mt-4 uppercase">
                            {isSubmitting ? 'Registrando...' : 'Registrarme'}
                        </button>
                    </form>

                    {/* REDIRECCIÓN AL LOGIN */}
                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-gray-400 text-sm">
                            ¿Ya tienes una cuenta? {' '}
                            <Link to="/login" className="text-violet-400 font-bold hover:text-violet-300 hover:underline transition-all">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;