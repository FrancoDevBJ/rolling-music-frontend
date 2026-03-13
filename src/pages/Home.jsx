import React from 'react';
import { useSongs } from '../context/SongsContext'; 
import Canciones from '../components/Canciones.jsx'; 
import CatalogoPorSecciones from '../components/CatalogoPorSecciones.jsx'; 
import Footer from '../components/Footer.jsx';

const Home = () => {

    const { 
        songs,
        adminSongs,
        isLoading,
        error
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
        <div className="bg-gradient-to-b from-neutral-900 to-black min-h-full">

            <div className="p-4 md:p-8 space-y-12">

                {/* PRODUCCIONES ORIGINALES */}
                <section>
                    <div className="flex items-center justify-between mb-6 border-b border-violet-700/30 pb-2">
                        <h2 className="text-3xl font-black text-violet-400">
                            Lanzamientos Originales
                        </h2>
                    </div>

                    {isLoading ? (
                        <p className="text-center py-10 text-gray-500">
                            Sincronizando con el servidor...
                        </p>
                    ) : adminSongs.length > 0 ? (
                        <Canciones songs={adminSongs} />
                    ) : (
                        <p className="text-gray-500 italic">
                            No hay producciones originales aún.
                        </p>
                    )}
                </section>

                {/* CATÁLOGO GENERAL */}
                <section>
                    <div className="flex items-center justify-between mb-6 border-b border-neutral-800 pb-2">
                        <h2 className="text-3xl font-black text-gray-200">
                            Tendencias Globales
                        </h2>
                    </div>

                    {isLoading ? (
                        <p className="text-center py-10 text-gray-500">
                            Cargando canciones...
                        </p>
                    ) : (
                        <Canciones songs={songs} />
                    )}
                </section>

                {/* CATEGORÍAS */}
                <CatalogoPorSecciones />

            </div>

            <Footer/>

        </div>
    );
};

export default Home;