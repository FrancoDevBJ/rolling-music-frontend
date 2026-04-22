import React, { useState, useCallback } from 'react';
import { useSongs } from '../context/SongsContext';
import { songSchema } from '../utils/validation';
import musicApi from '../services/musicApi';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

// ✅ FIX: Estado inicial completo con todos los campos del formulario
const initialFormState = {
    title: '',
    artist: '',
    album: '',
    releaseDate: '',
    genre: ''
};

const GENRES = [
    'Bachata', 'Baladas', 'Cumbia', 'Funk', 'Jazz',
    'Pop', 'R&B', 'Reggae', 'Reggaeton', 'Rock', 'Salsa', 'Trap', 'Otro'
];

const MAX_AUDIO_MB = 20;
const MAX_IMAGE_MB = 5;

const Admin = () => {
    const { adminSongs, syncSongs } = useSongs();

    const [formData, setFormData] = useState(initialFormState);
    const [files, setFiles] = useState({ audio: null, cover: null });
    const [previews, setPreviews] = useState({ cover: null, audioName: null });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState({});
    const [dragOver, setDragOver] = useState({ audio: false, cover: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    // ✅ MEJORADO: Validación de tipo y tamaño de archivo
    const validateFile = (file, type) => {
        if (type === 'audio') {
            const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac'];
            if (!validTypes.includes(file.type)) {
                return 'Solo se permiten archivos de audio (MP3, WAV, OGG, FLAC)';
            }
            if (file.size > MAX_AUDIO_MB * 1024 * 1024) {
                return `El archivo no puede superar ${MAX_AUDIO_MB}MB`;
            }
        }
        if (type === 'cover') {
            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                return 'Solo se permiten imágenes (JPG, PNG, WEBP)';
            }
            if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
                return `La imagen no puede superar ${MAX_IMAGE_MB}MB`;
            }
        }
        return null;
    };

    const processFile = (file, name) => {
        const error = validateFile(file, name);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
            return;
        }
        setErrors(prev => ({ ...prev, [name]: null }));
        setFiles(prev => ({ ...prev, [name]: file }));

        if (name === 'cover') {
            const url = URL.createObjectURL(file);
            setPreviews(prev => ({ ...prev, cover: url }));
        }
        if (name === 'audio') {
            setPreviews(prev => ({ ...prev, audioName: file.name }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles && selectedFiles[0]) {
            processFile(selectedFiles[0], name);
        }
    };

    // ✅ NUEVO: Drag & drop
    const handleDrop = useCallback((e, name) => {
        e.preventDefault();
        setDragOver(prev => ({ ...prev, [name]: false }));
        const dropped = e.dataTransfer.files[0];
        if (dropped) processFile(dropped, name);
    }, []);

    const handleDragOver = (e, name) => {
        e.preventDefault();
        setDragOver(prev => ({ ...prev, [name]: true }));
    };

    const handleDragLeave = (name) => {
        setDragOver(prev => ({ ...prev, [name]: false }));
    };

    const renderSafeText = (value) => {
        if (typeof value === 'object' && value !== null) {
            return value.name || value.title || 'N/A';
        }
        return value || 'N/A';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validación con Zod (solo campos que existan en el schema)
        const result = songSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = result.error.issues.reduce((acc, issue) => {
                acc[issue.path[0]] = issue.message;
                return acc;
            }, {});
            setErrors(fieldErrors);
            Swal.fire('Error', 'Revisá los campos obligatorios', 'error');
            return;
        }

        setLoading(true);
        setUploadProgress(0);

        // ✅ FIX: Todos los campos se mapean correctamente
        const data = new FormData();
        data.append('title', formData.title);
        data.append('artist', formData.artist);
        data.append('album', formData.album);
        data.append('releaseDate', formData.releaseDate);
        data.append('genre', formData.genre);

        if (files.audio) data.append('audio', files.audio);
        if (files.cover) data.append('cover', files.cover);

        try {
            const config = {
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percent);
                }
            };

            if (isEditing && editingId) {
                await musicApi.put(`/song/${editingId}`, data, config);
                Swal.fire('¡Éxito!', 'Canción actualizada.', 'success');
            } else {
                await musicApi.post('/song', data, config);
                Swal.fire('¡Éxito!', 'Canción subida correctamente.', 'success');
            }

            syncSongs();
            handleCancelEdit();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error en el servidor', 'error');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleEditClick = (song) => {
        setFormData({
            title: renderSafeText(song.title),
            artist: renderSafeText(song.artist),
            album: renderSafeText(song.album),
            releaseDate: song.releaseDate ? song.releaseDate.slice(0, 10) : '',
            genre: renderSafeText(song.genre)
        });
        setPreviews({ cover: song.cover || null, audioName: null });
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
        setPreviews({ cover: null, audioName: null });
        setIsEditing(false);
        setEditingId(null);
        setErrors({});
    };

    return (
        <div className="p-4 md:p-8 bg-[#0a0a0a] min-h-screen text-white font-sans">

            <div className="max-w-5xl mx-auto mb-6">
                <Link to="/" className="text-gray-400 hover:text-violet-400 font-bold uppercase text-[10px] tracking-widest transition-colors">
                    ← Volver al Inicio
                </Link>
            </div>

            <h1 className="text-3xl font-black mb-8 border-b border-white/10 pb-4">Administración</h1>

            <div className="bg-neutral-900 p-8 rounded-2xl border border-white/5 max-w-3xl mx-auto mb-16 shadow-2xl">
                <h2 className="text-xl font-bold mb-6">
                    {isEditing ? '✏️ Editar Canción' : '＋ Nueva Canción'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Fila 1: Título y Artista */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Título *</label>
                            <input
                                type="text" name="title" value={formData.title}
                                onChange={handleChange}
                                className={`w-full p-3 bg-neutral-800 border rounded-lg text-white transition-colors ${errors.title ? 'border-red-500' : 'border-neutral-700 focus:border-violet-500'}`}
                                required
                            />
                            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Artista *</label>
                            <input
                                type="text" name="artist" value={formData.artist}
                                onChange={handleChange}
                                className={`w-full p-3 bg-neutral-800 border rounded-lg text-white transition-colors ${errors.artist ? 'border-red-500' : 'border-neutral-700 focus:border-violet-500'}`}
                                required
                            />
                            {errors.artist && <p className="text-red-400 text-xs mt-1">{errors.artist}</p>}
                        </div>
                    </div>

                    {/* Fila 2: Album y Fecha — ✅ FIX: ahora conectados al estado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Álbum</label>
                            <input
                                type="text" name="album" value={formData.album}
                                onChange={handleChange}
                                className="w-full p-3 bg-neutral-800 border border-neutral-700 focus:border-violet-500 rounded-lg text-white transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Año de lanzamiento</label>
                            <input
                                type="date" name="releaseDate" value={formData.releaseDate}
                                onChange={handleChange}
                                min="1900-01-01"
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full p-3 bg-neutral-800 border border-neutral-700 focus:border-violet-500 rounded-lg text-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Género */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Género *</label>
                        <select
                            name="genre" value={formData.genre}
                            onChange={handleChange}
                            className={`w-full p-3 bg-neutral-800 border rounded-lg text-white transition-colors ${errors.genre ? 'border-red-500' : 'border-neutral-700 focus:border-violet-500'}`}
                            required
                        >
                            <option value="">Seleccionar...</option>
                            {GENRES.map(g => (
                                <option key={g} value={g.toLowerCase()}>{g}</option>
                            ))}
                        </select>
                        {errors.genre && <p className="text-red-400 text-xs mt-1">{errors.genre}</p>}
                    </div>

                    {/* Archivos: Audio y Cover con Drag & Drop + Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Audio */}
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Audio (MP3/WAV) *</label>
                            <input
                                id="audio-input"
                                type="file" name="audio" accept="audio/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="audio-input"
                                onDrop={(e) => handleDrop(e, 'audio')}
                                onDragOver={(e) => handleDragOver(e, 'audio')}
                                onDragLeave={() => handleDragLeave('audio')}
                                className={`p-5 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer block ${dragOver.audio ? 'border-violet-500 bg-violet-500/10' : errors.audio ? 'border-red-500 bg-neutral-800' : 'border-neutral-700 bg-neutral-800 hover:border-violet-500/50'}`}
                            >
                                {previews.audioName ? (
                                    <div className="space-y-1">
                                        <div className="text-2xl">🎵</div>
                                        <p className="text-xs text-violet-400 font-bold truncate">{previews.audioName}</p>
                                        <p className="text-[10px] text-gray-500">
                                            {files.audio ? (files.audio.size / 1024 / 1024).toFixed(2) + ' MB' : ''}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="text-2xl">🎧</div>
                                        <p className="text-xs text-gray-400">Arrastrá o hacé click</p>
                                        <p className="text-[10px] text-gray-600">MP3, WAV, OGG — máx {MAX_AUDIO_MB}MB</p>
                                    </div>
                                )}
                            </label>
                            {errors.audio && <p className="text-red-400 text-xs mt-1">{errors.audio}</p>}
                        </div>

                        {/* Cover con preview */}
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Portada (JPG/PNG) *</label>
                            <input
                                id="cover-input"
                                type="file" name="cover" accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="cover-input"
                                onDrop={(e) => handleDrop(e, 'cover')}
                                onDragOver={(e) => handleDragOver(e, 'cover')}
                                onDragLeave={() => handleDragLeave('cover')}
                                className={`p-5 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer block ${dragOver.cover ? 'border-violet-500 bg-violet-500/10' : errors.cover ? 'border-red-500 bg-neutral-800' : 'border-neutral-700 bg-neutral-800 hover:border-violet-500/50'}`}
                                style={{ minHeight: '120px' }}
                            >
                                {previews.cover ? (
                                    <div>
                                        <img
                                            src={previews.cover}
                                            alt="Preview portada"
                                            className="w-20 h-20 object-cover rounded-lg mx-auto"
                                        />
                                        <p className="text-[10px] text-gray-500 mt-2">Click para cambiar</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="text-2xl">🖼️</div>
                                        <p className="text-xs text-gray-400">Arrastrá o hacé click</p>
                                        <p className="text-[10px] text-gray-600">JPG, PNG, WEBP — máx {MAX_IMAGE_MB}MB</p>
                                    </div>
                                )}
                            </label>
                            {errors.cover && <p className="text-red-400 text-xs mt-1">{errors.cover}</p>}
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    {loading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Subiendo a Cloudinary...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-2 bg-violet-500 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl font-bold uppercase bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? `Subiendo... ${uploadProgress}%` : isEditing ? 'Guardar Cambios' : 'Subir Canción'}
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="w-full py-2 text-gray-500 text-xs font-bold uppercase hover:text-gray-300 transition-colors"
                        >
                            Cancelar edición
                        </button>
                    )}
                </form>
            </div>

            {/* CATÁLOGO */}
            <div className="max-w-5xl mx-auto">
                <h2 className="text-xl font-bold mb-8 pl-4 border-l-2 border-violet-500">
                    Catálogo <span className="text-gray-500 font-normal text-sm ml-2">({adminSongs?.length || 0} canciones)</span>
                </h2>
                <div className="grid grid-cols-1 gap-3">
                    {adminSongs && adminSongs.map((song) => (
                        <div key={song._id} className="flex items-center gap-4 bg-neutral-900/60 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <img
                                src={song.cover}
                                alt={renderSafeText(song.title)}
                                className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                                onError={(e) => { e.target.src = 'https://i.ibb.co/ZRn36S2x/Cover-Default-Playlist.jpg'; }}
                            />
                            <div className="grow min-w-0">
                                <h4 className="font-bold text-sm truncate">{renderSafeText(song.title)}</h4>
                                <p className="text-xs text-gray-500 truncate">
                                    {renderSafeText(song.artist)}
                                    {song.album && <> • <span className="text-gray-400">{renderSafeText(song.album)}</span></>}
                                    {' • '}<span className="uppercase text-violet-500 font-bold">{renderSafeText(song.genre)}</span>
                                </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={() => handleEditClick(song)}
                                    className="px-3 py-2 text-[10px] font-black border border-white/10 hover:bg-white hover:text-black rounded-lg transition-all"
                                >
                                    EDITAR
                                </button>
                                <button
                                    onClick={() => handleDeleteSong(song._id)}
                                    className="px-3 py-2 text-[10px] font-black border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                >
                                    ELIMINAR
                                </button>
                            </div>
                        </div>
                    ))}
                    {(!adminSongs || adminSongs.length === 0) && (
                        <p className="text-center text-gray-600 py-12 text-sm">No hay canciones cargadas todavía.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
