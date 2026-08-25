import React from 'react';
import { Book, BookshelfCategory } from '../../types';
import { BookOpen, ArrowRight, Star } from 'lucide-react';

interface Classic2DLibraryProps {
  categories: BookshelfCategory[];
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export const Classic2DLibrary: React.FC<Classic2DLibraryProps> = ({
  categories,
  books,
  onSelectBook,
}) => {
  return (
    <div
      id="ayt-classic-2d-library-view"
      className="w-full h-full overflow-y-auto p-4 sm:p-10 pt-20 pb-36 space-y-12 bg-gradient-to-b from-[#14100b] to-[#0c0906] text-stone-200"
    >
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#d4af37] tracking-widest uppercase font-['Cinzel']">
          AYT BOOKS VIRTUAL ARCHIVE
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold text-white font-['Hind_Siliguri']">
          ডিজিটাল বুকশেলফ সংগ্রহশালা
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 font-['Hind_Siliguri']">
          যেকোনো বই নির্বাচন করে পড়ার টেবিলে খুলুন এবং সম্পূর্ণ বিনামূল্যে পড়ুন।
        </p>
      </div>

      {/* 5 Shelf Sections */}
      {categories.map((category, catIdx) => {
        const shelfBooks = books.filter((b) => b.shelfIndex === catIdx);

        return (
          <section key={category.id} className="space-y-4 max-w-6xl mx-auto">
            {/* Shelf Header Banner */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-900/80 border border-[#d4af37]/30 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] font-bold">
                  {catIdx + 1}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white font-['Hind_Siliguri']">
                    {category.banglaTitle}
                  </h2>
                  <span className="text-xs text-[#d4af37] font-['Cinzel'] tracking-wider uppercase">
                    {category.title}
                  </span>
                </div>
              </div>

              <span className="text-xs text-stone-400 font-mono">
                {shelfBooks.length} টি বই
              </span>
            </div>

            {/* Bookshelf Shelf Unit with 3D-styled Books */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-[#281a11] border-4 border-[#3b2413] shadow-2xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {shelfBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    {/* Realistic 3D Book Cover Card */}
                    <div
                      className="relative w-full aspect-[3/4.2] rounded-r-xl rounded-l-sm shadow-xl p-4 flex flex-col justify-between text-center overflow-hidden border-2 border-[#d4af37]/40 transform group-hover:-translate-y-2 transition-all duration-300"
                      style={{ backgroundColor: book.coverColor }}
                    >
                      {/* Leather overlay & Spine shadow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30 pointer-events-none" />
                      <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />

                      {/* Gold border */}
                      <div className="absolute inset-2 border border-[#d4af37]/40 rounded-sm pointer-events-none" />

                      <div className="relative z-10 text-[9px] tracking-widest text-[#d4af37] font-['Cinzel'] uppercase">
                        AYT BOOKS
                      </div>

                      <div className="relative z-10 my-auto">
                        <div className="text-xs font-serif text-[#d4af37] mb-1">✦</div>
                        <h3 className="text-sm sm:text-base font-bold text-white font-['Hind_Siliguri'] leading-tight drop-shadow">
                          {book.banglaTitle}
                        </h3>
                        {book.subtitle && (
                          <p className="text-[10px] text-stone-300 font-['Hind_Siliguri'] mt-1 line-clamp-2">
                            {book.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="relative z-10 text-[11px] text-[#e5c158] font-['Hind_Siliguri'] font-medium truncate">
                        {book.author}
                      </div>
                    </div>

                    {/* Book Details underneath */}
                    <div className="w-full mt-2.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBook(book);
                        }}
                        className="w-full py-1.5 rounded-xl bg-stone-900/90 hover:bg-[#d4af37] text-stone-300 hover:text-stone-950 text-xs font-['Hind_Siliguri'] font-semibold border border-stone-700/60 transition-all flex items-center justify-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>টেবিলে পড়ুন</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wooden Shelf Base Planks */}
              <div className="w-full h-3 bg-[#1e130c] border-t border-[#3b2413] mt-6 rounded-b" />
            </div>
          </section>
        );
      })}
    </div>
  );
};
