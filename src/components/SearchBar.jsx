import React, { useState, useEffect } from "react";
import { useSongs } from "../context/SongsContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  const [inputValue, setInputValue] = useState("");
  const { handleSearch, clearSearch, searchTerm } = useSongs();
  const navigate = useNavigate();

  // Sincroniza el input local si el término de búsqueda cambia desde otro lugar
  useEffect(() => {
    // 🛠️ Evitamos que el input se vuelva 'undefined' si searchTerm es nulo
    setInputValue(searchTerm || "");
  }, [searchTerm]);

  const processSearch = async (e) => {
    e.preventDefault();
    const query = inputValue.trim();
    
    if (query) {
      handleSearch(query); // No enviamos el segundo parámetro, por defecto es isGenre = false
      navigate("/search");
      
      try {
        // 🛠️ Ejecutamos la búsqueda (que debe estar en tu SongsContext.jsx)
        await handleSearch(query); 
      } catch (error) {
        console.error("Error al procesar la búsqueda:", error);
      }
    }
  };

  const handleClearAction = () => {
    setInputValue("");
    clearSearch();
    navigate("/"); 
  };

  return (
    <form
      onSubmit={processSearch}
      className="flex items-center gap-2 w-full max-w-xs sm:max-w-md lg:max-w-xl group"
      role="search"
    >
      <div className="relative flex items-center w-full">
        {/* Icono de lupa decorativo */}
        <FontAwesomeIcon 
          icon={faSearch} 
          className="absolute left-3 text-gray-500 group-focus-within:text-purple-400 transition-colors"
        />
        
        <input
          type="text"
          placeholder="¿Qué quieres escuchar?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="rounded-full bg-black/40 border border-purple-500/20 w-full h-10 pl-10 pr-10
                     hover:bg-purple-900/20 focus:outline-none focus:ring-2 focus:ring-purple-600/50
                     text-white placeholder-gray-500 text-sm transition-all backdrop-blur-sm"
        />

        {/* Botón de Limpiar (X) */}
        {inputValue && (
          <button
            type="button"
            onClick={handleClearAction}
            className="absolute right-3 text-gray-400 hover:text-white transition-colors p-1"
            title="Limpiar búsqueda"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      {/* Botón Buscar - Desktop */}
      <button
        type="submit"
        className="hidden md:block shrink-0 bg-gradient-to-r from-purple-700 to-fuchsia-700 
                   hover:from-purple-600 hover:to-fuchsia-600 px-6 h-10 rounded-full 
                   text-white font-bold text-xs uppercase tracking-widest shadow-lg 
                   shadow-purple-900/20 transition-all active:scale-95"
      >
        Buscar
      </button>

      {/* Botón Buscar - Mobile */}
      <button
        type="submit"
        className="md:hidden shrink-0 w-10 h-10 flex items-center justify-center 
                   bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-full 
                   shadow-lg shadow-purple-900/40 active:scale-90"
      >
        <FontAwesomeIcon icon={faMusic} className="text-white text-sm" />
      </button>
    </form>
  );
};

export default SearchBar;