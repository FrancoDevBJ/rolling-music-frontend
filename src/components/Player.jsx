import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { PlayIcon, PauseIcon, VolumeIcon } from "../icons/icon.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";
import { useSongs } from "../context/SongsContext";

export default function Player() {
  const { currentSong } = useSongs();
  
  // 🛠️ VALIDACIÓN INICIAL: Si no hay canción, no renderizamos nada.
  // Esto evita que se vea "Sin título" y la imagen rota al cargar la app.
  if (!currentSong) return null;

  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);

  const API_URL_FILES = import.meta.env.VITE_API_URL_FILES || 'http://localhost:3000';
  const prevAudioUrlRef = useRef(null);

  const getAudioUrl = () => {
    if (!currentSong) return null;
    const url = currentSong.preview || currentSong.url_cancion || currentSong.audioPath;
    if (!url) return null;
    return url.startsWith('http') ? url : `${API_URL_FILES}/${url}`;
  };

  const getImageUrl = () => {
    if (!currentSong) return null;
    const img = currentSong.cover || currentSong.album?.cover_medium || currentSong.url_imagen || currentSong.imagenUrl || currentSong.imagePath;
    if (!img) return "https://i.ibb.co/ZRn36S2x/Cover-Default-Playlist.jpg";
    return img.startsWith('http') ? img : `${API_URL_FILES}/uploads/covers/${img}`;
  };

  const audioUrl = getAudioUrl();
  const displayTitle = currentSong?.title || currentSong?.titulo || "Sin título";
  const displayArtist = currentSong?.artist?.name || currentSong?.artista || "Artista desconocido";
  const displayImage = getImageUrl();

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "rgba(255, 255, 255, 0.3)",
      progressColor: "#F527EE",
      cursorColor: "#F527EE",
      height: 24,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      responsive: true,
      normalize: true,
      backend: 'MediaElement',
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("finish", () => setIsPlaying(false));

    waveSurferRef.current = ws;

    return () => ws.destroy();
  }, []);

  useEffect(() => {
    if (!audioUrl || !waveSurferRef.current) return;

    const isNewSong = audioUrl !== prevAudioUrlRef.current;
    prevAudioUrlRef.current = audioUrl;

    const ws = waveSurferRef.current;
    const audioEntity = ws.getMediaElement();
    if (audioEntity) {
        audioEntity.crossOrigin = "anonymous";
    }

    ws.load(audioUrl);

    ws.once("ready", () => {
        ws.setVolume(volume);
        if (isNewSong) {
            ws.play().catch(err => console.error("Error al reproducir:", err));
            setIsPlaying(true);
        }
    });
  }, [audioUrl]);

  const togglePlay = () => waveSurferRef.current?.playPause();

  const handleVolume = (e) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    waveSurferRef.current?.setVolume(newVol);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1 sm:gap-2 p-2 bg-gradient-to-l from-purple-950/60 to-black/90 text-white backdrop-blur-md">
      
      <div className="w-full hidden sm:flex justify-center mt-1">
        <div ref={containerRef} className="w-[85%] max-w-3xl h-6 overflow-hidden cursor-pointer" />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-7xl px-2 sm:px-10 gap-3 sm:gap-0">
        
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 w-full sm:w-auto justify-center sm:justify-start">
          <div className="relative group shrink-0">
            <img
              src={displayImage}
              alt={displayTitle}
              className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg border-2 border-fuchsia-700 shadow-lg shadow-purple-500/20 transition-all ${isPlaying ? 'animate-pulse' : ''}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://i.ibb.co/ZRn36S2x/Cover-Default-Playlist.jpg";
              }}
            />
          </div>
          <div className="overflow-hidden text-center sm:text-left">
            <p className="text-white font-bold truncate text-xs sm:text-sm">{displayTitle}</p>
            <p className="text-gray-400 text-[9px] sm:text-[10px] uppercase tracking-widest truncate">{displayArtist}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 flex-1 justify-center order-first sm:order-none">
          <button
            onClick={() => {
              const ws = waveSurferRef.current;
              if (ws) ws.setTime(Math.max(0, ws.getCurrentTime() - 5));
            }}
            className="text-purple-300 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faBackward} className="text-base sm:text-lg" />
          </button>

          <button
            onClick={togglePlay}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 rounded-full shadow-[0_0_20px_rgba(192,38,211,0.4)] hover:scale-110 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <PauseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            ) : (
              <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1" />
            )}
          </button>

          <button className="text-purple-300 hover:text-white transition-colors">
            <FontAwesomeIcon icon={faForward} className="text-base sm:text-lg" />
          </button>
        </div>

        <div className="hidden sm:flex items-center justify-end gap-3 flex-1">
          <div className="relative flex items-center">
            <button
              onClick={() => setShowVolume(!showVolume)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <VolumeIcon className="w-5 h-5" />
            </button>
            <div className="block">
              <input
                type="range"
                min={0} max={1} step={0.01}
                value={volume}
                onChange={handleVolume}
                className="w-20 lg:w-24 h-1 rounded-full accent-fuchsia-500 cursor-pointer bg-neutral-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}