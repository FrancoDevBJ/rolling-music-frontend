import { useState, useEffect, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import Logo from '../assets/imagenes/logos/Logo.png';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';

const Navbar = ({ toggleSidebar }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const menuRef = useRef(null);
    const { user, logout, isAdmin } = useAuth();

    const API_URL_FILES = import.meta.env.VITE_API_URL_FILES || 'http://localhost:3000';

    // Cerrar menú al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuClick = () => {
        toggleSidebar();
        setIsMobileMenuOpen(prev => !prev);
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
            <header
                className="flex items-center w-full h-full px-3 sm:px-5 relative z-40"
                style={{
                    background: 'linear-gradient(90deg, #0d0118 0%, #1a0035 40%, #0d0118 100%)',
                    borderBottom: '1px solid rgba(167,139,250,0.1)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.4)'
                }}
            >
                {/* ── Izquierda: hamburguesa ── */}
                <div className="flex items-center shrink-0 w-10 sm:w-14">
                    <button
                        onClick={handleMenuClick}
                        className="p-2 rounded-lg text-gray-400 hover:text-white transition-all duration-200 active:scale-90"
                        style={{ background: isMobileMenuOpen ? 'rgba(167,139,250,0.1)' : 'transparent' }}
                        aria-label="Menú"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                    <Link to="/" className="flex-shrink-0">
                        <img
                            src={Logo}
                            alt="RollingPlay"
                            className="hidden sm:block w-10 sm:w-16 h-auto pl-2 hover:brightness-125 transition-all duration-200 drop-shadow-[0_0_8px_rgba(167,139,250,0.4)]"
                        />
                    </Link>
                </div>

                {/* ── Centro: logo + searchbar ── */}
                <div className="flex-1 flex items-center justify-center gap-3 sm:gap-6 min-w-0">

                    {/* SearchBar — ocupa el resto del espacio central */}
                    <div className="flex-1 max-w-xl">
                        <SearchBar />
                    </div>
                </div>

                {/* ── Derecha: usuario ── */}
                <div className="flex items-center gap-3 shrink-0 ml-3" ref={menuRef}>

                    {/* Nombre en desktop */}
                    <span className="hidden lg:block text-xs font-bold text-gray-400 max-w-[120px] truncate">
                        {user ? userName : ''}
                    </span>

                    {user ? (
                        <>
                            <button
                                onClick={() => setIsUserMenuOpen(prev => !prev)}
                                className="relative flex-shrink-0 transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                <img
                                    src={getAvatar()}
                                    alt={userName}
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                                    style={{
                                        border: isUserMenuOpen
                                            ? '2px solid rgba(167,139,250,0.9)'
                                            : '2px solid rgba(167,139,250,0.3)',
                                        boxShadow: isUserMenuOpen ? '0 0 12px rgba(167,139,250,0.4)' : 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s'
                                    }}
                                    onError={(e) => { e.target.src = defaultAvatar; }}
                                />
                                {/* Indicador online */}
                                <div
                                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                                    style={{ background: '#22c55e', borderColor: '#0d0118' }}
                                />
                            </button>

                            {/* Dropdown */}
                            {isUserMenuOpen && (
                                <div
                                    className="absolute right-3 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50"
                                    style={{
                                        background: '#111',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                                        animation: 'fadeSlideDown 0.15s ease both'
                                    }}
                                >
                                    <style>{`
                                        @keyframes fadeSlideDown {
                                            from { opacity: 0; transform: translateY(-8px); }
                                            to   { opacity: 1; transform: translateY(0); }
                                        }
                                    `}</style>

                                    {/* Header del menú */}
                                    <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={getAvatar()}
                                                alt={userName}
                                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                                style={{ border: '1px solid rgba(167,139,250,0.3)' }}
                                                onError={(e) => { e.target.src = defaultAvatar; }}
                                            />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-white font-bold text-sm truncate">{userName}</p>
                                                    {isAdmin && (
                                                        <span
                                                            className="text-[8px] px-1.5 py-0.5 rounded font-black uppercase flex-shrink-0"
                                                            style={{ background: 'rgba(124,58,237,0.3)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.4)' }}
                                                        >
                                                            Admin
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 text-[10px] truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="py-2">
                                        {[
                                            { label: 'Editar Perfil', icon: '⚙️', action: () => { setIsEditModalOpen(true); setIsUserMenuOpen(false); } },
                                            { label: 'Mis Colecciones', icon: '🎵', to: '/mis-playlists' },
                                            { label: 'Mis Favoritos', icon: '❤️', to: '/favoritos' },
                                        ].map((item) =>
                                            item.to ? (
                                                <Link
                                                    key={item.label}
                                                    to={item.to}
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-gray-400 text-xs font-medium transition-all"
                                                    style={{ ':hover': { background: 'rgba(124,58,237,0.15)', color: '#fff' } }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.12)'; e.currentTarget.style.color = '#fff'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ''; }}
                                                >
                                                    <span>{item.icon}</span>
                                                    {item.label}
                                                </Link>
                                            ) : (
                                                <button
                                                    key={item.label}
                                                    onClick={item.action}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 text-xs font-medium transition-all text-left"
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.12)'; e.currentTarget.style.color = '#fff'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ''; }}
                                                >
                                                    <span>{item.icon}</span>
                                                    {item.label}
                                                </button>
                                            )
                                        )}
                                    </div>

                                    {/* Cerrar sesión */}
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                        <button
                                            onClick={() => { logout(); setIsUserMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all text-left"
                                            style={{ color: '#f87171' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                                            </svg>
                                            Cerrar sesión
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
                            style={{ background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.4)' }}
                        >
                            Iniciar sesión
                        </Link>
                    )}
                </div>
            </header>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </>
    );
};

export default Navbar;
