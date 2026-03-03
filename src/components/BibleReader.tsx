import { useEffect, useRef } from 'react';
import type { ChapterContent } from '../types';

interface Props {
  content: ChapterContent | null;
  loading: boolean;
  error: string | null;
  selectedVerse: number | null;
  onVerseClick: (verse: number) => void;
}

export default function BibleReader({
  content,
  loading,
  error,
  selectedVerse,
  onVerseClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top on new chapter
  useEffect(() => {
    containerRef.current?.scrollTo(0, 0);
  }, [content?.bookId, content?.chapter, content?.translationId]);

  // Add click handlers to verse numbers
  useEffect(() => {
    if (!containerRef.current || !content) return;

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      // API.Bible marks verse numbers with data-number attribute or class "v"
      const verseSpan = target.closest('[data-number]') as HTMLElement;
      if (verseSpan) {
        const num = parseInt(verseSpan.getAttribute('data-number') || '', 10);
        if (!isNaN(num)) {
          onVerseClick(num);
        }
      }
    };

    const el = containerRef.current;
    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, [content, onVerseClick]);

  // Highlight selected verse
  useEffect(() => {
    if (!containerRef.current) return;
    const spans = containerRef.current.querySelectorAll('[data-number]');
    spans.forEach((span) => {
      const num = parseInt(span.getAttribute('data-number') || '', 10);
      if (num === selectedVerse) {
        span.classList.add('verse-selected');
      } else {
        span.classList.remove('verse-selected');
      }
    });
  }, [selectedVerse, content]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
          <p className="text-slate-400 text-sm mt-2">
            Try again or check your internet connection.
          </p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-400">Select a book and chapter to start reading.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-3xl mx-auto w-full"
    >
      <div
        className="bible-content prose prose-slate dark:prose-invert prose-lg max-w-none leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
      {content.copyright && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-8 border-t border-slate-200 dark:border-slate-700 pt-4">
          {content.copyright}
        </p>
      )}
    </div>
  );
}
