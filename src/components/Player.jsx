import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from 'react-dom';
import WaveSurfer from "wavesurfer.js";
import { useSongs } from "../context/SongsContext";

// ─── Iconos inline ────────────────────────────────────────────────────────

const IconPlay = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M8 5v14l11-7z"/>
    </svg>
);

const IconPause = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
);

const IconPrev = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
    </svg>
);

const IconNext = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M6 18l8.5-6L6 6v12zm2-8.14 5.5 3.89L8 17.14V9.86zM16 6h2v12h-2z"/>
    </svg>
);

const IconShuffle = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
    </svg>
);

const IconRepeat = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
    </svg>
);

const IconRepeatOne = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/>
    </svg>
);

const IconVolume = ({ muted }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        {muted
            ? <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
            : <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        }
    </svg>
);

// ─── Componente principal ─────────────────────────────────────────────────

export default function Player() {
    const {
        currentSong,
        playNext,
        playPrev,
        shuffleOn,
        toggleShuffle,
        repeatMode,
        toggleRepeat,
        queue,
        queueIndex,
    } = useSongs();

    const containerRef = useRef(null);
    const waveSurferRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [showVolumeBar, setShowVolumeBar] = useState(false);
    

    const API_URL_FILES = import.meta.env.VITE_API_URL_FILES || 'http://localhost:3000';

    const getAudioUrl = () => {
        if (!currentSong) return null;
        const url = currentSong.audio || currentSong.preview || currentSong.url_cancion;
        if (!url) return null;
        return url.startsWith('http') ? url : `${API_URL_FILES}/${url}`;
    };

    const getImageUrl = () => {
        if (!currentSong) return "https://i.ibb.co/ZRn36S2x/Cover-Default-Playlist.jpg";
        const img = currentSong.cover || currentSong.album?.cover_medium || currentSong.url_imagen;
        if (!img) return "https://i.ibb.co/ZRn36S2x/Cover-Default-Playlist.jpg";
        return img.startsWith('http') ? img : `${API_URL_FILES}/${img}`;
    };

    const formatTime = (secs) => {
        if (!secs || isNaN(secs)) return '0:00';
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // ── Init WaveSurfer ───────────────────────────────────────────────────
    useEffect(() => {
        if (!containerRef.current) return;

        const ws = WaveSurfer.create({
            container: containerRef.current,
            waveColor: 'rgba(255,255,255,0.15)',
            progressColor: '#a855f7',
            cursorColor: 'transparent',
            height: 28,
            barWidth: 2,
            barGap: 2,
            barRadius: 10,
            responsive: true,
            normalize: true,
            backend: 'MediaElement',
        });

        ws.on('play',   () => setIsPlaying(true));
        ws.on('pause',  () => setIsPlaying(false));
        ws.on('ready',  () => {
            setIsReady(true);
            setDuration(ws.getDuration());
        });
        ws.on('audioprocess', () => setCurrentTime(ws.getCurrentTime()));
        ws.on('finish', () => {
            setIsPlaying(false);
            playNext();
        });

        waveSurferRef.current = ws;
        return () => ws.destroy();
    }, []);

    // ── Cargar nueva canción ──────────────────────────────────────────────
    useEffect(() => {
        const audioUrl = getAudioUrl();
        if (!audioUrl || !waveSurferRef.current) return;

        const ws = waveSurferRef.current;
        setIsReady(false);
        setCurrentTime(0);
        setDuration(0);

        ws.load(audioUrl);
        ws.once('ready', () => {
            ws.setVolume(muted ? 0 : volume);
            ws.play().catch(err => console.error(err));
        });
    }, [currentSong]);

    // ── Controles ─────────────────────────────────────────────────────────
    const togglePlay = () => waveSurferRef.current?.playPause();

    const handleVolume = (e) => {
        const v = Number(e.target.value);
        setVolume(v);
        setMuted(v === 0);
        waveSurferRef.current?.setVolume(v);
    };

    const toggleMute = () => {
    if (window.innerWidth < 640) {
        // En mobile abre/cierra el slider vertical
        setShowVolumeBar(prev => !prev);
        return;
    }
    const newMuted = !muted;
    setMuted(newMuted);
    waveSurferRef.current?.setVolume(newMuted ? 0 : volume);
};

    const displayTitle  = currentSong?.title || 'Seleccioná una canción';
    const displayArtist = currentSong?.artist?.name || '—';
    const displayImage  = getImageUrl();
    const hasQueue      = queue.length > 1;

    // Colores de estado
    const activeColor   = '#a855f7';
    const inactiveColor = 'rgba(255,255,255,0.35)';

    return (
        <div
            className="w-full h-full flex items-center px-4 sm:px-8 gap-4"
            style={{
                background: 'linear-gradient(90deg, #0d0118 0%, #0a0a0a 50%, #0d0118 100%)',
                borderTop: '1px solid rgba(168,85,247,0.15)'
            }}
        >
                    {showVolumeBar && createPortal(
    <div
        className="sm:hidden fixed z-[999]"
        style={{ bottom: '50px', right: '50px' }}
    >
        <div
            className="flex flex-col items-center py-3 px-2 rounded-2xl gap-2"
            style={{ background: '#1a0030', border: '1px solid rgba(168,85,247,0.3)' }}
        >
            <span className="text-[9px] font-bold" style={{ color: activeColor }}>
                {Math.round((muted ? 0 : volume) * 100)}%
            </span>
            <input
                type="range"
                min={0} max={1} step={0.01}
                value={muted ? 0 : volume}
                onChange={handleVolume}
                className="h-24 cursor-pointer"
                style={{
                    accentColor: activeColor,
                    writingMode: 'vertical-lr',
                    direction: 'rtl',
                }}
            />
        </div>
    </div>,
    document.body
)}
            {/* ── Info canción ── */}
            <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-none sm:w-56">
                <div className="relative flex-shrink-0">
                    <img
                        src={displayImage}
                        alt={displayTitle}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shadow-lg"
                        style={{
                            boxShadow: isPlaying ? '0 0 16px rgba(168,85,247,0.5)' : 'none',
                            transition: 'box-shadow 0.3s ease'
                        }}
                        onError={(e) => { e.target.src = "https://i.ibb.co/ZRn36S2x/Cover-Default-Playlist.jpg"; }}
                    />
                    {isPlaying && (
                        <div
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ background: '#a855f7' }}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="text-white font-bold text-xs sm:text-sm truncate leading-tight">{displayTitle}</p>
                    <p className="text-[10px] sm:text-xs truncate leading-tight" style={{ color: inactiveColor }}>
                        {displayArtist}
                    </p>
                </div>
            </div>

            {/* ── Centro: waveform + controles ── */}
            <div className="flex flex-col items-center flex-1 min-w-0 gap-2 py-2">

                {/* Waveform + tiempo */}
                <div className="hidden sm:flex items-center gap-2 w-full max-w-2xl">
                    <span className="text-[10px] tabular-nums flex-shrink-0" style={{ color: inactiveColor }}>
                        {formatTime(currentTime)}
                    </span>
                    <div ref={containerRef} className="flex-1 cursor-pointer" style={{ minHeight: 28, maxHeight: 28 }} />
                    <span className="text-[10px] tabular-nums flex-shrink-0" style={{ color: inactiveColor }}>
                        {formatTime(duration)}
                    </span>
                </div>

                {/* Controles de reproducción */}
                <div className="flex items-center gap-3 sm:gap-5">

                    {/* Shuffle */}
                    <button
                        onClick={toggleShuffle}
                        title="Aleatorio"
                        className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full transition-all"
                        style={{ color: shuffleOn ? activeColor : inactiveColor }}
                    >
                        <IconShuffle />
                        {shuffleOn && (
                            <span
                                className="absolute mt-5 w-1 h-1 rounded-full"
                                style={{ background: activeColor }}
                            />
                        )}
                    </button>

                    {/* Anterior */}
                    <button
                        onClick={playPrev}
                        disabled={!hasQueue}
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                        <IconPrev />
                    </button>

                    {/* Play / Pause */}
                    <button
                        onClick={togglePlay}
                        disabled={!currentSong}
                        className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-40 shadow-lg"
                        style={{
                            background: currentSong
                                ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                                : 'rgba(255,255,255,0.1)',
                            boxShadow: currentSong ? '0 4px 20px rgba(168,85,247,0.4)' : 'none'
                        }}
                    >
                        {isPlaying ? <IconPause /> : <IconPlay />}
                    </button>

                    {/* Siguiente */}
                    <button
                        onClick={playNext}
                        disabled={!hasQueue}
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                        <IconNext />
                    </button>

                    {/* Repeat */}
                    <button
                        onClick={toggleRepeat}
                        title={repeatMode === 'none' ? 'Sin repetir' : repeatMode === 'all' ? 'Repetir todo' : 'Repetir una'}
                        className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full transition-all relative"
                        style={{ color: repeatMode !== 'none' ? activeColor : inactiveColor }}
                    >
                        {repeatMode === 'one' ? <IconRepeatOne /> : <IconRepeat />}
                        {repeatMode !== 'none' && (
                            <span
                                className="absolute -bottom-1 w-1 h-1 rounded-full"
                                style={{ background: activeColor }}
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* ── Volumen ── */}
            <div className="flex items-center gap-2 flex-shrink-0 sm:w-38 relative">
                <button
                    onClick={toggleMute}
                    className="transition-colors flex-shrink-0"
                    style={{ color: inactiveColor }}
                >
                    <IconVolume muted={muted || volume === 0} />
                </button>

                {/* Horizontal en desktop */}
                <input
                    type="range"
                    min={0} max={1} step={0.01}
                    value={muted ? 0 : volume}
                    onChange={handleVolume}
                    className="hidden sm:block flex-1 h-1 rounded-full cursor-pointer"
                    style={{ accentColor: activeColor }}
                />

            {/* Vertical en mobile — aparece al tocar el ícono */}
            </div>

            {/* ── Cola info (mobile) ── */}
            {hasQueue && (
                <div
                    className="sm:hidden flex-shrink-0 text-[9px] font-bold px-2 py-1 rounded-full"
                    style={{ background: 'rgba(168,85,247,0.15)', color: activeColor }}
                >
                    {queueIndex + 1}/{queue.length}
                </div>
            )}
        </div>
    );
}
