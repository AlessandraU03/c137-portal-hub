import React from 'react';
import { useCharactersViewModel } from '../hooks/useCharactersViewModel';
import CharacterCard from '../components/CharacterCard';
import SearchBar from '../../../shared/components/SearchBar';
import Skeleton from '../../../shared/components/Skeleton';
import ErrorState from '../../../shared/components/ErrorState';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

export const CharactersPage: React.FC = () => {
  const {
    searchInput,
    setSearchInput,
    page,
    setPage,
    isLoading,
    isError,
    refetch,
    handleSearchSubmit,
    handleResetFilters,
    totalPages,
    characters,
  } = useCharactersViewModel();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Cabecera / Banner con buscador a la derecha */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-outline-variant/15 font-mono">
        <div className="space-y-2 max-w-xl">
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-100 uppercase">
            Directorio de Personajes
          </h1>
          <p className="text-xs text-slate-450 font-mono">
            Accede a la base de datos central de todos los seres sintientes, no sintientes y semi-sintientes a través de la curva finita.
          </p>
        </div>

        {/* Buscador alineado a la derecha */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-xs shrink-0">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSuggestionClick={(val) => {
              setSearchInput(val);
            }}
            placeholder="Buscar personajes..."
            className="w-full"
          />
        </form>
      </div>

      {/* Error State */}
      {isError && <ErrorState onRetry={refetch} />}

      {/* Content Section (Full width grid) */}
      {!isError && (
        <div className="space-y-8">
          {isLoading ? (
            // Skeletons
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-surface-container/40 rounded-xl border border-outline-variant/20 overflow-hidden h-[440px] flex flex-col justify-between"
                >
                  <Skeleton variant="rect" className="h-56 w-full" />
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <Skeleton variant="text" className="w-16 h-5" />
                      <Skeleton variant="text" className="w-3/4 h-6 mt-3" />
                    </div>
                    <Skeleton variant="text" className="w-1/2 h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : characters.length === 0 ? (
            // Empty state
            <div className="text-center py-16 glass-panel rounded-2xl border-outline-variant/20 font-mono">
              <div className="inline-flex p-3 rounded-full bg-surface-container-high mb-3 text-slate-400">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold font-display text-slate-200">No se encontraron registros</h3>
              <p className="text-xs font-mono text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                El escáner no detectó firmas biológicas correspondientes a estos parámetros. Intente depurar la búsqueda.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-slate-355 hover:text-primary font-mono text-xs py-2 px-4 rounded-lg transition-all cursor-pointer"
              >
                REINICIAR ESCÁNER
              </button>
            </div>
          ) : (
            // Grid of cards spanning full width
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
              {characters.map((char) => (
                <CharacterCard key={char.id} character={char} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <div className="flex items-center justify-between border-t border-outline-variant/15 pt-6 font-mono text-xs">
              <p className="text-slate-500">
                PÁGINA <span className="font-bold text-slate-200">{page}</span> DE{' '}
                <span className="font-bold text-slate-200">{totalPages}</span>
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="inline-flex items-center justify-center p-2 rounded-lg border border-outline-variant/30 hover:border-primary/50 bg-surface-container-lowest/50 text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="inline-flex items-center justify-center p-2 rounded-lg border border-outline-variant/30 hover:border-primary/50 bg-surface-container-lowest/50 text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CharactersPage;
