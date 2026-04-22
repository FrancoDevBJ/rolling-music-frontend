import React, { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { useAuth } from '../context/AuthContext';
import { getCroppedImg } from '../utils/cropImage';
import Swal from 'sweetalert2';

const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, updateUserData } = useAuth();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: user?.displayName?.split(' ')[0] || user?.name || '',
        surname: user?.displayName?.split(' ').slice(1).join(' ') || user?.surname || ''
    });

    // ── Crop state
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    
    const onCropComplete = useCallback((_, pixels) => {
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
            console.error('Error al recortar:', e);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const dataToSend = new FormData();
            dataToSend.append('name', formData.name);
            dataToSend.append('surname', formData.surname);
            if (croppedImage) {
                dataToSend.append('profilePic', croppedImage);
            }
            
            await updateUserData(dataToSend);

            Swal.fire({
                title: '¡Éxito!',
                text: 'Perfil actualizado correctamente',
                icon: 'success',
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#7c3aed'
            });
            
            onClose();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron actualizar los datos', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Avatar actual (antes de cualquier cambio)
    const currentAvatar = user?.avatar || user?.photoURL ||
    'https://cdn-icons-png.flaticon.com/512/10813/10813372.png';
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">

            {/* CROPPER */}
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
                    <div className="mt-6 w-full max-w-xl space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-gray-500 uppercase font-bold w-10">Zoom</span>
                            <input
                                type="range"
                                min={1} max={3} step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="flex-1 accent-violet-600"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowCropper(false)}
                                className="flex-1 py-3 bg-neutral-800 text-white rounded-lg font-bold hover:bg-neutral-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmCrop}
                                className="flex-1 py-3 bg-violet-600 text-white rounded-lg font-bold hover:bg-violet-500 transition-colors"
                            >
                                Confirmar Recorte
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL */}
            <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl border border-white/10 p-8 shadow-2xl">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >✕</button>

                <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight text-center">
                    Editar Perfil
                </h2>

                {/* Avatar con click para cambiar */}
                <div className="flex flex-col items-center mb-6">
                    <div
                        onClick={() => fileInputRef.current.click()}
                        className="relative w-24 h-24 rounded-full border-2 border-violet-500 cursor-pointer overflow-hidden hover:scale-105 transition-transform bg-neutral-800 group"
                    >
                        <img
                            src={preview || currentAvatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/10813/10813372.png'; }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[10px] font-black text-white uppercase">Cambiar</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-widest">
                        {preview ? 'Nueva foto lista' : 'Click para cambiar foto'}
                    </p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-violet-400 uppercase mb-1 ml-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white outline-none focus:ring-2 focus:ring-violet-600 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-violet-400 uppercase mb-1 ml-1">
                            Apellido
                        </label>
                        <input
                            type="text"
                            value={formData.surname}
                            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                            className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white outline-none focus:ring-2 focus:ring-violet-600 transition-all"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-500 transition-all disabled:opacity-50 shadow-lg shadow-violet-900/20"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
