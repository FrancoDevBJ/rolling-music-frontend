import React from 'react';
import { useSongs } from '../context/SongsContext';
import Canciones from '../components/Canciones.jsx';
import Footer from '../components/Footer.jsx';

const GENRES = [
    { name: 'Rock',        color: '#7f1d1d', accent: '#ef4444' },
    { name: 'Pop',         color: '#831843', accent: '#ec4899' },
    { name: 'Hip-Hop',     color: '#1e1b4b', accent: '#818cf8' },
    { name: 'Electronic',  color: '#064e3b', accent: '#34d399' },
    { name: 'Latin',       color: '#7c2d12', accent: '#fb923c' },
    { name: 'R&B',         color: '#4a1942', accent: '#c084fc' },
    { name: 'Jazz',        color: '#1c1917', accent: '#d6d3d1' },
    { name: 'K-Pop',       color: '#4d1c6d', accent: '#f0abfc' },
    { name: 'Classical',   color: '#1c1917', accent: '#fbbf24' },
    { name: 'Metal',       color: '#111827', accent: '#6b7280' },
    { name: 'Tropical',    color: '#064e3b', accent: '#6ee7b7' },
    { name: 'Country',     color: '#451a03', accent: '#fcd34d' },
    { name: 'Christian',   color: '#0c4a6e', accent: '#7dd3fc' },
    { name: 'Urban',       color: '#0f172a', accent: '#94a3b8' },
    { name: 'Kids',        color: '#7c2d12', accent: '#fdba74' },
    { name: 'Oldies',      color: '#1e3a5f', accent: '#93c5fd' },
];

const Search = () => {
    const { handleSearch, songs, adminSongs, isLoading, error, searchTerm } = useSongs();

    const handleGenreClick = (genreName) => {
        handleSearch(genreName, true);
        const el = document.getElementById('search-results');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white p-8">
                <div className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <h2 className="text-xl font-black mb-2">Error de conexión</h2>
                    <p className="text-gray-500 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const hasResults = songs.length > 0 || adminSongs.length > 0;

    return (
        <>
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeSlideUp 0.5s ease both; }
                .genre-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .genre-card:hover { transform: scale(1.04); }
                .genre-card:active { transform: scale(0.97); }
            `}</style>

            <div className="min-h-full flex flex-col" style={{ background: 'linear-gradient(160deg, #0d0118 0%, #0a0a0a 40%, #020010 100%)' }}>
                <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 md:py-12">
                    <div className="max-w-7xl mx-auto space-y-12">

                        {/* Header */}
                        <div className="fade-up">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-violet-500 font-black mb-2">Descubrí</p>
                            <h1 className="font-black leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em' }}>
                                Explorar <span style={{ color: '#a78bfa' }}>Géneros</span>
                            </h1>
                        </div>

                        {/* Grid géneros */}
                        <div className="fade-up grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4" style={{ animationDelay: '100ms' }}>
                            {GENRES.map((genre, i) => (
                                <button
                                    key={genre.name}
                                    onClick={() => handleGenreClick(genre.name)}
                                    className="genre-card relative h-24 sm:h-28 rounded-2xl overflow-hidden text-left p-4 flex flex-col justify-between"
                                    style={{
                                        background: genre.color,
                                        border: `1px solid ${genre.accent}20`,
                                        animationDelay: `${i * 30}ms`,
                                        animation: 'fadeSlideUp 0.5s ease both'
                                    }}
                                >
                                    <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full pointer-events-none" style={{ background: genre.accent, filter: 'blur(20px)', opacity: 0.3 }} />
                                    <span className="text-white font-black text-base sm:text-lg z-10 leading-tight">{genre.name}</span>
                                    <span className="text-[10px] font-black uppercase tracking-wider z-10" style={{ color: genre.accent }}>Explorar →</span>
                                </button>
                            ))}
                        </div>

                        {/* Resultados */}
                        <div id="search-results" className="scroll-mt-8 fade-up" style={{ animationDelay: '200ms' }}>
                            <div className="mb-8 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <h2 className="font-black" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em' }}>
                                    {searchTerm
                                        ? <>Resultados para <span style={{ color: '#a78bfa' }}>"{searchTerm}"</span></>
                                        : <>Descubrimientos <span style={{ color: '#a78bfa' }}>para ti</span></>
                                    }
                                </h2>
                            </div>

                            {isLoading && (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-gray-600 text-sm">Buscando en la biblioteca...</p>
                                </div>
                            )}

                            {!isLoading && searchTerm && !hasResults && (
                                <div className="flex flex-col items-center justify-center py-20 rounded-3xl text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                                    <p className="text-5xl mb-4">🔍</p>
                                    <p className="text-white font-black text-lg mb-2">Sin resultados</p>
                                    <p className="text-gray-600 text-sm">No encontramos coincidencias para "{searchTerm}"</p>
                                </div>
                            )}

                            {!isLoading && (
                                <div className="space-y-12">
                                    {adminSongs.length > 0 && (
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-violet-500 font-black mb-4">Desde tu servidor</p>
                                            <Canciones songs={adminSongs} />
                                        </div>
                                    )}
                                    {songs.length > 0 && (
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-black mb-4">Catálogo Global</p>
                                            <Canciones songs={songs} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Search;
