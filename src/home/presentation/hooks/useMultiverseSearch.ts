import { useQuery } from '@tanstack/react-query';
import { getCharacters } from '../../../characters/data/characters.api';
import { mapCharacterToVM } from '../../../characters/data/characters.mapper';
import { mapLocationToVM } from '../../../locations/data/locations.mapper';
import { clientFetch } from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type { Location } from '../../../locations/domain/location.types';
import type { Episode } from '../../../episodes/domain/episode.types';

interface MultiverseSearchFilters {
  query: string;
}

export function useMultiverseSearch(filters: MultiverseSearchFilters) {
  const query = filters.query.trim();

  // Búsqueda paralela de personajes (sin debouncing)
  const charactersQuery = useQuery({
    queryKey: ['search-characters', query],
    queryFn: () => getCharacters(1, { name: query }),
    select: (data) => ({
      ...data,
      results: data.results.map(mapCharacterToVM),
    }),
    enabled: query.length > 0,
  });

  // Búsqueda paralela de dimensiones/ubicaciones
  const locationsQuery = useQuery({
    queryKey: ['search-locations', query],
    queryFn: async () => {
      const params = new URLSearchParams({ name: query });
      try {
        return await clientFetch<ApiResponse<Location>>(`/location/?${params.toString()}`);
      } catch (error: any) {
        if (error.message && error.message.includes('404')) {
          return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
        }
        throw error;
      }
    },
    select: (data) => ({
      ...data,
      results: data.results.map(mapLocationToVM),
    }),
    enabled: query.length > 0,
  });

  // Búsqueda paralela de episodios
  const episodesQuery = useQuery({
    queryKey: ['search-episodes', query],
    queryFn: async () => {
      const params = new URLSearchParams({ name: query });
      try {
        return await clientFetch<ApiResponse<Episode>>(`/episode/?${params.toString()}`);
      } catch (error: any) {
        if (error.message && error.message.includes('404')) {
          return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
        }
        throw error;
      }
    },
    enabled: query.length > 0,
  });

  const isLoading =
    (charactersQuery.isLoading && query.length > 0) ||
    (locationsQuery.isLoading && query.length > 0) ||
    (episodesQuery.isLoading && query.length > 0);

  const isError = charactersQuery.isError || locationsQuery.isError || episodesQuery.isError;

  return {
    characters: charactersQuery.data?.results || [],
    locations: locationsQuery.data?.results || [],
    episodes: episodesQuery.data?.results || [],
    isLoading,
    isError,
    refetch: () => {
      charactersQuery.refetch();
      locationsQuery.refetch();
      episodesQuery.refetch();
    },
  };
}
