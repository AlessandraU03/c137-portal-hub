import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, User, Globe, Tv, Loader2 } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSuggestionClick?: (value: string) => void;
}

interface SearchSuggestion {
  id: number;
  name: string;
  type: 'character' | 'location' | 'episode';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar en el multiverso...',
  className = '',
  onSuggestionClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const term = value.trim();

  // Consulta directa a la API en tiempo real para obtener sugerencias vivas de personajes, ubicaciones y episodios
  const { data: suggestions = [], isLoading } = useQuery<SearchSuggestion[]>({
    queryKey: ['live-suggestions', term],
    queryFn: async () => {
      if (term.length < 4) return [];

      // Ejecutamos consultas paralelas utilizando Promise.allSettled para que el fallo de una (ej. 404) no cancele las demás
      const [charRes, locRes, epRes] = await Promise.allSettled([
        fetch(`https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(term)}`).then((r) => {
          if (!r.ok) throw new Error('Not found');
          return r.json();
        }),
        fetch(`https://rickandmortyapi.com/api/location/?name=${encodeURIComponent(term)}`).then((r) => {
          if (!r.ok) throw new Error('Not found');
          return r.json();
        }),
        fetch(`https://rickandmortyapi.com/api/episode/?name=${encodeURIComponent(term)}`).then((r) => {
          if (!r.ok) throw new Error('Not found');
          return r.json();
        }),
      ]);

      const list: SearchSuggestion[] = [];

      if (charRes.status === 'fulfilled' && charRes.value.results) {
        charRes.value.results.slice(0, 3).forEach((c: any) => {
          list.push({ id: c.id, name: c.name, type: 'character' });
        });
      }
      if (locRes.status === 'fulfilled' && locRes.value.results) {
        locRes.value.results.slice(0, 2).forEach((l: any) => {
          list.push({ id: l.id, name: l.name, type: 'location' });
        });
      }
      if (epRes.status === 'fulfilled' && epRes.value.results) {
        epRes.value.results.slice(0, 2).forEach((e: any) => {
          list.push({ id: e.id, name: e.name, type: 'episode' });
        });
      }

      return list;
    },
    enabled: term.length >= 4,
    staleTime: 30000, // Cache de 30 segundos
  });

  const handleBlur = () => {
    // Delay para permitir que el evento onClick del item de sugerencia se registre antes de ocultar
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleSuggestionSelect = (item: SearchSuggestion) => {
    onChange(item.name);
    if (onSuggestionClick) {
      onSuggestionClick(item.name);
    }
    setIsOpen(false);
    // Redirigir directamente al detalle del apartado correspondiente
    navigate(`/${item.type}/${item.id}`);
  };

  return (
    <div className={`relative w-full max-w-md ${className} font-mono`}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          className="w-full pl-11 pr-10 py-2.5 bg-surface-container-lowest/80 border border-outline-variant/30 rounded-xl text-sm font-sans placeholder-slate-500 focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all text-on-surface hover:border-outline-variant/50"
        />
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        {isLoading && term.length >= 2 && (
          <Loader2 className="absolute right-3.5 top-3 h-4 w-4 text-primary animate-spin" />
        )}
      </div>

      {/* Floating Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1.5 bg-surface-lowest/95 backdrop-blur-md border border-outline-variant/35 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
          <div className="p-2 border-b border-outline-variant/10 text-[8px] font-bold text-slate-550 tracking-wider">
            SUGERENCIAS DETECTADAS EN VIVO (API)
          </div>
          <ul className="divide-y divide-outline-variant/5">
            {suggestions.map((item) => {
              const Icon = item.type === 'character' ? User : item.type === 'location' ? Globe : Tv;
              const typeLabel = item.type === 'character' ? 'SUJETO' : item.type === 'location' ? 'ANCLA' : 'CRÓNICA';
              const typeColor = item.type === 'character' ? 'text-primary' : item.type === 'location' ? 'text-tertiary' : 'text-secondary';

              return (
                <li key={`${item.type}-${item.id}`}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionSelect(item);
                    }}
                    className="w-full px-4 py-2.5 hover:bg-surface-container-lowest text-left text-xs font-sans text-slate-300 hover:text-primary transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-3.5 w-3.5 text-slate-500 group-hover:text-primary transition-colors shrink-0" />
                      <span className="font-semibold line-clamp-1">{item.name}</span>
                    </div>
                    <span className={`text-[8px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/15 ${typeColor}`}>
                      {typeLabel}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
