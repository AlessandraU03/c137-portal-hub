import React from 'react';
import { NavLink } from 'react-router-dom';
import { useFavorites } from '../../favorites/presentation/hooks/useFavorites';
import { Globe, Users, Tv, Star, HelpCircle, FileText, Settings, Plus } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { favorites } = useFavorites();

  const navItems = [
    { to: '/locations', label: 'DIMENSIONES', icon: Globe },
    { to: '/characters', label: 'PERSONAJES', icon: Users },
    { to: '/episodes', label: 'EPISODIOS', icon: Tv },
    { to: '/favorites', label: 'FAVORITOS', icon: Star, count: favorites.length },
  ];

  return (
    <aside className={`bg-surface-container-lowest flex flex-col justify-between h-full font-mono select-none transition-all duration-300 ${
      isOpen ? 'w-64 border-r border-outline-variant/35 opacity-100' : 'w-0 opacity-0 overflow-hidden pointer-events-none'
    }`}>
      <div className="p-6">
        {/* Menú de Navegación */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all border ${
                    isActive
                      ? 'bg-primary text-on-primary border-primary portal-glow-green font-extrabold translate-x-1'
                      : 'text-slate-400 border-transparent hover:bg-surface-container hover:text-slate-100 hover:border-outline-variant/30'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[9px] font-bold bg-secondary text-on-secondary px-1.5 py-0.5 rounded-full ring-1 ring-secondary/25">
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom controls */}
      <div className="p-6 space-y-4 border-t border-outline-variant/20 bg-surface-container-lowest/50">
        {/* Botón Nuevo Portal */}
        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-primary hover:bg-primary-container text-on-primary font-extrabold text-xs py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer portal-glow-green hover:scale-103 active:scale-97 active:opacity-90"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3px]" />
          <span>NUEVO PORTAL</span>
        </button>

        {/* Footer info */}
        <div className="space-y-2.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
            Explorar
          </span>
          <a
            href="#"
            className="flex items-center space-x-2 text-[10px] text-slate-400 hover:text-primary transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Ayuda</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-2 text-[10px] text-slate-400 hover:text-primary transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Términos</span>
          </a>
          <div className="flex items-center justify-between text-[10px] text-slate-500 hover:text-slate-350 transition-colors pt-2 cursor-pointer border-t border-outline-variant/10">
            <div className="flex items-center space-x-2">
              <Settings className="h-3.5 w-3.5" />
              <span>Ajustes</span>
            </div>
            <span className="text-[8px] bg-surface-container-highest px-1 py-0.5 rounded text-slate-400 font-mono">
              v1.0.4
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
