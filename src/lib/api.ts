import { getCached, setCache } from './cache';
import type { BibleTranslation, ChapterContent } from '../types';

const API_BASE = 'https://api.scripture.api.bible/v1';

// Preferred translations shown first (if available), then all others
const PREFERRED_ABBRS = ['ESV', 'CSB', 'NIV', 'KJV', 'NLT'];

function getApiKey(): string {
  return localStorage.getItem('bible-app-api-key') || '';
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

export function setApiKey(key: string): void {
  localStorage.setItem('bible-app-api-key', key.trim());
  // Clear cached translations so they get re-fetched with new key
  localStorage.removeItem('bible-app-translations');
}

async function apiFetch(endpoint: string): Promise<any> {
  const key = getApiKey();
  if (!key) throw new Error('No API key configured');

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'api-key': key },
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error('Invalid API key. Please check your key and try again.');
  }
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch available translations — preferred ones first, then all others.
 * Results are cached in localStorage.
 */
export async function fetchTranslations(): Promise<BibleTranslation[]> {
  const cached = localStorage.getItem('bible-app-translations');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      /* fall through */
    }
  }

  const data = await apiFetch('/bibles?language=eng');
  const bibles = data.data as any[];

  // Build full list of translations
  const all: BibleTranslation[] = bibles.map((b: any) => ({
    id: b.id,
    abbreviation: (b.abbreviationLocal || b.abbreviation || b.id).toUpperCase(),
    name: b.name || b.nameLocal || b.abbreviation,
    description: b.description,
  }));

  // Deduplicate by abbreviation (keep first occurrence)
  const seen = new Set<string>();
  const unique = all.filter((t) => {
    if (seen.has(t.abbreviation)) return false;
    seen.add(t.abbreviation);
    return true;
  });

  // Sort: preferred translations first (in order), then alphabetical
  const preferred: BibleTranslation[] = [];
  const rest: BibleTranslation[] = [];

  for (const t of unique) {
    const prefIndex = PREFERRED_ABBRS.indexOf(t.abbreviation);
    if (prefIndex !== -1) {
      preferred[prefIndex] = t;
    } else {
      rest.push(t);
    }
  }

  rest.sort((a, b) => a.abbreviation.localeCompare(b.abbreviation));
  const translations = [...preferred.filter(Boolean), ...rest];

  if (translations.length > 0) {
    localStorage.setItem('bible-app-translations', JSON.stringify(translations));
  }

  return translations;
}

/**
 * Fetch a chapter's content. Aggressively cached in IndexedDB —
 * after first fetch, works instantly (and offline).
 */
export async function fetchChapter(
  translationId: string,
  bookId: string,
  chapter: number
): Promise<ChapterContent> {
  const cacheKey = `ch:${translationId}:${bookId}.${chapter}`;

  const cached = await getCached(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const chapterId = `${bookId}.${chapter}`;
  const data = await apiFetch(
    `/bibles/${translationId}/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=true`
  );

  const result: ChapterContent = {
    translationId,
    bookId,
    chapter,
    content: data.data.content,
    copyright: data.data.copyright,
  };

  await setCache(cacheKey, JSON.stringify(result));
  return result;
}

/**
 * Validate an API key by making a lightweight request.
 */
export async function validateApiKey(key: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/bibles?language=eng`, {
      headers: { 'api-key': key.trim() },
    });
    return response.ok;
  } catch {
    return false;
  }
}
