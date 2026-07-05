import { clientFetch } from '../../shared/api/client';
import type { ApiResponse } from '../../shared/types/api';
import type { Episode } from '../domain/episode.types';

export async function getEpisodes(
  page: number,
  filters?: { name?: string; episode?: string }
): Promise<ApiResponse<Episode>> {
  try {
    const params = new URLSearchParams({ page: page.toString() });
    if (filters?.name) params.append('name', filters.name);
    if (filters?.episode) params.append('episode', filters.episode);

    return await clientFetch<ApiResponse<Episode>>(`/episode?${params.toString()}`);
  } catch (error: any) {
    if (error.message && error.message.includes('404')) {
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
    }
    throw error;
  }
}

export async function getEpisodeById(id: number): Promise<Episode> {
  return clientFetch<Episode>(`/episode/${id}`);
}

export async function getEpisodesByIds(ids: number[]): Promise<Episode[]> {
  if (ids.length === 0) return [];
  try {
    const response = await clientFetch<Episode | Episode[]>(`/episode/${ids.join(',')}`);
    return Array.isArray(response) ? response : [response];
  } catch (error: any) {
    if (error.message && error.message.includes('404')) {
      return [];
    }
    throw error;
  }
}
