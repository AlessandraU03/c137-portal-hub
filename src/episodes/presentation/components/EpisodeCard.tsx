import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Episode } from '../../domain/episode.types';
import { MessageSquare, Heart, Star, Settings, Film, Calendar, ArrowRight, ShieldAlert } from 'lucide-react';

interface EpisodeCardProps {
  episode: Episode;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  const navigate = useNavigate();

  // Mapeamos descripciones reales para los primeros episodios para que coincidan con los mockups
  const getEpisodeDescription = (id: number) => {
    switch (id) {
      case 1:
        return 'Rick se muda con la familia de su hija y se establece como una mala influencia para su nieto Morty.';
      case 2:
        return 'Rick construye un dispositivo para que Snuffles sea más inteligente, pero el perro toma el control de la casa.';
      case 3:
        return 'Morty es encogido y enviado al cuerpo de un vagabundo disfrazado de Santa Claus para salvar el Parque Anatómico.';
      case 4:
        return 'Rick y Morty están atrapados en una serie de simulaciones creadas por alienígenas estafadores.';
      case 5:
        return 'Rick le da a la familia una caja que invoca a los Meeseeks para ayudarlos con sus tareas cotidianas.';
      default:
        return 'Registro de anomalía cronológica detectada. El escáner C-137 está descifrando los sucesos de esta línea temporal.';
    }
  };

  // Mapeamos iconos específicos basados en la temática del episodio (Mockup Image 1)
  const getEpisodeIcon = (id: number) => {
    switch (id) {
      case 1:
        return MessageSquare;
      case 2:
        return ShieldAlert; // Paw print fallback/temático
      case 3:
        return Heart; // Anatomy box fallback
      case 4:
        return Star;
      case 5:
        return Settings;
      default:
        return Film;
    }
  };

  const IconComponent = getEpisodeIcon(episode.id);

  return (
    <div
      onClick={() => navigate(`/episode/${episode.id}`)}
      className="group glass-panel p-5 rounded-xl border-outline-variant/35 hover:border-primary/60 hover:bg-surface-container/80 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:shadow-primary/5 hover:shadow-md"
    >
      {/* Left side info */}
      <div className="flex items-start md:items-center space-x-4 flex-1">
        {/* Episode Index */}
        <span className="font-mono text-xs font-bold text-slate-500 w-8 shrink-0">
          #{episode.id.toString().padStart(2, '0')}
        </span>

        {/* Custom Icon Box */}
        <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-slate-450 group-hover:text-primary group-hover:border-primary/30 transition-colors">
          <IconComponent className="h-5 w-5" />
        </div>

        {/* Title and Summary */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h3 className="font-extrabold text-sm text-slate-100 font-display group-hover:text-primary transition-colors line-clamp-1">
              {episode.name}
            </h3>
            <span className="text-[9px] font-mono font-bold bg-secondary/15 text-secondary border border-secondary/20 px-2 py-0.5 rounded uppercase">
              {episode.episode.replace('S', 'T')}
            </span>
          </div>
          <p className="text-[10px] font-sans text-slate-400 line-clamp-1 leading-relaxed max-w-2xl">
            {getEpisodeDescription(episode.id)}
          </p>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center justify-between md:justify-end space-x-6 border-t border-outline-variant/10 md:border-t-0 pt-3 md:pt-0 shrink-0 font-mono">
        <div className="flex items-center space-x-1.5 text-[10px] text-slate-450">
          <Calendar className="h-3.5 w-3.5" />
          <span>{episode.air_date.toUpperCase()}</span>
        </div>
        <button className="bg-surface-container-lowest group-hover:bg-primary border border-outline-variant/35 group-hover:border-primary text-slate-400 group-hover:text-on-primary font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1 hover:scale-103 cursor-pointer">
          <span>Detalles</span>
          <ArrowRight className="h-3 w-3 stroke-[2.5px]" />
        </button>
      </div>
    </div>
  );
};
export default EpisodeCard;
