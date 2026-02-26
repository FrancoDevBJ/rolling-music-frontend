const DEEZER_API_BASE = 'https://api.deezer.com/api';

// La función normalizeSong debe devolver un objeto que se parezca lo más posible
// al formato original de Deezer, para que el componente Canciones.jsx no se rompa.
const normalizeSong = (deezerTrack) => ({
    // Campos básicos de la canción
    id: deezerTrack.id, 
    title: deezerTrack.title || deezerTrack.name, 
    preview: deezerTrack.preview, // URL del audio mp3

    // ESTRUCTURA DE ARTISTA CORREGIDA Y SIMPLIFICADA
    artist: {
        id: deezerTrack.artist?.id,
        name: deezerTrack.artist?.name || 'Artista Desconocido', 
    },
    
    // Estructura de Álbum (necesaria para la imagen)
    album: {
        id: deezerTrack.album?.id,
        title: deezerTrack.album?.title,
        cover_medium: deezerTrack.album?.cover_medium, 
    },
    
    // Propiedades adicionales
    duration: deezerTrack.duration
});

/**
 * Función genérica para hacer llamadas GET a la API de Deezer.
 * @param {string} endpoint El endpoint específico de Deezer (e.g., '/chart/0/tracks').
 * @returns {Promise<Array>} Un array de objetos de canciones normalizadas.
 */
const fetchTracks = async (endpoint) => {
    const fullEndpoint = `${DEEZER_API_BASE}${endpoint}`;
    console.log(`Cargando desde: ${fullEndpoint}`);

    try {
        const response = await fetch(fullEndpoint);
        
        if (!response.ok) {
            throw new Error(`Deezer API respondió con estado: ${response.status}`);
        }

        const data = await response.json();
        
        // Asumiendo que data.data contiene el array de tracks en la mayoría de los endpoints de Deezer
        return data.data.map(normalizeSong); 

    } catch (error) {
        console.error("😐 Fallo en la llamada a la API de Deezer:", error);
        return []; 
    }
};

/**
 * Realiza una búsqueda de canciones en Deezer.
 * @param {string} query El término de búsqueda.
 * @returns {Promise<Array>} Un array de objetos de canciones normalizadas.
 */
export const searchSongs = async (query) => {
    if (!query) return [];
    
    const endpoint = `/search?q=${encodeURIComponent(query)}`;
    return fetchTracks(endpoint);
};

/**
 * Carga los Top Tracks de Deezer (Catálogo inicial).
 * @returns {Promise<Array>} Un array de objetos de canciones normalizadas.
 */
export const getTopTracks = async () => {
    // Endpoint para Top Tracks
    const endpoint = `/chart/0/tracks?limit=10`; // Limitado para la carga inicial
    return fetchTracks(endpoint);
};


// --- NUEVAS FUNCIONES PARA SECCIONES ESPECÍFICAS ---

/**
 * Carga las canciones más populares del momento (simulando "Lo más escuchado").
 * @returns {Promise<Array>} Un array de objetos de canciones normalizadas.
 */
export const getMostListened = async () => {
    // Usamos el mismo endpoint de chart con un límite diferente o distinto filtro si existiera
    const endpoint = `/chart/0/tracks?limit=15`; 
    return fetchTracks(endpoint);
};

/**
 * Carga un listado de nuevos lanzamientos (simulado con un endpoint de playlist popular).
 * @returns {Promise<Array>} Un array de objetos de canciones normalizadas.
 */
export const getNewReleases = async () => {
    // Ejemplo de un playlist de "Descubrimiento" o "Novedades" (usamos chart/0/tracks/albums/releases como ejemplo)
    const endpoint = `/chart/0/albums`; // Esto devuelve álbumes, tendrías que procesar las canciones.
    // Usaremos un artista o un género popular para simular "Nuevos Lanzamientos" de forma simple
    const simulatedEndpoint = `/search?q=pop%20new%20releases&limit=10`;
    return fetchTracks(simulatedEndpoint);
};

/**
 * Carga las canciones top a nivel global.
 * @returns {Promise<Array>} Un array de objetos de canciones normalizadas.
 */
export const getGlobalTop = async () => {
    // Usamos el mismo endpoint de chart, asumiendo que es global por defecto
    const endpoint = `/chart/0/tracks?limit=20`; 
    return fetchTracks(endpoint);
};
