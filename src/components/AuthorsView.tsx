import React from 'react';
import { AUTHORS, BOOKS_DATA } from '../data/booksData';
import { Book, Author } from '../types';
import { BookOpen, User, Phone, CheckCircle2 } from 'lucide-react';

interface AuthorsViewProps {
  onSelectBook: (book: Book) => void;
  onReadBook: (book: Book) => void;
}

export const AuthorsView: React.FC<AuthorsViewProps> = ({ onSelectBook, onReadBook }) => {
  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C8882] font-bold block mb-2">
          Scholars & Writers
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-3">
          আমাদের শ্রদ্ধেয় লেখক ও গবেষকবৃন্দ
        </h1>
        <p className="text-sm sm:text-base text-[#5C5852] font-serif leading-relaxed">
          যাঁদের ঐকান্তিক গবেষণা ও লেখনীতে আলোকিত হচ্ছে বাংলা ভাষাভাষী পাঠকদের হৃদয়
        </p>
        <div className="w-16 h-0.5 bg-[#1A1A1A] mx-auto mt-4" />
      </div>

      {/* Authors List */}
      <div className="space-y-8">
        {AUTHORS.map((author) => {
          const authorBooks = BOOKS_DATA.filter(b => b.author.includes(author.name) || (author.id === 'ayt-books-editorial' && b.author.includes('AYT Books')));

          return (
            <div
              key={author.id}
              className="bg-[#F9F7F4] rounded-2xl border border-[#E5E1DB] p-6 sm:p-8 shadow-xs hover:border-[#1A1A1A] transition-colors"
            >
              {/* Author Profile Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E1DB] mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#F2EFE9] border border-[#E5E1DB] flex items-center justify-center text-2xl shadow-xs">
                    {author.avatarIcon}
                  </div>
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                      {author.name}
                    </h2>
                    <span className="text-xs sm:text-sm font-serif italic text-[#8C8882] block">
                      {author.role}
                    </span>
                    <p className="text-xs sm:text-sm text-[#5C5852] mt-1 max-w-xl font-serif leading-relaxed">
                      {author.bio}
                    </p>
                  </div>
                </div>

                {author.phone && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FDFCFB] border border-[#E5E1DB] text-xs font-mono text-[#1A1A1A]">
                    <Phone className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    <span>{author.phone}</span>
                  </div>
                )}
              </div>

              {/* Author's Books */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#8C8882] mb-4 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  <span>প্রকাশিত গ্রন্থসমূহ ({authorBooks.length} টি)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {authorBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => onSelectBook(book)}
                      className="bg-[#FDFCFB] border border-[#E5E1DB] rounded-xl p-2.5 cursor-pointer hover:border-[#1A1A1A] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div
                          className="aspect-[1/1.38] rounded-r-md rounded-l-xs flex flex-col justify-between p-2 text-white book-shadow-editorial text-[9px] mb-2"
                          style={{
                            backgroundColor: book.coverColor,
                            backgroundImage: `linear-gradient(135deg, ${book.coverColor} 0%, rgba(0,0,0,0.3) 100%)`
                          }}
                        >
                          <span className="text-[7px] text-[#E0C268] text-center font-bold font-sans">AYT BOOKS</span>
                          <span className="font-serif text-[10px] font-bold leading-tight line-clamp-3 text-center text-[#FDFCFB]">
                            {book.title}
                          </span>
                          <span className="text-[7px] text-[#E0C268] text-right font-mono font-bold">{book.currency}{book.price}</span>
                        </div>
                        <h5 className="font-serif text-xs font-bold text-[#1A1A1A] line-clamp-1">
                          {book.title}
                        </h5>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReadBook(book);
                        }}
                        className="mt-2 w-full py-1 text-center bg-[#1A1A1A] hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-md cursor-pointer transition-colors"
                      >
                        পড়ুন
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
