import type { Character } from '../domain/character.types';

export interface DecoratedCharacter extends Character {
  threatLevel: 'NULO' | 'ALTO' | 'EXTREMO';
  activeScan: string;
  quote: string;
  intellect: { val: number; label: string };
  alignment: { val: number; label: string };
  portalEnergy: { val: number; label: string };
}

export function mapCharacterToVM(character: Character): DecoratedCharacter {
  const name = character.name.toLowerCase();
  
  // Threat level
  let threatLevel: 'NULO' | 'ALTO' | 'EXTREMO' = 'ALTO';
  if (character.status === 'Dead') {
    threatLevel = 'NULO';
  } else if (character.species.toLowerCase().includes('alien')) {
    threatLevel = 'EXTREMO';
  }

  // Quotes
  let quote = '"Viajar por el multiverso es peligroso. Mantén tu arma de portales cargada y no toques los fluidos verdes."';
  if (name.includes('rick')) {
    quote = '"Vivir es arriesgarlo todo; de lo contrario, solo eres un trozo inerte de moléculas ensambladas al azar que flotan hacia donde el universo las lleve."';
  } else if (name.includes('morty')) {
    quote = '"Nadie existe a propósito. Nadie pertenece a ningún lugar. Todos vamos a morir. Ven a ver televisión."';
  } else if (name.includes('summer')) {
    quote = '"¡Ugh! Todo es tan aburrido. Solo quiero ir a otra dimensión y hacer cosas."';
  } else if (name.includes('beth')) {
    quote = '"Soy la hija de Rick Sanchez. Hago cirugía cardíaca en caballos. Soy perfectamente feliz."';
  } else if (name.includes('jerry')) {
    quote = '"Solo quiero que todo vuelva a la normalidad... Y comer galletas sin que nadie me juzgue."';
  }

  // C-137 Stats
  let intellect = { val: 60, label: 'PROMEDIO_GALA' };
  let alignment = { val: 40, label: 'DESCONOCIDO' };
  let portalEnergy = { val: 30, label: 'BAJO_CONSUMO' };

  if (name.includes('rick')) {
    intellect = { val: 100, label: 'FUERA-DE-RANGO' };
    alignment = { val: 75, label: 'CAÓTICO_NEUTRAL' };
    portalEnergy = { val: 95, label: 'NIVELES_CRÍTICOS' };
  } else if (name.includes('morty')) {
    intellect = { val: 35, label: 'ESTÁNDAR_BAJO' };
    alignment = { val: 80, label: 'NEUTRAL_BUENO' };
    portalEnergy = { val: 15, label: 'ESTABLE' };
  } else if (name.includes('jerry')) {
    intellect = { val: 8, label: 'DEFICIENTE' };
    alignment = { val: 50, label: 'NEUTRAL_PASIVO' };
    portalEnergy = { val: 0, label: 'INACTIVO' };
  }

  return {
    ...character,
    threatLevel,
    activeScan: '98.4%',
    quote,
    intellect,
    alignment,
    portalEnergy,
  };
}
