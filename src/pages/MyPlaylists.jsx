import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSongs } from '../context/SongsContext';
import { Link } from 'react-router-dom';
import musicApi from '../services/musicApi';
import Swal from 'sweetalert2';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import Footer from '../components/Footer';

const DEFAULT_IMG = 'https://i.ibb.co/ZRn36S2x/Cover-Default-Playlist.jpg';

// ─── Tarjeta de playlist ───────────────────────────────────────────────────
const PlaylistCard = ({ pl, index }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <Link
            to={`/playlist/${pl._id}`}
            className="group relative flex flex-col"
            style={{
                animationDelay: `${index * 60}ms`,
                animation: 'fadeSlideUp 0.5s ease both'
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Imagen */}
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-2xl">
                <img
                    src={pl.img || DEFAULT_IMG}
                    alt={pl.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out"
                    style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
                    onError={(e) => { e.target.src = DEFAULT_IMG; }}
                />

                {/* Overlay gradiente */}
                <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                        opacity: hovered ? 1 : 0
                    }}
                />

                {/* Botón play */}
                <div
                    className="absolute bottom-3 right-3 transition-all duration-300"
                    style={{
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.8)'
                    }}
                >
                    <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <svg className="w-5 h-5 fill-black ml-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </div>

                {/* Número de canciones sobre la imagen */}
                <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-black/60 backdrop-blur-sm text-white/70 px-2 py-1 rounded-full">
                        {pl.songs?.length || 0} tracks
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="px-1">
                <h3
                    className="font-black text-sm truncate transition-colors duration-200"
                    style={{ color: hovered ? '#a78bfa' : '#fff' }}
                >
                    {pl.name}
                </h3>
                {pl.description && (
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{pl.description}</p>
                )}
            </div>
        </Link>
    );
};

