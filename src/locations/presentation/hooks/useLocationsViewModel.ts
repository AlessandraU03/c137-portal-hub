import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocationsList } from './useLocations';

export function useLocationsViewModel() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados locales para inputs
  const [nameInput, setNameInput] = useState(searchParams.get('name') || '');

  // Estados de filtros activos
  const [nameFilter, setNameFilter] = useState(searchParams.get('name') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Sincronizar filtros activos con la URL
  useEffect(() => {
    setPage(1);
    const params: Record<string, string> = {};
    if (nameFilter) params.name = nameFilter;
    params.page = '1';
    setSearchParams(params);
  }, [nameFilter]);

  // Sincronizar paginación con la URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (nameFilter) params.name = nameFilter;
    params.page = page.toString();
    setSearchParams(params);
  }, [page]);

  const { data, isLoading, isError, refetch } = useLocationsList(page, {
    name: nameFilter,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameFilter(nameInput);
  };

  const handleResetFilters = () => {
    setNameInput('');
    setNameFilter('');
    setPage(1);
  };

  const totalPages = data?.info?.pages || 0;

  return {
    nameInput,
    setNameInput,
    page,
    setPage,
    isLoading,
    isError,
    refetch,
    handleSearchSubmit,
    handleResetFilters,
    totalPages,
    locations: data?.results || [],
  };
}
