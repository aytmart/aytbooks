import React, { useState } from 'react';
import { BookOpen, Search, Bookmark, Clock, CloudOff, User, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Book } from '../../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenCategories: () => void;
  onOpenMyBooks: (tab?: 'continue' | 'bookmarks' | 'offline') => void;
  onOpenSettings: () => void;
  lastReadBook: Book | null;
  onSelectBook: (book: Book) => void;
  is2DView: boolean;
  onToggle2DView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenCategories,
  onOpenMyBooks,
  onOpenSettings,
  lastReadBook,
  onSelectBook,
  is2DView,
  onToggle2DView,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header
      id="ayt-main-header"
      className="absolute top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/50 to-transparent backdrop-blur-xs select-none"
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8a6614] via-[#d4af37] to-[#fae19c] flex items-center justify-center shadow-lg border border-[#f1c40f]/40">
          <BookOpen className="w-4 h-4 text-[#1a1207]" />
        </div>
        <span className="text-xl font-bold tracking-wider text-white font-['Cinzel'] flex items-center gap-1.5 drop-shadow">
          AYT <span className="text-[#e5c158]">Books</span>
        </span>
      </div>

      {/* Center Nav Items matching image.png */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300 font-['Hind_Siliguri']">
        <button
          onClick={() => {
            if (is2DView) onToggle2DView();
          }}
          className={`hover:text-[#d4af37] transition-colors ${!is2DView ? 'text-[#d4af37] font-bold border-b border-[#d4af37] pb-0.5' : ''}`}
        >
          Library
        </button>

        <button
          onClick={onOpenCategories}
          className="hover:text-[#d4af37] transition-colors"
        >
          Categories
        </button>

        <button
          onClick={() => onOpenMyBooks('bookmarks')}
          className="hover:text-[#d4af37] transition-colors"
        >
          My Books
        </button>

        <button
          onClick={() => onOpenMyBooks('continue')}
          className="hover:text-[#d4af37] transition-colors"
        >
          Continue Reading
        </button>

        <button
          onClick={() => onOpenMyBooks('offline')}
          className="hover:text-[#d4af37] transition-colors"
        >
          Offline
        </button>

        <button
          onClick={onOpenSearch}
          className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
        </button>
      </nav>

      {/* Right Profile & Toggle Controls */}
      <div className="flex items-center gap-3">
        {/* User Profile Pill matching image.png */}
        <div className="relative">
          <button
            id="user-profile-menu-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-stone-900/85 hover:bg-stone-800 border border-[#d4af37]/40 text-xs text-stone-200 transition-all shadow-md"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 flex items-center justify-center text-stone-900 font-bold text-[11px] shadow-sm">
              A
            </div>
            <span className="font-['Plus_Jakarta_Sans'] font-semibold">Hi, Ayman</span>
            <span className="text-stone-400 text-[10px]">▾</span>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div
              id="user-profile-dropdown"
              className="absolute right-0 mt-2 w-64 rounded-2xl bg-stone-900/95 border border-[#d4af37]/30 shadow-2xl p-4 text-xs font-['Hind_Siliguri'] backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center gap-3 border-b border-stone-800 pb-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#d4af37] text-stone-900 flex items-center justify-center font-bold text-base">
                  A
                </div>
                <div>
                  <div className="font-bold text-stone-100">Ayman S.</div>
                  <div className="text-[11px] text-stone-400">ayman@aytbooks.org</div>
                </div>
              </div>

              <div className="space-y-1 text-stone-300">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenMyBooks('continue');
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2.5 text-left"
                >
                  <Clock className="w-4 h-4 text-[#d4af37]" />
                  <span>সর্বশেষ পঠিত বইসমূহ</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenMyBooks('bookmarks');
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2.5 text-left"
                >
                  <Bookmark className="w-4 h-4 text-[#d4af37]" />
                  <span>সংরক্ষিত বুকমার্ক ও নোটস</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenMyBooks('offline');
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2.5 text-left"
                >
                  <CloudOff className="w-4 h-4 text-emerald-400" />
                  <span>অফলাইন ডাউনলোড ম্যানেজার</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenSettings();
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2.5 text-left"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#5ec2d7]" />
                  <span>অ্যাপ ও রিডিং সেটিংস</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
