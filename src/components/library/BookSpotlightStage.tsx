import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Book } from '../../types';
import { soundEngine } from '../../utils/audio';
import { BookOpen, Library, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface BookSpotlightStageProps {
  book: Book;
  onOpenBook: (book: Book) => void;
  onBackToLibrary: () => void;
  reducedMotion: boolean;
}

export const BookSpotlightStage: React.FC<BookSpotlightStageProps> = ({
  book,
  onOpenBook,
  onBackToLibrary,
  reducedMotion,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const progress = StorageService.getProgress(book.id);

  const handleOpen = () => {
    soundEngine.playPageTurn();
    onOpenBook(book);
  };

  const handleBack = () => {
    soundEngine.playBookThud();
    onBackToLibrary();
  };

  return (
    <div
      id="book-spotlight-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-in fade-in duration-300 select-none overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleBack();
        }
      }}
    >
      {/* Ambient Chandelier Spotlight Effect */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-[#d4af37]/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-2xl bg-gradient-to-b from-stone-900/95 via-stone-950/95 to-black/95 border border-[#d4af37]/50 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row items-center p-6 md:p-8 gap-6 md:gap-8 my-auto">
        {/* Top Gold Corner Accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#d4af37]/70 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#d4af37]/70 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#d4af37]/70 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#d4af37]/70 rounded-br-2xl pointer-events-none" />

        {/* 3D Floating Book Showcase (Left Column) */}
        <div className="flex flex-col items-center justify-center flex-shrink-0">
          <motion.div
            id="spotlight-3d-book"
            initial={reducedMotion ? {} : { scale: 0.7, y: -60, rotateY: 30, opacity: 0 }}
            animate={reducedMotion ? {} : { scale: 1, y: 0, rotateY: isHovered ? -10 : 12, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleOpen}
            className="relative w-48 h-68 sm:w-56 sm:h-80 rounded-r-xl shadow-2xl cursor-pointer group transform perspective-[1000px] transition-transform duration-300"
            style={{
              backgroundColor: book.coverColor,
              boxShadow: isHovered
                ? '0 30px 60px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(212, 175, 55, 0.4)'
                : '0 20px 45px -10px rgba(0, 0, 0, 0.85), 0 0 25px rgba(212, 175, 55, 0.2)',
            }}
            title="বইটি পড়তে ক্লিক করুন"
          >
            {/* Outer Gold Border */}
            <div className="absolute inset-2 border-2 border-[#d4af37]/80 rounded-r-lg pointer-events-none" />
            <div className="absolute inset-4 border border-[#d4af37]/40 rounded-r-sm pointer-events-none" />

            {/* Spine Highlight */}
            <div className="absolute top-0 bottom-0 left-0 w-5 bg-gradient-to-r from-black/70 via-black/20 to-transparent rounded-l-sm" />

            {/* Book Front Art */}
            <div className="relative z-10 p-6 flex flex-col items-center justify-between h-full text-center">
              <div className="text-[10px] tracking-widest text-[#d4af37] font-['Cinzel'] uppercase font-bold">
                AYT LIBRARY
              </div>

              <div className="my-auto">
                <div className="w-10 h-10 rounded-full border border-[#d4af37]/70 flex items-center justify-center text-[#d4af37] text-sm mx-auto mb-2 group-hover:scale-110 transition-transform">
                  ✦
                </div>
                <h3 className="text-lg font-bold text-white font-['Hind_Siliguri'] leading-tight drop-shadow-md">
                  {book.banglaTitle}
                </h3>
                {book.subtitle && (
                  <p className="text-[11px] text-stone-300 font-['Hind_Siliguri'] mt-1 line-clamp-2">
                    {book.subtitle}
                  </p>
                )}
              </div>

              <div className="text-xs font-medium text-[#f1c40f] font-['Hind_Siliguri']">
                {book.author}
              </div>
            </div>

            {/* Click to open badge hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-xl flex items-center justify-center z-20">
              <span className="px-3 py-1.5 rounded-full bg-[#d4af37] text-stone-950 font-bold font-['Hind_Siliguri'] text-xs shadow-lg flex items-center gap-1.5 transform scale-90 group-hover:scale-100 transition-transform">
                <BookOpen className="w-3.5 h-3.5" />
                ক্লিক করে পড়ুন
              </span>
            </div>
          </motion.div>

          <span className="text-[11px] text-stone-400 font-['Hind_Siliguri'] mt-2.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            বইটিতে ক্লিক করলেও পড়া শুরু হবে
          </span>
        </div>

        {/* Book Details & 2 Major Buttons (Right Column) */}
        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            {/* Category Tag & Page Count */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f1c40f] text-xs font-['Hind_Siliguri'] font-medium">
                {book.category}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {book.pagesCount} পৃষ্ঠা
              </span>
            </div>

            {/* Title & Author */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Hind_Siliguri'] leading-snug drop-shadow">
              {book.banglaTitle}
            </h2>
            <p className="text-sm text-[#e5c158] font-['Hind_Siliguri'] mt-0.5">
              লেখক: <span className="font-semibold text-stone-200">{book.author}</span>
            </p>

            {/* Description */}
            <div className="mt-4 p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 text-stone-300 text-xs sm:text-sm font-['Hind_Siliguri'] leading-relaxed max-h-36 overflow-y-auto">
              {book.description || 'এই গ্রন্থটিতে গভীর আধ্যাত্মিক ও শিক্ষণীয় জ্ঞান সন্নিবেশিত রয়েছে। সহজে পাঠযোগ্য ফন্টে বইটি পড়ার টেবিলে উপভোগ করুন।'}
            </div>

            {/* Reading Progress if started */}
            {progress && (
              <div className="mt-3 flex items-center gap-2 text-xs text-stone-300 font-['Hind_Siliguri'] bg-[#1a291f] border border-[#2b523a] px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-[#4ade80]" />
                <span>আপনি {progress.currentPage} পৃষ্ঠায় ছিলেন ({progress.percent}%)</span>
              </div>
            )}
          </div>

          {/* THE 2 ACTION BUTTONS: "বইটি পড়ুন" and "লাইব্রেরিতে ফিরে যান" */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-stone-800">
            {/* Button 1: Open Book */}
            <button
              id="spotlight-open-book-btn"
              onClick={handleOpen}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f1c40f] text-stone-950 font-bold font-['Hind_Siliguri'] text-sm sm:text-base shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <BookOpen className="w-5 h-5 text-stone-950" />
              <span>বইটি পড়ুন (Open Book)</span>
            </button>

            {/* Button 2: Back to Library */}
            <button
              id="spotlight-back-library-btn"
              onClick={handleBack}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white font-medium font-['Hind_Siliguri'] text-sm sm:text-base active:scale-[0.98] transition-all"
            >
              <Library className="w-4 h-4 text-[#d4af37]" />
              <span>লাইব্রেরিতে ফিরে যান (Library)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
