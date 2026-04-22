import React, { useState } from 'react';

import { useSongs } from "../context/SongsContext";
import { useNavigate } from "react-router-dom";
import AddToPlaylistModal from "./AddToPlaylistModal";

// 🛠️ Recibimos onRemoveSong e isPlaylistView como props
const Canciones = ({ songs, onRemoveSong, isPlaylistView = false }) => {
  const { selectSong, toggleFavorite, favorites } = useSongs();
  const navigate = useNavigate();

  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);

  const [mobileMenuSong, setMobileMenuSong] = useState(null);

  const API_URL_FILES = import.meta.env.VITE_API_URL_FILES || 'http://localhost:3000';

  if (!songs || songs.length === 0) return null;

  return (
    <div className="mb-10 sm:mb-12 px-2 sm:px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
                      gap-3 sm:gap-4 md:gap-6 w-full py-4">
        {songs.map((item, index) => {

          // 🛠️ LÓGICA DE IMAGEN
          let imageUrl = item.cover || item.imagePath || item.cover_medium || item.imagenUrl || item.album?.cover_medium;

          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `${API_URL_FILES}/rollingMusic/covers/${imageUrl}`;
          } else if (!imageUrl) {
            imageUrl = "https://i.ibb.co/ZRn36S2x/Cover-Default-Playlist.jpg";
          }

          // 🛠️ LÓGICA DE REPRODUCCIÓN
          if (item.audio && !item.audio.startsWith('http')) {
            item.preview = item.audio;
          }

          const title = item.title || item.titulo || item.name || "Título Desconocido";
          const artistName = item.artist?.name || item.artista || item.artist || "Artista Desconocido";

          const isPlayable = !!item.preview || !!item.url_cancion;
          const isFavorite = favorites?.includes(item.codigo_unico);

          const handleClick = () => {
            if (isPlayable) {
              selectSong(item);
            } else {
              navigate("/notFound");
            }
          };

          return (
            <div
              key={item.codigo_unico || item.id || index}
              onClick={handleClick}
              className={`group relative rounded-xl p-3 text-center text-white transition-all duration-300
                          ${isPlayable
                  ? "bg-neutral-900/40 hover:bg-neutral-800 cursor-pointer hover:-translate-y-1 shadow-lg"
                  : "bg-neutral-800 opacity-60 cursor-not-allowed"}`}
            >

              {/* BOTÓN DE FAVORITOS */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item);
                }}
                className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-black/40 backdrop-blur-md 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300 fill-none hover:text-white'}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* 🛠️ BOTÓN CONDICIONAL: QUITAR DE PLAYLIST O AGREGAR A PLAYLIST */}
              {isPlaylistView ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSong(item.codigo_unico);
                  }}
                  className="absolute top-4 left-4 z-20 p-1.5 rounded-full bg-red-600/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 text-white hover:bg-red-600"
                  title="Quitar de la lista"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSongForPlaylist(item);
                  }}
                  className="absolute top-4 left-4 z-20 p-1.5 rounded-full bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 text-white hover:bg-violet-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}


              {/* OPCIONES PARA MOBILE */}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuSong(item);
                }}
                className="absolute top-3 right-3 md:hidden z-30 p-2 rounded-full bg-black/50"
              >
                ⋮
              </button>
              
              {mobileMenuSong && (
                <div className="fixed inset-0 z-50 md:hidden">

                  {/* fondo oscuro */}
                  <div
                    className="absolute inset-0 bg-black/60"
                    onClick={() => setMobileMenuSong(null)}
                  />

                  {/* panel */}
                  <div className="absolute bottom-0 left-0 right-0 bg-neutral-900 rounded-t-2xl p-6 animate-slideUp">

                    {/* info canción */}
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={mobileMenuSong.cover_medium || mobileMenuSong.cover}
                        className="w-16 h-16 rounded-lg"
                      />

                      <div>
                        <p className="font-bold">{mobileMenuSong.title}</p>
                        <p className="text-sm text-gray-400">
                          {mobileMenuSong.artist?.name}
                        </p>
                      </div>
                    </div>

                    {/* acciones */}

                    <button
                      onClick={() => {
                        toggleFavorite(mobileMenuSong);
                        setMobileMenuSong(null);
                      }}
                      className="w-full text-left py-3 border-b border-neutral-800"
                    >
                      ❤️ Agregar a favoritos
                    </button>

                    <button
                      onClick={() => {
                        setSelectedSongForPlaylist(mobileMenuSong);
                        setMobileMenuSong(null);
                      }}
                      className="w-full text-left py-3 border-b border-neutral-800"
                    >
                      ➕ Agregar a playlist
                    </button>

                    {isPlaylistView && (
                      <button
                        onClick={() => {
                          onRemoveSong(mobileMenuSong.codigo_unico);
                          setMobileMenuSong(null);
                        }}
                        className="w-full text-left py-3 text-red-500"
                      >
                        ❌ Quitar de lista
                      </button>
                    )}

                  </div>
                </div>
              )}





              <div className="relative overflow-hidden rounded-lg mb-3 aspect-square shadow-black/50 shadow-md">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://i.ibb.co/ZRn36S2x/Cover-Default-Playlist.jpg";
                  }}
                />
                {isPlayable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-violet-600 p-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-white" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <h4 className="text-sm sm:text-base font-bold truncate text-gray-100 group-hover:text-violet-400 transition-colors">
                {title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
                {artistName}
              </p>
            </div>
          );
        })}
      </div>

      {selectedSongForPlaylist && (
        <AddToPlaylistModal
          song={selectedSongForPlaylist}
          onClose={() => setSelectedSongForPlaylist(null)}
        />
      )}
    </div>
  );
};

export default Canciones;