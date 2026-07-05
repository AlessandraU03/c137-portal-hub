import { clientFetch } from '../../shared/api/client';
import type { ApiResponse } from '../../shared/types/api';
import type { Character, CharacterFilters } from '../domain/character.types';

export async function getCharacters(page: number, filters?: CharacterFilters): Promise<ApiResponse<Character>> {
  const params = new URLSearchParams();
  params.append('page', page.toString());

  if (filters) {
    if (filters.name) params.append('name', filters.name);
    if (filters.status) params.append('status', filters.status);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.species) params.append('species', filters.species);
  }

  try {
    return await clientFetch<ApiResponse<Character>>(`/character/?${params.toString()}`);
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

export async function getCharacterById(id: number): Promise<Character> {
  return clientFetch<Character>(`/character/${id}`);
}

export async function getCharactersByIds(ids: number[]): Promise<Character[]> {
  if (ids.length === 0) return [];
  try {
    const response = await clientFetch<Character | Character[]>(`/character/${ids.join(',')}`);
    return Array.isArray(response) ? response : [response];
  } catch (error: any) {
    if (error.message && error.message.includes('404')) {
      return [];
    }
    throw error;
  }
}
