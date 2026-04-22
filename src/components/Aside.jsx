import { Link } from "react-router-dom";
import SideMenuItem from "./SideMenuItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../context/AuthContext";
import { useSongs } from "../context/SongsContext";
import {
  faHouse,
  faCircleInfo,
  faListUl,
  faSearch,
  faLock,
  faHeart,
  faUsers  // ✅ Nuevo: icono para panel de usuarios
} from "@fortawesome/free-solid-svg-icons";

const menuItems = [
  { href: "/", label: "Inicio", icon: faHouse },
  { href: "/search", label: "Explorar", icon: faSearch },
  { href: "/nosotros", label: "Sobre Nosotros", icon: faCircleInfo },
];

function Aside({ onItemClick }) {
  const { isAdmin } = useAuth();
  const { playlists } = useSongs();

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      onItemClick();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto
                      bg-gradient-to-b from-purple-950/40 to-black/90
                      border-r border-purple-500/10">
      
      <nav aria-label="Navegación principal" className="flex flex-col flex-1 p-3 pt-6">
        <ul className="flex flex-col space-y-2">
          
          {/* SECCIÓN PRINCIPAL */}
          {menuItems.map(({ href, label, icon }) => (
            <SideMenuItem key={href} href={href} onClick={handleItemClick}>
              <FontAwesomeIcon
                icon={icon}
                className="w-4 h-4 shrink-0 text-purple-400 group-hover:text-white transition-colors"
                aria-hidden="true"
              />
              <span className="truncate">{label}</span>
            </SideMenuItem>
          ))}

          {/* FAVORITOS */}
          <SideMenuItem href="/favoritos" onClick={handleItemClick}>
            <FontAwesomeIcon
              icon={faHeart}
              className="w-4 h-4 shrink-0 text-purple-400"
              aria-hidden="true"
            />
            <span className="truncate">Favoritos</span>
          </SideMenuItem>

          {/* SECCIÓN DINÁMICA: TUS PLAYLISTS */}
          <div className="pt-6 mt-2 border-t border-white/5">
            <div className="flex items-center justify-between px-4 mb-3">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                Tu Biblioteca
              </p>
              <Link to="/my-playlists" onClick={handleItemClick} className="text-[10px] text-purple-400 hover:text-white">Ver todo</Link>
            </div>
            
            <div className="flex flex-col space-y-1">
              {playlists?.length > 0 ? (
                playlists.map((pl) => (
                  <SideMenuItem 
                    key={pl._id || pl.id} 
                    href={`/playlist/${pl._id}`}
                    onClick={handleItemClick}
                  >
                    <FontAwesomeIcon
                      icon={faListUl}
                      className="w-3 h-3 shrink-0 text-gray-400"
                    />
                    <span className="truncate text-sm text-gray-300">{pl.name}</span>
                  </SideMenuItem>
                ))
              ) : (
                <p className="px-4 text-[11px] text-gray-600 italic">No tienes listas aún</p>
              )}
            </div>
          </div>

          {/* SECCIÓN ADMINISTRADOR */}
          {isAdmin && (
            <div className="pt-6 mt-6 border-t border-purple-900/30">
              <p className="px-4 mb-2 text-[10px] uppercase tracking-widest font-bold text-purple-500">
                Administración
              </p>
              <SideMenuItem href="/admin" onClick={handleItemClick}>
                <FontAwesomeIcon
                  icon={faLock}
                  className="w-4 h-4 shrink-0 text-purple-400"
                  aria-hidden="true"
                />
                <span className="truncate text-white">Panel Canciones</span>
              </SideMenuItem>

              {/* ✅ Nuevo: Panel de Usuarios */}
              <SideMenuItem href="/admin/usuarios" onClick={handleItemClick}>
                <FontAwesomeIcon
                  icon={faUsers}
                  className="w-4 h-4 shrink-0 text-purple-400"
                  aria-hidden="true"
                />
                <span className="truncate text-white">Panel Usuarios</span>
              </SideMenuItem>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Aside;
