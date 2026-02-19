import React, { useState, useEffect } from 'react';
import { songSchema } from '../utils/validation';
import { useSongs } from '../context/SongsContext';
import Swal from 'sweetalert2';

const initialFormState = {
    titulo: '',
    artista: '',
    categoria: '',
};

const SongForm = ({ initialData, onSubmit, onCancel }) => {
    const { syncSongs } = useSongs();
    const [formData, setFormData] = useState(initialFormState);
    const [files, setFiles] = useState({ audio: null, cover: null });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                titulo: initialData.title,
                artista: initialData.artist,
                categoria: initialData.genre,
            });
        } else {
            setFormData(initialFormState);
            setFiles({ audio: null, cover: null });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        setFiles({ ...files, [name]: selectedFiles[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            // 1. Validamos los campos de texto
            songSchema.parse(formData);

            if (!files.audio || !files.cover) {
            setErrors({
            audio: !files.audio ? "El audio es obligatorio" : null,
            cover: !files.cover ? "La portada es obligatoria" : null
            });
            setLoading(false);
            return;
            }

            // 2. Preparamos el FormData para Multer
            const data = new FormData();
            
            // 🛠️ Mapeo exacto a las keys que espera el Modelo/Backend
            data.append('title', formData.titulo);
            data.append('artist', formData.artista);
            data.append('genre', formData.categoria);
            data.append('audio', files.audio);
            data.append('cover', files.cover);
            
            // Adjuntamos archivos físicos
            if (files.audio) data.append('audio', files.audio);
            if (files.cover) data.append('cover', files.cover);

            // 3. Envío al componente padre (Admin.jsx)
            await onSubmit(data);
            
            // 4. Sincronización exitosa
            syncSongs();
            
            Swal.fire('¡Éxito!', `Canción ${initialData ? 'actualizada' : 'creada'} correctamente`, 'success');

            if (!initialData) {
                setFormData(initialFormState);
                setFiles({ audio: null, cover: null });
                e.target.reset(); 
            }

        } catch (error) {
            if (error.issues) {
                const newErrors = {};
                error.issues.forEach(issue => {
                    newErrors[issue.path[0]] = issue.message; 
                });
                setErrors(newErrors);
            } else {
                console.error("Error en la operación:", error);
                Swal.fire('Error', error.response?.data?.message || 'Error al procesar la canción', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (name, label, type = 'text', isFile = false) => (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {name === 'categoria' ? (
                // 🛠️ Usamos un select para asegurar que el género sea válido para el ENUM del modelo
                <select
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
                    required
                >
                    <option value="">Seleccionar Género</option>
                    <option value="rock">Rock</option>
                    <option value="pop">Pop</option>
                    <option value="cumbia">Cumbia</option>
                    <option value="bachata">Bachata</option>
                    <option value="trap">Trap</option>
                    <option value="hip-hop">Hip-Hop</option>
                    <option value="baladas">Baladas</option>
                    <option value="otro">Otro</option>
                </select>
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    accept={name === 'cover' ? "image/*" : name === 'audio' ? "audio/*" : ""}
                    value={isFile ? undefined : (formData[name] || '')}
                    onChange={isFile ? handleFileChange : handleChange}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
                    required={isFile}
                />
            )}
            {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                {initialData ? 'Editar Canción' : 'Publicar Contenido Original'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput('titulo', 'Título de la Canción')}
                {renderInput('artista', 'Artista o Grupo')}
            </div>
            
            {renderInput('categoria', 'Género Musical')}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput('cover', 'Archivo de Carátula', 'file', true)}
                {renderInput('audio', 'Archivo MP3 / Audio', 'file', true)}
            </div>
            
            <div className="flex justify-start space-x-4 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400"
                >
                    {loading ? 'Subiendo...' : initialData ? 'Guardar Cambios' : 'Crear Canción'}
                </button>
                
                {initialData && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition duration-200"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};

export default SongForm;