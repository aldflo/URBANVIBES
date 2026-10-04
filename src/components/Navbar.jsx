import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";
import corona from "../assets/corona.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-white"
        : "text-white/70 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-black via-purple-950 to-blue-950 shadow-lg shadow-black/20 backdrop-blur-md">

      <div className="mx-auto flex h-20 w-[94%] max-w-7xl items-center justify-between">

        {/* LOGO */}
        <NavLink
          to="/"
          onClick={closeMenu}
          className="flex flex-col items-center justify-center leading-none"
        >
          <img
            src={corona}
            alt="Corona Urban"
            className="mb-1 h-7 w-auto object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
          />

          <span className="text-[11px] font-black tracking-[0.28em] text-white">
            URBAN
          </span>
        </NavLink>

        {/* MENU DESKTOP */}
        <nav className="hidden items-center gap-8 md:flex">

          <NavLink
            to="/"
            className={navLinkClasses}
          >
            Inicio
          </NavLink>

          <NavLink
            to="/dama"
            className={navLinkClasses}
          >
            Dama
          </NavLink>

          <NavLink
            to="/caballeros"
            className={navLinkClasses}
          >
            Caballeros
          </NavLink>

          <NavLink
            to="/contacto"
            className={navLinkClasses}
          >
            Contacto
          </NavLink>

        </nav>

        {/* ACCIONES DERECHA */}
        <div className="flex items-center gap-2">

          {/* ADMIN DESKTOP */}
          <NavLink
            to={user ? "/admin" : "/admin/login"}
            onClick={closeMenu}
            className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40 hover:bg-white/10 sm:flex"
          >
            <span>👤</span>

            <span>
              {user ? "Panel Admin" : "Administrador"}
            </span>
          </NavLink>

          {/* ADMIN MOBILE */}
          <NavLink
            to={user ? "/admin" : "/admin/login"}
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-sm text-white transition hover:bg-white/10 sm:hidden"
            aria-label="Administrador"
          >
            👤
          </NavLink>

          {/* CARRITO */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
            aria-label="Carrito"
          >
            <span className="text-lg">
              🛒
            </span>

            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
              0
            </span>
          </button>

          {/* HAMBURGUESA */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full transition hover:bg-white/10 md:hidden"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <span
              className={`h-[2px] w-5 bg-white transition-all duration-300 ${
                menuOpen
                  ? "translate-y-[7px] rotate-45"
                  : ""
              }`}
            />

            <span
              className={`h-[2px] w-5 bg-white transition-all duration-300 ${
                menuOpen
                  ? "opacity-0"
                  : ""
              }`}
            />

            <span
              className={`h-[2px] w-5 bg-white transition-all duration-300 ${
                menuOpen
                  ? "-translate-y-[7px] -rotate-45"
                  : ""
              }`}
            />
          </button>

        </div>
      </div>

      {/* MENU MOBILE */}
      <div
        className={`overflow-hidden border-t border-white/10 bg-gradient-to-b from-purple-950 to-blue-950 transition-all duration-300 md:hidden ${
          menuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex w-[92%] flex-col py-3">

          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              `border-b border-white/10 py-4 text-sm font-medium ${
                isActive
                  ? "text-white"
                  : "text-white/70"
              }`
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/dama"
            onClick={closeMenu}
            className={({ isActive }) =>
              `border-b border-white/10 py-4 text-sm font-medium ${
                isActive
                  ? "text-white"
                  : "text-white/70"
              }`
            }
          >
            Dama
          </NavLink>

          <NavLink
            to="/caballeros"
            onClick={closeMenu}
            className={({ isActive }) =>
              `border-b border-white/10 py-4 text-sm font-medium ${
                isActive
                  ? "text-white"
                  : "text-white/70"
              }`
            }
          >
            Caballeros
          </NavLink>

          <NavLink
            to="/contacto"
            onClick={closeMenu}
            className={({ isActive }) =>
              `border-b border-white/10 py-4 text-sm font-medium ${
                isActive
                  ? "text-white"
                  : "text-white/70"
              }`
            }
          >
            Contacto
          </NavLink>

          <NavLink
            to={user ? "/admin" : "/admin/login"}
            onClick={closeMenu}
            className="py-4 text-sm font-semibold text-white"
          >
            {user
              ? "Panel Administrador"
              : "Administrador"}
          </NavLink>

        </nav>
      </div>

    </header>
  );
}

export default Navbar;