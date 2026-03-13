import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSongs } from "../context/SongsContext";
import Navbar from "../components/Navbar";
import Aside from "../components/Aside";
import Player from "../components/Player";

const MainLayout = () => {

  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  const { currentSong } = useSongs();

  // Corrige cuando se cambia tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="grid h-screen bg-black text-white"
      style={{
        gridTemplateAreas: `
          "navbar navbar"
          "aside main"
          "player player"
        `,
        gridTemplateColumns: isOpen ? "auto 1fr" : "0px 1fr",
        gridTemplateRows: "auto 1fr auto"
      }}
    >

      {/* NAVBAR */}
      <header className="[grid-area:navbar] z-50">
        <Navbar toggleSidebar={toggleSidebar} />
      </header>

      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* ASIDE */}
      <aside
        className={`
        [grid-area:aside]
        w-64
        bg-neutral-950
        border-r border-white/5
        overflow-y-auto
        transition-transform duration-300
        fixed md:static
        top-10 md:top-0
        h-full
        z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Aside onItemClick={toggleSidebar} />
      </aside>

      {/* MAIN */}
      <main className="[grid-area:main] overflow-y-auto">
        <Outlet />
      </main>

      {/* PLAYER */}
      <footer className={
        `[grid-area:player]
        shadow-lg
        transition-all duration-300
        ${currentSong ? "opacity-100 translate-y-0 h-auto" : "opacity-0 translate-y-4 h-0 overflow-hidden"}`
        }>
        <Player />
        </footer>

    </div>
  );
};

export default MainLayout;