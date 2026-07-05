import { useQuery } from '@tanstack/react-query';
import { getEpisodes, getEpisodeById, getEpisodesByIds } from '../../data/episodes.api';

export function useEpisodesList(page: number, filters?: { name?: string; episode?: string }) {
  return useQuery({
    queryKey: ['episodes', page, filters],
    queryFn: () => getEpisodes(page, filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useEpisodeDetail(id: number) {
  return useQuery({
    queryKey: ['episode', id],
    queryFn: () => getEpisodeById(id),
    enabled: !!id && !isNaN(id),
  });
}

export function useEpisodesByIds(ids: number[]) {
  return useQuery({
    queryKey: ['episodes-by-ids', ids],
    queryFn: () => getEpisodesByIds(ids),
    enabled: ids.length > 0,
  });
}
