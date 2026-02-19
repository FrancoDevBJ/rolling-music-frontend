import React from 'react';
import { useSongs } from '../context/SongsContext';
import Swal from 'sweetalert2';
import musicApi from '../services/musicApi';

const AddToPlaylistModal = ({ song, onClose }) => {
    // 🛠️ Extraemos 'getUserPlaylists' para refrescar la lista después de agregar
    const { playlists, getUserPlaylists } = useSongs();
    
    const API_URL_FILES = import.meta.env.VITE_API_URL_FILES || 'http://localhost:3000';

    const handleAdd = async (playlistId) => {
        try {
            const songId = song.codigo_unico || song.id || song._id;
            
            // La ruta coincide con tu controlador: /playlists/add/:playlistId/:songId
            const response = await musicApi.patch(`/playlists/add/${playlistId}/${songId}`);
            
            if (response.data.ok) {
                // 🛠️ Refrescamos las playlists en el contexto para que el contador de canciones suba
                if (getUserPlaylists) await getUserPlaylists();

                Swal.fire({
                    icon: 'success',
                    title: '¡Añadida!',
                    text: `Canción agregada a la lista`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000
                });
                onClose();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'No se pudo agregar la canción';
            Swal.fire('Error', errorMsg, 'error');
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div 
                className="bg-neutral-900 w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Añadir a una lista</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {playlists && playlists.length > 0 ? (
                        playlists.map(pl => {
                            // 🛠️ AJUSTE DE RUTA: Apuntamos a /uploads/playlists/
                            const plImage = pl.img?.startsWith('http') 
                                ? pl.img 
                                : `${API_URL_FILES}/uploads/playlists/${pl.img || 'default-playlist.png'}`;

                            return (
                                <button
                                    key={pl._id}
                                    onClick={() => handleAdd(pl._id)}
                                    className="w-full flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-transparent hover:border-violet-500/50 transition-all group"
                                >
                                    <img 
                                        src={plImage} 
                                        alt={pl.name} 
                                        className="w-12 h-12 rounded object-cover shadow-md" 
                                        onError={(e) => {
                                            e.target.src = "https://i.ibb.co/ZRn36S2x/Cover-Default-Playlist.jpg";
                                        }}
                                    />
                                    <div className="flex flex-col items-start">
                                        <span className="text-gray-200 group-hover:text-white font-medium text-left">
                                            {pl.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {pl.songs?.length || 0} canciones
                                        </span>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-gray-500 mb-4">No tienes listas creadas aún.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddToPlaylistModal;