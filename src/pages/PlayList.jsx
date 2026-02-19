import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSongs } from '../context/SongsContext'; 
import Canciones from '../components/Canciones.jsx';
import Navbar from '../components/Navbar.jsx';
import Aside from '../components/Aside.jsx';
import Player from '../components/Player.jsx';
import Footer from '../components/Footer.jsx';
import musicApi from '../services/musicApi';
import Swal from 'sweetalert2';

function PlayList() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    
    const { adminSongs, songs, isLoading: songsLoading, loadPlaylists } = useSongs();
    
    const [currentPlaylist, setCurrentPlaylist] = useState(null);
    const [playlistSongs, setPlaylistSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL_FILES = import.meta.env.VITE_API_URL_FILES || 'http://localhost:3000';

    // --- 1. FUNCIÓN PARA EDITAR NOMBRE/DESCRIPCIÓN ---
    const handleEditPlaylist = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Editar Playlist',
            background: '#171717',
            color: '#fff',
            html:
                `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${currentPlaylist.name}" style="background: #262626; color: white; border: 1px solid #404040">` +
                `<input id="swal-input2" class="swal2-input" placeholder="Descripción" value="${currentPlaylist.description || ''}" style="background: #262626; color: white; border: 1px solid #404040">`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar cambios',
            preConfirm: () => {
                return {
                    name: document.getElementById('swal-input1').value,
                    description: document.getElementById('swal-input2').value
                }
            }
        });

        if (formValues) {
            try {
                const response = await musicApi.put(`/playlists/${id}`, formValues);
                if (response.data.ok) {
                    setCurrentPlaylist({ ...currentPlaylist, ...formValues });
                    if (loadPlaylists) await loadPlaylists(); // Actualiza el Aside
                    Swal.fire({ icon: 'success', title: 'Actualizado', background: '#171717', color: '#fff' });
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo actualizar', 'error');
            }
        }
    };

    // --- 2. FUNCIÓN PARA QUITAR UNA CANCIÓN ---
    const handleRemoveSong = async (songId) => {
        try {
            const response = await musicApi.delete(`/playlists/${id}/songs/${songId}`);
            if (response.data.ok) {
                // Filtramos localmente para que desaparezca de la vista de inmediato
                setPlaylistSongs(prev => prev.filter(s => s.codigo_unico !== songId));
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Canción quitada',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#171717',
                    color: '#fff'
                });
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo quitar la canción', 'error');
        }
    };

    // --- 3. FUNCIÓN PARA ELIMINAR TODA LA PLAYLIST ---
    const handleDeletePlaylist = async () => {
        const result = await Swal.fire({
            title: '¿Eliminar esta lista?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar',
            background: '#171717',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                const response = await musicApi.delete(`/playlists/${id}`);
                if (response.data.ok) {
                    if (loadPlaylists) await loadPlaylists();
                    navigate('/');
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
        }
    };

    useEffect(() => {
        const fetchPlaylistData = async () => {
            setLoading(true);
            try {
                const response = await musicApi.get(`/playlists/${id}`); 
                if (response.data.ok) {
                    const plData = response.data.data;
                    const formattedPlaylist = {
                        ...plData,
                        img: plData.img?.startsWith('http') 
                            ? plData.img 
                            : `${API_URL_FILES}/uploads/playlists/${plData.img}`
                    };
                    setCurrentPlaylist(formattedPlaylist);
                    const allAvailableSongs = [...adminSongs, ...songs];
                    const foundSongs = plData.songs.map(songId => 
                        allAvailableSongs.find(s => s.codigo_unico === songId)
                    ).filter(Boolean);
                    setPlaylistSongs(foundSongs);
                }
            } catch (error) {
                if (error.response?.status === 404) navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (id && adminSongs.length > 0) fetchPlaylistData();
    }, [id, adminSongs, songs, navigate]);

    return (
        <div id="app" className="grid w-full h-screen bg-black text-white m-0 p-0 overflow-hidden"
             style={{
                gridTemplateAreas: '"navbar navbar" "aside main" "player player"',
                gridTemplateColumns: `${isOpen ? '260px' : '0px'} 1fr`,
                gridTemplateRows: 'auto 1fr auto'
             }}>
            
            <header className="[grid-area:navbar] z-50">
                <Navbar toggleSidebar={() => setIsOpen(!isOpen)}/>
            </header>

            <aside className={`[grid-area:aside] flex flex-col bg-neutral-950 border-r border-white/5 transition-all duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 -translate-x-full'}`}>
                <Aside />
            </aside>

            <main className="[grid-area:main] overflow-y-auto bg-gradient-to-b from-blue-900/20 to-black w-full">
                
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-8 bg-gradient-to-b from-blue-600/20 to-transparent">
                    <div className="w-48 h-48 bg-neutral-800 shadow-2xl flex items-center justify-center rounded-lg border border-white/10 overflow-hidden shrink-0 group relative">
                        {currentPlaylist?.img ? (
                            <img src={currentPlaylist.img} alt={currentPlaylist.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-6xl">🎵</span>
                        )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Lista de Reproducción</p>
                        <h1 className="text-4xl md:text-7xl font-black mt-2 mb-4">
                            {currentPlaylist?.name || "Cargando..."}
                        </h1>
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <p className="text-gray-400 font-medium">
                                {playlistSongs.length} canciones • {currentPlaylist?.description || "Sin descripción"}
                            </p>
                            
                            <div className="flex gap-2">
                                <button onClick={handleEditPlaylist} className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all">
                                    EDITAR
                                </button>
                                <button onClick={handleDeletePlaylist} className="px-4 py-1.5 rounded-full border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
                                    ELIMINAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 md:p-8">
                    {(loading || songsLoading) ? (
                        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
                    ) : playlistSongs.length === 0 ? (
                        <div className="text-center py-20 bg-neutral-900/40 rounded-2xl border border-dashed border-white/10">
                            <p className="text-gray-400 text-xl font-medium">Esta lista está vacía.</p>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            {/* Pasamos handleRemoveSong como prop a Canciones */}
                            <Canciones songs={playlistSongs} onRemoveSong={handleRemoveSong} isPlaylistView={true} />
                        </div>
                    )}
                </div>
                
                <Footer />
            </main>

            <footer className="[grid-area:player] w-full border-t border-white/5 bg-black/80 backdrop-blur-lg">
                <Player/>
            </footer>
        </div>
    );
}

export default PlayList;