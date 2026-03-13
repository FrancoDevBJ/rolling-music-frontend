import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useSongs } from '../context/SongsContext'; 
import Canciones from '../components/Canciones.jsx';
import Footer from '../components/Footer.jsx';
import musicApi from '../services/musicApi';
import Swal from 'sweetalert2';

function PlayList() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { adminSongs, songs, isLoading: songsLoading, loadPlaylists } = useSongs();

    const [currentPlaylist, setCurrentPlaylist] = useState(null);
    const [playlistSongs, setPlaylistSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL_FILES = import.meta.env.VITE_API_URL_FILES || 'http://localhost:3000';

    // EDITAR PLAYLIST
    const handleEditPlaylist = async () => {

        const { value: formValues } = await Swal.fire({
            title: 'Editar Playlist',
            background: '#171717',
            color: '#fff',
            html:
                `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${currentPlaylist.name}">` +
                `<input id="swal-input2" class="swal2-input" placeholder="Descripción" value="${currentPlaylist.description || ''}">`,
            showCancelButton: true,
            confirmButtonText: 'Guardar cambios',
            preConfirm: () => ({
                name: document.getElementById('swal-input1').value,
                description: document.getElementById('swal-input2').value
            })
        });

        if (formValues) {

            try {

                const response = await musicApi.put(`/playlists/${id}`, formValues);

                if (response.data.ok) {

                    setCurrentPlaylist({ ...currentPlaylist, ...formValues });

                    if (loadPlaylists) await loadPlaylists();

                    Swal.fire({
                        icon: 'success',
                        title: 'Actualizado',
                        background: '#171717',
                        color: '#fff'
                    });

                }

            } catch {

                Swal.fire('Error', 'No se pudo actualizar', 'error');

            }

        }

    };

    // QUITAR CANCIÓN
    const handleRemoveSong = async (songId) => {

        try {

            const response = await musicApi.delete(`/playlists/${id}/songs/${songId}`);

            if (response.data.ok) {

                setPlaylistSongs(prev =>
                    prev.filter(s => s.codigo_unico !== songId)
                );

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Canción quitada',
                    showConfirmButton: false,
                    timer: 2000
                });

            }

        } catch {

            Swal.fire('Error', 'No se pudo quitar la canción', 'error');

        }

    };

    // ELIMINAR PLAYLIST
    const handleDeletePlaylist = async () => {

        const result = await Swal.fire({
            title: '¿Eliminar esta lista?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar'
        });

        if (result.isConfirmed) {

            try {

                const response = await musicApi.delete(`/playlists/${id}`);

                if (response.data.ok) {

                    if (loadPlaylists) await loadPlaylists();

                    navigate('/my-playlists');

                }

            } catch {

                Swal.fire('Error', 'No se pudo eliminar', 'error');

            }

        }

    };

    useEffect(() => {

    const fetchPlaylistData = async () => {

        if (!id) return;

        setLoading(true);

        try {

            const response = await musicApi.get(`/playlists/${id}`);

            if (!response.data.ok) return;

            const plData = response.data.data;

            const formattedPlaylist = {
                ...plData,
                img: plData.img?.startsWith('http')
                    ? plData.img
                    : `${API_URL_FILES}/uploads/playlists/${plData.img}`
            };

            setCurrentPlaylist(formattedPlaylist);

            // canciones disponibles en memoria
            const allAvailableSongs = [...adminSongs, ...songs];

            const resolvedSongs = await Promise.all(

                plData.songs.map(async (songId) => {

                    // buscamos primero en memoria
                    let song = allAvailableSongs.find(
                        s => s.codigo_unico === songId
                    );

                    // si no existe y es de Deezer
                    if (!song && songId.startsWith("deezer-")) {

                        const deezerId = songId.replace("deezer-", "");

                        try {

                            const res = await fetch(
                                `https://api.deezer.com/track/${deezerId}`
                            );

                            const data = await res.json();

                            song = {
                                ...data,
                                codigo_unico: `deezer-${data.id}`
                            };

                        } catch (err) {
                            console.error("Error cargando canción Deezer:", err);
                        }

                    }

                    return song;

                })
            );

            // filtramos canciones inexistentes
            setPlaylistSongs(resolvedSongs.filter(Boolean));

        } catch (error) {

            console.error("Error cargando playlist:", error);

            if (error.response?.status === 404) {
                navigate('/');
            }

        } finally {
            setLoading(false);
        }

    };

    fetchPlaylistData();

}, [id, adminSongs, songs]);

    return (

        <div className="bg-gradient-to-b from-blue-900/20 to-black min-h-full">

            {/* HEADER PLAYLIST */}

            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-8">

                <div className="w-48 h-48 bg-neutral-800 rounded-lg overflow-hidden">

                    {currentPlaylist?.img ? (
                        <img src={currentPlaylist.img} alt={currentPlaylist.name} className="w-full h-full object-cover"/>
                    ) : (
                        <span className="text-6xl">🎵</span>
                    )}

                </div>

                <div>

                    <p className="text-xs uppercase text-blue-400">
                        Lista de reproducción
                    </p>

                    <h1 className="text-5xl font-black mt-2">
                        {currentPlaylist?.name || "Cargando..."}
                    </h1>

                    <p className="text-gray-400 mt-2">
                        {playlistSongs.length} canciones
                    </p>

                    <div className="flex gap-2 mt-4">

                        <button
                            onClick={handleEditPlaylist}
                            className="px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs"
                        >
                            EDITAR
                        </button>

                        <button
                            onClick={handleDeletePlaylist}
                            className="px-4 py-1 rounded-full border border-red-500 text-red-500 text-xs"
                        >
                            ELIMINAR
                        </button>

                    </div>

                </div>

            </div>

            {/* SONGS */}

            <div className="p-8">

                {(loading || songsLoading) ? (

                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>

                ) : playlistSongs.length === 0 ? (

                    <p className="text-center text-gray-400">
                        Esta lista está vacía.
                    </p>

                ) : (

                    <Canciones
                        songs={playlistSongs}
                        onRemoveSong={handleRemoveSong}
                        isPlaylistView={true}
                    />

                )}

            </div>

            <Footer/>

        </div>

    );

}

export default PlayList;