import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiverseSearch } from './useMultiverseSearch';
import { useCharactersList } from '../../../characters/presentation/hooks/useCharacters';

export function useHomeViewModel() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Traemos los personajes por defecto para el dossier (Rick, Morty, Summer, Meeseeks, Krombopulos)
  const { data: defaultData, isLoading: isLoadingDefault } = useCharactersList(1, {});
  const defaultCharacters = defaultData?.results || [];

  // Hook de búsqueda en todo el multiverso (personajes, ubicaciones, episodios) sin debouncing
  const { characters, locations, episodes, isLoading: isSearching } = useMultiverseSearch({
    query: searchQuery,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
    }
  };

  const handleResetSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const handleExampleClick = (val: string) => {
    setSearchInput(val);
    setSearchQuery(val);
  };

  const hasSearchQuery = searchQuery.length > 0;
  const noResults = hasSearchQuery && characters.length === 0 && locations.length === 0 && episodes.length === 0;

  // Diseñamos los Sujetos Críticos según el mockup (Rick es la carta grande a la izquierda)
  const rickChar = useMemo(() => {
    return defaultCharacters.find((c) => c.name.toLowerCase().includes('rick'));
  }, [defaultCharacters]);

  const otherChars = useMemo(() => {
    return defaultCharacters.filter((c) => !c.name.toLowerCase().includes('rick')).slice(0, 4);
  }, [defaultCharacters]);

  return {
    searchInput,
    setSearchInput,
    searchQuery,
    setSearchQuery,
    isLoadingDefault,
    isSearching,
    characters,
    locations,
    episodes,
    handleSearchSubmit,
    handleResetSearch,
    handleExampleClick,
    hasSearchQuery,
    noResults,
    rickChar,
    otherChars,
    navigate,
  };
}
