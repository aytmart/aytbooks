import React from 'react';
import { Book } from '../types';
import { WHATSAPP_CONTACT } from '../data/booksData';
import { X, BookOpen, MessageCircle, Heart, Share2, Star, CheckCircle, List, ArrowRight, FileText } from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onRead: (book: Book) => void;
  onOpenRoutine?: () => void;
  isSaved: boolean;
  onToggleSave: (bookId: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onRead,
  onOpenRoutine,
  isSaved,
  onToggleSave
}) => {
  if (!book) return null;

  const waOrderLink = `https://wa.me/${WHATSAPP_CONTACT.number}?text=${encodeURIComponent(
    `আসসালামু আলাইকুম, আমি AYT Books থেকে "${book.title}" (${book.titleEn || ''}) বইটি কিনতে চাই।\nমূল্য: ${book.currency}${book.price}\nডেলিভারি ও পেমেন্ট প্রসেস জানাবেন প্লিজ।`
  )}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `${book.title} — ${book.summary}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('বইয়ের লিঙ্ক কপি করা হয়েছে!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#FDFCFB] border border-[#E5E1DB] rounded-2xl sm:rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl my-auto text-[#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#F2EFE9] hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          aria-label="Close"
          id="close-book-detail-btn"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Book Cover & Quick Meta */}
          <div className="md:col-span-5 bg-[#F9F7F4] p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#E5E1DB] text-center">
            {/* 3D Visual Book Cover */}
            <div
              className="w-44 sm:w-48 aspect-[1/1.44] rounded-r-md rounded-l-xs overflow-hidden flex flex-col justify-between p-4 text-white book-shadow-editorial book-spine-effect relative border-y border-r border-white/25 shadow-xl transform hover:scale-102 transition-transform my-4"
              style={{
                backgroundColor: book.coverColor,
                backgroundImage: `linear-gradient(135deg, ${book.coverColor} 0%, rgba(0,0,0,0.4) 100%), radial-gradient(circle at top right, ${book.coverAccent}44, transparent 70%)`
              }}
            >
              <div className="border-t border-b border-[#C9A227]/40 py-1">
                <span className="text-[9px] tracking-widest text-[#E0C268] uppercase font-sans font-bold">
                  AYT DIGITAL ARCHIVE
                </span>
              </div>

              <div className="my-auto py-2">
                <h3 className="font-serif text-base sm:text-lg font-bold leading-snug text-[#FDFCFB] drop-shadow-md">
                  {book.title}
                </h3>
                {book.titleEn && (
                  <p className="text-[10px] text-[#E0C268] mt-1 font-sans italic opacity-85">{book.titleEn}</p>
                )}
                <p className="text-[9px] text-white/75 mt-2">{book.author}</p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#E0C268] border-t border-[#C9A227]/30 pt-1.5 font-mono">
                <span className="font-bold">{book.currency}{book.price}</span>
                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded text-white font-medium">ফ্রি পড়ুন</span>
              </div>
            </div>

            {/* Quick Meta Checklist */}
            <div className="w-full space-y-1.5 text-xs text-[#5C5852] pt-2 border-t border-[#E5E1DB] text-left">
              <div className="flex justify-between py-1 border-b border-dashed border-[#E5E1DB]">
                <span className="text-[#8C8882]">লেখক/সংকলক:</span>
                <span className="font-semibold text-[#1A1A1A]">{book.author}</span>
              </div>
              {book.editor && (
                <div className="flex justify-between py-1 border-b border-dashed border-[#E5E1DB]">
                  <span className="text-[#8C8882]">সম্পাদনা:</span>
                  <span className="font-medium text-[#1A1A1A]">{book.editor}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-dashed border-[#E5E1DB]">
                <span className="text-[#8C8882]">প্রকাশক:</span>
                <span className="font-medium text-[#1A1A1A]">{book.publisher}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-[#E5E1DB]">
                <span className="text-[#8C8882]">পৃষ্ঠা সংখ্যা:</span>
                <span className="font-bold text-[#1A1A1A] font-mono">{book.pages} পৃষ্ঠা</span>
              </div>
              {book.isbn && (
                <div className="flex justify-between py-1 border-b border-dashed border-[#E5E1DB]">
                  <span className="text-[#8C8882]">ISBN:</span>
                  <span className="font-mono text-[#1A1A1A]">{book.isbn}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information, TOC & Action Buttons */}
          <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Tags Header */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-wider">
                  {book.category === 'islamic' ? '🕌 ইসলামিক' : book.category === 'kids' ? '👤 শিশু-কিশোর' : book.category === 'education' ? '🎓 শিক্ষামূলক' : '❤️ জীবন ঘনিষ্ঠ'}
                </span>
                {book.isBestseller && (
                  <span className="px-2 py-0.5 rounded-md bg-[#F2EFE9] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider border border-[#E5E1DB]">
                    জনপ্রিয়
                  </span>
                )}
                {book.isNewRelease && (
                  <span className="px-2 py-0.5 rounded-md bg-[#F2EFE9] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider border border-[#E5E1DB]">
                    নতুন প্রকাশনা
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] leading-tight mb-1">
                {book.title}
              </h2>
              {book.subtitle && (
                <p className="text-sm text-[#5C5852] font-serif italic mb-3">{book.subtitle}</p>
              )}

              {/* Free Announcement & Price/Rating Box */}
              <div className="my-4 space-y-2">
                {/* Free Reading Ribbon */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                      ✓
                    </span>
                    <div>
                      <span className="font-serif text-xs sm:text-sm font-bold text-emerald-950 block">
                        {book.hasHardcopy 
                          ? 'অনলাইনে পড়ার সুযোগ এবং হার্ডকপি অর্ডারযোগ্য' 
                          : 'অনলাইনে সম্পূর্ণ পড়ার জন্য উন্মুক্ত'}
                      </span>
                      <span className="text-[11px] text-emerald-800">
                        {book.hasHardcopy
                          ? 'অনলাইনে ফ্রি পড়তে পারবেন অথবা মুদ্রিত কপি অর্ডার করতে পারবেন'
                          : 'বিনা খরচে আসল বইয়ের মতো পাতা উল্টে অনলাইনে পড়ুন'}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider">
                    ফ্রি পড়ুন
                  </span>
                </div>

                {/* Hardcopy and Rating details (Only if hasHardcopy) */}
                {book.hasHardcopy ? (
                  <div className="flex items-center justify-between p-3.5 bg-[#F9F7F4] rounded-xl border border-[#E5E1DB]">
                    <div>
                      <span className="text-[10px] text-[#8C8882] uppercase tracking-wider block">
                        মুদ্রিত হার্ডকপি মূল্য
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-2xl font-bold text-[#1A1A1A]">
                          {book.currency}{book.price}
                        </span>
                        {book.originalPrice && (
                          <span className="text-xs text-[#8C8882] line-through font-mono">
                            {book.currency}{book.originalPrice}
                          </span>
                        )}
                        <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100/70 px-1.5 py-0.5 rounded">
                          হোম ডেলিভারি
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1A1A1A] bg-[#F2EFE9] border border-[#E5E1DB] px-2 py-1 rounded">
                        <Star className="w-3.5 h-3.5 fill-[#E0C268] text-[#E0C268]" />
                        <span className="font-mono">{book.rating || 5.0} / 5.0</span>
                      </span>
                      <span className="text-[10px] text-[#5C5852] font-medium block mt-0.5">{book.pages} পৃষ্ঠা · {book.language}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-[#F9F7F4] rounded-xl border border-[#E5E1DB]">
                    <div>
                      <span className="text-[10px] text-[#8C8882] uppercase tracking-wider block">
                        পাঠের ধরন
                      </span>
                      <span className="font-serif text-sm font-bold text-[#1A1A1A]">
                        অনলাইনে পড়ার জন্য
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1A1A1A] bg-[#F2EFE9] border border-[#E5E1DB] px-2 py-1 rounded">
                        <Star className="w-3.5 h-3.5 fill-[#E0C268] text-[#E0C268]" />
                        <span className="font-mono">{book.rating || 5.0} / 5.0</span>
                      </span>
                      <span className="text-[10px] text-[#5C5852] font-medium block mt-0.5">{book.pages} পৃষ্ঠা · {book.language}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Book Summary */}
              <div className="space-y-2 mb-4">
                <h4 className="text-xs uppercase tracking-widest font-bold text-[#8C8882] flex items-center gap-1.5">
                  <span>বই সংক্ষেপ ও পরিচয়</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed font-serif">
                  {book.summary}
                </p>
              </div>

              {/* Special Pregnancy Routine Button if applicable */}
              {book.specialType === 'pregnancy_routine' && onOpenRoutine && (
                <div className="my-3 p-3.5 bg-[#F9F7F4] border border-[#E5E1DB] rounded-xl flex items-center justify-between">
                  <div className="text-xs text-[#1A1A1A]">
                    <strong className="block font-serif text-sm">গর্ভবতী মায়ের ২৪ ঘণ্টার পূর্ণাঙ্গ রুটিন</strong>
                    <p className="text-[11px] text-[#5C5852]">সময়ভিত্তিক খাদ্যতালিকা, আমল ও সিজারিয়ান সতর্কতা চার্ট</p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenRoutine();
                    }}
                    className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-neutral-800 text-white text-xs font-bold rounded-md shrink-0 shadow-xs uppercase tracking-wider cursor-pointer"
                  >
                    চার্ট খুলুন →
                  </button>
                </div>
              )}

              {/* Table of Contents / Stories list preview */}
              {book.tableOfContents && book.tableOfContents.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-[#8C8882] flex items-center gap-1.5">
                    <List className="w-4 h-4 text-[#1A1A1A]" />
                    <span>সূচিপত্র ও গল্পসমূহ ({book.tableOfContents.length}টি অধ্যায়)</span>
                  </h4>
                  <div className="max-h-36 overflow-y-auto bg-[#F9F7F4] p-3 rounded-lg border border-[#E5E1DB] text-xs space-y-1.5">
                    {book.tableOfContents.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 py-0.5 text-[#5C5852] hover:text-[#1A1A1A]">
                        <span className="text-[10px] font-mono text-[#8C8882]">{idx + 1}.</span>
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {book.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] uppercase tracking-wider bg-[#F2EFE9] text-[#5C5852] px-2 py-0.5 rounded border border-[#E5E1DB]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions Buttons */}
            <div className="pt-4 border-t border-[#E5E1DB] flex flex-col sm:flex-row items-center gap-3">
              {/* Read Online Button */}
              <button
                onClick={() => {
                  onClose();
                  onRead(book);
                }}
                className={`w-full py-3 px-4 rounded-md bg-[#1A1A1A] hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                  book.hasHardcopy ? 'sm:flex-1' : 'sm:flex-1'
                }`}
                id="modal-read-online-btn"
              >
                <BookOpen className="w-4 h-4 text-[#E0C268]" />
                <span>{book.hasHardcopy ? 'অনলাইনে ফ্রি পড়ুন' : 'সম্পূর্ণ বইটি ফ্রি পড়ুন'}</span>
              </button>

              {/* WhatsApp Order Button (ONLY for books that have printed hardcopy like 'সৃষ্টিকর্তা কে?') */}
              {book.hasHardcopy && (
                <a
                  href={waOrderLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 rounded-md bg-[#1F7A4D] hover:bg-[#18603C] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  id="modal-whatsapp-order-btn"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>হার্ডকপি অর্ডার ({book.currency}{book.price})</span>
                </a>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {/* Save / Wishlist Toggle */}
                <button
                  onClick={() => onToggleSave(book.id)}
                  className={`p-3 rounded-md border transition-colors cursor-pointer flex-1 sm:flex-none flex items-center justify-center ${
                    isSaved
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-[#F2EFE9] border-[#E5E1DB] text-[#1A1A1A] hover:bg-[#E5E1DB]'
                  }`}
                  title={isSaved ? 'সংরক্ষিত থেকে সরান' : 'পড়ার তালিকায় রাখুন'}
                  id="modal-toggle-save-btn"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-600' : ''}`} />
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-3 rounded-md border border-[#E5E1DB] bg-[#F2EFE9] text-[#1A1A1A] hover:bg-[#E5E1DB] transition-colors cursor-pointer flex-1 sm:flex-none flex items-center justify-center"
                  title="বন্ধুদের সাথে শেয়ার করুন"
                  id="modal-share-btn"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
