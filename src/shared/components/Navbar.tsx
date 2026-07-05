import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Globe, Menu } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <header className="h-16 border-b border-outline-variant/20 bg-surface-container-lowest/80 backdrop-blur-md px-6 flex items-center justify-between font-mono z-45 sticky top-0 select-none">
      {/* Left side: Menu Toggle + Brand Logo */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg border border-outline-variant/25 text-slate-400 hover:text-primary hover:border-primary/50 transition-colors bg-surface-container-lowest/50 cursor-pointer"
          title={isSidebarOpen ? 'Colapsar escáner' : 'Desplegar escáner'}
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link to="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity cursor-pointer">
          <img
            src="/logo.png"
            alt="Portal C-137"
            className="h-7 w-7 rounded-full border border-primary/50 object-cover portal-glow-green"
          />
          <span className="text-sm font-extrabold text-primary font-display tracking-wide animate-pulse">
            C-137 Portal Hub
          </span>
        </Link>
      </div>

      {/* Center/Right side: Links + Public Portal indicator */}
      <div className="flex items-center space-x-8">
        <nav className="flex items-center space-x-6 text-xs font-bold tracking-wider">
          <NavLink
            to="/locations"
            className={({ isActive }) =>
              isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-200 transition-colors'
            }
          >
            Dimensiones
          </NavLink>
          <NavLink
            to="/characters"
            className={({ isActive }) =>
              isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-200 transition-colors'
            }
          >
            Personajes
          </NavLink>
          <NavLink
            to="/episodes"
            className={({ isActive }) =>
              isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-200 transition-colors'
            }
          >
            Episodios
          </NavLink>
        </nav>

        {/* Portal Público Capsule */}
        <div className="flex items-center space-x-2 text-[10px] font-bold text-primary border border-primary/30 bg-primary/5 px-4 py-1.5 rounded-full">
          <span>PORTAL PÚBLICO</span>
          <Globe className="h-3.5 w-3.5" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
