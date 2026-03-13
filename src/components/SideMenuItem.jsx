import { NavLink } from "react-router-dom";

function SideMenuItem({ href = "#", children, onClick }) {
  return (
    <li>
      <NavLink
        to={href}
         onClick={onClick}
        className={({ isActive }) =>
        `relative flex gap-4 items-center py-3 px-5 font-medium transition duration-300 
        ${
        isActive
        ? "text-fuchsia-400 bg-white/5"
        : "text-zinc-50 hover:text-fuchsia-400 hover:bg-white/5"
        }`
        }
      >
        {children}
      </NavLink>
    </li>
  );
}

export default SideMenuItem;