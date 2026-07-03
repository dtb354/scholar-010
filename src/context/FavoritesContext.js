import { createContext, useContext, useEffect, useState } from 'react';
import * as storage from '../storage/storage';

const FavoritesContext = createContext(undefined);

/**
 * Holds the set of favorited spot ids in React state and keeps it in sync with
 * on-device storage, so favorites persist across restarts and stay consistent
 * between the list and detail screens.
 */
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    storage.getFavorites().then(setFavorites);
  }, []);

  const toggle = async (spotId) => {
    const next = await storage.toggleFavorite(spotId);
    setFavorites(next);
  };

  const isFavorite = (spotId) => favorites.includes(spotId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (ctx === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
}
