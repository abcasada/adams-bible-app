import type { Bookmark } from '../types';

const STORAGE_KEY = 'bible-app-bookmarks';

function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: Bookmark[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function getBookmarks(): Bookmark[] {
  return loadBookmarks();
}

export function addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>): Bookmark {
  const bookmarks = loadBookmarks();
  const newBookmark: Bookmark = {
    ...bookmark,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  bookmarks.push(newBookmark);
  saveBookmarks(bookmarks);
  return newBookmark;
}

export function updateBookmark(id: string, updates: Partial<Bookmark>): Bookmark | null {
  const bookmarks = loadBookmarks();
  const index = bookmarks.findIndex((b) => b.id === id);
  if (index === -1) return null;

  bookmarks[index] = {
    ...bookmarks[index],
    ...updates,
    updatedAt: Date.now(),
  };
  saveBookmarks(bookmarks);
  return bookmarks[index];
}

export function deleteBookmark(id: string): boolean {
  const bookmarks = loadBookmarks();
  const filtered = bookmarks.filter((b) => b.id !== id);
  if (filtered.length === bookmarks.length) return false;
  saveBookmarks(filtered);
  return true;
}

/**
 * Auto-advance a bookmark's chapter when the user navigates forward/backward
 * from the bookmarked location.
 */
export function autoAdvanceBookmark(
  id: string,
  newBookId: string,
  newChapter: number
): Bookmark | null {
  const bookmarks = loadBookmarks();
  const bookmark = bookmarks.find((b) => b.id === id);
  if (!bookmark || !bookmark.autoAdvance) return null;

  return updateBookmark(id, {
    bookId: newBookId,
    chapter: newChapter,
    verse: undefined, // Reset verse on chapter change
  });
}
