export interface BibleTranslation {
  id: string;
  abbreviation: string;
  name: string;
  description?: string;
}

export interface BookMeta {
  id: string;
  name: string;
  chapters: number;
  testament: 'OT' | 'NT';
}

export interface ChapterContent {
  translationId: string;
  bookId: string;
  chapter: number;
  content: string; // HTML content from API.Bible
  copyright?: string;
}

export interface Bookmark {
  id: string;
  name: string;
  bookId: string;
  chapter: number;
  verse?: number;
  translationId: string;
  translationAbbr: string;
  autoAdvance: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ReadingLocation {
  bookId: string;
  chapter: number;
  verse?: number;
  translationId: string;
  translationAbbr: string;
}
