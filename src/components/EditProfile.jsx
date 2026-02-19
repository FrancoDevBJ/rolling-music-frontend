import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const EditProfile = () => {
    const { user, updateUserData } = useAuth(); // Usaremos la función que agregaremos al Context
    
    // Inicializamos con los datos actuales del usuario
    const [formData, setFormData] = useState({
        name: user?.displayName?.split(' ')[0] || '',
        surname: user?.displayName?.split(' ').slice(1).join(' ') || '',
        email: user?.email || ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateUserData(formData);
            Swal.fire({
                title: '¡Actualizado!',
                text: 'Tus datos han sido guardados con éxito.',
                icon: 'success',
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#7c3aed'
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-neutral-900 p-8 rounded-2xl border border-white/5 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Editar Perfil</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-400 text-sm mb-1 ml-1">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white outline-none focus:ring-2 focus:ring-violet-600 transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-1 ml-1">Apellido</label>
                    <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white outline-none focus:ring-2 focus:ring-violet-600 transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-1 ml-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white outline-none focus:ring-2 focus:ring-violet-600 transition-all"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-500 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-violet-900/20"
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;