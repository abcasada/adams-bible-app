import { useState, useCallback } from 'react';
import {
  getFavoriteTranslationIds,
  toggleFavoriteTranslation as toggleFav,
} from '../lib/favorites';

export function useFavoriteTranslations() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    getFavoriteTranslationIds()
  );

  const toggleFavorite = useCallback((id: string) => {
    const updated = toggleFav(id);
    setFavoriteIds([...updated]);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  return { favoriteIds, toggleFavorite, isFavorite };
}
