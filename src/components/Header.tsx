import type { BibleTranslation } from '../types';
import { getBookById } from '../data/books';

interface Props {
  bookId: string;
  chapter: number;
  translation: BibleTranslation | null;
  onOpenBookSelector: () => void;
  onOpenTranslationSelector: () => void;
  onOpenBookmarks: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export default function Header({
  bookId,
  chapter,
  translation,
  onOpenBookSelector,
  onOpenTranslationSelector,
  onOpenBookmarks,
  isDark,
  onToggleDark,
}: Props) {
  const book = getBookById(bookId);
  const bookName = book?.name ?? bookId;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Book/Chapter - tappable */}
        <button
          onClick={onOpenBookSelector}
          className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition min-w-0"
        >
          <span className="truncate">
            {bookName} {chapter}
          </span>
          <svg
            className="w-4 h-4 flex-shrink-0 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Right-side controls */}
        <div className="flex items-center gap-1">
          {/* Translation selector */}
          <button
            onClick={onOpenTranslationSelector}
            className="px-2.5 py-1.5 text-sm font-bold rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900 transition"
          >
            {translation?.abbreviation ?? '...'}
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Bookmarks"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
