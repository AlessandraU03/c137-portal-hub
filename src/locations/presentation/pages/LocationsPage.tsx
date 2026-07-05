import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationsViewModel } from '../hooks/useLocationsViewModel';
import Skeleton from '../../../shared/components/Skeleton';
import ErrorState from '../../../shared/components/ErrorState';
import SearchBar from '../../../shared/components/SearchBar';
import { Globe, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';

export const LocationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    nameInput,
    setNameInput,
    page,
    setPage,
    isLoading,
    isError,
    refetch,
    handleSearchSubmit,
    handleResetFilters,
    totalPages,
    locations,
  } = useLocationsViewModel();

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-mono">
      {/* Cabecera / Banner con buscador a la derecha */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-outline-variant/15">
        <div className="space-y-2 max-w-xl">
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-100 uppercase">
            Guía de Ubicaciones
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Escaneando el multiverso en busca de anclas dimensionales estables. Accediendo a datos topológicos locales y evaluaciones de riesgo existencial.
          </p>
        </div>

        {/* Buscador alineado a la derecha */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-xs shrink-0">
          <SearchBar
            value={nameInput}
            onChange={setNameInput}
            onSuggestionClick={(val) => {
              setNameInput(val);
              // Como la sugerencia hace navigate, no necesitamos setear el filtro de búsqueda aquí
            }}
            placeholder="Buscar dimensiones..."
            className="w-full"
          />
        </form>
      </div>

      {/* Error State */}
      {isError && <ErrorState onRetry={refetch} />}

      {/* Content Section */}
      {!isError && (
        <div className="space-y-8">
          {isLoading ? (
            // Skeletons
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton variant="rect" className="md:col-span-2 h-72 rounded-2xl" />
              <Skeleton variant="rect" className="h-72 rounded-2xl" />
              <Skeleton variant="rect" className="h-60 rounded-xl" />
              <Skeleton variant="rect" className="h-60 rounded-xl" />
              <Skeleton variant="rect" className="h-60 rounded-xl" />
            </div>
          ) : locations.length === 0 ? (
            // Empty state
            <div className="text-center py-16 glass-panel rounded-2xl border-outline-variant/20">
              <div className="inline-flex p-3 rounded-full bg-surface-container-high mb-3 text-slate-400">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold font-display text-slate-200">No se encontraron ubicaciones</h3>
              <p className="text-xs font-mono text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                El escáner no detectó coordenadas espaciales que correspondan a estos parámetros. Intente depurar la búsqueda.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-slate-350 hover:text-primary font-mono text-xs py-2 px-4 rounded-lg transition-all cursor-pointer"
              >
                REINICIAR ESCÁNER
              </button>
            </div>
          ) : (
            // Grid de 3 columnas estilo Mockup
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {locations.map((loc, idx) => {
                // Si estamos en la página 1 y es el primer elemento, ocupa 2 columnas
                const isHighlight = page === 1 && idx === 0;

                return (
                  <div
                    key={loc.id}
                    onClick={() => navigate(`/location/${loc.id}`)}
                    className={`glass-panel p-6 rounded-2xl flex flex-col justify-between border-t-2 ${loc.color} hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-primary/5 ${
                      isHighlight ? 'md:col-span-2 min-h-72' : 'min-h-[280px]'
                    }`}
                  >
                    {/* Contenido Superior */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold bg-surface-container-lowest/80 border border-outline-variant/25 px-2.5 py-1 rounded">
                          {loc.badge}
                        </span>
                        {isHighlight && (
                          <div className="h-4.5 w-4.5 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
                            <Globe className="h-3 w-3 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 font-bold tracking-widest block uppercase">
                          DIMENSIÓN: {loc.dimension}
                        </span>
                        <h3 className={`font-extrabold font-display text-slate-100 tracking-tight leading-snug uppercase ${
                          isHighlight ? 'text-2xl md:text-3xl' : 'text-base'
                        }`}>
                          {loc.name}
                        </h3>
                      </div>

                      <p className="text-[10px] font-sans text-slate-400 leading-relaxed line-clamp-3">
                        {loc.desc}
                      </p>
                    </div>

                    {/* Contenido Inferior */}
                    <div className="pt-4 border-t border-outline-variant/10 flex items-center justify-between text-[9px] font-bold text-slate-350">
                      <div className="flex items-center space-x-2">
                        {loc.action ? (
                          <span className="text-primary border border-primary/25 bg-primary/5 px-3 py-1 rounded-lg uppercase">
                            {loc.action}
                          </span>
                        ) : loc.warn ? (
                          <span className="text-error flex items-center space-x-1.5 bg-error-container/20 border border-error/25 px-2.5 py-1 rounded">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            <span>{loc.warn}</span>
                          </span>
                        ) : (
                          <span className="text-slate-500">APROBADA</span>
                        )}
                      </div>

                      <span className="text-slate-550 uppercase">
                        HABITANTES: {loc.residents.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <div className="flex items-center justify-between border-t border-outline-variant/15 pt-6 text-xs font-mono">
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

export default LocationsPage;
