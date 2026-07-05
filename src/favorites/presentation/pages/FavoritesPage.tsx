import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { useCharactersByIds } from '../../../characters/presentation/hooks/useCharacters';
import CharacterCard from '../../../characters/presentation/components/CharacterCard';
import Skeleton from '../../../shared/components/Skeleton';
import ErrorState from '../../../shared/components/ErrorState';
import { Star, HeartOff, Sparkles } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const { data: characters, isLoading, isError, refetch } = useCharactersByIds(favorites);

  const hasFavorites = favorites.length > 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Panel */}
      <div className="relative overflow-hidden glass-panel p-8 rounded-2xl border-primary/20 portal-glow-green">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5 text-primary">
              <Star className="h-6 w-6 fill-current animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">Base de Datos Personal</span>
            </div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-100 flex items-center gap-2">
              <span>Recortes de Favoritos</span>
              <span className="text-xs font-mono text-slate-400 bg-surface-container-highest px-2.5 py-0.5 rounded border border-outline-variant/30">
                {favorites.length} REGISTROS
              </span>
            </h1>
            <p className="text-xs font-sans text-slate-400 max-w-xl">
              Elementos anclados de la Curva Finita Central
            </p>
          </div>
        </div>
      </div>

      {/* Grid or Empty State */}
      {isError && hasFavorites ? (
        <ErrorState onRetry={refetch} />
      ) : !hasFavorites ? (
        // Empty State: Swirling Portal
        <div className="text-center py-16 glass-panel rounded-2xl max-w-lg mx-auto px-6 border-outline-variant/20">
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            {/* Swirl Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-portal-spin" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-primary/10 via-secondary/15 to-transparent blur-md" />
            <HeartOff className="h-8 w-8 text-primary relative z-10 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold font-display text-slate-200">Buzón de Recortes Vacío</h3>
          <p className="text-xs font-mono text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
            No has marcado ningún personaje en tus viajes. Abre un portal, explora el directorio e indexa registros.
          </p>
          <button
            onClick={() => navigate('/characters')}
            className="mt-6 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs py-2 px-6 rounded-lg transition-all shadow-sm hover:scale-103 cursor-pointer flex items-center space-x-2 mx-auto font-mono"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>ESCANEAR PERSONAJES</span>
          </button>
        </div>
      ) : isLoading ? (
        // Loading state
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: Math.min(favorites.length, 4) }).map((_, idx) => (
            <div
              key={idx}
              className="bg-surface-container/40 rounded-xl border border-outline-variant/20 overflow-hidden h-[360px] flex flex-col justify-between"
            >
              <Skeleton variant="rect" className="h-56 w-full" />
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <Skeleton variant="text" className="w-16 h-5" />
                  <Skeleton variant="text" className="w-3/4 h-6" />
                </div>
                <Skeleton variant="text" className="w-1/2 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : characters && characters.length > 0 ? (
        // Favorites Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {characters.map((char) => (
            <CharacterCard key={char.id} character={char} />
          ))}
        </div>
      ) : null}
    </div>
  );
};
export default FavoritesPage;
