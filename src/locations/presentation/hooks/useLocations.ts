import { useQuery } from '@tanstack/react-query';
import { getLocations, getLocationById } from '../../data/locations.api';
import { mapLocationToVM } from '../../data/locations.mapper';

export function useLocationsList(
  page: number,
  filters?: { name?: string; type?: string; dimension?: string }
) {
  return useQuery({
    queryKey: ['locations', page, filters],
    queryFn: () => getLocations(page, filters),
    select: (data) => ({
      ...data,
      results: data.results.map(mapLocationToVM),
    }),
    placeholderData: (previousData) => previousData,
  });
}

export function useLocationDetail(id: number) {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => getLocationById(id),
    select: mapLocationToVM,
    enabled: !!id && !isNaN(id),
  });
}
