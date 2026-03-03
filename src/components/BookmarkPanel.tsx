import { useState } from 'react';
import type { Bookmark, BibleTranslation } from '../types';
import { getBookById } from '../data/books';

interface Props {
  bookmarks: Bookmark[];
  currentBookId: string;
  currentChapter: number;
  currentVerse?: number;
  currentTranslation: BibleTranslation | null;
  onNavigate: (bookId: string, chapter: number, translationId: string, translationAbbr: string, bookmarkId?: string) => void;
  onAdd: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Bookmark>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function BookmarkPanel({
  bookmarks,
  currentBookId,
  currentChapter,
  currentVerse,
  currentTranslation,
  onNavigate,
  onAdd,
  onUpdate,
  onDelete,
  onClose,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAutoAdvance, setNewAutoAdvance] = useState(false);

  const handleAdd = () => {
    if (!newName.trim() || !currentTranslation) return;
    onAdd({
      name: newName.trim(),
      bookId: currentBookId,
      chapter: currentChapter,
      verse: currentVerse,
      translationId: currentTranslation.id,
      translationAbbr: currentTranslation.abbreviation,
      autoAdvance: newAutoAdvance,
    });
    setNewName('');
    setNewAutoAdvance(false);
    setShowAddForm(false);
  };

  const startEdit = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditName(bookmark.name);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      onUpdate(id, { name: editName.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-sm bg-white dark:bg-slate-800 shadow-xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Bookmarks
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Bookmark list */}
        <div className="flex-1 overflow-y-auto">
          {bookmarks.length === 0 && !showAddForm && (
            <div className="text-center py-12 px-4">
              <div className="text-4xl mb-3">🔖</div>
              <p className="text-slate-400 dark:text-slate-500 text-sm">
                No bookmarks yet. Add one to save your place!
              </p>
            </div>
          )}

          {bookmarks.map((bm) => {
            const book = getBookById(bm.bookId);
            return (
              <div
                key={bm.id}
                className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50"
              >
                {editingId === bm.id ? (
                  <div className="flex gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(bm.id)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(bm.id)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {bm.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                          {book?.name ?? bm.bookId} {bm.chapter}
                          {bm.verse ? `:${bm.verse}` : ''} · {bm.translationAbbr}
                        </p>
                        {bm.autoAdvance && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Auto-advance
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => onNavigate(bm.bookId, bm.chapter, bm.translationId, bm.translationAbbr, bm.id)}
                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => startEdit(bm)}
                        className="px-3 py-1.5 text-slate-500 dark:text-slate-400 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => onUpdate(bm.id, { autoAdvance: !bm.autoAdvance })}
                        className={`px-3 py-1.5 text-sm rounded-lg transition ${
                          bm.autoAdvance
                            ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {bm.autoAdvance ? 'Auto ✓' : 'Auto'}
                      </button>
                      <button
                        onClick={() => onDelete(bm.id)}
                        className="px-3 py-1.5 text-red-500 dark:text-red-400 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Add bookmark */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
          {showAddForm ? (
            <div className="space-y-3">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Bookmark name..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                autoFocus
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Saving: {getBookById(currentBookId)?.name} {currentChapter}
                {currentVerse ? `:${currentVerse}` : ''} · {currentTranslation?.abbreviation}
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAutoAdvance}
                  onChange={(e) => setNewAutoAdvance(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Auto-advance when I navigate chapters
                </span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2.5 rounded-lg transition"
                >
                  Save Bookmark
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewName('');
                  }}
                  className="px-4 py-2.5 text-slate-500 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-blue-600 dark:text-blue-400 font-medium text-sm rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Bookmark
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
