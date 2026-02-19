import React, { useState, useEffect } from 'react';
import { useSongs } from "../context/SongsContext";
import { useNavigate } from 'react-router-dom';
// 🛠️ CORRECCIÓN: Las funciones de catálogo externo vienen de deezerService
import * as deezerService from '../services/deezerService';

const CatalogoPorSecciones = () => {
    const { selectSong } = useSongs();
    const navigate = useNavigate();
    
    // URL base para imágenes de tu backend (fallback)
    const API_URL_FILES = import.meta.env.VITE_API_URL_FILES || 'http://localhost:3000';

    const [secciones, setSecciones] = useState([
        { titulo: "Recomendadas",      data: [], loading: true, error: null, fetcher: deezerService.getTopTracks   },
        { titulo: "Lo más escuchado",   data: [], loading: true, error: null, fetcher: deezerService.getMostListened },
        { titulo: "Nuevos lanzamientos",data: [], loading: true, error: null, fetcher: deezerService.getNewReleases  },
        { titulo: "Top Global",         data: [], loading: true, error: null, fetcher: deezerService.getGlobalTop    },
    ]);

    useEffect(() => {
        const loadSections = async () => {
            const loadedPromises = secciones.map(async (sec) => {
                try {
                    const results = await sec.fetcher();
                    // Normalizamos los resultados para asegurar que tengan IDs únicos
                    const normalizedResults = results.map(song => ({
                        ...song,
                        codigo_unico: song.codigo_unico || `deezer-${song.id}`
                    }));
                    return { ...sec, data: normalizedResults, loading: false, error: null };
                } catch (error) {
                    console.error(`Error al cargar la sección ${sec.titulo}:`, error);
                    return { ...sec, loading: false, error: "No se pudo conectar con el servicio" };
                }
            });
            const newSections = await Promise.all(loadedPromises);
            setSecciones(newSections);
        };
        loadSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const Cards = ({ titulo, data, loading, error }) => {
        if (loading) return (
            <div className="mb-10 px-2 sm:px-4">
                <p className="text-violet-400 text-sm animate-pulse">Cargando {titulo}...</p>
            </div>
        );
        if (error) return (
            <div className="mb-10 px-2 sm:px-4">
                <p className="text-red-500 text-sm italic">Error al cargar {titulo}</p>
            </div>
        );
        if (data.length === 0) return null;

        return (
            <div className="mb-10 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6
                               border-l-4 border-violet-500 pl-3 mx-2 sm:mx-4">
                    {titulo}
                </h2>

                <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-3 px-2 sm:px-4
                                 [scrollbar-width:thin]
                                 [scrollbar-color:#7c3aed_transparent]
                                 [&::-webkit-scrollbar]:h-1.5
                                 [&::-webkit-scrollbar-track]:bg-transparent
                                 [&::-webkit-scrollbar-thumb]:bg-purple-700
                                 [&::-webkit-scrollbar-thumb]:rounded-full
                                 hover:[&::-webkit-scrollbar-thumb]:bg-violet-500">
                    {data.map((item, index) => {
                        // Lógica de compatibilidad de campos
                        const imageUrl = item.album?.cover_medium || item.url_imagen || item.imagenUrl;
                        const title = item.title || item.titulo || item.name;
                        const artistName = item.artist?.name || item.artista || 'Artista Desconocido';
                        const isPlayable = !!item.preview || !!item.url_cancion;

                        return (
                            <div
                                key={item.codigo_unico || index}
                                onClick={() => isPlayable ? selectSong(item) : navigate('/notFound')}
                                className={`shrink-0 w-36 sm:w-44 rounded-lg p-2 sm:p-3 text-center text-white
                                            transition-all duration-300 shadow-lg
                                            ${isPlayable
                                                ? 'bg-neutral-900/50 hover:bg-neutral-800 hover:scale-105 cursor-pointer'
                                                : 'bg-neutral-800 opacity-60 cursor-not-allowed'}`}
                            >
                                <div className="relative group">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl.startsWith('http') ? imageUrl : `${API_URL_FILES}/${imageUrl}`}
                                            alt={title}
                                            className="w-full aspect-square object-cover rounded-md mb-2 shadow-md border border-white/5"
                                        />
                                    ) : (
                                        <div className="bg-neutral-800 border-2 border-neutral-700 rounded-md w-full aspect-square mb-2 flex items-center justify-center">
                                            <span className="text-gray-500 text-xs">Sin imagen</span>
                                        </div>
                                    )}
                                    {isPlayable && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                            <div className="bg-violet-600 p-2 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <h4 className="text-sm sm:text-base font-semibold truncate text-gray-100">{title}</h4>
                                <p className="text-xs sm:text-sm text-gray-500 truncate">{artistName}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen py-4 sm:py-6">
            {secciones.map((seccion, index) => (
                <Cards
                    key={index}
                    titulo={seccion.titulo}
                    data={seccion.data}
                    loading={seccion.loading}
                    error={seccion.error}
                />
            ))}
        </div>
    );
};

export default CatalogoPorSecciones;