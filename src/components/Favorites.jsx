import React, { useState } from 'react';
import { useSongs } from '../context/SongsContext'; 
import Canciones from '../components/Canciones.jsx'; 
import Footer from '../components/Footer.jsx';

const Favorites = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { 
        songs,           // Canciones de Deezer
        adminSongs,      // Tus canciones de MongoDB
        favorites,       // Array de IDs: ["local-123", "deezer-456"]
        isLoading 
    } = useSongs();

    // 🛠️ FILTRADO HÍBRIDO: Juntamos ambas fuentes y filtramos por los favoritos del usuario
    const allSongs = [...adminSongs, ...songs];
    const favoriteSongs = allSongs.filter(song => favorites.includes(song.codigo_unico));

    return (
        <div>
            <main className="[grid-area:main] overflow-y-auto bg-gradient-to-b from-purple-900/20 to-black p-8">
                <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
                    
                    {/* ENCABEZADO */}
                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-40 h-40 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl shadow-2xl flex items-center justify-center text-6xl">
                            ❤️
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-red-500">Favoritos</p>
                            <h1 className="text-5xl md:text-6xl font-black mt-2">Tus Favoritos</h1>
                            <p className="text-gray-400 mt-4 font-medium">
                                {favoriteSongs.length} canciones guardadas
                            </p>
                        </div>
                    </div>

                    {/* LISTADO DE CANCIONES */}
                    {isLoading ? (
                        <div className="text-center py-20">
                            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : favoriteSongs.length === 0 ? (
                        <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-dashed border-white/10">
                            <p className="text-gray-400 text-xl">Tu lista de favoritos está vacía.</p>
                            <p className="text-sm text-gray-600 mt-2">Explora el catálogo y toca el corazón en tus canciones preferidas.</p>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <Canciones songs={favoriteSongs} />
                        </div>
                    )}

                </div>

            </main>

            <Footer />
            
        </div>
    );
};

export default Favorites;