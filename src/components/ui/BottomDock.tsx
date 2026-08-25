import React from 'react';
import { LayoutGrid, Search, BookMarked, Settings, BookOpen } from 'lucide-react';
import { Book } from '../../types';

interface BottomDockProps {
  onOpenCategories: () => void;
  onOpenSearch: () => void;
  onOpenContinueReading: () => void;
  onOpenMyBooks: () => void;
  onOpenSettings: () => void;
  lastReadBook: Book | null;
  onOpenLastBook: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  onOpenCategories,
  onOpenSearch,
  onOpenContinueReading,
  onOpenMyBooks,
  onOpenSettings,
  lastReadBook,
  onOpenLastBook,
}) => {
  return (
    <div
      id="ayt-bottom-floating-dock"
      className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 sm:gap-4 px-2 sm:px-8 py-1.5 sm:py-2.5 rounded-2xl bg-black/80 border border-[#d4af37]/35 shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl text-stone-300 font-['Hind_Siliguri'] text-[10px] sm:text-xs select-none max-w-[96vw] sm:max-w-max justify-around"
    >
      <button
        id="dock-categories-btn"
        onClick={onOpenCategories}
        className="flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 rounded-xl hover:bg-white/10 hover:text-[#d4af37] transition-all"
      >
        <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d4af37]" />
        <span className="text-[10px] sm:text-[11px] whitespace-nowrap">Categories</span>
      </button>

      <div className="w-[1px] h-5 sm:h-6 bg-stone-700/60 shrink-0" />

      <button
        id="dock-search-btn"
        onClick={onOpenSearch}
        className="flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 rounded-xl hover:bg-white/10 hover:text-[#d4af37] transition-all"
      >
        <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5ec2d7]" />
        <span className="text-[10px] sm:text-[11px] whitespace-nowrap">Search</span>
      </button>

      <div className="w-[1px] h-5 sm:h-6 bg-stone-700/60 shrink-0" />

      <button
        id="dock-continue-reading-btn"
        onClick={lastReadBook ? onOpenLastBook : onOpenContinueReading}
        className="flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 rounded-xl hover:bg-white/10 hover:text-[#d4af37] transition-all text-[#f1c40f]"
      >
        <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="text-[10px] sm:text-[11px] whitespace-nowrap">{lastReadBook ? 'Continue' : 'Reading'}</span>
      </button>

      <div className="w-[1px] h-5 sm:h-6 bg-stone-700/60 shrink-0" />

      <button
        id="dock-my-books-btn"
        onClick={onOpenMyBooks}
        className="flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 rounded-xl hover:bg-white/10 hover:text-[#d4af37] transition-all"
      >
        <BookMarked className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
        <span className="text-[10px] sm:text-[11px] whitespace-nowrap">My Books</span>
      </button>

      <div className="w-[1px] h-5 sm:h-6 bg-stone-700/60 shrink-0" />

      <button
        id="dock-settings-btn"
        onClick={onOpenSettings}
        className="flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 rounded-xl hover:bg-white/10 hover:text-[#d4af37] transition-all"
      >
        <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
        <span className="text-[10px] sm:text-[11px] whitespace-nowrap">Settings</span>
      </button>
    </div>
  );
};
