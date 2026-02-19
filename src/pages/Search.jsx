import React, { useState } from 'react';
import { useSongs } from '../context/SongsContext'; 
import Canciones from '../components/Canciones.jsx'; 
import Navbar from '../components/Navbar.jsx';
import Aside from '../components/Aside.jsx';
import Player from '../components/Player.jsx';
import Footer from '../components/Footer.jsx';

const GENRES = [
  { name: 'Country', color: 'from-orange-600 to-amber-900' }, // Corregido: 'Country'
  { name: 'Rock', color: 'from-red-900 to-rose-700' },
  { name: 'Hip-Hop', color: 'from-indigo-900 to-purple-800' },
  { name: 'Pop', color: 'from-pink-700 to-rose-900' },
  { name: 'Latin', color: 'from-slate-500 to-purple-400' }, // Corregido: 'Latin'
  { name: 'R&B', color: 'from-orange-900 to-red-700' },
  { name: 'Christian', color: 'from-teal-800 to-stone-500' },
  { name: 'Electronic', color: 'from-purple-800 to-emerald-900' },
  { name: 'Kids', color: 'from-orange-400 to-amber-600' },
  { name: 'Classical', color: 'from-stone-700 to-gray-900' },
  { name: 'Jazz', color: 'from-indigo-900 to-purple-800' },
  { name: 'K-Pop', color: 'from-pink-500 to-rose-700' },
  { name: 'Tropical', color: 'from-emerald-700 to-teal-900' },
  { name: 'Urban', color: 'from-teal-800 to-stone-500' },
  { name: 'Oldies', color: 'from-purple-800 to-emerald-900' },
  { name: 'Metal', color: 'from-zinc-800 to-black' },
];

const Search = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { 
        handleSearch,
        songs,           // Resultados de Deezer
        adminSongs,      // Tus resultados de MongoDB
        isLoading,
        error,
        searchTerm,     
    } = useSongs();

    // Función para buscar por género y hacer scroll suave a los resultados
    const handleGenreClick = (genreName) => {
    // El segundo parámetro indica que ES un género
    handleSearch(genreName, true); 
    
    const resultsSection = document.getElementById('search-results');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
};

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-red-500 p-8">
                <div className="bg-neutral-900 p-6 rounded-xl border border-red-900/30">
                    <h2 className="text-xl font-bold mb-2">Error de conexión</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

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

            <aside className={`[grid-area:aside] flex flex-col bg-neutral-950 transition-all duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 -translate-x-full'}`}>
                <Aside />
            </aside>

            <main className="[grid-area:main] overflow-y-auto w-full bg-gradient-to-b from-neutral-900 to-black">
                <div className='animate-fade-in px-4 md:px-8 py-6 w-full max-w-7xl mx-auto'>
                    
                    <h2 className="text-3xl font-black text-violet-400 mb-8 border-b border-violet-900/30 pb-4">
                        Explorar Géneros
                    </h2>
                    
                    {/* GRILLA DE GÉNEROS */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                        {GENRES.map((genre) => (
                            <button
                                key={genre.name}
                                onClick={() => handleGenreClick(genre.name)}
                                className={`h-28 rounded-xl bg-gradient-to-br ${genre.color}
                                            flex items-start p-4 text-left relative overflow-hidden
                                            hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-xl group`}
                            >
                                <span className="text-white font-black text-xl z-10">
                                    {genre.name}
                                </span>
                                {/* Efecto decorativo de fondo */}
                                <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
                            </button>
                        ))}
                    </div>

                    {/* SECCIÓN DE RESULTADOS */}
                    <div id="search-results" className="scroll-mt-6 pt-8 border-t border-white/5">
                        <h2 className="text-3xl font-black text-white mb-8">
                            {searchTerm ? (
                                <>Resultados para <span className="text-violet-400">"{searchTerm}"</span></>
                            ) : (
                                "Descubrimientos para ti"
                            )}
                        </h2>
                        
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-gray-400 font-medium">Buscando en la biblioteca...</p>
                            </div>
                        )}
                        
                        {!isLoading && searchTerm && songs.length === 0 && adminSongs.length === 0 && (
                            <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-dashed border-white/10">
                                <p className="text-gray-400 text-lg">No encontramos coincidencias para "{searchTerm}"</p>
                                <p className="text-sm text-gray-600 mt-2">Prueba con otro artista, género o canción.</p>
                            </div>
                        )}
                        
                        {/* RESULTADOS HÍBRIDOS */}
                        <div className="space-y-12">
                            {/* Primero mostramos tus canciones de MongoDB si hay resultados */}
                            {adminSongs.length > 0 && (
                                <div>
                                    <h3 className="text-sm uppercase tracking-[0.2em] text-violet-500 font-bold mb-4">Desde tu servidor</h3>
                                    <Canciones songs={adminSongs} />
                                </div>
                            )}

                            {/* Luego mostramos los resultados de Deezer */}
                            {songs.length > 0 && (
                                <div>
                                    <h3 className="text-sm uppercase tracking-[0.2em] text-gray-500 font-bold mb-4">Catálogo Global</h3>
                                    <Canciones songs={songs} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Footer/>
            </main>

            <footer className="[grid-area:player] w-full border-t border-white/5">
                <Player/>
            </footer>
        </div>
    );
}

export default Search;