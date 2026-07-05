import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocationDetail } from '../hooks/useLocations';
import { useCharactersByIds } from '../../../characters/presentation/hooks/useCharacters';
import CharacterCard from '../../../characters/presentation/components/CharacterCard';
import Skeleton from '../../../shared/components/Skeleton';
import ErrorState from '../../../shared/components/ErrorState';
import { ArrowLeft, Globe, Users, Cpu } from 'lucide-react';

export const LocationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const locationId = Number(id);

  const { data: location, isLoading, isError, error, refetch } = useLocationDetail(locationId);

  // Extraemos los IDs de los personajes residentes de la ubicación
  const residentIds = React.useMemo(() => {
    if (!location || !location.residents) return [];
    return location.residents.map((url) => {
      const parts = url.split('/');
      return Number(parts[parts.length - 1]);
    });
  }, [location]);

  // Consumimos el listado de residentes de forma agrupada en paralelo
  const { data: residents, isLoading: isLoadingResidents } = useCharactersByIds(residentIds);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton variant="text" className="w-24 h-9" />
        <Skeleton variant="rect" className="w-full h-64 rounded-2xl" />
        <Skeleton variant="rect" className="w-full h-[400px] rounded-xl" />
      </div>
    );
  }

  if (isError || !location) {
    return (
      <ErrorState title="Error al Escanear Núcleo" message={(error as Error)?.message} onRetry={refetch} />
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-mono">
      {/* Botón Regresar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 border border-outline-variant/35 bg-surface-container-lowest/50 text-slate-400 hover:text-primary hover:border-primary/50 font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Regresar</span>
      </button>

      {/* Cabecera / Banner */}
      <div className="relative overflow-hidden glass-panel p-8 rounded-2xl border-primary/20 portal-glow-green min-h-64 flex flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-surface-lowest/95 to-surface-lowest -z-10" />
        <div
          className="absolute inset-0 opacity-20 mix-blend-color-dodge -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${location.banner})` }}
        />

        <div className="flex justify-between items-start">
          <span className={`text-[10px] font-bold bg-surface-container-lowest/70 border px-3 py-1 rounded ${location.color}`}>
            {location.badge}
          </span>
          <span className="text-[10px] font-bold text-error bg-error-container/20 border border-error/20 px-3 py-1 rounded animate-pulse">
            {location.risk}
          </span>
        </div>

        <div className="my-6 space-y-2">
          <span className="text-[10px] text-slate-500 font-bold tracking-widest block uppercase">
            DIMENSIÓN: {location.dimension}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-100 uppercase tracking-wide">
            {location.name}
          </h1>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-slate-400 border-t border-outline-variant/10 pt-4">
          <div className="flex items-center space-x-1.5">
            <Globe className="h-4 w-4 text-slate-500" />
            <span>Tipo Topológico: <span className="font-semibold text-slate-300">{location.type}</span></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Users className="h-4 w-4 text-slate-500" />
            <span>Habitantes Registrados: <span className="font-semibold text-slate-300">{location.residents.length}</span></span>
          </div>
        </div>
      </div>

      {/* Grid de Residentes */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold tracking-widest text-slate-350 uppercase border-b border-outline-variant/15 pb-2">
          Residentes de esta Ubicación
        </h2>

        {isLoadingResidents ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        ) : residents && residents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {residents.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-panel rounded-xl border-outline-variant/20">
            <Cpu className="h-8 w-8 text-slate-500 mx-auto mb-3" />
            <p className="text-xs text-slate-400">
              No se han catalogado firmas de vida permanentes en este plano.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDetailPage;
