import { useSongs } from '../context/SongsContext';
import "../assets/styles/SongCards.css";

function SongCard({ song }) {
    const { selectSong } = useSongs();

    const titulo      = song.titulo || song.title;
    const artista     = song.artista || song.artist?.name;
    const url_imagen  = song.imagenUrl || song.album?.cover_medium || song.imagen;
    const codigo_unico = song.codigo_unico || song.id;

    const handlePlay = () => selectSong(song);

    if (!titulo) return null;

    return (
        <div
            id={`song-${codigo_unico}`}
            onClick={handlePlay}
            className="song-card bg-neutral-900/60 hover:bg-neutral-800 rounded-xl p-2 sm:p-3
                       text-center text-white transition-all duration-300 cursor-pointer
                       flex flex-col h-full w-full"
        >
            {/* Imagen cuadrada con aspect-ratio */}
            <div className="relative aspect-square w-full mb-2 sm:mb-3 overflow-hidden rounded-lg">
                {url_imagen ? (
                    <img
                        src={url_imagen}
                        alt={`Portada de ${titulo}`}
                        className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150"; }}
                    />
                ) : (
                    <div className="bg-gray-700 w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs">Sin imagen</span>
                    </div>
                )}
            </div>

            <div className="mt-auto">
                <h4 className="text-xs sm:text-base font-bold truncate leading-tight" title={titulo}>
                    {titulo}
                </h4>
                <p className="text-xs text-gray-400 truncate mt-0.5">{artista}</p>
            </div>
        </div>
    );
}

export default SongCard;