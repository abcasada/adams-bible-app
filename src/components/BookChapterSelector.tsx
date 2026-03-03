import { useState } from 'react';
import { BIBLE_BOOKS } from '../data/books';
import type { BookMeta } from '../types';

interface Props {
  currentBookId: string;
  currentChapter: number;
  onSelect: (bookId: string, chapter: number) => void;
  onClose: () => void;
}

export default function BookChapterSelector({
  currentBookId,
  currentChapter,
  onSelect,
  onClose,
}: Props) {
  const [selectedBook, setSelectedBook] = useState<BookMeta | null>(
    BIBLE_BOOKS.find((b) => b.id === currentBookId) ?? null
  );
  const [testament, setTestament] = useState<'OT' | 'NT'>(
    BIBLE_BOOKS.find((b) => b.id === currentBookId)?.testament ?? 'OT'
  );

  const otBooks = BIBLE_BOOKS.filter((b) => b.testament === 'OT');
  const ntBooks = BIBLE_BOOKS.filter((b) => b.testament === 'NT');
  const displayedBooks = testament === 'OT' ? otBooks : ntBooks;

  const handleBookClick = (book: BookMeta) => {
    setSelectedBook(book);
    // If book has only 1 chapter, select it immediately
    if (book.chapters === 1) {
      onSelect(book.id, 1);
    }
  };

  const handleChapterClick = (chapter: number) => {
    if (selectedBook) {
      onSelect(selectedBook.id, chapter);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {selectedBook && selectedBook.chapters > 1
            ? `${selectedBook.name} — Select Chapter`
            : 'Select Book'}
        </h2>
        <div className="flex items-center gap-2">
          {selectedBook && selectedBook.chapters > 1 && (
            <button
              onClick={() => setSelectedBook(null)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Books
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chapter grid for selected book */}
      {selectedBook && selectedBook.chapters > 1 ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-w-2xl mx-auto">
            {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(
              (ch) => (
                <button
                  key={ch}
                  onClick={() => handleChapterClick(ch)}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition ${
                    selectedBook.id === currentBookId && ch === currentChapter
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                  }`}
                >
                  {ch}
                </button>
              )
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Testament tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTestament('OT')}
              className={`flex-1 py-3 text-sm font-medium transition ${
                testament === 'OT'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Old Testament
            </button>
            <button
              onClick={() => setTestament('NT')}
              className={`flex-1 py-3 text-sm font-medium transition ${
                testament === 'NT'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              New Testament
            </button>
          </div>

          {/* Book grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-w-2xl mx-auto">
              {displayedBooks.map((book) => (
                <button
                  key={book.id}
                  onClick={() => handleBookClick(book)}
                  className={`px-3 py-3 rounded-lg text-sm font-medium text-left transition ${
                    book.id === currentBookId
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                  }`}
                >
                  {book.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
