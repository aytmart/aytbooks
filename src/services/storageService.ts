import { Bookmark, BookNote, ReadingProgress, ReadingSettings } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'ayt_books_settings_v1',
  PROGRESS_PREFIX: 'ayt_books_progress_',
  BOOKMARKS: 'ayt_books_bookmarks_v1',
  NOTES: 'ayt_books_notes_v1',
  OFFLINE_BOOKS: 'ayt_books_offline_ids_v1',
  LAST_READ_BOOK: 'ayt_books_last_read_id',
};

export const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 18,
  lineHeight: 1.8,
  fontFamily: 'Noto Serif Bengali',
  theme: 'sepia',
  pageSpread: 'double',
  autoPageTurn: false,
  soundEffects: true,
  reducedMotion: false,
  tableAmbientLighting: true,
  ambientSound: 'none',
};

export const StorageService = {
  getSettings(): ReadingSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: ReadingSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  },

  getProgress(bookId: string): ReadingProgress | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS_PREFIX + bookId);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveProgress(progress: ReadingProgress) {
    try {
      localStorage.setItem(
        STORAGE_KEYS.PROGRESS_PREFIX + progress.bookId,
        JSON.stringify(progress)
      );
      localStorage.setItem(STORAGE_KEYS.LAST_READ_BOOK, progress.bookId);
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  },

  getLastReadBookId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_READ_BOOK);
    } catch {
      return null;
    }
  },

  getAllProgress(): Record<string, ReadingProgress> {
    const map: Record<string, ReadingProgress> = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEYS.PROGRESS_PREFIX)) {
          const bookId = key.replace(STORAGE_KEYS.PROGRESS_PREFIX, '');
          const val = localStorage.getItem(key);
          if (val) {
            map[bookId] = JSON.parse(val);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to get all progress:', e);
    }
    return map;
  },

  getBookmarks(bookId?: string): Bookmark[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      const list: Bookmark[] = data ? JSON.parse(data) : [];
      return bookId ? list.filter((b) => b.bookId === bookId) : list;
    } catch {
      return [];
    }
  },

  addBookmark(bookmark: Bookmark) {
    try {
      const list = this.getBookmarks();
      const filtered = list.filter(
        (b) => !(b.bookId === bookmark.bookId && b.pageNumber === bookmark.pageNumber)
      );
      filtered.unshift(bookmark);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered));
    } catch (e) {
      console.warn('Failed to add bookmark:', e);
    }
  },

  removeBookmark(bookId: string, pageNumber: number) {
    try {
      const list = this.getBookmarks().filter(
        (b) => !(b.bookId === bookId && b.pageNumber === pageNumber)
      );
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to remove bookmark:', e);
    }
  },

  isPageBookmarked(bookId: string, pageNumber: number): boolean {
    const list = this.getBookmarks(bookId);
    return list.some((b) => b.pageNumber === pageNumber);
  },

  getNotes(bookId?: string): BookNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      const list: BookNote[] = data ? JSON.parse(data) : [];
      return bookId ? list.filter((n) => n.bookId === bookId) : list;
    } catch {
      return [];
    }
  },

  saveNote(note: BookNote) {
    try {
      const list = this.getNotes().filter((n) => n.id !== note.id);
      list.unshift(note);
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save note:', e);
    }
  },

  getOfflineBookIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OFFLINE_BOOKS);
      return data ? JSON.parse(data) : ['ayt_books_1', 'who_is_creator']; // Pre-cached default
    } catch {
      return ['ayt_books_1', 'who_is_creator'];
    }
  },

  toggleOfflineBook(bookId: string): boolean {
    try {
      const ids = this.getOfflineBookIds();
      const isSaved = ids.includes(bookId);
      const updated = isSaved ? ids.filter((id) => id !== bookId) : [...ids, bookId];
      localStorage.setItem(STORAGE_KEYS.OFFLINE_BOOKS, JSON.stringify(updated));
      return !isSaved;
    } catch {
      return false;
    }
  },

  isBookOffline(bookId: string): boolean {
    return this.getOfflineBookIds().includes(bookId);
  },
};
