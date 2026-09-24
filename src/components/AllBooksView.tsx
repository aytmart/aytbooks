import React, { useState, useMemo } from 'react';
import { Book, ShelfId } from '../types';
import { CATEGORIES } from '../data/booksData';
import { Search, Filter, BookOpen, Star, Heart, ArrowUpDown, Tag } from 'lucide-react';

interface AllBooksViewProps {
  books: Book[];
  selectedCategory: ShelfId | 'all';
  onSelectCategory: (cat: ShelfId | 'all') => void;
  onSelectBook: (book: Book) => void;
  onReadBook: (book: Book) => void;
  onToggleSave: (bookId: string) => void;
  savedBookIds: string[];
}

export const AllBooksView: React.FC<AllBooksViewProps> = ({
  books,
  selectedCategory,
  onSelectCategory,
  onSelectBook,
  onReadBook,
  onToggleSave,
  savedBookIds
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'pages'>('popularity');

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
        const matchesSearch =
          searchQuery.trim() === '' ||
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (book.titleEn && book.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'pages') return b.pages - a.pages;
        return (b.rating || 5) - (a.rating || 5);
      });
  }, [books, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
          <span>✓ অনলাইনে সব বই ফ্রি পড়ুন</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-3">
          বইয়ের উন্মুক্ত সংগ্রহশালা
        </h1>
        <p className="text-sm sm:text-base text-[#5C5852] font-serif leading-relaxed">
          ইসলামিক, শিক্ষামূলক, শিশু-কিশোর ও জীবন ঘনিষ্ঠ বইগুলো অনলাইনে ফ্রি পড়ুন
        </p>
        <div className="w-16 h-0.5 bg-[#1A1A1A] mx-auto mt-4" />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#F9F7F4] p-4 sm:p-5 rounded-2xl border border-[#E5E1DB] shadow-xs mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#8C8882] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="বইয়ের নাম, লেখক বা বিষয় লিখুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#E5E1DB] bg-[#FDFCFB] focus:outline-none focus:border-[#1A1A1A] text-sm text-[#1A1A1A]"
              id="catalog-search-input"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <ArrowUpDown className="w-4 h-4 text-[#1A1A1A]" />
            <span className="text-xs uppercase tracking-wider text-[#8C8882] font-bold">সাজান:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 rounded-lg border border-[#E5E1DB] bg-[#FDFCFB] text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="popularity">জনপ্রিয়তা অনুযায়ী</option>
              <option value="price-low">মূল্য: কম থেকে বেশি</option>
              <option value="price-high">মূল্য: বেশি থেকে কম</option>
              <option value="pages">পৃষ্ঠা সংখ্যা অনুযায়ী</option>
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => onSelectCategory('all')}
            className={`py-2 px-4 rounded-md text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#1A1A1A] text-[#FDFCFB] shadow-xs'
                : 'bg-[#F2EFE9] text-[#5C5852] border border-[#E5E1DB] hover:bg-[#E5E1DB]'
            }`}
          >
            সব বই ({books.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = books.filter(b => b.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`py-2 px-4 rounded-md text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-[#FDFCFB] shadow-xs'
                    : 'bg-[#F2EFE9] text-[#5C5852] border border-[#E5E1DB] hover:bg-[#E5E1DB]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="opacity-70 font-mono text-xs">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6 text-xs text-[#8C8882]">
        <span className="font-mono">{filteredBooks.length} টি বই পাওয়া গেছে</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#1A1A1A] hover:underline font-semibold uppercase tracking-wider text-[11px]"
          >
            অনুসন্ধান মুছুন
          </button>
        )}
      </div>

      {/* Books Grid View */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredBooks.map((book) => {
            const isSaved = savedBookIds.includes(book.id);

            return (
              <div
                key={book.id}
                className="bg-[#FDFCFB] border border-[#E5E1DB] rounded-xl p-3.5 sm:p-4 flex flex-col justify-between shadow-xs hover:border-[#1A1A1A] transition-all group"
              >
                {/* Book Cover */}
                <div
                  onClick={() => onSelectBook(book)}
                  className="aspect-[1/1.42] rounded-r-md rounded-l-xs overflow-hidden flex flex-col justify-between p-2.5 text-white book-shadow-editorial book-spine-effect relative border border-white/20 mb-3 cursor-pointer group-hover:scale-102 transition-transform"
                  style={{
                    backgroundColor: book.coverColor,
                    backgroundImage: `linear-gradient(135deg, ${book.coverColor} 0%, rgba(0,0,0,0.35) 100%), radial-gradient(circle at top right, ${book.coverAccent}33, transparent 60%)`
                  }}
                >
                  <span className="text-[7.5px] uppercase tracking-widest text-[#E0C268] font-sans font-bold text-center block">
                    {book.category === 'islamic' ? 'AYT ISLAMIC' : book.category === 'kids' ? 'AYT KIDS' : 'AYT BOOKS'}
                  </span>

                  <div className="text-center my-auto py-1">
                    <h4 className="font-serif text-xs font-bold leading-tight line-clamp-3 text-[#FDFCFB]">
                      {book.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[8px] text-[#E0C268] border-t border-[#C9A227]/30 pt-1 font-mono">
                    {book.hasHardcopy ? (
                      <>
                        <span className="font-bold bg-emerald-800 text-white px-1 py-0.5 rounded font-sans">হার্ডকপি ৳৪০০</span>
                        <span className="bg-white/20 px-1 rounded text-white font-sans">ফ্রি পড়ুন</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold bg-black/60 text-[#E0C268] px-1 py-0.5 rounded font-sans">অনলাইন পাঠ</span>
                        <span className="bg-white/20 px-1 rounded text-white font-sans">📖 ফ্রি পড়ুন</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#1A1A1A] mb-1">
                      <span className="font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">
                        {book.hasHardcopy ? 'হার্ডকপি ও ফ্রি পাঠ' : 'অনলাইনে পড়ার জন্য'}
                      </span>
                      <button
                        onClick={() => onToggleSave(book.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>

                    <h3
                      onClick={() => onSelectBook(book)}
                      className="font-serif text-sm font-bold text-[#1A1A1A] leading-snug line-clamp-2 hover:text-neutral-600 cursor-pointer mb-1"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#8C8882] line-clamp-1 mb-2 font-serif">{book.author}</p>
                  </div>

                  {/* Free Online Read and Hardcopy Note */}
                  <div className="pt-2 border-t border-[#E5E1DB] flex items-center justify-between gap-1">
                    <div className="flex flex-col">
                      {book.hasHardcopy ? (
                        <>
                          <span className="text-[10px] text-emerald-700 font-bold font-sans">
                            অনলাইনে ফ্রি পড়ুন
                          </span>
                          <span className="text-[10px] text-[#1A1A1A] font-bold font-mono">
                            মুদ্রিত কপি: {book.currency}{book.price}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] text-emerald-700 font-bold font-sans">
                            অনলাইনে পড়ার জন্য
                          </span>
                          <span className="text-[9px] text-[#8C8882] font-mono">
                            {book.pages} পৃষ্ঠা
                          </span>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => onReadBook(book)}
                      className="inline-flex items-center gap-1 py-1 px-2.5 rounded-md bg-[#1A1A1A] hover:bg-neutral-800 text-white text-[11px] font-semibold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3 text-[#E0C268]" />
                      <span>ফ্রি পড়ুন</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#F9F7F4] rounded-2xl border border-[#E5E1DB] p-6">
          <BookOpen className="w-12 h-12 text-[#8C8882] mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-1">কোনো বই পাওয়া যায়নি</h3>
          <p className="text-sm text-[#5C5852] font-serif mb-4">অন্য কোনো শব্দ বা ক্যাটাগরি দিয়ে অনুসন্ধান করে দেখুন</p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('all');
            }}
            className="py-2.5 px-6 bg-[#1A1A1A] text-white text-xs font-semibold uppercase tracking-widest rounded-md"
          >
            সব বই দেখুন
          </button>
        </div>
      )}
    </div>
  );
};
