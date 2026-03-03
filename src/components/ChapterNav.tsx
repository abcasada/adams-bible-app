import { getBookById } from '../data/books';

interface Props {
  bookId: string;
  chapter: number;
  totalChapters: number;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function ChapterNav({
  bookId,
  chapter,
  totalChapters,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: Props) {
  const book = getBookById(bookId);

  return (
    <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </button>

        <span className="text-sm text-slate-500 dark:text-slate-400">
          {book?.name} — Ch {chapter} of {totalChapters}
        </span>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Next
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
