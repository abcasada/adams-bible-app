import { useState, useEffect, useCallback } from 'react';
import type { BibleTranslation, ChapterContent, Bookmark } from './types';
import { getBookById, getNextChapter, getPrevChapter } from './data/books';
import { hasApiKey, fetchTranslations, fetchChapter } from './lib/api';
import { useDarkMode } from './hooks/useDarkMode';
import { useBookmarks } from './hooks/useBookmarks';

import ApiKeySetup from './components/ApiKeySetup';
import Header from './components/Header';
import BibleReader from './components/BibleReader';
import BookChapterSelector from './components/BookChapterSelector';
import TranslationSelector from './components/TranslationSelector';
import BookmarkPanel from './components/BookmarkPanel';
import ChapterNav from './components/ChapterNav';

const LAST_LOC_KEY = 'bible-app-last-location';

interface LastLocation {
  bookId: string;
  chapter: number;
  translationId: string;
  translationAbbr: string;
}

function loadLastLocation(): LastLocation {
  try {
    const raw = localStorage.getItem(LAST_LOC_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through */
  }
  return { bookId: 'JHN', chapter: 1, translationId: '', translationAbbr: 'KJV' };
}

function saveLastLocation(loc: LastLocation) {
  localStorage.setItem(LAST_LOC_KEY, JSON.stringify(loc));
}

export default function App() {
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { bookmarks, addBookmark, updateBookmark, deleteBookmark, autoAdvance } = useBookmarks();

  // Setup state
  const [apiKeyReady, setApiKeyReady] = useState(hasApiKey());

  // Navigation state
  const lastLoc = loadLastLocation();
  const [bookId, setBookId] = useState(lastLoc.bookId);
  const [chapter, setChapter] = useState(lastLoc.chapter);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  // Translation state
  const [translations, setTranslations] = useState<BibleTranslation[]>([]);
  const [currentTranslation, setCurrentTranslation] = useState<BibleTranslation | null>(null);

  // Content state
  const [content, setContent] = useState<ChapterContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI panels
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showTranslationSelector, setShowTranslationSelector] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);

  // Active bookmark tracking (for auto-advance)
  const [activeBookmarkId, setActiveBookmarkId] = useState<string | null>(null);

  // Load translations on API key ready
  useEffect(() => {
    if (!apiKeyReady) return;

    fetchTranslations()
      .then((t) => {
        setTranslations(t);
        const saved = loadLastLocation();
        const match =
          t.find((tr) => tr.id === saved.translationId) ||
          t.find((tr) => tr.abbreviation === saved.translationAbbr) ||
          t[0];
        if (match) {
          setCurrentTranslation(match);
        }
      })
      .catch((err) => {
        console.error('Failed to load translations:', err);
        setError('Failed to load translations. Check your API key.');
      });
  }, [apiKeyReady]);

  // Load chapter content
  useEffect(() => {
    if (!currentTranslation) return;

    setLoading(true);
    setError(null);
    setSelectedVerse(null);

    fetchChapter(currentTranslation.id, bookId, chapter)
      .then((data) => {
        setContent(data);
        setLoading(false);
        saveLastLocation({
          bookId,
          chapter,
          translationId: currentTranslation.id,
          translationAbbr: currentTranslation.abbreviation,
        });
      })
      .catch((err) => {
        console.error('Failed to load chapter:', err);
        setError(err.message || 'Failed to load chapter.');
        setLoading(false);
      });
  }, [bookId, chapter, currentTranslation]);

  const navigateTo = useCallback(
    (newBookId: string, newChapter: number) => {
      if (activeBookmarkId) {
        autoAdvance(activeBookmarkId, newBookId, newChapter);
      }
      setBookId(newBookId);
      setChapter(newChapter);
    },
    [activeBookmarkId, autoAdvance]
  );

  const goNext = useCallback(() => {
    const next = getNextChapter(bookId, chapter);
    if (next) navigateTo(next.bookId, next.chapter);
  }, [bookId, chapter, navigateTo]);

  const goPrev = useCallback(() => {
    const prev = getPrevChapter(bookId, chapter);
    if (prev) navigateTo(prev.bookId, prev.chapter);
  }, [bookId, chapter, navigateTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (!showBookSelector && !showBookmarks && !showTranslationSelector) {
          e.preventDefault();
          goNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (!showBookSelector && !showBookmarks && !showTranslationSelector) {
          e.preventDefault();
          goPrev();
        }
      } else if (e.key === 'Escape') {
        setShowBookSelector(false);
        setShowTranslationSelector(false);
        setShowBookmarks(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, showBookSelector, showBookmarks, showTranslationSelector]);

  const handleBookChapterSelect = (newBookId: string, newChapter: number) => {
    setBookId(newBookId);
    setChapter(newChapter);
    setActiveBookmarkId(null);
    setShowBookSelector(false);
  };

  const handleTranslationSelect = (translation: BibleTranslation) => {
    setCurrentTranslation(translation);
    setShowTranslationSelector(false);
  };

  const handleBookmarkNavigate = (
    bmBookId: string,
    bmChapter: number,
    bmTranslationId: string,
    bmTranslationAbbr: string,
    bmId?: string
  ) => {
    const t =
      translations.find((tr) => tr.id === bmTranslationId) ||
      translations.find((tr) => tr.abbreviation === bmTranslationAbbr);
    if (t) setCurrentTranslation(t);
    setBookId(bmBookId);
    setChapter(bmChapter);
    setActiveBookmarkId(bmId ?? null);
    setShowBookmarks(false);
  };

  const handleAddBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => {
    addBookmark(bookmark);
  };

  const handleVerseClick = useCallback((verse: number) => {
    setSelectedVerse((prev) => (prev === verse ? null : verse));
  }, []);

  if (!apiKeyReady) {
    return <ApiKeySetup onComplete={() => setApiKeyReady(true)} />;
  }

  const book = getBookById(bookId);
  const totalChapters = book?.chapters ?? 1;
  const prev = getPrevChapter(bookId, chapter);
  const next = getNextChapter(bookId, chapter);

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Header
        bookId={bookId}
        chapter={chapter}
        translation={currentTranslation}
        onOpenBookSelector={() => setShowBookSelector(true)}
        onOpenTranslationSelector={() => setShowTranslationSelector(true)}
        onOpenBookmarks={() => setShowBookmarks(true)}
        isDark={isDark}
        onToggleDark={toggleDark}
      />

      <BibleReader
        content={content}
        loading={loading}
        error={error}
        selectedVerse={selectedVerse}
        onVerseClick={handleVerseClick}
      />

      <ChapterNav
        bookId={bookId}
        chapter={chapter}
        totalChapters={totalChapters}
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={!!prev}
        hasNext={!!next}
      />

      {showBookSelector && (
        <BookChapterSelector
          currentBookId={bookId}
          currentChapter={chapter}
          onSelect={handleBookChapterSelect}
          onClose={() => setShowBookSelector(false)}
        />
      )}

      {showTranslationSelector && (
        <TranslationSelector
          translations={translations}
          current={currentTranslation}
          onSelect={handleTranslationSelect}
          onClose={() => setShowTranslationSelector(false)}
        />
      )}

      {showBookmarks && (
        <BookmarkPanel
          bookmarks={bookmarks}
          currentBookId={bookId}
          currentChapter={chapter}
          currentVerse={selectedVerse ?? undefined}
          currentTranslation={currentTranslation}
          onNavigate={handleBookmarkNavigate}
          onAdd={handleAddBookmark}
          onUpdate={updateBookmark}
          onDelete={deleteBookmark}
          onClose={() => setShowBookmarks(false)}
        />
      )}
    </div>
  );
}
