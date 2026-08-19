export type ShelfId = 'islamic' | 'kids' | 'education' | 'life';

export interface Category {
  id: ShelfId;
  name: string;
  nameEn: string;
  icon: string;
  badgeBg: string;
  badgeText: string;
  pillColor: string;
  desc: string;
}

export interface StoryChapter {
  id?: string;
  number?: string | number;
  title: string;
  subtitle?: string;
  content: string[];
  lesson?: string;
  actionItem?: string;
  quranVerse?: string;
}

export interface Book {
  id: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  author: string;
  editor?: string;
  publisher: string;
  category: ShelfId;
  language: string;
  pages: number;
  isbn?: string;
  edition?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating?: number;
  coverColor: string;
  coverAccent: string;
  coverImage?: string;
  summary: string;
  tags: string[];
  featured?: boolean;
  isBestseller?: boolean;
  isNewRelease?: boolean;
  isFree?: boolean;
  hasHardcopy?: boolean;
  tableOfContents?: string[];
  chapters?: StoryChapter[];
  pdfUrl?: string;
  specialType?: 'pregnancy_routine' | 'story_collection' | 'theological_guide' | 'standard';
}

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarIcon: string;
  bookCount: number;
  phone?: string;
}

export interface DailyRoutineItem {
  time: string;
  activity: string;
  childCoordination: string;
  category: 'prayer' | 'diet' | 'rest' | 'study';
}
