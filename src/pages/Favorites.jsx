import React from 'react';
import { useSongs } from '../context/SongsContext';
import Canciones from '../components/Canciones';

const Favorites = () => {
    const { songs, adminSongs, favorites } = useSongs();

    // Juntamos todas las fuentes y filtramos las que están en el array de favoritos
    const allSongs = [...adminSongs, ...songs];
    const favoriteSongs = allSongs.filter(s => favorites.includes(s.codigo_unico));

    return (
        <div className="p-8">
            <h1 className="text-4xl font-black text-white mb-8 border-b border-violet-700 pb-4">
                Mis Favoritos ❤️
            </h1>
            {favoriteSongs.length > 0 ? (
                <Canciones songs={favoriteSongs} />
            ) : (
                <p className="text-gray-500 italic">Aún no tienes canciones favoritas.</p>
            )}
        </div>
    );
};