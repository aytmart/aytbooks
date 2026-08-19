import React, { useState, useEffect, useRef } from 'react';
import { Book } from '../types';
import { CATEGORIES } from '../data/booksData';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';

interface SmartSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onSelectBook: (book: Book) => void;
  onReadBook: (book: Book) => void;
}

export const SmartSearchOverlay: React.FC<SmartSearchOverlayProps> = ({
  isOpen,
  onClose,
  books,
  onSelectBook,
  onReadBook
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim() === ''
    ? []
    : books.filter(b =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        (b.titleEn && b.titleEn.toLowerCase().includes(query.toLowerCase())) ||
        b.author.toLowerCase().includes(query.toLowerCase()) ||
        b.summary.toLowerCase().includes(query.toLowerCase()) ||
        b.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8);

  const quickTags = ['সৃষ্টিতত্ত্ব', 'মৃত্যু ও পরকাল', 'নামাজ', 'পারিবারিক জীবন', 'মোবাইল আসক্তি', 'শিশু-কিশোর', 'মানসিক শান্তি'];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#FDFCFB] rounded-2xl border border-[#E5E1DB] shadow-2xl p-5 sm:p-7 space-y-4 my-4 text-[#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#E5E1DB]">
          <Search className="w-5 h-5 text-[#1A1A1A]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="আপনি কোন বইটি পড়তে বা খুঁজতে চান?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 font-serif text-lg sm:text-xl text-[#1A1A1A] placeholder:text-[#8C8882] bg-transparent border-none outline-none"
            id="overlay-search-input"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F2EFE9] text-[#5C5852] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] uppercase tracking-wider text-[#8C8882] font-bold mr-1">জনপ্রিয় বিষয়:</span>
          {quickTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(tag)}
              className="text-xs px-2.5 py-1 rounded-md bg-[#F2EFE9] border border-[#E5E1DB] hover:bg-[#1A1A1A] hover:text-white text-[#5C5852] font-medium transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[55vh] overflow-y-auto divide-y divide-[#E5E1DB] pt-2">
          {query.trim() !== '' && results.length === 0 && (
            <div className="text-center py-8 text-sm text-[#8C8882] font-serif">
              <p>“{query}” সম্পর্কিত কোনো বই খুঁজে পাওয়া যায়নি।</p>
              <p className="text-xs text-[#8C8882] mt-1">অন্য কোনো বানান বা শব্দ লিখে চেষ্টা করুন।</p>
            </div>
          )}

          {results.map((book) => (
            <div
              key={book.id}
              onClick={() => {
                onSelectBook(book);
                onClose();
              }}
              className="p-3 rounded-xl hover:bg-[#F9F7F4] transition-colors flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-14 rounded-xs shrink-0 flex items-center justify-center text-[8px] text-white font-bold p-1 text-center line-clamp-2 book-shadow-editorial"
                  style={{ backgroundColor: book.coverColor }}
                >
                  {book.title.slice(0, 12)}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#1A1A1A] group-hover:text-neutral-700">
                    {book.title}
                  </h4>
                  <p className="text-xs text-[#8C8882] font-serif">{book.author} · <span className="font-mono">{book.pages} পৃষ্ঠা · {book.currency}{book.price}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReadBook(book);
                    onClose();
                  }}
                  className="hidden sm:inline-flex items-center gap-1 py-1 px-2.5 rounded-md bg-[#1A1A1A] text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-neutral-800"
                >
                  <BookOpen className="w-3 h-3 text-[#E0C268]" />
                  <span>পড়ুন</span>
                </button>
                <ArrowRight className="w-4 h-4 text-[#8C8882] group-hover:text-[#1A1A1A] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
