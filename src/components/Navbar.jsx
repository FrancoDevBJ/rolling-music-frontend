import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import Logo from '../assets/imagenes/logos/Logo.png';
import Aside from '../components/Aside';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import EditProfileModal from './EditProfileModal'; // 🛠️ Importamos el Modal

const Navbar = ({ toggleSidebar }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 🛠️ Estado para el modal
  const { user, logout, isAdmin } = useAuth();

  const API_URL_FILES = import.meta.env.VITE_API_URL_FILES || 'http://localhost:3000';

  const handleMenuClick = () => {
    toggleSidebar();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/10813/10813372.png';
  
  const getAvatar = () => {
    if (!user) return defaultAvatar;
    const photo = user.photoURL || user.avatar;
    if (!photo) return defaultAvatar;
    return photo.startsWith('http') 
      ? photo 
      : `${API_URL_FILES}/uploads/profiles/${photo}`;
  };

  const userName = user?.displayName || user?.name || 'Usuario';

  return (
    <>
      <header className="bg-gradient-to-r from-[#120228] to-[#4b0082]
                        flex items-center justify-between
                        w-full h-full px-3 sm:px-4 md:px-6
                        z-40 relative shadow-lg shadow-black/20">

        {/* Izquierda: hamburguesa + logo */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={handleMenuClick}
            className="text-white hover:bg-purple-400/20 rounded-lg p-2 transition-all duration-200 active:scale-90"
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link to="/">
            <img
              src={Logo}
              alt="RollingMusic logo"
              className="w-12 sm:w-[60px] cursor-pointer hover:brightness-110 transition-all duration-200"
            />
          </Link>
        </div>

        {/* Centro: SearchBar */}
        <div className="flex-1 flex justify-center px-2 sm:px-4 min-w-0 max-w-2xl">
          <SearchBar />
        </div>

        {/* Derecha: avatar + menú usuario */}
        <div className="relative shrink-0 flex items-center gap-3">
          <span className="hidden lg:block text-xs font-medium text-purple-200">
            {userName}
          </span>
          
          <button
            onClick={() => setIsUserMenuOpen(prev => !prev)}
            className="w-10 h-10 sm:w-[42px] sm:h-[42px] rounded-full overflow-hidden
                       ring-2 ring-purple-500 hover:ring-fuchsia-400 transition-all duration-300 shadow-lg shadow-purple-900/40"
          >
            <img 
              src={getAvatar()} 
              alt={userName} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = defaultAvatar; }}
            />
          </button>

          {user && isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-3 w-52
                            bg-neutral-900 rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-white/5 bg-white/5">
                <p className="text-white font-bold truncate text-sm flex items-center justify-between">
                  {userName}
                  {isAdmin && <span className="bg-fuchsia-600 text-[7px] px-1.5 py-0.5 rounded text-white uppercase font-black">Admin</span>}
                </p>
                <p className="text-gray-500 text-[10px] truncate">{user?.email}</p>
              </div>
              
              <div className="py-1">
                {/* 🛠️ Botón para abrir el Modal de Edición */}
                <button 
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left block px-4 py-2 text-gray-300 text-xs hover:bg-purple-600 hover:text-white transition-colors"
                >
                  Editar Perfil ⚙️
                </button>
                <Link 
                  to="/mis-playlists" 
                  className="block px-4 py-2 text-gray-300 text-xs hover:bg-purple-600 hover:text-white transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Mis Colecciones
                </Link>
                <Link 
                  to="/favoritos" 
                  className="block px-4 py-2 text-gray-300 text-xs hover:bg-purple-600 hover:text-white transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Mis Favoritos ❤️
                </Link>
              </div>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors border-t border-white/5"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 🛠️ Renderizado del Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />

      {/* Drawer móvil mejorado */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="bg-[#120228] w-72 h-full p-4 shadow-2xl flex flex-col border-r border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <img src={Logo} alt="Logo" className="w-10" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                <Aside onItemClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;