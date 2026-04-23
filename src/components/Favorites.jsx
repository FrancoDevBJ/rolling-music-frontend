import React from 'react';
import { useSongs } from '../context/SongsContext';
import Canciones from '../components/Canciones.jsx';
import Footer from '../components/Footer.jsx';

const Favorites = () => {
    const {
        songs,
        adminSongs,
        favorites,
        isLoading
    } = useSongs();

    const allSongs = [...adminSongs, ...songs];
    const favoriteSongs = allSongs.filter(song => favorites.includes(song.codigo_unico));

    return (
        <>
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    15%       { transform: scale(1.15); }
                    30%       { transform: scale(1); }
                    45%       { transform: scale(1.08); }
                    60%       { transform: scale(1); }
                }
                .heart-icon { animation: heartbeat 3s ease-in-out infinite; }
                .fade-up { animation: fadeSlideUp 0.5s ease both; }
            `}</style>

            <div
                className="min-h-full flex flex-col"
                style={{ background: 'linear-gradient(160deg, #0d0118 0%, #0a0a0a 50%, #020010 100%)' }}
            >
                <main className="flex-1 p-6 md:p-10">
                    <div className="max-w-7xl mx-auto space-y-10">

                        {/* ENCABEZADO */}
                        <div
                            className="fade-up flex flex-col sm:flex-row items-start sm:items-end gap-6 pb-8"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        >
                            
                            {/* Texto */}
                            <div className="flex-1">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-black mb-2">
                                    Tu colección
                                </p>
                                <h1
                                    className="font-black leading-none mb-4"
                                    style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '-0.03em' }}
                                >
                                    Tus{' '}
                                    <span style={{ color: '#f87171' }}>Favoritos</span>
                                </h1>
                                <div className="flex items-center gap-3">
                                    <span
                                        className="text-sm font-black px-3 py-1 rounded-full"
                                        style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
                                    >
                                        {favoriteSongs.length} {favoriteSongs.length === 1 ? 'canción' : 'canciones'}
                                    </span>
                                    {favoriteSongs.length > 0 && (
                                        <span className="text-xs text-gray-600">guardadas en tu biblioteca</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CONTENIDO */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-32 gap-4">
                                <div
                                    className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                                    style={{ borderColor: 'rgba(239,68,68,0.3)', borderTopColor: '#ef4444' }}
                                />
                                <p className="text-sm text-gray-600">Cargando tus favoritos...</p>
                            </div>

                        ) : favoriteSongs.length === 0 ? (
                            <div
                                className="fade-up flex flex-col items-center justify-center py-32 rounded-3xl text-center"
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
                            >
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 text-3xl"
                                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px dashed rgba(239,68,68,0.25)' }}
                                >
                                    🎵
                                </div>
                                <p className="text-white font-black text-xl mb-2">Todavía no tenés favoritos</p>
                                <p className="text-gray-600 text-sm max-w-xs">
                                    Explorá el catálogo y tocá el ❤️ en las canciones que más te gusten
                                </p>
                            </div>

                        ) : (
                            <div className="fade-up">
                                <Canciones songs={favoriteSongs} />
                            </div>
                        )}

                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default Favorites;
