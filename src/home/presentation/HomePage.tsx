import React from 'react';
import { Link } from 'react-router-dom';
import { useHomeViewModel } from './hooks/useHomeViewModel';
import CharacterCard from '../../characters/presentation/components/CharacterCard';
import EpisodeCard from '../../episodes/presentation/components/EpisodeCard';
import Skeleton from '../../shared/components/Skeleton';
import SearchBar from '../../shared/components/SearchBar';
import type { DecoratedLocation } from '../../locations/data/locations.mapper';
import type { Episode } from '../../episodes/domain/episode.types';
import { AlertTriangle, Globe, HelpCircle, Activity, Tv } from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    searchInput,
    setSearchInput,
    searchQuery,
    setSearchQuery,
    isLoadingDefault,
    isSearching,
    characters,
    locations,
    episodes,
    handleSearchSubmit,
    handleResetSearch,
    handleExampleClick,
    hasSearchQuery,
    noResults,
    rickChar,
    otherChars,
    navigate,
  } = useHomeViewModel();

  return (
    <div className="space-y-12 max-w-6xl mx-auto font-mono py-4 select-none animate-fade-in">
      {/* Central Portal Hub Search Section */}
      <div className="relative glass-panel rounded-3xl p-8 md:p-14 border-primary/20 flex flex-col items-center text-center overflow-hidden portal-glow-green min-h-[480px] justify-center">
        {/* Portal Swirl Animado en Background */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-primary/20 via-tertiary/10 to-transparent blur-3xl animate-portal-spin -z-10" />
        <div className="absolute w-[220px] h-[220px] rounded-full bg-primary/5 blur-2xl animate-pulse -z-10" />

        <div className="space-y-4 max-w-2xl">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">
            Siempre en constante fluidez.
          </span>
          <span className="text-[10px] text-primary uppercase tracking-widest block font-extrabold animate-pulse">
            ● Portal en operaciones.
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-slate-100 tracking-tight leading-none uppercase">
            Hub de Portales C-137
          </h1>
          <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-md mx-auto">
            La curva infinita es extensa y caótica. Comience a escanear nombres de sujetos, dimensiones o episodios...
          </p>
        </div>

        {/* Central Search Form (Sin debouncing, se activa con submit) */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mt-8 flex flex-col sm:flex-row gap-3 items-stretch justify-center">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSuggestionClick={(val) => setSearchQuery(val)}
            placeholder="Escriba nombres de personajes, dimensiones o episodios (ej: Rick, Earth, Pilot)..."
            className="flex-1 max-w-none"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary-container text-on-primary font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-103 active:scale-97 flex items-center justify-center space-x-2 portal-glow-green shrink-0"
          >
            <span>ESCANEAR</span>
          </button>
        </form>

        {/* Quick links tag lines */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-[9px] font-bold text-slate-400">
          <span className="text-slate-550">EX:</span>
          {['C-137', 'Tierra', 'Anatomía', 'Cronenberg'].map((ex) => (
            <button
              key={ex}
              onClick={() => handleExampleClick(ex)}
              className="bg-surface-container-lowest/60 hover:bg-primary/10 hover:text-primary border border-outline-variant/30 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTADOS DE BÚSQUEDA MULTIVERSAL */}
      {hasSearchQuery && (
        <div className="space-y-8 glass-panel p-6 md:p-8 rounded-2xl border-primary/20 portal-glow-green">
          <div className="flex justify-between items-center border-b border-outline-variant/15 pb-4">
            <h2 className="text-sm font-extrabold tracking-widest text-primary flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span>RESULTADOS DEL ESCANEO: "{searchQuery.toUpperCase()}"</span>
            </h2>
            <button
              onClick={handleResetSearch}
              className="text-[10px] font-extrabold text-error hover:text-red-455 border border-error/25 hover:border-error/50 px-3 py-1 rounded-md transition-all cursor-pointer font-mono"
            >
              LIMPIAR ESCÁNER
            </button>
          </div>

          {isSearching ? (
            <div className="space-y-6">
              <Skeleton variant="text" className="w-48 h-6" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={idx} variant="rect" className="h-64 rounded-xl" />
                ))}
              </div>
            </div>
          ) : noResults ? (
            <div className="text-center py-16 animate-fade-in">
              <HelpCircle className="h-10 w-10 text-slate-550 mx-auto mb-4 animate-bounce" />
              <h3 className="text-base font-bold text-slate-350">Señal de Escáner Inactiva</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                Ninguna dimensión, sujeto o episodio coincide con la firma "{searchQuery}". Intente con un anclaje diferente.
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              {/* Personajes */}
              {characters.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold tracking-widest text-slate-300 uppercase flex items-center space-x-1.5">
                    <Activity className="h-4 w-4 text-primary" />
                    <span>Sujetos Localizados ({characters.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {characters.map((char) => (
                      <CharacterCard key={char.id} character={char} />
                    ))}
                  </div>
                </div>
              )}

              {/* Dimensiones */}
              {locations.length > 0 && (
                <div className="space-y-4 border-t border-outline-variant/10 pt-6">
                  <h3 className="text-xs font-extrabold tracking-widest text-slate-300 uppercase flex items-center space-x-1.5">
                    <Globe className="h-4 w-4 text-tertiary" />
                    <span>Dimensiones Localizadas ({locations.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {locations.map((loc: DecoratedLocation) => (
                      <div
                        key={loc.id}
                        onClick={() => navigate(`/location/${loc.id}`)}
                        className={`glass-panel p-5 rounded-xl flex flex-col justify-between h-44 border-t-2 ${loc.color} hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1`}
                      >
                        <div>
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                            {loc.badge}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-200 line-clamp-1">{loc.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{loc.desc}</p>
                        </div>
                        <span className="text-[9px] text-slate-500 block text-right mt-2 uppercase">
                          Residents: {loc.residents.length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Episodios */}
              {episodes.length > 0 && (
                <div className="space-y-4 border-t border-outline-variant/10 pt-6">
                  <h3 className="text-xs font-extrabold tracking-widest text-slate-300 uppercase flex items-center space-x-1.5">
                    <Tv className="h-4 w-4 text-secondary" />
                    <span>Crónicas Indexadas ({episodes.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {episodes.map((ep: Episode) => (
                      <EpisodeCard key={ep.id} episode={ep} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MUESTRAS COMPORTAMENTALES (Por Defecto) */}
      {!hasSearchQuery && (
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-outline-variant/15 pb-3">
            <h2 className="text-xs font-extrabold tracking-widest text-slate-350 uppercase">
              Muestras Comportamentales / Sujetos Críticos
            </h2>
            <Link
              to="/characters"
              className="text-[10px] font-extrabold text-primary hover:text-primary-container transition-colors tracking-wide flex items-center space-x-1"
            >
              <span>VER TODOS LOS PERSONAJES</span>
              <span>&gt;</span>
            </Link>
          </div>

          {isLoadingDefault ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton variant="rect" className="md:col-span-1 h-[450px] rounded-2xl" />
              <div className="md:col-span-2 grid grid-cols-2 gap-6">
                <Skeleton variant="rect" className="h-52 rounded-xl" />
                <Skeleton variant="rect" className="h-52 rounded-xl" />
                <Skeleton variant="rect" className="h-52 rounded-xl" />
                <Skeleton variant="rect" className="h-52 rounded-xl" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch animate-fade-in">
              {/* Rick (Carta Grande a la izquierda) */}
              {rickChar && (
                <div
                  onClick={() => navigate(`/character/${rickChar.id}`)}
                  className="md:col-span-2 glass-panel rounded-2xl overflow-hidden border border-outline-variant/40 hover:border-primary transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-primary/5 hover:shadow-lg relative group h-[450px]"
                >
                  <div className="absolute top-3 left-3 z-10 font-mono text-[9px] font-bold bg-surface-container-lowest/80 text-primary border border-primary/30 px-2.5 py-0.5 rounded uppercase tracking-widest">
                    SUJETO DE INTERÉS
                  </div>

                  <div className="relative aspect-video flex-1 bg-surface-container-lowest overflow-hidden flex items-center justify-center border-b border-outline-variant/20">
                    <img
                      src={rickChar.image}
                      alt={rickChar.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 space-y-4 font-mono">
                    <div className="space-y-1">
                      <span className="text-[9px] text-tertiary font-bold tracking-widest block uppercase">LECTURA COGNITIVA ACTIVA</span>
                      <h3 className="font-extrabold text-lg text-slate-100 font-display line-clamp-1 group-hover:text-primary transition-colors">
                        {rickChar.name}
                      </h3>
                      <p className="text-[10px] text-slate-450 font-sans leading-relaxed">
                        DESIGNACIÓN: MAESTRO ARQUITECTO DE LA TIERRA C-137
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-bold text-[10px] py-2 rounded transition-all cursor-pointer">
                        ANALIZAR
                      </button>
                      <button className="flex-1 bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/35 text-slate-350 font-bold text-[10px] py-2 rounded transition-all cursor-pointer">
                        NÚCLEO
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Otros 4 Personajes del Mockup en la derecha */}
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {otherChars.map((char) => {
                  let behaviorTag = 'ALTO RIESGO QUANTUM';
                  let desc = 'Sujeto de interés';
                  if (char.name.toLowerCase().includes('morty')) {
                    behaviorTag = 'ALTO RIESGO QUANTUM';
                    desc = 'COMPORTAMIENTO';
                  } else if (char.name.toLowerCase().includes('summer')) {
                    behaviorTag = 'EXPEDICIÓN MULTIVERSAL';
                    desc = 'FUNCIÓN';
                  } else if (char.name.toLowerCase().includes('meeseeks')) {
                    behaviorTag = 'PROYECCIÓN TEMPORAL';
                    desc = 'ENTIDAD';
                  } else if (char.name.toLowerCase().includes('krombopulos')) {
                    behaviorTag = 'LIGA ASESINOS';
                    desc = 'FUGITIVO';
                  }

                  return (
                    <div
                      key={char.id}
                      onClick={() => navigate(`/character/${char.id}`)}
                      className="glass-panel p-4 rounded-xl border border-outline-variant/25 hover:border-primary/50 transition-all flex flex-col justify-between cursor-pointer group h-[213px]"
                    >
                      <div className="flex space-x-3 items-start">
                        <img
                          src={char.image}
                          alt={char.name}
                          className="h-14 w-14 rounded-lg object-cover border border-outline-variant/20 group-hover:border-primary/30 shrink-0"
                        />
                        <div className="space-y-0.5 font-mono">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                            {desc}
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-200 line-clamp-1 group-hover:text-primary transition-colors">
                            {char.name}
                          </h4>
                          <span className="text-[8px] font-bold text-primary block truncate font-mono">
                            {behaviorTag}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-outline-variant/10 pt-3 flex items-center justify-between text-[8px] text-slate-500 font-mono">
                        <span>ORIGEN: {char.origin.name.split(' ')[0]}</span>
                        <span className="text-primary font-bold group-hover:underline">VER DOSSIER</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUJETOS CRÍTICOS STATS METERS */}
      {!hasSearchQuery && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-center bg-surface-container-lowest/30 p-6 rounded-2xl border border-outline-variant/15">
          <div className="space-y-1">
            <span className="text-[20px] font-extrabold text-slate-100 block">51</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">APARICIONES</span>
          </div>
          <div className="space-y-1 border-l border-outline-variant/10">
            <span className="text-[20px] font-extrabold text-slate-100 block">1.429</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">ESPECIES REGISTRADAS</span>
          </div>
          <div className="space-y-1 border-l border-outline-variant/10">
            <span className="text-[20px] font-extrabold text-primary block">100%</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">ENERGÍA PORTAL</span>
          </div>
          <div className="space-y-1 border-l border-outline-variant/10">
            <span className="text-[20px] font-extrabold text-tertiary block">1</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">RICK ORIGINAL</span>
          </div>
        </div>
      )}

      {/* Security Warning & Action footer */}
      <div className="glass-panel p-6 rounded-2xl border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-6 bg-surface-container-lowest/40">
        <div className="flex items-start space-x-3 max-w-xl">
          <div className="p-2 bg-error-container/20 text-error border border-error/20 rounded-lg animate-pulse mt-0.5 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-error uppercase tracking-widest block">LÍNEA DE SEGURIDAD NÚCLEO PORTAL C-137</span>
            <p className="text-[10px] font-sans text-slate-400 leading-relaxed">
              Cuidado al interactuar con fluidos de portal de origen no verificado en su consola local. El contacto directo sin blindaje cuántico puede causar colapsos dimensionales o desmaterialización.
            </p>
          </div>
        </div>

        <div className="flex space-x-3 shrink-0">
          <button
            onClick={() => navigate('/characters')}
            className="bg-primary hover:bg-primary-container text-on-primary font-extrabold text-[10px] px-5 py-2.5 rounded-lg transition-all hover:scale-103 cursor-pointer shadow-sm"
          >
            INICIAR AVENTURA
          </button>
          <button
            onClick={() => window.open('https://github.com', '_blank')}
            className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-slate-350 font-extrabold text-[10px] px-5 py-2.5 rounded-lg transition-all hover:scale-103 cursor-pointer"
          >
            LEER EL MANUAL
          </button>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
