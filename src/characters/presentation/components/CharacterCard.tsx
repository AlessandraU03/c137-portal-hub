import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Character } from '../../domain/character.types';
import { useFavorites } from '../../../favorites/presentation/hooks/useFavorites';
import { Star, Eye } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(character.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(character.id);
    } else {
      addFavorite(character.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Alive':
        return 'bg-primary text-primary';
      case 'Dead':
        return 'bg-error text-error';
      default:
        return 'bg-slate-500 text-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Alive':
        return 'VIVO';
      case 'Dead':
        return 'MUERTO';
      default:
        return 'DESCONOCIDO';
    }
  };

  return (
    <div
      onClick={() => navigate(`/character/${character.id}`)}
      className="group relative bg-surface-container/60 hover:bg-surface-container-high/85 border border-secondary-container/30 hover:border-primary rounded-xl overflow-hidden shadow-md transition-all duration-300 flex flex-col justify-between h-[440px] cursor-pointer hover:-translate-y-1 hover:shadow-primary/10 hover:shadow-lg"
    >
      {/* Top Header Card Label */}
      <div className="absolute top-3 left-3 z-10 font-mono text-[9px] font-bold bg-surface-container-lowest/80 text-primary border border-primary/30 px-2 py-0.5 rounded uppercase tracking-widest">
        {character.species.split(' ')[0]}
      </div>

      {/* Image Block */}
      <div className="relative aspect-square w-full bg-surface-container-lowest/50 overflow-hidden border-b border-outline-variant/20 flex items-center justify-center">
        <img
          src={character.image}
          alt={character.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Glow Halo behind image on card hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info Block */}
      <div className="p-4 flex-1 flex flex-col justify-between font-mono">
        <div>
          {/* Status & Species indicator */}
          <div className="flex items-center justify-between mb-3 text-[10px] font-bold">
            <div className="flex items-center space-x-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${getStatusColor(character.status).split(' ')[0]} animate-pulse`} />
              <span className={getStatusColor(character.status).split(' ')[1]}>
                {getStatusText(character.status)}
              </span>
            </div>
            <span className="text-slate-500">{character.gender.toUpperCase()}</span>
          </div>

          {/* Name & Favorite Star */}
          <div className="flex items-start justify-between gap-2 mb-4">
            <h3 className="font-extrabold text-base text-slate-100 font-display line-clamp-1 group-hover:text-primary transition-colors">
              {character.name}
            </h3>
            <button
              onClick={handleFavoriteClick}
              className={`p-1.5 rounded-full hover:scale-110 active:scale-90 transition-all cursor-pointer ${
                favorite
                  ? 'text-primary bg-primary/10 border border-primary/20'
                  : 'text-slate-500 hover:text-primary hover:bg-primary/5 border border-transparent'
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${favorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Details list */}
          <div className="space-y-2 text-[10px] border-t border-outline-variant/10 pt-3">
            <div>
              <span className="text-slate-500 block uppercase font-bold tracking-wider">Última ubicación</span>
              <span className="text-slate-300 block truncate font-medium">{character.location.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-bold tracking-wider">Especie</span>
              <span className="text-slate-300 block truncate font-medium">{character.species}</span>
            </div>
          </div>
        </div>

        {/* Dossier Action Button */}
        <div className="mt-4 pt-2">
          <div className="w-full bg-surface-container-lowest/80 border border-outline-variant/30 group-hover:border-primary/50 text-slate-300 group-hover:text-primary font-bold text-center text-[10px] py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5">
            <Eye className="h-3 w-3" />
            <span>VER DOSSIER</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CharacterCard;
