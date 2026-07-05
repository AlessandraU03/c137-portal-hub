import { useQuery } from '@tanstack/react-query';
import { getCharacterById } from '../../data/characters.api';
import { mapCharacterToVM } from '../../data/characters.mapper';

export function useCharacterDetail(id: number) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => getCharacterById(id),
    select: mapCharacterToVM,
    enabled: !!id && !isNaN(id),
  });
}
export default useCharacterDetail;
