import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark as BookmarkIcon,
  BookmarkCheck,
  Maximize2,
  Minimize2,
  Sliders,
  ArrowLeft,
  List,
  Sparkles,
  Search,
  BookOpen,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Book, ReadingSettings } from '../../types';
import { soundEngine } from '../../utils/audio';
import { StorageService } from '../../services/storageService';
import confetti from 'canvas-confetti';

interface TableReadingModeProps {
  book: Book;
  currentPage: number;
  onPageChange: (page: number) => void;
  onBackToLibrary: () => void;
  settings: ReadingSettings;
  onUpdateSettings: (settings: Partial<ReadingSettings>) => void;
  onOpenSettingsModal: () => void;
  onOpenTOC: () => void;
}

export const TableReadingMode: React.FC<TableReadingModeProps> = ({
  book,
  currentPage,
  onPageChange,
  onBackToLibrary,
  settings,
  onUpdateSettings,
  onOpenSettingsModal,
  onOpenTOC,
}) => {
  const [turnDirection, setTurnDirection] = useState<'next' | 'prev'>('next');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);

  // Check bookmark status on page change
  useEffect(() => {
    setIsBookmarked(StorageService.isPageBookmarked(book.id, currentPage));
  }, [book.id, currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < book.pagesCount) {
      setTurnDirection('next');
      if (settings.soundEffects) soundEngine.playPageTurn();
      onPageChange(currentPage + 1);
    }
  }, [currentPage, book.pagesCount, settings.soundEffects, onPageChange]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setTurnDirection('prev');
      if (settings.soundEffects) soundEngine.playPageTurn();
      onPageChange(currentPage - 1);
    }
  }, [currentPage, settings.soundEffects, onPageChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'Escape') {
        onBackToLibrary();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage, onBackToLibrary]);

  // Toggle bookmark with confetti milestone
  const handleToggleBookmark = () => {
    if (isBookmarked) {
      StorageService.removeBookmark(book.id, currentPage);
      setIsBookmarked(false);
    } else {
      const pageData = book.pages.find((p) => p.pageNumber === currentPage);
      const snippet = pageData?.content.slice(0, 70) || `পৃষ্ঠা ${currentPage}`;
      StorageService.addBookmark({
        id: `${book.id}_${currentPage}_${Date.now()}`,
        bookId: book.id,
        pageNumber: currentPage,
        title: pageData?.chapterTitle || book.banglaTitle,
        snippet: snippet + '...',
        createdAt: Date.now(),
      });
      setIsBookmarked(true);
      confetti({
        particleCount: 35,
        spread: 45,
        origin: { y: 0.2, x: 0.85 },
        colors: ['#d4af37', '#f1c40f', '#2ecc71'],
      });
    }
  };

  // Search in book
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const matches: number[] = [];
    book.pages.forEach((p) => {
      if (p.content.toLowerCase().includes(query.toLowerCase()) || p.chapterTitle?.toLowerCase().includes(query.toLowerCase())) {
        matches.push(p.pageNumber);
      }
    });
    setSearchResults(matches);
  };

  // Page data lookup
  const pageData = book.pages.find((p) => p.pageNumber === currentPage) || {
    pageNumber: currentPage,
    content: `[পৃষ্ঠা ${currentPage} এর তথ্য সংরক্ষিত আছে।]`,
  };

  // Theme colors
  const themeStyles = {
    light: {
      bg: 'bg-[#faf6ed]',
      text: 'text-[#1c1917]',
      subtext: 'text-[#57534e]',
      border: 'border-[#e7dec8]',
      pageBg: 'bg-[#fffdfa]',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.4)]',
    },
    sepia: {
      bg: 'bg-[#f4ebd0]',
      text: 'text-[#2c1d11]',
      subtext: 'text-[#6e5d4f]',
      border: 'border-[#dfd0af]',
      pageBg: 'bg-[#fbf4de]',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]',
    },
    dark: {
      bg: 'bg-[#1c1815]',
      text: 'text-[#e6ded5]',
      subtext: 'text-[#9c9287]',
      border: 'border-[#2d2520]',
      pageBg: 'bg-[#15120f]',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.85)]',
    },
    oled: {
      bg: 'bg-[#000000]',
      text: 'text-[#d8d8d8]',
      subtext: 'text-[#888888]',
      border: 'border-[#1a1a1a]',
      pageBg: 'bg-[#080808]',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.95)]',
    },
  }[settings.theme];

  return (
    <div
      id="ayt-table-reader-view"
      className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(ellipse at center 40%, rgba(212, 175, 55, 0.08) 0%, rgba(15, 10, 6, 0.95) 70%), url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Warm Reading Lamp Glow Overlay */}
      {settings.tableAmbientLighting && (
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Top Floating Header Controls */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-3 flex items-center justify-between bg-black/60 backdrop-blur-md border-b border-[#d4af37]/20">
        <div className="flex items-center gap-3">
          <button
            id="reader-back-to-library-btn"
            onClick={onBackToLibrary}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-['Hind_Siliguri'] transition-all duration-200 border border-stone-600/40"
          >
            <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden sm:inline">লাইব্রেরিতে ফিরুন</span>
          </button>

          <div className="hidden md:block">
            <h1 className="text-sm font-bold text-stone-100 font-['Hind_Siliguri'] truncate max-w-xs">
              {book.banglaTitle}
            </h1>
            <p className="text-[11px] text-stone-400 font-['Hind_Siliguri']">
              {book.author}
            </p>
          </div>
        </div>

        {/* Center Quick Page Jump Indicator */}
        <div className="flex items-center gap-2 text-xs font-['Hind_Siliguri'] text-stone-300">
          <button
            id="reader-prev-top-btn"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
            title="পূর্ববর্তী পৃষ্ঠা"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 py-0.5 rounded bg-black/40 border border-stone-700 font-mono text-[#d4af37]">
            {currentPage} / {book.pagesCount}
          </span>
          <button
            id="reader-next-top-btn"
            onClick={handleNextPage}
            disabled={currentPage >= book.pagesCount}
            className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
            title="পরবর্তী পৃষ্ঠা"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          <button
            id="reader-toc-toggle-btn"
            onClick={onOpenTOC}
            className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            title="সূচিপত্র"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            id="reader-bookmark-btn"
            onClick={handleToggleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50'
                : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
            }`}
            title={isBookmarked ? 'বুকমার্ক সরানো হয়েছে' : 'বুকমার্ক করুন'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-[#d4af37]" />
            ) : (
              <BookmarkIcon className="w-4 h-4" />
            )}
          </button>

          <button
            id="reader-sound-toggle-btn"
            onClick={() => onUpdateSettings({ soundEffects: !settings.soundEffects })}
            className={`p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 ${
              settings.soundEffects ? 'text-[#5ec2d7]' : 'text-stone-500'
            }`}
            title={settings.soundEffects ? 'শব্দ সক্রিয়' : 'শব্দ বন্ধ'}
          >
            {settings.soundEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            id="reader-settings-btn"
            onClick={onOpenSettingsModal}
            className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            title="পড়ার সেটিংস"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Table Surface & Open Physical Book */}
      <main className="relative z-10 flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Navigation Side Arrow Left */}
        <button
          id="reader-page-prev-arrow-btn"
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="absolute left-2 sm:left-6 z-30 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white/80 hover:text-[#d4af37] flex items-center justify-center backdrop-blur-md border border-stone-700/60 shadow-xl disabled:opacity-20 disabled:pointer-events-none transition-all duration-200"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Navigation Side Arrow Right */}
        <button
          id="reader-page-next-arrow-btn"
          onClick={handleNextPage}
          disabled={currentPage >= book.pagesCount}
          className="absolute right-2 sm:right-6 z-30 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white/80 hover:text-[#d4af37] flex items-center justify-center backdrop-blur-md border border-stone-700/60 shadow-xl disabled:opacity-20 disabled:pointer-events-none transition-all duration-200"
          aria-label="Next Page"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 3D Physical Book Structure on Table */}
        <div
          id="open-book-3d-wrapper"
          className={`relative w-full max-w-4xl max-h-[82vh] rounded-2xl ${themeStyles.shadow} border-4 border-[#3b2413] flex flex-col md:flex-row overflow-hidden transition-colors duration-300`}
          style={{
            perspective: '1400px',
            backgroundColor: book.coverColor,
          }}
        >
          {/* Leather Book Cover Rim Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none z-0" />

          {/* Center Spine Gutter Shadow */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/40 via-black/70 to-black/40 z-20 pointer-events-none" />

          {/* Book Bookmark Ribbon */}
          {isBookmarked && (
            <div className="absolute -top-1 right-12 z-30 w-5 h-16 bg-red-700 rounded-b-md shadow-md flex items-end justify-center pb-1">
              <div className="w-2 h-2 bg-yellow-400 rotate-45" />
            </div>
          )}

          {/* Page Leaf Body with Smooth Turn Animation */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPage}
              initial={
                settings.reducedMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0.2,
                      rotateY: turnDirection === 'next' ? -25 : 25,
                      scale: 0.98,
                    }
              }
              animate={{
                opacity: 1,
                rotateY: 0,
                scale: 1,
              }}
              exit={
                settings.reducedMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0.2,
                      rotateY: turnDirection === 'next' ? 25 : -25,
                      scale: 0.98,
                    }
              }
              transition={{ duration: 0.38, ease: 'easeOut' }}
              className={`relative z-10 w-full flex-1 flex flex-col p-6 sm:p-10 md:p-14 ${themeStyles.pageBg} ${themeStyles.text} select-text overflow-y-auto max-h-[75vh]`}
              style={{
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
              }}
            >
              {/* Top Header of Page */}
              <div className={`flex items-center justify-between border-b ${themeStyles.border} pb-3 mb-6 text-xs ${themeStyles.subtext} font-['Cinzel'] tracking-wider uppercase`}>
                <span>{pageData.headerText || `${book.banglaTitle} • পৃষ্ঠা ${currentPage}`}</span>
                <span>AYT BOOKS</span>
              </div>

              {/* Chapter Title if present */}
              {pageData.chapterTitle && (
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-['Hind_Siliguri'] text-[#b8860b] dark:text-[#f1c40f]">
                    {pageData.chapterTitle}
                  </h2>
                  <div className="text-sm text-[#d4af37] font-serif mt-1">
                    — ✦ —
                  </div>
                </div>
              )}

              {/* Quranic Verse / Arabic block if present */}
              {pageData.verseArabic && (
                <div className="my-4 p-4 rounded-xl bg-amber-500/10 border-l-4 border-[#d4af37] text-right font-serif text-lg leading-loose">
                  {pageData.verseArabic}
                </div>
              )}

              {/* Main Body Text (High DPI crisp rendering) */}
              <div className="flex-1 whitespace-pre-line tracking-wide font-normal">
                {pageData.content}
              </div>

              {/* Moral / Highlight Box */}
              {pageData.moralQuote && (
                <div className="mt-8 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[#d4af37]/40 text-sm italic text-center font-['Hind_Siliguri']">
                  💡 {pageData.moralQuote}
                </div>
              )}

              {/* Page Footer */}
              <div className={`flex items-center justify-between border-t ${themeStyles.border} pt-3 mt-8 text-xs ${themeStyles.subtext} font-mono`}>
                <span>AYT Books</span>
                <span className="font-bold">{currentPage}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Progress Bar & Mode Switcher */}
      <footer className="relative z-20 w-full px-6 py-2.5 bg-black/75 backdrop-blur-md border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Progress Slider */}
        <div className="w-full sm:w-80 flex items-center gap-3">
          <span className="text-stone-400 font-mono">1</span>
          <input
            id="reader-page-slider"
            type="range"
            min={1}
            max={book.pagesCount}
            value={currentPage}
            onChange={(e) => onPageChange(parseInt(e.target.value))}
            className="flex-1 accent-[#d4af37] h-1.5 bg-stone-700 rounded-lg cursor-pointer"
          />
          <span className="text-stone-400 font-mono">{book.pagesCount}</span>
        </div>

        {/* Progress Percentage */}
        <div className="text-stone-300 font-['Hind_Siliguri'] flex items-center gap-2">
          <span>পড়া সম্পন্ন:</span>
          <span className="font-bold text-[#d4af37] font-mono">
            {Math.round((currentPage / book.pagesCount) * 100)}%
          </span>
        </div>
      </footer>
    </div>
  );
};
