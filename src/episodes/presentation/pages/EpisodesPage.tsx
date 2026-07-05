import React from 'react';
import { useEpisodesViewModel } from '../hooks/useEpisodesViewModel';
import EpisodeCard from '../components/EpisodeCard';
import Skeleton from '../../../shared/components/Skeleton';
import ErrorState from '../../../shared/components/ErrorState';
import SearchBar from '../../../shared/components/SearchBar';
import { ChevronLeft, ChevronRight, Tv } from 'lucide-react';

export const EpisodesPage: React.FC = () => {
  const {
    nameInput,
    setNameInput,
    page,
    setPage,
    sortBy,
    setSortBy,
    isLoading,
    isError,
    refetch,
    handleSearchSubmit,
    handleResetFilters,
    handleSeasonSelect,
    totalPages,
    sortedEpisodes,
    activeSeason,
  } = useEpisodesViewModel();

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-mono">
      {/* Cabecera / Quote Científico con buscador a la derecha */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-outline-variant/15">
        <div className="space-y-2 max-w-xl">
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase block">Directorio de Archivos</span>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-100 uppercase">
            Archivo de Episodios
          </h1>
          <div className="border-l-2 border-primary/40 pl-4 py-0.5 mt-2">
            <p className="text-[11px] italic text-slate-350 font-sans">
              "¡Wubba Lubba Dub Dub!"
            </p>
            <span className="text-[8px] text-slate-500 font-mono block mt-0.5 uppercase">
              — Rick Sanchez, Dimensión C-137
            </span>
          </div>
        </div>

        {/* Buscador alineado a la derecha */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-xs shrink-0">
          <SearchBar
            value={nameInput}
            onChange={setNameInput}
            onSuggestionClick={(val) => {
              setNameInput(val);
            }}
            placeholder="Buscar episodios..."
            className="w-full"
          />
        </form>
      </div>

      {/* Main Content Area (Spanning full width) */}
      <div className="space-y-6">
        {/* Season Tabs & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/15 pb-4">
          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            {[
              { id: 'ALL', label: 'Todas las Temporadas' },
              { id: '01', label: 'Temporada 01' },
              { id: '02', label: 'Temporada 02' },
              { id: '03', label: 'Temporada 03' },
              { id: '04', label: 'Temporada 04' },
            ].map((season) => (
              <button
                key={season.id}
                type="button"
                onClick={() => handleSeasonSelect(season.id as any)}
                className={`px-4 py-2 rounded-full border transition-all cursor-pointer ${
                  activeSeason === season.id
                    ? 'bg-primary text-on-primary border-primary portal-glow-green'
                    : 'bg-surface-container-lowest/50 text-slate-450 border-outline-variant/20 hover:text-slate-200'
                }`}
              >
                {season.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-bold">
            <span className="text-slate-550 uppercase tracking-widest">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'chrono' | 'reverse')}
              className="px-3 py-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-lowest/50 focus:outline-none focus:border-primary/80 transition-all text-slate-300 cursor-pointer"
            >
              <option value="chrono">Cronológico</option>
              <option value="reverse">Inverso</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {isError && <ErrorState onRetry={refetch} />}

        {/* Content Loading or List */}
        {!isError && (
          <>
            {isLoading ? (
              // Skeletons
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={idx} variant="rect" className="h-28 rounded-xl w-full" />
                ))}
              </div>
            ) : sortedEpisodes.length === 0 ? (
              // Empty State
              <div className="text-center py-16 glass-panel rounded-2xl border-outline-variant/20">
                <div className="inline-flex p-3 rounded-full bg-surface-container-high mb-3 text-slate-400">
                  <Tv className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold font-display text-slate-200">No se encontraron crónicas</h3>
                <p className="text-xs font-mono text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                  El escáner no detectó registros históricos o crónicas correspondientes a estos parámetros.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-slate-350 hover:text-primary font-mono text-xs py-2 px-4 rounded-lg transition-all cursor-pointer"
                >
                  REINICIAR ESCÁNER
                </button>
              </div>
            ) : (
              // List of cards
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedEpisodes.map((ep) => (
                  <EpisodeCard key={ep.id} episode={ep} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
              <div className="flex items-center justify-between border-t border-outline-variant/15 pt-6 text-xs">
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
          </>
        )}
      </div>
    </div>
  );
};

export default EpisodesPage;
