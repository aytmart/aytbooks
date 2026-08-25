import React from 'react';
import { X, ArrowRight, BookOpen, Sparkles, Moon, Users, GraduationCap, TrendingUp, Lightbulb } from 'lucide-react';
import { BookshelfCategory, Book } from '../../types';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: BookshelfCategory[];
  books: Book[];
  onSelectCategory: (shelfIndex: number) => void;
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  isOpen,
  onClose,
  categories,
  books,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Moon':
        return <Moon className="w-6 h-6 text-[#d4af37]" />;
      case 'Users':
        return <Users className="w-6 h-6 text-[#e5b869]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-[#5ec2d7]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-[#f39c12]" />;
      case 'Lightbulb':
        return <Lightbulb className="w-6 h-6 text-[#f1c40f]" />;
      default:
        return <BookOpen className="w-6 h-6 text-[#d4af37]" />;
    }
  };

  return (
    <div
      id="ayt-categories-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        id="ayt-categories-modal-box"
        className="w-full max-w-4xl max-h-[85vh] rounded-3xl bg-stone-900 border border-[#d4af37]/40 shadow-2xl flex flex-col overflow-hidden text-stone-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#d4af37] tracking-widest uppercase font-['Cinzel']">
              BOOKSHELF SECTIONS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Hind_Siliguri'] mt-0.5">
              ৫টি প্রধান বুকশেলফ ক্যাটাগরি
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Category Shelf Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, idx) => {
            const catBooks = books.filter((b) => b.shelfIndex === idx);
            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(idx);
                  onClose();
                }}
                className="p-5 rounded-2xl bg-stone-800/70 hover:bg-stone-800 border border-stone-700/80 hover:border-[#d4af37]/60 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
                style={{
                  background: cat.bannerBg,
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-inner">
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-black/40 text-[11px] font-mono text-[#d4af37] border border-[#d4af37]/30">
                      শেলফ #{idx + 1} • {catBooks.length} টি বই
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-['Hind_Siliguri'] group-hover:text-[#f1c40f] transition-colors">
                    {cat.banglaTitle}
                  </h3>
                  <div className="text-xs font-semibold text-[#d4af37] font-['Cinzel'] tracking-wider mb-2 uppercase">
                    {cat.title}
                  </div>
                  <p className="text-xs text-stone-300/80 font-['Hind_Siliguri'] leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#5ec2d7] font-['Hind_Siliguri'] group-hover:text-[#f1c40f] transition-colors">
                  <span>৩ডি শেলফ দেখতে ক্লিক করুন</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
