import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCharacterDetail } from '../hooks/useCharacterDetail';
import { useEpisodesByIds } from '../../../episodes/presentation/hooks/useEpisodes';
import { useFavorites } from '../../../favorites/presentation/hooks/useFavorites';
import { Skeleton } from '../../../shared/components/Skeleton';
import { ErrorState } from '../../../shared/components/ErrorState';
import { ArrowLeft, Heart, Beaker, Database, Film, Activity } from 'lucide-react';

export const CharacterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const characterId = Number(id);

  const { data: character, isLoading, isError, error, refetch } = useCharacterDetail(characterId);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(characterId);

  // Extraemos los IDs de los episodios del array de URLs que viene en el personaje
  const episodeIds = React.useMemo(() => {
    if (!character || !character.episode) return [];
    return character.episode.map((url) => {
      const parts = url.split('/');
      return Number(parts[parts.length - 1]);
    });
  }, [character]);

  // Consumo secundario relacional: Traemos los datos de todos los episodios correspondientes
  const { data: episodes, isLoading: isLoadingEpisodes } = useEpisodesByIds(episodeIds);

  const handleFavoriteToggle = () => {
    if (character) {
      if (favorite) {
        removeFavorite(characterId);
      } else {
        addFavorite(characterId);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton variant="text" className="w-24 h-9" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton variant="rect" className="aspect-square md:h-[450px] rounded-2xl" />
          <div className="md:col-span-2 space-y-6">
            <Skeleton variant="text" className="w-1/2 h-10" />
            <Skeleton variant="rect" className="w-full h-48 rounded-xl" />
            <Skeleton variant="rect" className="w-full h-32 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !character) {
    return (
      <ErrorState
        title="Interferencia crítica detectada"
        message={(error as Error)?.message || 'El registro del personaje no existe o el escáner falló.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono">
      {/* Regresar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 border border-outline-variant/30 bg-surface-container-lowest/50 text-slate-400 hover:text-primary hover:border-primary/50 font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Regresar</span>
      </button>

      {/* Grid General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* LADO IZQUIERDO: Holograma y Frase */}
        <div className="space-y-4">
          <div className="relative glass-panel rounded-2xl overflow-hidden border border-outline-variant/35 shadow-lg group">
            {/* Badges de Estado Flotantes */}
            <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1.5 font-mono text-[8px] font-bold">
              <span className="bg-surface-container-lowest/90 text-primary border border-primary/40 px-2 py-0.5 rounded tracking-widest uppercase">
                ESCANEO_ACTIVO: {character.activeScan}
              </span>
              <span className="bg-surface-container-lowest/90 text-error border border-error/40 px-2 py-0.5 rounded tracking-widest uppercase animate-pulse">
                NIVEL_AMENAZA: {character.threatLevel}
              </span>
            </div>

            {/* Avatar Holograma */}
            <div className="aspect-square w-full bg-surface-container-lowest overflow-hidden flex items-center justify-center border-b border-outline-variant/20">
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
            </div>

            {/* Caja de Frase en el Bottom */}
            <div className="p-5 bg-surface-container-lowest/65 border-t border-outline-variant/20 flex space-x-3.5">
              <Activity className="h-5 w-5 text-primary shrink-0 animate-pulse mt-0.5" />
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Lectura Cognitiva</span>
                <p className="text-[10px] italic text-slate-300 leading-relaxed font-sans">
                  {character.quote}
                </p>
                <span className="text-[8px] font-bold text-primary block mt-1 font-mono">
                  — {character.name.toUpperCase()}, Dimensión {character.origin.name.includes('C-137') ? 'C-137' : 'Desconocida'}
                </span>
              </div>
            </div>
          </div>

          {/* Botón de Favorito */}
          <button
            onClick={handleFavoriteToggle}
            className={`w-full py-2.5 rounded-lg border transition-all flex items-center justify-center space-x-2 font-bold text-xs cursor-pointer ${
              favorite
                ? 'bg-secondary/20 text-secondary border-secondary/50 glow-secondary'
                : 'bg-surface-container-lowest hover:bg-surface-container border-outline-variant/35 text-slate-400 hover:text-primary hover:border-primary/50'
            }`}
          >
            <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
            <span>{favorite ? 'QUITAR EXPEDIENTE' : 'ARCHIVAR EN FAVORITOS'}</span>
          </button>
        </div>

        {/* LADO DERECHO: Expediente técnico */}
        <div className="md:col-span-2 space-y-6">
          {/* Cabecera */}
          <div className="glass-panel p-6 rounded-2xl border-outline-variant/35 shadow-sm space-y-2">
            <div className="flex items-center space-x-2 text-[10px] font-bold text-primary">
              <Beaker className="h-4 w-4" />
              <span className="tracking-widest">EXPEDIENTE: {character.name.toUpperCase()}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold font-display text-slate-100 tracking-wide uppercase leading-tight">
              DESIGNACIÓN: <span className="text-primary">{character.name}</span>
            </h1>
            <div className="flex items-center space-x-2 text-[8px] font-mono text-slate-500">
              <Database className="h-3 w-3" />
              <span>HUB_SD &gt; BASE_DATOS &gt; IDENT_{character.name.replace(' ', '_').toUpperCase()}</span>
            </div>
          </div>

          {/* Fichas Técnicas Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Caja 1: Estado */}
            <div className="glass-panel p-4 rounded-xl border-outline-variant/20 flex items-center space-x-4">
              <div className={`p-3 rounded-full bg-surface-container-lowest border ${character.status === 'Alive' ? 'border-primary/30 text-primary' : character.status === 'Dead' ? 'border-error/30 text-error' : 'border-slate-700 text-slate-400'}`}>
                <Activity className="h-5 w-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Estado Actual</span>
                <span className="text-sm font-bold text-slate-150 block">{character.status === 'Alive' ? 'Vivo' : character.status === 'Dead' ? 'Muerto' : 'Desconocido'}</span>
                <span className="text-[8px] text-slate-500 block">Sincronización Biométrica: POSITIVA</span>
              </div>
            </div>

            {/* Caja 2: Especie */}
            <div className="glass-panel p-4 rounded-xl border-outline-variant/20 flex items-center space-x-4">
              <div className="p-3 rounded-full bg-surface-container-lowest border border-outline-variant/35 text-slate-400">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Tipo Biológico</span>
                <span className="text-sm font-bold text-slate-150 block">{character.species}</span>
                <span className="text-[8px] text-slate-500 block">Género: {character.gender.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Origen Espacial */}
          <div className="glass-panel p-5 rounded-xl border-outline-variant/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Origen Espacial</span>
              <h4 className="text-sm font-bold text-slate-200">{character.origin.name}</h4>
              <p className="text-[9px] text-slate-400">Ubicación actual: {character.location.name}</p>
            </div>
            <div className="flex items-center space-x-2 text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-md shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              <span>REGISTROS CIUDADELA: CONFIRMADO</span>
            </div>
          </div>

          {/* Registro de Apariciones */}
          <div className="glass-panel p-6 rounded-xl border-outline-variant/20 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-outline-variant/15 pb-3">
              <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                <Film className="h-4.5 w-4.5 text-primary" />
                <span>Registro Apariciones</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400">ENTRADAS_TOTALES: {character.episode.length}</span>
            </div>

            {isLoadingEpisodes ? (
              <div className="space-y-2">
                <Skeleton variant="text" className="w-full h-8" />
                <Skeleton variant="text" className="w-full h-8" />
              </div>
            ) : episodes && episodes.length > 0 ? (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {episodes.map((ep) => (
                  <Link
                    key={ep.id}
                    to={`/episode/${ep.id}`}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-outline-variant/15 hover:border-primary/40 bg-surface-container-lowest/30 hover:bg-surface-container/50 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/15">
                        {ep.episode.replace('S', 'T')}
                      </span>
                      <span className="text-[11px] font-bold text-slate-300 group-hover:text-primary transition-colors">
                        {ep.name}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">{ep.air_date}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No se encontraron crónicas galácticas en caché.</p>
            )}
          </div>

          {/* C-137 Stats Medidores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Intelecto */}
            <div className="glass-panel p-4 rounded-xl border-outline-variant/15 space-y-2 text-center">
              <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider block">Cociente Intelectual</span>
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden border border-outline-variant/10 mt-2">
                <div className="h-full bg-tertiary glow-tertiary" style={{ width: `${character.intellect.val}%` }} />
              </div>
              <span className="text-[10px] font-bold text-tertiary block mt-1">{character.intellect.label}</span>
            </div>

            {/* Alineación */}
            <div className="glass-panel p-4 rounded-xl border-outline-variant/15 space-y-2 text-center">
              <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider block">Alineación Moral</span>
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden border border-outline-variant/10 mt-2">
                <div className="h-full bg-secondary glow-secondary" style={{ width: `${character.alignment.val}%` }} />
              </div>
              <span className="text-[10px] font-bold text-secondary block mt-1">{character.alignment.label}</span>
            </div>

            {/* Energía Portal */}
            <div className="glass-panel p-4 rounded-xl border-outline-variant/15 space-y-2 text-center">
              <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider block">Uso Energía Portal</span>
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden border border-outline-variant/10 mt-2">
                <div className="h-full bg-primary glow-primary" style={{ width: `${character.portalEnergy.val}%` }} />
              </div>
              <span className="text-[10px] font-bold text-primary block mt-1">{character.portalEnergy.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default CharacterDetailPage;
