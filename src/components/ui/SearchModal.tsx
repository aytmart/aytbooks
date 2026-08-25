import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { Book } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onSelectBook: (book: Book) => void;
  onFocusShelf: (shelfIndex: number) => void;
  onLocateBook?: (book: Book, coords: { x: number; z: number }) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  books,
  onSelectBook,
  onFocusShelf,
  onLocateBook,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getBookCoords = (categoryId: string) => {
    switch (categoryId) {
      case 'islamic_books':
        return { x: -13, z: 0 };
      case 'children_teen':
        return { x: 13, z: 0 };
      case 'educational':
        return { x: -13, z: -15 };
      case 'personal_dev':
        return { x: 13, z: -15 };
      case 'life_knowledge':
        return { x: 0, z: -19 };
      default:
        return { x: 0, z: -19 };
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchCat = selectedCategory === 'all' || b.categoryId === selectedCategory;
      const q = query.toLowerCase().trim();
      if (!q) return matchCat;
      const matchQuery =
        b.title.toLowerCase().includes(q) ||
        b.banglaTitle.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [books, query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      id="ayt-search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        id="ayt-search-modal-box"
        className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-stone-900 border border-[#d4af37]/40 shadow-2xl flex flex-col overflow-hidden text-stone-200"
      >
        {/* Search Header Bar */}
        <div className="p-5 border-b border-stone-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#d4af37]" />
          <input
            id="book-search-input"
            type="text"
            placeholder="বইয়ের নাম, লেখক, বিষয় বা কিওয়ার্ড লিখে খুঁজুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder-stone-500 font-['Hind_Siliguri']"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-white/10 text-stone-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-5 py-2.5 bg-stone-950/60 border-b border-stone-800 flex items-center gap-2 overflow-x-auto text-xs font-['Hind_Siliguri']">
          <span className="text-stone-400 text-[11px]">ফিল্টার:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#d4af37] text-stone-900 font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            সকল বই ({books.length})
          </button>
          <button
            onClick={() => setSelectedCategory('islamic_books')}
            className={`px-3 py-1 rounded-full transition-colors ${
              selectedCategory === 'islamic_books'
                ? 'bg-[#d4af37] text-stone-900 font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            ইসলামিক
          </button>
          <button
            onClick={() => setSelectedCategory('life_knowledge')}
            className={`px-3 py-1 rounded-full transition-colors ${
              selectedCategory === 'life_knowledge'
                ? 'bg-[#d4af37] text-stone-900 font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            জীবন ও জ্ঞান
          </button>
          <button
            onClick={() => setSelectedCategory('educational')}
            className={`px-3 py-1 rounded-full transition-colors ${
              selectedCategory === 'educational'
                ? 'bg-[#d4af37] text-stone-900 font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            শিক্ষা ও বিজ্ঞান
          </button>
          <button
            onClick={() => setSelectedCategory('personal_dev')}
            className={`px-3 py-1 rounded-full transition-colors ${
              selectedCategory === 'personal_dev'
                ? 'bg-[#d4af37] text-stone-900 font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            আত্মউন্নয়ন
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12 text-stone-400 font-['Hind_Siliguri']">
              <BookOpen className="w-10 h-10 mx-auto text-stone-600 mb-3" />
              <p className="text-base font-semibold">কোনো বই পাওয়া যায়নি</p>
              <p className="text-xs text-stone-500 mt-1">অন্য কোনো শব্দ বা লেখক দিয়ে চেষ্টা করুন</p>
            </div>
          ) : (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className="p-4 rounded-2xl bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60 transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Spine / Mini Cover Indicator */}
                  <div
                    className="w-12 h-16 rounded-md shadow-md flex items-center justify-center text-center p-1 text-[8px] font-bold text-white border border-white/20 shrink-0"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <span className="line-clamp-2">{book.banglaTitle}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] font-['Cinzel']">
                        {book.category}
                      </span>
                      <span className="text-stone-500">•</span>
                      <span className="text-[11px] text-stone-400 font-mono">{book.pagesCount} পৃষ্ঠা</span>
                    </div>

                    <h3 className="text-base font-bold text-white font-['Hind_Siliguri'] truncate mt-0.5 group-hover:text-[#f1c40f] transition-colors">
                      {book.banglaTitle}
                    </h3>
                    <p className="text-xs text-stone-400 font-['Hind_Siliguri'] truncate">
                      {book.author}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (onLocateBook) {
                        const coords = getBookCoords(book.categoryId);
                        onLocateBook(book, coords);
                      } else {
                        onFocusShelf(book.shelfIndex);
                      }
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-['Hind_Siliguri'] flex items-center gap-1.5 transition-colors shadow-sm"
                    title="৩ডি লাইব্রেরিতে এই বইয়ের শেলফে নিয়ে যান"
                  >
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>লাইব্রেরিতে খুঁজুন</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectBook(book);
                      onClose();
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-stone-950 text-xs font-bold font-['Hind_Siliguri'] flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <span>পড়ুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
