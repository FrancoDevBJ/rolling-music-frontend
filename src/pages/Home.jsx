import React from 'react';
import { useSongs } from '../context/SongsContext';
import Canciones from '../components/Canciones.jsx';
import CatalogoPorSecciones from '../components/CatalogoPorSecciones.jsx';
import Footer from '../components/Footer.jsx';

const Home = () => {
    const { songs, adminSongs, isLoading, error } = useSongs();

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white p-8 text-center">
                <div className="p-8 rounded-2xl max-w-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <p className="text-4xl mb-4">⚠️</p>
                    <h2 className="text-xl font-black mb-2">Algo salió mal</h2>
                    <p className="text-gray-500 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeSlideUp 0.6s ease both; }
            `}</style>

            <div className="min-h-full flex flex-col" style={{ background: 'linear-gradient(160deg, #0d0118 0%, #0a0a0a 40%, #020010 100%)' }}>
                <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 md:py-12 space-y-16">

                    {/* Hero */}
                    <div
                        className="fade-up relative rounded-3xl overflow-hidden px-8 py-12 md:py-16"
                        style={{ background: 'linear-gradient(135deg, #1e0040 0%, #0d0118 50%, #0a0a0a 100%)', border: '1px solid rgba(167,139,250,0.1)' }}
                    >
                        <div className="absolute top-0 left-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', filter: 'blur(30px)' }} />
                        <div className="relative z-10">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-violet-500 font-black mb-3">Bienvenido a</p>
                            <h1 className="font-black leading-none mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.03em' }}>
                                Rolling<span style={{ color: '#a78bfa' }}>Play</span>
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base max-w-md">
                                Tu música, tu ritmo. Descubrí nuevos artistas y escuchá lo mejor del momento.
                            </p>
                        </div>
                    </div>

                    {/* Lanzamientos originales */}
                    {(isLoading || adminSongs.length > 0) && (
                        <section className="fade-up" style={{ animationDelay: '100ms' }}>
                            <div className="mb-6">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-violet-500 font-black mb-1">Exclusivos</p>
                                <h2 className="font-black leading-none" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}>
                                    Lanzamientos <span style={{ color: '#a78bfa' }}>Originales</span>
                                </h2>
                            </div>
                            {isLoading ? (
                                <div className="flex items-center gap-3 py-8 text-gray-600">
                                    <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm">Sincronizando con el servidor...</span>
                                </div>
                            ) : (
                                <Canciones songs={adminSongs} />
                            )}
                        </section>
                    )}

                    {/* Tendencias globales */}
                    <section className="fade-up" style={{ animationDelay: '200ms' }}>
                        <div className="mb-6">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-black mb-1">En el mundo</p>
                            <h2 className="font-black leading-none" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}>
                                Tendencias <span style={{ color: '#f472b6' }}>Globales</span>
                            </h2>
                        </div>
                        {isLoading ? (
                            <div className="flex items-center gap-3 py-8 text-gray-600">
                                <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm">Cargando canciones...</span>
                            </div>
                        ) : (
                            <Canciones songs={songs} />
                        )}
                    </section>

                    {/* Catálogo */}
                    <section className="fade-up" style={{ animationDelay: '300ms' }}>
                        <CatalogoPorSecciones />
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Home;
