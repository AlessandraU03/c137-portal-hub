import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEpisodeDetail } from '../hooks/useEpisodes';
import { useCharactersByIds } from '../../../characters/presentation/hooks/useCharacters';
import CharacterCard from '../../../characters/presentation/components/CharacterCard';
import Skeleton from '../../../shared/components/Skeleton';
import ErrorState from '../../../shared/components/ErrorState';
import { ArrowLeft, Calendar, Users, Tv } from 'lucide-react';

export const EpisodeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const episodeId = Number(id);

  const { data: episode, isLoading, isError, error, refetch } = useEpisodeDetail(episodeId);

  // Extraemos los IDs de los personajes para consumirlos de forma agrupada (batching)
  const characterIds = React.useMemo(() => {
    if (!episode || !episode.characters) return [];
    return episode.characters.map((url) => {
      const parts = url.split('/');
      return Number(parts[parts.length - 1]);
    });
  }, [episode]);

  // Consumimos el listado relacional de personajes en una sola petición HTTP agrupada
  const { data: characters, isLoading: isLoadingCharacters } = useCharactersByIds(characterIds);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton variant="text" className="w-24 h-9" />
        <div className="space-y-4">
          <Skeleton variant="text" className="w-1/3 h-10" />
          <Skeleton variant="rect" className="w-full h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !episode) {
    return (
      <ErrorState title="Error al Cargar Crónica" message={(error as Error)?.message} onRetry={refetch} />
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-mono">
      {/* Botón de Regreso */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 border border-outline-variant/35 bg-surface-container-lowest/50 text-slate-400 hover:text-primary hover:border-primary/50 font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Regresar</span>
      </button>

      {/* Cabecera del Episodio */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl border-primary/20 portal-glow-green space-y-4">
        <div className="flex items-center space-x-3">
          <Tv className="h-5 w-5 text-primary" />
          <span className="text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded">
            {episode.episode.replace('S', 'T')}
          </span>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-slate-100 uppercase tracking-wide">
            {episode.name}
          </h1>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>Fecha Emisión: <span className="font-semibold text-slate-300">{episode.air_date.toUpperCase()}</span></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Users className="h-4 w-4 text-slate-500" />
              <span>Sujetos Catalogados: <span className="font-semibold text-slate-300">{episode.characters.length}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Personajes Relacionados (Elenco) */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold tracking-widest text-slate-350 uppercase border-b border-outline-variant/15 pb-2">
          Personajes en este Episodio
        </h2>

        {isLoadingCharacters ? (
          // Carga del elenco de personajes
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-surface-container/40 rounded-xl border border-outline-variant/20 overflow-hidden h-[440px] flex flex-col justify-between">
                <Skeleton variant="rect" className="aspect-square w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton variant="text" className="w-16 h-5" />
                  <Skeleton variant="text" className="w-3/4 h-6 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : characters && characters.length > 0 ? (
          // Elenco cargado
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {characters.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No se encontraron sujetos para este registro.</p>
        )}
      </div>
    </div>
  );
};

export default EpisodeDetailPage;
