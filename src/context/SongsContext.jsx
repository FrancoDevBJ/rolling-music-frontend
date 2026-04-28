import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import musicApi from '../services/musicApi';
import { getTopTracks, searchSongs as searchDeezer } from '../services/deezerService';
import Swal from 'sweetalert2';

const SongsContext = createContext();
export const useSongs = () => useContext(SongsContext);

export const SongsProvider = ({ children }) => {
    const API_URL_FILES = import.meta.env.VITE_API_URL_FILES || 'http://localhost:3000';
    const [songs, setSongs] = useState([]);
    const [adminSongs, setAdminSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState([]);
    const { token } = useAuth();

    // ── Cola de reproducción ──────────────────────────────────────────────
    const [queue, setQueue] = useState([]);           // lista activa
    const [queueIndex, setQueueIndex] = useState(0);  // índice actual
    const [shuffleOn, setShuffleOn] = useState(false);
    const [repeatMode, setRepeatMode] = useState('none'); // 'none' | 'one' | 'all'
    const [shuffledQueue, setShuffledQueue] = useState([]);

    // Genera una cola shuffleada manteniendo la canción actual primero
    const buildShuffledQueue = useCallback((list, currentIdx) => {
        const rest = list.filter((_, i) => i !== currentIdx);
        const shuffled = [...rest].sort(() => Math.random() - 0.5);
        return [list[currentIdx], ...shuffled];
    }, []);

    // Cola efectiva según shuffle
    const activeQueue = shuffleOn ? shuffledQueue : queue;

    // ── Mapeo canciones locales ───────────────────────────────────────────
    const mapLocalSong = (s) => ({
        ...s,
        id: s._id,
        title: s.title,
        artist: { name: s.artist },
        preview: s.audio,
        album: { cover_medium: s.cover },
        codigo_unico: `local-${s._id}`
    });

    // ── Carga de datos ────────────────────────────────────────────────────
    const loadAdminSongs = async () => {
        try {
            const response = await musicApi.get('/song');
            const mapped = response.data.data.map(mapLocalSong);
            setAdminSongs(mapped);
        } catch (err) {
            console.error("Error al cargar canciones locales:", err);
        }
    };

    const loadPlaylists = async () => {
        try {
            const response = await musicApi.get('/playlists');
            const playlistData = response.data.data || [];
            const mapped = playlistData.map(pl => ({
                ...pl,
                img: pl.img?.startsWith('http')
                    ? pl.img
                    : `${API_URL_FILES}/uploads/playlists/${pl.img || 'default-playlist.png'}`
            }));
            setPlaylists(mapped);
        } catch (err) {
            console.error("Error al cargar playlists:", err);
            if (err.response?.status === 401) {
                setError("Sesión expirada. Por favor, inicia sesión de nuevo.");
            }
        }
    };

    const loadInitialSongs = async () => {
        setIsLoading(true);
        try {
            const results = await getTopTracks();
            setSongs(mapApiSongs(results));
        } catch (err) {
            setError("Error al cargar el catálogo de Deezer.");
        } finally {
            setIsLoading(false);
        }
    };

    const mapApiSongs = (apiResults) => {
        return apiResults.map(song => ({
            ...song,
            codigo_unico: song.codigo_unico || `deezer-${song.id}`
        }));
    };

    const loadFavorites = async () => {
        try {
            const response = await musicApi.get('/favorites');
            setFavorites(response.data.data);
        } catch (err) {
            console.error("Error al cargar favoritos:", err);
        }
    };

    const toggleFavorite = async (song) => {
        try {
            const songId = song.codigo_unico;
            const response = await musicApi.patch(`/favorites/${songId}`);
            if (response.data.ok) {
                setFavorites(prev =>
                    prev.includes(songId)
                        ? prev.filter(id => id !== songId)
                        : [...prev, songId]
                );
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'success',
                    background: '#1a1a1a', color: '#fff',
                    title: response.data.message,
                    showConfirmButton: false, timer: 2000
                });
            }
        } catch (err) {
            Swal.fire('Error', 'Debes estar logueado para guardar favoritos', 'error');
        }
    };

    useEffect(() => {
        loadAdminSongs();
        loadInitialSongs();
        loadPlaylists();
    }, []);

    useEffect(() => {
        if (token) {
            loadFavorites();
            loadPlaylists();
        }
    }, [token]);

    // ── Controles de cola ─────────────────────────────────────────────────

    /**
     * Selecciona una canción y arma la cola con el array completo de su contexto.
     * @param {object} song - canción clickeada
     * @param {array}  songList - todas las canciones del contexto actual (sección, playlist, favoritos, etc.)
     */
    const selectSong = useCallback((song, songList = []) => {
        const list = songList.length > 0 ? songList : [song];
        const idx = list.findIndex(s => s.codigo_unico === song.codigo_unico);
        const safeIdx = idx >= 0 ? idx : 0;

        setQueue(list);
        setQueueIndex(safeIdx);
        setCurrentSong(song);

        if (shuffleOn) {
            setShuffledQueue(buildShuffledQueue(list, safeIdx));
        }
    }, [shuffleOn, buildShuffledQueue]);

    const playNext = useCallback(() => {
        const list = activeQueue;
        if (!list.length) return;

        if (repeatMode === 'one') {
            // Reinicia la misma canción — el player lo detecta vía currentSong
            setCurrentSong({ ...list[queueIndex] });
            return;
        }

        const nextIdx = queueIndex + 1;

        if (nextIdx >= list.length) {
            if (repeatMode === 'all') {
                setQueueIndex(0);
                setCurrentSong(list[0]);
            }
            // si 'none', no hace nada al llegar al final
            return;
        }

        setQueueIndex(nextIdx);
        setCurrentSong(list[nextIdx]);
    }, [activeQueue, queueIndex, repeatMode]);

    const playPrev = useCallback(() => {
        const list = activeQueue;
        if (!list.length) return;

        const prevIdx = queueIndex - 1;
        if (prevIdx < 0) {
            // Vuelve al principio de la cola
            setQueueIndex(0);
            setCurrentSong(list[0]);
            return;
        }

        setQueueIndex(prevIdx);
        setCurrentSong(list[prevIdx]);
    }, [activeQueue, queueIndex]);

    const toggleShuffle = useCallback(() => {
        setShuffleOn(prev => {
            const next = !prev;
            if (next && queue.length) {
                setShuffledQueue(buildShuffledQueue(queue, queueIndex));
            }
            return next;
        });
    }, [queue, queueIndex, buildShuffledQueue]);

    const toggleRepeat = useCallback(() => {
        setRepeatMode(prev => {
            if (prev === 'none') return 'all';
            if (prev === 'all') return 'one';
            return 'none';
        });
    }, []);

    // ── Búsqueda ──────────────────────────────────────────────────────────
    const handleSearch = async (query, isGenre = false) => {
        if (!query.trim()) {
            clearSearch();
            return;
        }
        setSearchTerm(query.trim());
        setIsLoading(true);
        setError(null);

        try {
            const deezerQuery = isGenre ? `genre:"${query.trim()}"` : query.trim();
            const deezerResults = await searchDeezer(deezerQuery);
            setSongs(mapApiSongs(deezerResults));

            const queryParam = isGenre ? `genre=${query.trim()}` : `term=${query.trim()}`;
            const myApiResults = await musicApi.get(`/song/search?${queryParam}`);
            if (myApiResults.data?.data) {
                setAdminSongs(myApiResults.data.data.map(mapLocalSong));
            }
        } catch (err) {
            console.error("Error en la búsqueda:", err);
            setAdminSongs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        loadInitialSongs();
        loadAdminSongs();
    };

    const value = {
        // Datos
        songs,
        adminSongs,
        playlists,
        setPlaylists,
        loadPlaylists,
        isLoading,
        error,
        searchTerm,

        // Reproducción
        currentSong,
        setCurrentSong,
        selectSong,

        // Cola
        queue,
        queueIndex,
        activeQueue,
        playNext,
        playPrev,

        // Shuffle & repeat
        shuffleOn,
        toggleShuffle,
        repeatMode,
        toggleRepeat,

        // Otros
        syncSongs: loadAdminSongs,
        handleSearch,
        clearSearch,
        favorites,
        toggleFavorite,
    };

    return <SongsContext.Provider value={value}>{children}</SongsContext.Provider>;
};
