import { clientFetch } from '../../shared/api/client';
import type { ApiResponse } from '../../shared/types/api';
import type { Location } from '../domain/location.types';

export async function getLocations(
  page: number,
  filters?: { name?: string; type?: string; dimension?: string }
): Promise<ApiResponse<Location>> {
  try {
    const params = new URLSearchParams({ page: page.toString() });
    if (filters?.name) params.append('name', filters.name);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.dimension) params.append('dimension', filters.dimension);

    return await clientFetch<ApiResponse<Location>>(`/location?${params.toString()}`);
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

export async function getLocationById(id: number): Promise<Location> {
  return clientFetch<Location>(`/location/${id}`);
}
