import React, { useState } from 'react';
import { useSongs } from '../context/SongsContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Aside from '../components/Aside';
import Player from '../components/Player';
import musicApi from '../services/musicApi';
import Swal from 'sweetalert2';

const MyPlaylists = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { playlists, setPlaylists } = useSongs();
    const [showModal, setShowModal] = useState(false);
    const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await musicApi.post('/playlists', newPlaylist);
            if (data.ok) {
                // Actualizamos el contexto global con la nueva lista
                setPlaylists([...playlists, data.data]);
                setShowModal(false);
                setNewPlaylist({ name: '', description: '' });
                Swal.fire('¡Creada!', 'Tu nueva lista está lista para recibir música', 'success');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo crear la playlist', 'error');
        }
    };

    return (
        <div id="app" className="grid w-full h-screen bg-black text-white overflow-hidden"
             style={{
                gridTemplateAreas: '"navbar navbar" "aside main" "player player"',
                gridTemplateColumns: `${isOpen ? '260px' : '0px'} 1fr`,
                gridTemplateRows: 'auto 1fr auto'
             }}>
            
            <header className="[grid-area:navbar] z-50"><Navbar toggleSidebar={() => setIsOpen(!isOpen)}/></header>
            <aside className="[grid-area:aside] bg-neutral-950 transition-all overflow-y-auto"><Aside /></aside>

            <main className="[grid-area:main] overflow-y-auto bg-gradient-to-b from-purple-900/20 to-black p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-10">
                        <h1 className="text-4xl font-black">Mis Playlists</h1>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-full font-bold transition-all transform active:scale-95"
                        >
                            + Crear Nueva
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {playlists.map(pl => (
                            <Link 
                                to={`/playlist/${pl._id}`} 
                                key={pl._id}
                                className="bg-neutral-900/40 p-4 rounded-xl hover:bg-neutral-800 transition-all group shadow-xl border border-white/5"
                            >
                                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                                    <img src={pl.img} alt={pl.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-violet-600 p-3 rounded-full shadow-lg text-white">
                                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="font-bold truncate text-lg">{pl.name}</h3>
                                <p className="text-gray-500 text-xs truncate">{pl.songs?.length || 0} canciones</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* MODAL PARA CREAR PLAYLIST */}
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <form onSubmit={handleCreate} className="bg-neutral-900 p-8 rounded-2xl border border-white/10 w-full max-w-sm shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6">Nueva Playlist</h2>
                            <input 
                                type="text" placeholder="Nombre" required
                                className="w-full bg-black border border-white/10 p-3 rounded-lg mb-4 text-white focus:ring-2 focus:ring-violet-500 outline-none"
                                onChange={(e) => setNewPlaylist({...newPlaylist, name: e.target.value})}
                            />
                            <textarea 
                                placeholder="Descripción"
                                className="w-full bg-black border border-white/10 p-3 rounded-lg mb-6 h-24 text-white focus:ring-2 focus:ring-violet-500 outline-none"
                                onChange={(e) => setNewPlaylist({...newPlaylist, description: e.target.value})}
                            ></textarea>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-gray-400 font-bold hover:text-white">Cancelar</button>
                                <button type="submit" className="flex-1 bg-violet-600 py-2 rounded-lg font-bold hover:bg-violet-500">Crear</button>
                            </div>
                        </form>
                    </div>
                )}
            </main>

            <footer className="[grid-area:player]"><Player/></footer>
        </div>
    );
};

export default MyPlaylists;