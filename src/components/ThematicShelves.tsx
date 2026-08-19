import React, { useRef } from 'react';
import { Book, ShelfId } from '../types';
import { CATEGORIES } from '../data/booksData';
import { ChevronRight, ChevronLeft, BookOpen, MessageCircle, Info, Heart, Star, Check } from 'lucide-react';

interface ThematicShelvesProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onReadBook: (book: Book) => void;
  onViewCategory: (catId: ShelfId) => void;
  onToggleSave: (bookId: string) => void;
  savedBookIds: string[];
}

export const ThematicShelves: React.FC<ThematicShelvesProps> = ({
  books,
  onSelectBook,
  onReadBook,
  onViewCategory,
  onToggleSave,
  savedBookIds
}) => {
  const shelfRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    islamic: useRef<HTMLDivElement>(null),
    kids: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
    life: useRef<HTMLDivElement>(null)
  };

  const scrollShelf = (id: string, direction: 'left' | 'right') => {
    const el = shelfRefs[id]?.current;
    if (el) {
      const scrollAmount = direction === 'right' ? 260 : -260;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="shelves-section" className="py-14 sm:py-18 md:py-22 bg-[#FDFCFB] border-b border-[#E5E1DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C8882] font-bold block mb-2">
            Thematic Curated Shelves
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight mb-3">
            বিষয়ভিত্তিক বইয়ের তাক
          </h2>
          <p className="text-sm sm:text-base text-[#5C5852] font-serif leading-relaxed">
            কাঠের তাকে সাজানো প্রতিটি বই অনলাইনে সম্পূর্ণ বিনামূল্যে পড়ুন অথবা সরাসরি সংগ্রহে রাখুন
          </p>
          <div className="w-16 h-0.5 bg-[#1A1A1A] mx-auto mt-4" />
        </div>

        {/* 2x2 Bookshelves Grid matching reference image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
          {CATEGORIES.map((cat) => {
            const shelfBooks = books.filter((b) => b.category === cat.id);

            return (
              <div key={cat.id} className="flex flex-col">
                {/* Category Badge Pill on Top */}
                <div className="flex justify-center -mb-4 z-20">
                  <div
                    className={`inline-flex items-center gap-2 px-6 py-2 rounded-full shadow-md text-white font-serif text-sm sm:text-base font-semibold bg-gradient-to-r ${cat.pillColor} border border-white/20`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                </div>

                {/* 3D Wooden Bookshelf Unit */}
                <div className="relative rounded-2xl p-4 pt-8 pb-3 shelf-editorial-texture border-4 border-[#3D2414] shadow-xl overflow-hidden group/shelf">
                  {/* Left Scroll Button */}
                  <button
                    onClick={() => scrollShelf(cat.id, 'left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/95 hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] flex items-center justify-center shadow-lg transition-all opacity-0 group-hover/shelf:opacity-100 hover:scale-110 cursor-pointer"
                    aria-label="Previous Books"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Right Scroll Button matching image (›) */}
                  <button
                    onClick={() => scrollShelf(cat.id, 'right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/95 hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer"
                    aria-label="Next Books"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Horizontal Scrollable Books Row */}
                  <div
                    ref={shelfRefs[cat.id]}
                    className="flex items-end gap-3 sm:gap-4 overflow-x-auto pb-4 pt-4 px-2 scroll-smooth no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {shelfBooks.map((book) => {
                      const isSaved = savedBookIds.includes(book.id);

                      return (
                        <div
                          key={book.id}
                          className="relative flex-none w-[100px] sm:w-[110px] md:w-[118px] group cursor-pointer transition-all duration-300 transform hover:-translate-y-4 hover:z-20"
                        >
                          {/* Physical 3D Book Graphic */}
                          <div
                            onClick={() => onSelectBook(book)}
                            className="aspect-[1/1.42] rounded-r-md rounded-l-xs overflow-hidden flex flex-col justify-between p-2 sm:p-2.5 text-white book-shadow-editorial book-spine-effect relative border-y border-r border-white/20 transition-transform group-hover:scale-105"
                            style={{
                              backgroundColor: book.coverColor,
                              backgroundImage: `linear-gradient(135deg, ${book.coverColor} 0%, rgba(0,0,0,0.35) 100%), radial-gradient(circle at top right, ${book.coverAccent}33, transparent 60%)`
                            }}
                          >
                            {/* Gold Embossed Top Frame Line */}
                            <div className="border-t border-b border-[#C9A227]/40 py-0.5 text-center">
                              <span className="text-[7px] tracking-widest text-[#E0C268] uppercase font-sans">
                                {book.category === 'islamic' ? 'AYT ISLAMIC' : book.category === 'kids' ? 'AYT KIDS' : 'AYT BOOKS'}
                              </span>
                            </div>

                            {/* Book Title Embossed */}
                            <div className="text-center my-auto py-1">
                              <h4 className="font-serif text-[11px] sm:text-xs font-bold leading-tight line-clamp-3 text-[#FDFCFB] drop-shadow-xs">
                                {book.title}
                              </h4>
                              {book.subtitle && (
                                <p className="text-[7.5px] text-[#E0C268] mt-0.5 line-clamp-1 opacity-80">
                                  {book.subtitle}
                                </p>
                              )}
                            </div>

                            {/* Bottom Seal / Emblem */}
                            <div className="flex items-center justify-between text-[8px] text-[#E0C268] border-t border-[#C9A227]/30 pt-1">
                              {book.hasHardcopy ? (
                                <>
                                  <span className="font-bold text-[#FDFCFB] bg-emerald-800/90 px-1 py-0.5 rounded font-sans">হার্ডকপি ৳৪০০</span>
                                  <span className="text-[8px] font-sans font-bold text-white">ফ্রি পড়ুন</span>
                                </>
                              ) : (
                                <>
                                  <span className="font-bold text-[#FDFCFB] bg-neutral-900/80 px-1 py-0.5 rounded font-sans">অনলাইন বই</span>
                                  <span className="text-[8.5px] font-sans font-bold text-[#E0C268]">📖 ফ্রি পড়ুন</span>
                                </>
                              )}
                            </div>

                            {/* Badge if special */}
                            {book.isBestseller && (
                              <div className="absolute top-1 right-1 px-1 py-0.2 bg-[#E0C268] text-[#1A1A1A] text-[6.5px] font-bold rounded" title="জনপ্রিয় বই">
                                সেরা
                              </div>
                            )}
                          </div>

                          {/* Hover Popover Micro-Card */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-[#FDFCFB] border border-[#E5E1DB] rounded-xl p-3.5 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-40 text-left">
                            <div className="flex items-start justify-between gap-1 mb-1.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {book.hasHardcopy ? '✓ হার্ডকপি ও ফ্রি পাঠ' : '✓ অনলাইনে পড়ার জন্য'}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleSave(book.id);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                              </button>
                            </div>
                            <h5 className="font-serif text-xs font-bold text-[#1A1A1A] leading-snug line-clamp-2">
                              {book.title}
                            </h5>
                            <p className="text-[10px] text-[#8C8882] mt-0.5 line-clamp-1">{book.author}</p>
                            <div className="flex items-center justify-between my-2 text-xs text-[#5C5852]">
                              <span className="text-emerald-700 font-bold text-xs">ফ্রি পড়ুন</span>
                              {book.hasHardcopy ? (
                                <span className="text-[10px] font-bold text-[#1A1A1A] font-mono">মুদ্রিত কপি: {book.currency}{book.price}</span>
                              ) : (
                                <span className="text-[10px] text-[#8C8882] font-mono">{book.pages} পৃষ্ঠা</span>
                              )}
                            </div>

                            {/* Action buttons inside popover */}
                            <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-[#E5E1DB]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onReadBook(book);
                                }}
                                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-[#1A1A1A] hover:bg-neutral-800 text-white text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                <BookOpen className="w-3 h-3 text-[#E0C268]" />
                                <span>ফ্রি পড়ুন</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectBook(book);
                                }}
                                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-[#F2EFE9] hover:bg-[#E5E1DB] text-[#1A1A1A] text-[10px] font-medium border border-[#E5E1DB] transition-colors cursor-pointer"
                              >
                                <Info className="w-3 h-3" />
                                <span>বিস্তারিত</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 3D Wood Shelf Plank Baseline */}
                  <div className="h-4 shelf-wood-plank w-full rounded-sm" />
                </div>

                {/* Sublink below shelf in Editorial Style ("সব দেখুন →") */}
                <div className="flex justify-end mt-3 pr-1">
                  <button
                    onClick={() => onViewCategory(cat.id)}
                    className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] border-b border-[#1A1A1A] hover:border-transparent transition-all flex items-center gap-1.5 pb-0.5 cursor-pointer"
                  >
                    <span>সকল {cat.name} দেখুন</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
