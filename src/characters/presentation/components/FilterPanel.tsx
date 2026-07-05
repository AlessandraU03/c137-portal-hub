import React from 'react';
import type { CharacterStatus, CharacterGender } from '../../domain/character.types';
import { RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  status: CharacterStatus | '';
  setStatus: (status: CharacterStatus | '') => void;
  gender: CharacterGender | '';
  setGender: (gender: CharacterGender | '') => void;
  species: string;
  setSpecies: (species: string) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  status,
  setStatus,
  gender,
  setGender,
  species,
  setSpecies,
  onReset,
}) => {
  const speciesList = [
    { label: 'Humano', value: 'Human' },
    { label: 'Alienígena', value: 'Alien' },
    { label: 'Robot', value: 'Robot' },
    { label: 'Mitológico', value: 'Mythological' },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border-outline-variant/30 space-y-6 font-mono select-none">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center space-x-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
          <span>Escaneo de Filtros</span>
        </h3>
        <button
          onClick={onReset}
          className="text-slate-500 hover:text-primary transition-colors cursor-pointer"
          title="Reiniciar Escáner"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* ESTADO */}
      <div className="space-y-3">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Estado
        </label>
        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
          <button
            onClick={() => setStatus(status === 'Alive' ? '' : 'Alive')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              status === 'Alive'
                ? 'bg-primary/20 text-primary border-primary portal-glow-green'
                : 'bg-surface-container-lowest/50 text-slate-400 border-outline-variant/20 hover:text-slate-200'
            }`}
          >
            Vivo
          </button>
          <button
            onClick={() => setStatus(status === 'Dead' ? '' : 'Dead')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              status === 'Dead'
                ? 'bg-error/20 text-error border-error/50 animate-pulse'
                : 'bg-surface-container-lowest/50 text-slate-400 border-outline-variant/20 hover:text-slate-200'
            }`}
          >
            Muerto
          </button>
          <button
            onClick={() => setStatus(status === 'unknown' ? '' : 'unknown')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              status === 'unknown'
                ? 'bg-secondary/20 text-secondary border-secondary/50'
                : 'bg-surface-container-lowest/50 text-slate-400 border-outline-variant/20 hover:text-slate-200'
            }`}
          >
            Desconocido
          </button>
        </div>
      </div>

      {/* ESPECIE */}
      <div className="space-y-3">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Especie
        </label>
        <div className="space-y-2 text-xs">
          {speciesList.map((item) => {
            const isChecked = species === item.value;
            return (
              <label
                key={item.value}
                className="flex items-center space-x-3 cursor-pointer group text-slate-400 hover:text-slate-200"
              >
                {/* Hexagonal/Square Custom Checkbox */}
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setSpecies(isChecked ? '' : item.value)}
                  className="sr-only"
                />
                <div
                  className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-primary/20 text-primary border-primary portal-glow-green'
                      : 'border-outline-variant/40 bg-surface-container-lowest/50 group-hover:border-slate-500'
                  }`}
                >
                  {isChecked && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </div>
                <span>{item.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* GÉNERO */}
      <div className="space-y-3">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Género
        </label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as CharacterGender | '')}
          className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant/30 bg-surface-container-lowest/50 focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all text-slate-300 cursor-pointer"
        >
          <option value="">Todos los géneros</option>
          <option value="Male">Masculino</option>
          <option value="Female">Femenino</option>
          <option value="Genderless">Sin género</option>
          <option value="unknown">Desconocido</option>
        </select>
      </div>

      {/* REINICIAR ESCÁNER BUTTON */}
      <button
        onClick={onReset}
        className="w-full py-2 bg-surface-container-lowest hover:bg-surface-container hover:text-primary text-slate-300 font-bold text-xs rounded-lg border border-outline-variant/30 hover:border-primary/40 transition-all cursor-pointer"
      >
        REINICIAR ESCÁNER
      </button>
    </div>
  );
};
export default FilterPanel;
