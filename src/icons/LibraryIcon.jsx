export default function LibraryIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h2A1.5 1.5 0 0 1 8 4.5v15A1.5 1.5 0 0 1 6.5 21h-2A1.5 1.5 0 0 1 3 19.5zM10 4a1 1 0 0 1 1-1h6a3 3 0 0 1 3 3v13a1 1 0 0 1-2 0V6a1 1 0 0 0-1-1h-6a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h6a3 3 0 0 1 3 3v9a1 1 0 0 1-2 0v-9a1 1 0 0 0-1-1h-6a1 1 0 0 1-1-1z" />
    </svg>
  );
}