// ─── Componente principal ──────────────────────────────────────────────────
const MyPlaylists = () => {
    const { playlists, setPlaylists, loadPlaylists } = useSongs();
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadPlaylists();
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });

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

    const handleCloseModal = () => {
        setShowModal(false);
        setNewPlaylist({ name: '', description: '' });
        setCroppedImage(null);
        setPreview(null);
        setImage(null);
        setZoom(1);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', newPlaylist.name);
            formData.append('description', newPlaylist.description);
            if (croppedImage) formData.append('img', croppedImage);

            const { data } = await musicApi.post('/playlists', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.ok) {
                setPlaylists([...playlists, data.data]);
                handleCloseModal();
                Swal.fire({
                    title: '¡Lista creada!',
                    text: 'Ya podés agregarle canciones',
                    icon: 'success',
                    background: '#0a0a0a',
                    color: '#fff',
                    confirmButtonColor: '#7c3aed'
                });
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo crear la playlist', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                .fade-up { animation: fadeSlideUp 0.5s ease both; }
                
            `}</style>

            <div
                className="min-h-full p-6 md:p-10"
                style={{ background: 'linear-gradient(160deg, #0d0118 0%, #0a0a0a 50%, #020010 100%)' }}
            >
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="fade-up flex items-end justify-between mb-10 border-b border-white/5 pb-8">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-violet-500 font-black mb-2">
                                Tu música
                            </p>
                            <h1
                                className="font-black leading-none"
                                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em' }}
                            >
                                Listas de<br />
                                <span style={{ color: '#a78bfa' }}>Reproducción</span>
                            </h1>
                        </div>

                        <button
                            onClick={() => setShowModal(true)}
                            className="group flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-200 active:scale-95"
                            style={{ background: '#7c3aed', color: '#fff' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#6d28d9'}
                            onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}
                        >
                            <span className="text-lg leading-none">+</span>
                            <span className="hidden sm:inline">Nueva lista</span>
                        </button>
                    </div>

                    {/* Grid */}
                    {playlists.length === 0 ? (
                        <div className="fade-up flex flex-col items-center justify-center py-32 text-center">
                            <div
                                className="w-24 h-24 rounded-2xl mb-6 flex items-center justify-center"
                                style={{ background: 'rgba(124,58,237,0.1)', border: '1px dashed rgba(124,58,237,0.3)' }}
                            >
                                <svg className="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                                </svg>
                            </div>
                            <p className="text-white font-black text-xl mb-2">No tenés listas aún</p>
                            <p className="text-gray-600 text-sm mb-6">Creá tu primera lista y empezá a organizar tu música</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all"
                                style={{ background: '#7c3aed' }}
                            >
                                Crear mi primera lista
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                            {playlists.map((pl, i) => (
                                <PlaylistCard key={pl._id} pl={pl} index={i} />
                            ))}

                            {/* Tarjeta de crear nueva */}
                            <button
                                onClick={() => setShowModal(true)}
                                className="group flex flex-col"
                                style={{ animationDelay: `${playlists.length * 60}ms`, animation: 'fadeSlideUp 0.5s ease both' }}
                            >
                                <div
                                    className="aspect-square rounded-2xl mb-3 flex flex-col items-center justify-center transition-all duration-300 border-2 border-dashed"
                                    style={{ borderColor: 'rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.05)' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.7)';
                                        e.currentTarget.style.background = 'rgba(124,58,237,0.1)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                                        e.currentTarget.style.background = 'rgba(124,58,237,0.05)';
                                    }}
                                >
                                    <span className="text-3xl text-violet-500 mb-2 font-thin">+</span>
                                    <span className="text-[10px] uppercase tracking-widest text-violet-500 font-black">Nueva</span>
                                </div>
                                <p className="text-xs text-gray-600 font-bold px-1">Crear lista</p>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* CROPPER */}
            {showCropper && (
                <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-widest text-violet-400 font-black mb-4">Ajustá la portada</p>
                    <div className="relative w-full h-[55vh] max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="mt-6 w-full max-w-lg space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Zoom</span>
                            <input
                                type="range" min={1} max={3} step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="flex-1 accent-violet-600"
                            />
                            <span className="text-[10px] text-gray-500 w-8">{zoom.toFixed(1)}x</span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCropper(false)}
                                className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-400 hover:text-white transition-colors"
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmCrop}
                                className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all"
                                style={{ background: '#7c3aed' }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CREAR PLAYLIST */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
                    <form
                        onSubmit={handleCreate}
                        className="w-full max-w-sm shadow-2xl"
                        style={{
                            background: '#111',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '24px',
                            padding: '2rem',
                            animation: 'modalIn 0.25s ease both'
                        }}
                    >
                        {/* Header modal */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-violet-500 font-black">Nueva</p>
                                <h2 className="text-xl font-black text-white leading-tight">Lista de reproducción</h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Portada opcional */}
                        <div className="flex items-center gap-4 mb-6 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className="relative w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden cursor-pointer group"
                                style={{ border: '2px dashed rgba(124,58,237,0.4)' }}
                            >
                                {preview ? (
                                    <img src={preview} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: 'rgba(124,58,237,0.08)' }}>
                                        <span className="text-xl">🎵</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.6)' }}>
                                    <span className="text-[9px] font-black text-white uppercase">Subir</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white mb-1">Portada</p>
                                <p className="text-[11px] text-gray-600 leading-snug">
                                    {preview ? '✓ Imagen seleccionada' : 'Opcional — click para elegir'}
                                </p>
                                {preview && (
                                    <button
                                        type="button"
                                        onClick={() => { setPreview(null); setCroppedImage(null); }}
                                        className="text-[10px] text-red-500 hover:text-red-400 font-bold mt-1 transition-colors"
                                    >
                                        Quitar foto
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        {/* Campos */}
                        <div className="space-y-3 mb-6">
                            <input
                                type="text"
                                placeholder="Nombre de la lista *"
                                required
                                value={newPlaylist.name}
                                onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                                className="w-full p-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                            <textarea
                                placeholder="Descripción (opcional)"
                                value={newPlaylist.description}
                                onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                                rows={3}
                                className="w-full p-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all resize-none"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                        </div>

                        {/* Acciones */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-white transition-colors"
                                style={{ background: 'rgba(255,255,255,0.04)' }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 rounded-xl text-sm font-black text-white transition-all active:scale-95 disabled:opacity-50"
                                style={{ background: '#7c3aed' }}
                                onMouseEnter={e => !isSubmitting && (e.currentTarget.style.background = '#6d28d9')}
                                onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}
                            >
                                {isSubmitting ? 'Creando...' : 'Crear lista'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <Footer />
        </>
    );
};

export default MyPlaylists;
