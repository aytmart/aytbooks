import React from 'react';
import { Book } from '../types';
import { AUTHORS } from '../data/booksData';
import { BookOpen } from 'lucide-react';

interface AuthorShelfProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onReadBook: (book: Book) => void;
}

export const AuthorShelf: React.FC<AuthorShelfProps> = ({ books, onSelectBook, onReadBook }) => {
  const author = AUTHORS.find((a) => a.id === 'syed-abdul-awal');
  const authorBooks = books.filter((b) => b.author.includes(author.name));
  if (!author || authorBooks.length === 0) return null;

  return (
    <section id="author-shelf" className="py-10 sm:py-14 bg-[#FDFCFB] border-b border-[#E5E1DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C8882] font-bold block mb-2">
            Syed Abdul Awal
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            {author.name}-এর বইসমূহ
          </h2>
          <div className="w-16 h-0.5 bg-[#1A1A1A] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {authorBooks.map((book) => (
            <div
              key={book.id}
              className="rounded-md overflow-hidden border border-[#E5E1DB] shadow-sm hover:shadow-lg transition-shadow flex flex-col"
            >
              <button
                onClick={() => onSelectBook(book)}
                className="flex-1 p-4 text-center text-white flex flex-col justify-center min-h-[150px] cursor-pointer"
                style={{ background: `linear-gradient(160deg, ${book.coverColor}, #111)` }}
              >
                <span className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: book.coverAccent }}>
                  AYT Books
                </span>
                <span className="font-serif text-sm sm:text-base font-bold leading-snug">{book.title}</span>
              </button>
              <button
                onClick={() => onReadBook(book)}
                className="py-2 px-3 bg-[#FDFCFB] text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#F2EFE9]"
              >
                <BookOpen className="w-3.5 h-3.5" />
                ফ্রি পড়ুন
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
