const FAVORITES_KEY = 'rick_morty_c137_favorites';

export function getFavorites(): number[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
}

export function saveFavorites(favorites: number[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
}
