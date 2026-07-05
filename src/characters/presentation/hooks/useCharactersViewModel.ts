import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCharactersList } from './useCharacters';

export function useCharactersViewModel() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados locales
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Cada vez que cambie el término de búsqueda, volvemos a la página 1
  useEffect(() => {
    setPage(1);
    const params: Record<string, string> = {};
    if (searchTerm) params.search = searchTerm;
    params.page = '1';
    setSearchParams(params);
  }, [searchTerm]);

  // Sincronizamos la paginación con la URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTerm) params.search = searchTerm;
    params.page = page.toString();
    setSearchParams(params);
  }, [page]);

  const { data, isLoading, isError, refetch } = useCharactersList(page, {
    name: searchTerm,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setPage(1);
  };

  const totalPages = data?.info?.pages || 0;

  return {
    searchInput,
    setSearchInput,
    page,
    setPage,
    isLoading,
    isError,
    refetch,
    handleSearchSubmit,
    handleResetFilters,
    totalPages,
    characters: data?.results || [],
  };
}
