const FAVORITES_KEY = 'bible-app-favorite-translations';

export function getFavoriteTranslationIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setFavoriteTranslationIds(ids: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function toggleFavoriteTranslation(id: string): string[] {
  const current = getFavoriteTranslationIds();
  const index = current.indexOf(id);
  if (index === -1) {
    current.push(id);
  } else {
    current.splice(index, 1);
  }
  setFavoriteTranslationIds(current);
  return current;
}

export function isFavoriteTranslation(id: string): boolean {
  return getFavoriteTranslationIds().includes(id);
}
