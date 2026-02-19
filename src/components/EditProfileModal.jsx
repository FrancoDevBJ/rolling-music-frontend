import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, updateUserData } = useAuth();
    
    // Mantenemos solo el estado de los textos
    const [formData, setFormData] = useState({
        name: user?.displayName?.split(' ')[0] || user?.name || '',
        surname: user?.displayName?.split(' ').slice(1).join(' ') || user?.surname || ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    // Manejador para el envío del formulario de texto
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Se envía el objeto con name y surname a la función del Context
            await updateUserData(formData);
            
            Swal.fire({
                title: '¡Éxito!',
                text: 'Perfil actualizado correctamente',
                icon: 'success',
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#7c3aed'
            });
            
            onClose(); // Cerramos el modal tras el éxito
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron actualizar los datos', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl border border-white/10 p-8 shadow-2xl">
                
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    ✕
                </button>

                <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight text-center">
                    Editar Perfil
                </h2>

                {/* Vista previa del avatar (Solo lectura) */}
                {/* <div className="flex flex-col items-center mb-8">
                    <img 
                        src={user?.profilePic ? `http://localhost:3000/uploads/profiles/${user.profilePic}` : 'https://cdn-icons-png.flaticon.com/512/10813/10813372.png'} 
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-violet-600/30"
                        alt="Profile"
                    />
                    <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-widest">
                        Imagen actual
                    </p>
                </div> */}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-violet-400 uppercase mb-1 ml-1">
                            Nombre
                        </label>
                        <input
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, surname: e.target.value})}
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