import { Link } from "react-router-dom";


export default function PlaylistItem({ playlist }) {
  const { id, cover, titulo, artists } = playlist;
  const artista = artists.join(", ");

  return (
    <Link
      to={`/playlist/${id}`}
      className="playlist-item flex relative p-2 overflow-hidden items-center gap-5 rounded-md hover:bg-zinc-800"
    >
      <picture className="h-12 w-12 flex-none">
        <img
          src={cover}
          alt={`Cover of ${titulo} by ${artista}`} 
          className="object-cover w-full h-full rounded-md"
        />
      </picture>

      <div className="flex flex-auto flex-col truncate">
        <h4 className="text-white text-sm">{titulo}</h4>

        <span className="text-xs text-gray-400">{artista}</span>
      </div>
    </Link>
  );
}
