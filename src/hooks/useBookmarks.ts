import { useState, useCallback } from 'react';
import type { Bookmark } from '../types';
import {
  getBookmarks,
  addBookmark as addBm,
  updateBookmark as updateBm,
  deleteBookmark as deleteBm,
  autoAdvanceBookmark,
} from '../lib/bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => getBookmarks());

  const refresh = useCallback(() => {
    setBookmarks(getBookmarks());
  }, []);

  const addBookmark = useCallback(
    (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => {
      const added = addBm(bookmark);
      refresh();
      return added;
    },
    [refresh]
  );

  const updateBookmark = useCallback(
    (id: string, updates: Partial<Bookmark>) => {
      const updated = updateBm(id, updates);
      refresh();
      return updated;
    },
    [refresh]
  );

  const deleteBookmark = useCallback(
    (id: string) => {
      const deleted = deleteBm(id);
      refresh();
      return deleted;
    },
    [refresh]
  );

  const autoAdvance = useCallback(
    (id: string, newBookId: string, newChapter: number) => {
      const updated = autoAdvanceBookmark(id, newBookId, newChapter);
      refresh();
      return updated;
    },
    [refresh]
  );

  return {
    bookmarks,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    autoAdvance,
    refresh,
  };
}
