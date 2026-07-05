import { useQuery } from '@tanstack/react-query';
import { getCharacters, getCharactersByIds } from '../../data/characters.api';
import type { CharacterFilters } from '../../domain/character.types';

export function useCharactersList(page: number, filters: CharacterFilters) {
  return useQuery({
    queryKey: ['characters', page, filters],
    queryFn: () => getCharacters(page, filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useCharactersByIds(ids: number[]) {
  return useQuery({
    queryKey: ['characters-by-ids', ids],
    queryFn: () => getCharactersByIds(ids),
    enabled: ids.length > 0,
  });
}
export default useCharactersList;
