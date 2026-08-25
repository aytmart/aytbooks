import React, { useState, useEffect } from 'react';
import { X, Clock, Bookmark as BookmarkIcon, CloudOff, Download, Check, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { Book, Bookmark, ReadingProgress } from '../../types';
import { StorageService } from '../../services/storageService';

interface MyBooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onSelectBook: (book: Book, startPage?: number) => void;
  initialTab?: 'continue' | 'bookmarks' | 'offline';
}

export const MyBooksModal: React.FC<MyBooksModalProps> = ({
  isOpen,
  onClose,
  books,
  onSelectBook,
  initialTab = 'continue',
}) => {
  const [activeTab, setActiveTab] = useState<'continue' | 'bookmarks' | 'offline'>(initialTab);
  const [progressMap, setProgressMap] = useState<Record<string, ReadingProgress>>({});
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [offlineIds, setOfflineIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setProgressMap(StorageService.getAllProgress());
      setBookmarks(StorageService.getBookmarks());
      setOfflineIds(StorageService.getOfflineBookIds());
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleToggleOffline = (bookId: string) => {
    StorageService.toggleOfflineBook(bookId);
    setOfflineIds(StorageService.getOfflineBookIds());
  };

  const handleDeleteBookmark = (b: Bookmark) => {
    StorageService.removeBookmark(b.bookId, b.pageNumber);
    setBookmarks(StorageService.getBookmarks());
  };

  const booksWithProgress = books.filter((b) => progressMap[b.id]);

  return (
    <div
      id="ayt-my-books-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        id="ayt-my-books-modal-box"
        className="w-full max-w-3xl max-h-[85vh] rounded-3xl bg-stone-900 border border-[#d4af37]/40 shadow-2xl flex flex-col overflow-hidden text-stone-200"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#d4af37] tracking-widest uppercase font-['Cinzel']">
              PERSONAL LIBRARY
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Hind_Siliguri'] mt-0.5">
              আমার বই ও সংরক্ষিত তথ্য
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 bg-stone-950/70 border-b border-stone-800 flex items-center gap-3 text-xs font-['Hind_Siliguri'] font-semibold">
          <button
            onClick={() => setActiveTab('continue')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'continue'
                ? 'bg-[#d4af37] text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>পড়া চালিয়ে যান ({booksWithProgress.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-[#d4af37] text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <BookmarkIcon className="w-4 h-4" />
            <span>বুকমার্কস ({bookmarks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('offline')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'offline'
                ? 'bg-[#d4af37] text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <CloudOff className="w-4 h-4" />
            <span>অফলাইন রিডার ({offlineIds.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: Continue Reading */}
          {activeTab === 'continue' && (
            <div>
              {booksWithProgress.length === 0 ? (
                <div className="text-center py-12 text-stone-400 font-['Hind_Siliguri']">
                  <Clock className="w-10 h-10 mx-auto text-stone-600 mb-3" />
                  <p className="text-base font-semibold">এখনো কোনো বই পড়া শুরু করেননি</p>
                  <p className="text-xs text-stone-500 mt-1">লাইব্রেরি থেকে যেকোনো বই নির্বাচন করে পড়া শুরু করুন</p>
                </div>
              ) : (
                booksWithProgress.map((book) => {
                  const progress = progressMap[book.id];
                  return (
                    <div
                      key={book.id}
                      className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/60 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-12 h-16 rounded-md shadow flex items-center justify-center text-center p-1 text-[8px] font-bold text-white shrink-0"
                          style={{ backgroundColor: book.coverColor }}
                        >
                          <span className="line-clamp-2">{book.banglaTitle}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-white font-['Hind_Siliguri'] truncate">
                            {book.banglaTitle}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-stone-400 mt-1 font-['Hind_Siliguri']">
                            <span>বর্তমান পৃষ্ঠা: <strong className="text-[#d4af37] font-mono">{progress.currentPage}</strong> / {book.pagesCount}</span>
                            <span>•</span>
                            <span>{progress.percent}% সম্পন্ন</span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full h-1.5 bg-stone-700 rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-[#d4af37]"
                              style={{ width: `${progress.percent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectBook(book, progress.currentPage);
                          onClose();
                        }}
                        className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-stone-950 text-xs font-bold font-['Hind_Siliguri'] flex items-center gap-1.5 shrink-0 shadow"
                      >
                        <span>চালিয়ে যান</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: Bookmarks */}
          {activeTab === 'bookmarks' && (
            <div>
              {bookmarks.length === 0 ? (
                <div className="text-center py-12 text-stone-400 font-['Hind_Siliguri']">
                  <BookmarkIcon className="w-10 h-10 mx-auto text-stone-600 mb-3" />
                  <p className="text-base font-semibold">কোনো বুকমার্ক সংরক্ষিত নেই</p>
                  <p className="text-xs text-stone-500 mt-1">পড়ার সময় বুকমার্ক আইকনে ক্লিক করে পৃষ্ঠা সংরক্ষণ করুন</p>
                </div>
              ) : (
                bookmarks.map((bm) => {
                  const book = books.find((b) => b.id === bm.bookId);
                  return (
                    <div
                      key={bm.id}
                      className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/60 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-[#d4af37] font-['Cinzel']">
                          <span>{book?.banglaTitle || 'Book'}</span>
                          <span>•</span>
                          <span className="font-mono">পৃষ্ঠা {bm.pageNumber}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-['Hind_Siliguri'] mt-0.5">
                          {bm.title}
                        </h4>
                        <p className="text-xs text-stone-400 italic mt-1 font-['Hind_Siliguri'] line-clamp-2">
                          “{bm.snippet}”
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleDeleteBookmark(bm)}
                          className="p-2 rounded-xl bg-stone-700/60 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300"
                          title="বুকমার্ক মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (book) {
                              onSelectBook(book, bm.pageNumber);
                              onClose();
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#d4af37] text-stone-950 font-bold text-xs font-['Hind_Siliguri']"
                        >
                          খুলুন
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: Offline Download Manager */}
          {activeTab === 'offline' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 font-['Hind_Siliguri'] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-emerald-400">অফলাইন স্টোরেজ সক্রিয়</div>
                  <p className="text-[11px] text-emerald-300/80 mt-0.5">
                    ইন্টারনেট সংযোগ ছাড়াও যেকোনো সময় এই বইগুলো পড়তে পারবেন।
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 font-mono text-[11px]">
                  {offlineIds.length} বই সংরক্ষিত
                </span>
              </div>

              {books.map((book) => {
                const isOffline = offlineIds.includes(book.id);
                return (
                  <div
                    key={book.id}
                    className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/60 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-14 rounded shadow flex items-center justify-center p-1 text-[7px] font-bold text-white shrink-0"
                        style={{ backgroundColor: book.coverColor }}
                      >
                        <span className="line-clamp-2">{book.banglaTitle}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-['Hind_Siliguri']">
                          {book.banglaTitle}
                        </h4>
                        <span className="text-xs text-stone-400 font-mono">
                          সাইজ: {book.fileSize} • {book.pagesCount} পৃষ্ঠা
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleOffline(book.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-['Hind_Siliguri'] font-semibold flex items-center gap-1.5 transition-all ${
                        isOffline
                          ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 hover:bg-rose-900/40 hover:text-rose-300 hover:border-rose-500/50'
                          : 'bg-stone-700 hover:bg-[#d4af37] text-stone-200 hover:text-stone-950'
                      }`}
                    >
                      {isOffline ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>সংরক্ষিত (মুছুন)</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>অফলাইনে সংরক্ষণ</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
