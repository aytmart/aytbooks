import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CloudRain,
  BookOpen,
  Volume2,
  VolumeX,
  Sliders,
  Bookmark as BookmarkIcon,
  BookmarkCheck,
  Eye,
} from 'lucide-react';
import { Book, ReadingSettings } from '../../types';
import { soundEngine } from '../../utils/audio';
import { StorageService } from '../../services/storageService';

interface ImmersiveReadingModeProps {
  book: Book;
  currentPage: number;
  onPageChange: (page: number) => void;
  onBackToLibrary: () => void;
  settings: ReadingSettings;
  onUpdateSettings: (settings: Partial<ReadingSettings>) => void;
  onOpenSettingsModal: () => void;
}

export const ImmersiveReadingMode: React.FC<ImmersiveReadingModeProps> = ({
  book,
  currentPage,
  onPageChange,
  onBackToLibrary,
  settings,
  onUpdateSettings,
  onOpenSettingsModal,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsBookmarked(StorageService.isPageBookmarked(book.id, currentPage));
  }, [book.id, currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < book.pagesCount) {
      if (settings.soundEffects) soundEngine.playPageTurn();
      onPageChange(currentPage + 1);
    }
  }, [currentPage, book.pagesCount, settings.soundEffects, onPageChange]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      if (settings.soundEffects) soundEngine.playPageTurn();
      onPageChange(currentPage - 1);
    }
  }, [currentPage, settings.soundEffects, onPageChange]);

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      StorageService.removeBookmark(book.id, currentPage);
      setIsBookmarked(false);
    } else {
      const pageData = book.pages.find((p) => p.pageNumber === currentPage);
      StorageService.addBookmark({
        id: `${book.id}_${currentPage}_${Date.now()}`,
        bookId: book.id,
        pageNumber: currentPage,
        title: pageData?.chapterTitle || book.banglaTitle,
        snippet: pageData?.content.slice(0, 60) + '...' || `পৃষ্ঠা ${currentPage}`,
        createdAt: Date.now(),
      });
      setIsBookmarked(true);
    }
  };

  const handleAmbientChange = (ambient: 'none' | 'rain' | 'library' | 'binaural') => {
    onUpdateSettings({ ambientSound: ambient });
    soundEngine.setAmbient(ambient);
  };

  const pageData = book.pages.find((p) => p.pageNumber === currentPage) || {
    pageNumber: currentPage,
    content: `[পৃষ্ঠা ${currentPage}]`,
  };

  return (
    <div
      id="ayt-immersive-reader-view"
      className="relative w-full h-full flex flex-col items-center justify-between bg-[#080604] text-[#ece4d0] overflow-hidden"
    >
      {/* Ambient Candle Flicker Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Top Floating Control Bar */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBackToLibrary}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 text-xs font-['Hind_Siliguri'] border border-stone-700/50 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>লাইব্রেরি</span>
        </button>

        {/* Ambient Sound Selector */}
        <div className="flex items-center gap-1 bg-stone-900/90 border border-stone-800 rounded-full px-3 py-1 text-xs backdrop-blur-md">
          <span className="text-[11px] text-stone-400 font-['Hind_Siliguri'] mr-1">পরিবেশ:</span>
          {(['none', 'rain', 'library', 'binaural'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleAmbientChange(type)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] capitalize transition-colors ${
                settings.ambientSound === type
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {type === 'none' && 'নীরব'}
              {type === 'rain' && 'বৃষ্টির শব্দ'}
              {type === 'library' && 'লাইব্রেরি'}
              {type === 'binaural' && 'ধ্যান সুর'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-full border transition-colors ${
              isBookmarked
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                : 'bg-stone-900/80 border-stone-700 text-stone-400 hover:text-white'
            }`}
            title="বুকমার্ক"
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-full bg-stone-900/80 border border-stone-700 text-stone-400 hover:text-white"
            title="সেটিংস"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Focus Reading Container */}
      <main className="relative z-10 flex-1 w-full max-w-3xl flex items-center justify-center p-4 sm:p-8">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="absolute left-2 sm:left-4 p-3 rounded-full bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-white disabled:opacity-20 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= book.pagesCount}
          className="absolute right-2 sm:right-4 p-3 rounded-full bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-white disabled:opacity-20 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Deep Focus Book Spread Sheet */}
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-h-[72vh] overflow-y-auto p-8 sm:p-12 rounded-3xl bg-[#120e0a]/95 border border-[#d4af37]/20 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-md select-text"
          style={{
            fontFamily: settings.fontFamily,
            fontSize: `${settings.fontSize + 2}px`,
            lineHeight: settings.lineHeight + 0.1,
          }}
        >
          {pageData.chapterTitle && (
            <div className="text-center mb-8">
              <span className="text-xs text-[#d4af37] tracking-widest font-['Cinzel'] uppercase">
                অধ্যায়
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#f1c40f] font-['Hind_Siliguri'] mt-1">
                {pageData.chapterTitle}
              </h2>
              <div className="text-sm text-[#d4af37] font-serif mt-1">— ✦ —</div>
            </div>
          )}

          {pageData.verseArabic && (
            <div className="my-6 p-4 rounded-2xl bg-amber-500/10 border-l-4 border-[#d4af37] text-right font-serif text-xl leading-loose text-amber-100">
              {pageData.verseArabic}
            </div>
          )}

          <div className="whitespace-pre-line tracking-wide text-stone-200 font-light">
            {pageData.content}
          </div>

          {pageData.moralQuote && (
            <div className="mt-10 p-5 rounded-2xl bg-amber-950/30 border border-[#d4af37]/30 text-amber-200/90 text-sm italic text-center font-['Hind_Siliguri']">
              ✨ {pageData.moralQuote}
            </div>
          )}
        </motion.div>
      </main>

      {/* Bottom Minimal Page Indicator */}
      <footer className="relative z-20 w-full px-6 py-4 flex items-center justify-between text-xs text-stone-400 font-['Hind_Siliguri']">
        <span className="truncate max-w-xs">{book.banglaTitle}</span>
        <div className="flex items-center gap-2">
          <span>পৃষ্ঠা</span>
          <span className="font-bold text-[#d4af37] font-mono">{currentPage}</span>
          <span>/ {book.pagesCount}</span>
        </div>
      </footer>
    </div>
  );
};
