import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEpisodesList } from './useEpisodes';

export function useEpisodesViewModel() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados locales para inputs
  const [nameInput, setNameInput] = useState(searchParams.get('name') || '');

  // Estados de filtros activos
  const [nameFilter, setNameFilter] = useState(searchParams.get('name') || '');
  const [episodeFilter, setEpisodeFilter] = useState(searchParams.get('episode') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [sortBy, setSortBy] = useState<'chrono' | 'reverse'>('chrono');

  // Cada vez que cambien los filtros, volvemos a la página 1
  useEffect(() => {
    setPage(1);
    const params: Record<string, string> = {};
    if (nameFilter) params.name = nameFilter;
    if (episodeFilter) params.episode = episodeFilter;
    params.page = '1';
    setSearchParams(params);
  }, [nameFilter, episodeFilter]);

  // Sincronizar paginación con la URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (nameFilter) params.name = nameFilter;
    if (episodeFilter) params.episode = episodeFilter;
    params.page = page.toString();
    setSearchParams(params);
  }, [page]);

  const { data, isLoading, isError, refetch } = useEpisodesList(page, {
    name: nameFilter,
    episode: episodeFilter,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameFilter(nameInput);
  };

  const handleResetFilters = () => {
    setNameInput('');
    setNameFilter('');
    setEpisodeFilter('');
    setPage(1);
  };

  const handleSeasonSelect = (seasonId: 'ALL' | '01' | '02' | '03' | '04') => {
    setPage(1);
    if (seasonId === 'ALL') {
      setEpisodeFilter('');
    } else {
      setEpisodeFilter(`S${seasonId}`);
    }
  };

  const totalPages = data?.info?.pages || 0;

  // Ordenar episodios obtenidos de la API
  const sortedEpisodes = useMemo(() => {
    if (!data?.results) return [];
    const list = [...data.results];
    if (sortBy === 'reverse') {
      list.reverse();
    }
    return list;
  }, [data, sortBy]);

  // Identificar qué temporada está activa basándonos en el filtro
  const activeSeason = useMemo(() => {
    if (!episodeFilter) return 'ALL';
    if (episodeFilter.startsWith('S01')) return '01';
    if (episodeFilter.startsWith('S02')) return '02';
    if (episodeFilter.startsWith('S03')) return '03';
    if (episodeFilter.startsWith('S04')) return '04';
    return 'ALL';
  }, [episodeFilter]);

  return {
    nameInput,
    setNameInput,
    page,
    setPage,
    sortBy,
    setSortBy,
    isLoading,
    isError,
    refetch,
    handleSearchSubmit,
    handleResetFilters,
    handleSeasonSelect,
    totalPages,
    sortedEpisodes,
    activeSeason,
  };
}
