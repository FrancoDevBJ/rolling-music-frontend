import React, { useState } from 'react';
import { useSongs } from '../context/SongsContext'; 
import { songSchema } from '../utils/validation';
import musicApi from '../services/musicApi'; 
import Swal from 'sweetalert2'; 
import { Link } from 'react-router-dom';

// 🛠️ IMPORTANTE: Estos nombres deben coincidir EXACTAMENTE con lo que pide tu Zod
// según la captura image_122c98.png
const initialFormState = {
    title: '',
    artist: '',
    genre: ''
};

const Admin = () => {
    const { adminSongs, syncSongs } = useSongs();
    
    const [formData, setFormData] = useState(initialFormState);
    const [files, setFiles] = useState({ audio: null, cover: null });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles && selectedFiles[0]) {
            setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
        }
    };

    // 🛠️ Evita el error "Objects are not valid as a React child" (image_115e1f.png)
    const renderSafeText = (value) => {
        if (typeof value === 'object' && value !== null) {
            return value.name || value.title || 'N/A';
        }
        return value || 'N/A';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // 1. Validar contra Zod (Usa los nombres de la captura image_122c98.png)
        const result = songSchema.safeParse(formData);
        
        if (!result.success) {
            const fieldErrors = result.error.issues.reduce((acc, issue) => {
                acc[issue.path[0]] = issue.message;
                return acc;
            }, {});
            setErrors(fieldErrors);
            console.error("Zod Errors:", fieldErrors);
            Swal.fire('Error', 'Revisa los campos obligatorios', 'error');
            return;
        }

        setLoading(true);

        // 2. Mapear al modelo de Mongoose (title, artist, genre)
        const data = new FormData();
        data.append('title', formData.title);
        data.append('artist', formData.artist);
        data.append('genre', formData.genre); // Mandamos 'album' como 'genre' al servidor
        
        if (files.audio) data.append('audio', files.audio);
        if (files.cover) data.append('cover', files.cover);

        try {
            if (isEditing && editingId) {
                await musicApi.put(`/song/${editingId}`, data);
                Swal.fire('¡Éxito!', 'Canción actualizada.', 'success');
            } else {
                await musicApi.post('/song', data);
                Swal.fire('¡Éxito!', 'Canción creada.', 'success');
            }
            syncSongs(); 
            handleCancelEdit();
            e.target.reset(); 
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error en el servidor', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (song) => {
        setFormData({ 
            title: renderSafeText(song.title),
            artist: renderSafeText(song.artist),
            genre: renderSafeText(song.genre)
        });
        setIsEditing(true);
        setEditingId(song._id); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteSong = async (id) => {
    const confirm = await Swal.fire({
        title: '¿Eliminar canción?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    try {
        await musicApi.delete(`/song/${id}`);
        Swal.fire('Eliminada', 'La canción fue eliminada', 'success');
        syncSongs();
    } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Error al eliminar', 'error');
    }
};

    const handleCancelEdit = () => {
        setFormData(initialFormState);
        setFiles({ audio: null, cover: null });
        setIsEditing(false);
        setEditingId(null);
    };

    return (
        <div className="p-4 md:p-8 bg-[#0a0a0a] min-h-screen text-white font-sans">
            
            <div className="max-w-5xl mx-auto mb-6">
                <Link to="/" className="text-gray-400 hover:text-violet-400 font-bold uppercase text-[10px] tracking-widest transition-colors">
                    ← Volver al Inicio
                </Link>
            </div>

            <h1 className="text-3xl font-black mb-8 border-b border-white/10 pb-4">Administración</h1>

            <div className="bg-neutral-900 p-8 rounded-2xl border border-white/5 max-w-3xl mx-auto mb-16 shadow-2xl relative">
                <h2 className="text-xl font-bold mb-6">
                    {isEditing ? "Editar Canción" : "Nueva Canción"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Título</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white" required />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Artista</label>
                            <input type="text" name="artist" value={formData.artist} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white" required />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Género (Zod: Album)</label>
                        <select name="genre" value={formData.genre} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white" required>
                            <option value="">Seleccionar...</option>
                            <option value="rock">rock</option>
                            <option value="pop">pop</option>
                            <option value="cumbia">cumbia</option>
                            <option value="bachata">bachata</option>
                            <option value="trap">trap</option>
                            <option value="baladas">baladas</option>
                            <option value="otro">otro</option>
                        </select>
                        {errors.genre && <p className="text-red-500 text-xs mt-1">{errors.genre}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-neutral-800 rounded-xl border border-dashed border-neutral-700">
                            <label className="text-xs font-bold text-gray-400 mb-2 block text-center">AUDIO (MP3)</label>
                            <input type="file" name="audio" accept="audio/*" onChange={handleFileChange} className="w-full text-xs text-gray-500 file:bg-violet-600 file:text-white file:rounded-full file:border-0 file:px-4 file:py-1" required/>
                        </div>
                        <div className="p-4 bg-neutral-800 rounded-xl border border-dashed border-neutral-700">
                            <label className="text-xs font-bold text-gray-400 mb-2 block text-center">PORTADA (JPG/PNG)</label>
                            <input type="file" name="cover" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-500 file:bg-fuchsia-600 file:text-white file:rounded-full file:border-0 file:px-4 file:py-1" required/>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold uppercase bg-white text-black hover:bg-gray-200 transition-all">
                        {loading ? 'Procesando...' : isEditing ? "Guardar Cambios" : "Subir Canción"}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={handleCancelEdit} className="w-full py-2 text-gray-500 text-xs font-bold uppercase">Cancelar</button>
                    )}
                </form>
            </div>

            {/* CATALOGO */}
            <div className="max-w-5xl mx-auto">
                <h2 className="text-xl font-bold mb-8 pl-4 border-l-2 border-violet-500">Catálogo MongoDB</h2>
                <div className="grid grid-cols-1 gap-4">
                    {adminSongs && adminSongs.map((song) => (
                        <div key={song._id} className="flex items-center bg-neutral-900/60 p-4 rounded-2xl border border-white/5">
                            <img 
                                src={`http://localhost:3000/uploads/covers/${song.cover}`} 
                                className="w-14 h-14 object-cover rounded-xl"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                            />
                            <div className="ml-5 grow">
                                <h4 className="font-bold text-md">{renderSafeText(song.title)}</h4>
                                <p className="text-xs text-gray-500">
                                    {renderSafeText(song.artist)} • <span className="uppercase text-violet-500 font-bold">{renderSafeText(song.genre)}</span>
                                </p>
                            </div>
                            <button onClick={() => handleEditClick(song)} className="px-4 py-2 text-[10px] font-black border border-white/10 hover:bg-white hover:text-black rounded-lg transition-all">EDITAR</button>
                            <button
                            onClick={() => handleDeleteSong(song._id)}
                            className="px-4 py-2 text-[10px] font-black border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                            >
                            ELIMINAR
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;