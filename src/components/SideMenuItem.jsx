import { NavLink } from "react-router-dom";

function SideMenuItem({ href = "#", children, onClick }) {
  return (
    <li>
      <NavLink
        to={href}
         onClick={onClick}
        className={({ isActive }) =>
          `flex gap-4 items-center py-3 px-5 font-medium transition duration-300 ${
            isActive ? "text-fuchsia-500" : "text-zinc-50 hover:text-fuchsia-400"
          }`
        }
      >
        {children}
      </NavLink>
    </li>
  );
}

export default SideMenuItem;