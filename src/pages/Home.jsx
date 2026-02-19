import React, { useState } from 'react';
import { useSongs } from '../context/SongsContext'; 
import Canciones from '../components/Canciones.jsx'; 
import CatalogoPorSecciones from '../components/CatalogoPorSecciones.jsx'; 
import Navbar from '../components/Navbar.jsx';
import Aside from '../components/Aside.jsx';
import Player from '../components/Player.jsx';
import Footer from '../components/Footer.jsx';

const Home = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { 
        songs,           // Catálogo de Deezer
        adminSongs,      // Tus canciones de MongoDB
        isLoading,
        error,   
    } = useSongs();

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-red-500 p-8 text-center">
                <div className="bg-neutral-900 p-6 rounded-xl border border-red-900/50 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-2">Ups! Algo salió mal</h2>
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

            <aside className={`[grid-area:aside] flex flex-col bg-neutral-950 border-r border-white/5 transition-all duration-300 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0 -translate-x-full'}`}>
                <Aside />
            </aside>

            <main className="[grid-area:main] overflow-y-auto bg-gradient-to-b from-neutral-900 to-black w-full">
                <div className="p-4 md:p-8 space-y-12">
                    
                    {/* SECCIÓN 1: PRODUCCIONES ORIGINALES (TU BACKEND) */}
                    <section className="animate-fade-in-up">
                        <div className="flex items-center justify-between mb-6 border-b border-violet-700/30 pb-2">
                            <h2 className="text-3xl font-black text-violet-400">
                                Lanzamientos Originales
                            </h2>
                            <span className="text-xs font-bold uppercase tracking-widest text-violet-500 bg-violet-950/30 px-3 py-1 rounded-full border border-violet-800/20">
                                Exclusivo MongoDB
                            </span>
                        </div>
                        
                        {isLoading ? (
                            <p className="text-center py-10 text-gray-500">Sincronizando con el servidor...</p>
                        ) : adminSongs.length > 0 ? (
                            <Canciones songs={adminSongs} /> // Renderiza tus canciones primero
                        ) : (
                            <p className="text-gray-500 italic">No hay producciones originales aún.</p>
                        )}
                    </section>

                    {/* SECCIÓN 2: CATÁLOGO GENERAL (DEEZER) */}
                    <section className="animate-fade-in-up delay-200">
                        <div className="flex items-center justify-between mb-6 border-b border-neutral-800 pb-2">
                            <h2 className="text-3xl font-black text-gray-200">
                                Tendencias Globales
                            </h2>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 bg-neutral-800 px-3 py-1 rounded-full">
                                Vía Deezer API
                            </span>
                        </div>
                        
                        {isLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-48 bg-neutral-800 animate-pulse rounded-lg"></div>
                                ))}
                            </div>
                        ) : (
                            <Canciones songs={songs} /> //
                        )}
                    </section>

                    {/* SECCIÓN 3: EXPLORAR POR CATEGORÍAS */}
                    <div className="mt-12">
                        <CatalogoPorSecciones />
                    </div>
                </div>
                <Footer/>
            </main>

            <footer className="[grid-area:player] w-full border-t border-white/5 shadow-2xl">
                <Player/>
            </footer>
        </div>
    );
};

export default Home;