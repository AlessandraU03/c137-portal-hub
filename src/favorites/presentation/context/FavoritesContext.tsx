import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFavorites, saveFavorites } from '../../data/favorites.storage';

interface FavoritesContextType {
  favorites: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const addFavorite = (id: number) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      saveFavorites(updated);
      return updated;
    });
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((favId) => favId !== id);
      saveFavorites(updated);
      return updated;
    });
  };

  const isFavorite = (id: number) => {
    return favorites.includes(id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
