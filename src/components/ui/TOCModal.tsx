import React from 'react';
import { X, List, ChevronRight, BookOpen } from 'lucide-react';
import { Book } from '../../types';

interface TOCModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  currentPage: number;
  onSelectPage: (page: number) => void;
}

export const TOCModal: React.FC<TOCModalProps> = ({
  isOpen,
  onClose,
  book,
  currentPage,
  onSelectPage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="ayt-toc-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        id="ayt-toc-drawer"
        className="w-full max-w-md h-full bg-stone-900 border-l border-[#d4af37]/30 shadow-2xl flex flex-col overflow-hidden text-stone-200"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <List className="w-5 h-5 text-[#d4af37]" />
            <h3 className="text-lg font-bold text-white font-['Hind_Siliguri']">
              সূচিপত্র ও অধ্যায়সমূহ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Header Preview */}
        <div className="p-4 bg-stone-950/60 border-b border-stone-800 flex items-center gap-3">
          <div
            className="w-9 h-12 rounded shadow flex items-center justify-center p-0.5 text-[7px] font-bold text-white shrink-0 text-center"
            style={{ backgroundColor: book.coverColor }}
          >
            <span className="line-clamp-2">{book.banglaTitle}</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-['Hind_Siliguri'] truncate">
              {book.banglaTitle}
            </h4>
            <span className="text-[11px] text-stone-400 font-mono">
              মোট {book.pagesCount} পৃষ্ঠা
            </span>
          </div>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-['Hind_Siliguri'] text-sm">
          {book.chapters && book.chapters.length > 0 ? (
            book.chapters.map((chap, idx) => {
              const isActive = currentPage >= chap.pageNumber && (idx === book.chapters.length - 1 || currentPage < book.chapters[idx + 1].pageNumber);
              return (
                <button
                  key={chap.id}
                  onClick={() => {
                    onSelectPage(chap.pageNumber);
                    onClose();
                  }}
                  className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                    isActive
                      ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f1c40f] font-bold shadow-md'
                      : 'bg-stone-800/60 hover:bg-stone-800 border-stone-700/60 text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-black/40 text-xs font-mono flex items-center justify-center text-stone-400">
                      {idx + 1}
                    </span>
                    <span>{chap.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-400 font-mono">
                    <span>পৃষ্ঠা {chap.pageNumber}</span>
                    <ChevronRight className="w-4 h-4 text-stone-500" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-stone-400">
              কোনো অধ্যায় তালিকা নেই।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
