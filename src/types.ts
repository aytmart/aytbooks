export type ReadingMode = 'table' | 'fullscreen' | 'immersive' | 'vr';

export type LibraryViewState = 'orbit' | 'shelf_focus' | 'table_transition' | 'table_reading' | 'classic_2d';

export type ReaderTheme = 'light' | 'sepia' | 'dark' | 'oled';

export interface BookChapter {
  id: string;
  title: string;
  pageNumber: number;
}

export interface BookPage {
  pageNumber: number;
  chapterTitle?: string;
  headerText?: string;
  content: string;
  hadithRef?: string;
  quranRef?: string;
  verseBengali?: string;
  verseArabic?: string;
  moralQuote?: string;
  imageUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  banglaTitle: string;
  subtitle?: string;
  author: string;
  authorTitle?: string;
  category: string;
  categoryId: string;
  shelfIndex: number; // 0 to 4
  slotIndex: number;  // position on shelf
  coverColor: string;
  accentColor: string;
  spineColor: string;
  height: number;    // variation in size
  thickness: number; // page volume
  pagesCount: number;
  fileSize: string;
  publishedYear: string;
  isbn?: string;
  description: string;
  tags: string[];
  chapters: BookChapter[];
  pages: BookPage[];
  isAvailableOffline?: boolean;
}

export interface BookshelfCategory {
  id: string;
  title: string;
  banglaTitle: string;
  iconName: string;
  shelfColor: string;
  bannerBg: string;
  description: string;
  bookCount: number;
}

export interface ReadingProgress {
  bookId: string;
  currentPage: number;
  totalPages: number;
  percent: number;
  lastReadTime: number;
  completed: boolean;
  timeSpentSeconds: number;
}

export interface Bookmark {
  id: string;
  bookId: string;
  pageNumber: number;
  title: string;
  snippet: string;
  createdAt: number;
}

export interface BookNote {
  id: string;
  bookId: string;
  pageNumber: number;
  text: string;
  createdAt: number;
}

export interface ReadingSettings {
  fontSize: number; // px e.g. 18
  lineHeight: number; // e.g. 1.8
  fontFamily: 'Hind Siliguri' | 'Noto Serif Bengali' | 'system-ui';
  theme: ReaderTheme;
  pageSpread: 'single' | 'double';
  autoPageTurn: boolean;
  soundEffects: boolean;
  reducedMotion: boolean;
  tableAmbientLighting: boolean;
  ambientSound: 'none' | 'rain' | 'library' | 'binaural';
}
