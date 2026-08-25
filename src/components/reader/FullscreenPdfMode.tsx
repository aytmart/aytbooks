import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Search,
  Bookmark as BookmarkIcon,
  BookmarkCheck,
  Sidebar,
  Sliders,
} from 'lucide-react';
import { Book, ReadingSettings } from '../../types';
import { StorageService } from '../../services/storageService';

interface FullscreenPdfModeProps {
  book: Book;
  currentPage: number;
  onPageChange: (page: number) => void;
  onBackToLibrary: () => void;
  settings: ReadingSettings;
  onOpenSettingsModal: () => void;
}

export const FullscreenPdfMode: React.FC<FullscreenPdfModeProps> = ({
  book,
  currentPage,
  onPageChange,
  onBackToLibrary,
  settings,
  onOpenSettingsModal,
}) => {
  const [zoom, setZoom] = useState(100);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsBookmarked(StorageService.isPageBookmarked(book.id, currentPage));
  }, [book.id, currentPage]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      StorageService.removeBookmark(book.id, currentPage);
      setIsBookmarked(false);
    } else {
      const pageData = book.pages.find((p) => p.pageNumber === currentPage);
      StorageService.addBookmark({
        id: `${book.id}_${currentPage}_${Date.now()}`,
        bookId: book.id,
        pageNumber: currentPage,
        title: pageData?.chapterTitle || book.banglaTitle,
        snippet: pageData?.content.slice(0, 60) + '...' || `পৃষ্ঠা ${currentPage}`,
        createdAt: Date.now(),
      });
      setIsBookmarked(true);
    }
  };

  const pageData = book.pages.find((p) => p.pageNumber === currentPage) || {
    pageNumber: currentPage,
    content: `[পৃষ্ঠা ${currentPage} এর ডিজিটাল প্রতিলিপি]`,
  };

  return (
    <div
      id="ayt-fullscreen-pdf-view"
      className="relative w-full h-full flex flex-col bg-[#2b2b2b] text-stone-100 overflow-hidden select-text"
    >
      {/* Top PDF Toolbar */}
      <header className="w-full px-4 py-2 bg-[#1f1f1f] border-b border-stone-700 flex items-center justify-between z-20 text-xs">
        <div className="flex items-center gap-3">
          <button
            id="pdf-back-btn"
            onClick={onBackToLibrary}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-700 hover:bg-stone-600 text-stone-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">লাইব্রেরি</span>
          </button>

          <button
            id="pdf-toggle-sidebar-btn"
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-1.5 rounded transition-colors ${
              showThumbnails ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'hover:bg-stone-700 text-stone-300'
            }`}
            title="থাম্বনেইল সাইডবার"
          >
            <Sidebar className="w-4 h-4" />
          </button>

          <span className="font-semibold text-stone-200 truncate max-w-xs font-['Hind_Siliguri']">
            {book.banglaTitle}.pdf
          </span>
        </div>

        {/* Page Jump */}
        <div className="flex items-center gap-2">
          <button
            id="pdf-prev-page-btn"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1 rounded hover:bg-stone-700 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 font-mono">
            <input
              type="number"
              min={1}
              max={book.pagesCount}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1 && val <= book.pagesCount) onPageChange(val);
              }}
              className="w-12 px-1.5 py-0.5 text-center bg-stone-900 border border-stone-600 rounded text-stone-100"
            />
            <span className="text-stone-400">/ {book.pagesCount}</span>
          </div>
          <button
            id="pdf-next-page-btn"
            onClick={() => onPageChange(Math.min(book.pagesCount, currentPage + 1))}
            disabled={currentPage >= book.pagesCount}
            className="p-1 rounded hover:bg-stone-700 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom & Tools */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 bg-stone-800 px-2 py-0.5 rounded border border-stone-700">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 15))}
              className="p-1 hover:text-[#d4af37]"
              title="জুম কমান"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 15))}
              className="p-1 hover:text-[#d4af37]"
              title="জুম বাড়ান"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded ${
              isBookmarked ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'hover:bg-stone-700 text-stone-300'
            }`}
            title="বুকমার্ক"
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded hover:bg-stone-700 text-stone-300"
            title="ফুলস্ক্রিন"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenSettingsModal}
            className="p-1.5 rounded hover:bg-stone-700 text-stone-300"
            title="সেটিংস"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Body: Sidebar Thumbnails + Main Document Page */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Thumbnails Strip */}
        {showThumbnails && (
          <aside
            id="pdf-thumbnails-sidebar"
            className="w-44 bg-[#212121] border-r border-stone-700 overflow-y-auto p-3 flex flex-col gap-3"
          >
            <div className="text-[11px] font-bold text-stone-400 font-['Hind_Siliguri'] uppercase tracking-wider mb-1">
              পৃষ্ঠা সূচি
            </div>
            {Array.from({ length: book.pagesCount }, (_, i) => i + 1).map((pNum) => {
              const pItem = book.pages.find((p) => p.pageNumber === pNum);
              const isActive = pNum === currentPage;
              return (
                <button
                  key={pNum}
                  onClick={() => onPageChange(pNum)}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-[#d4af37]/20 border-2 border-[#d4af37] text-white'
                      : 'bg-stone-800/80 hover:bg-stone-700 border border-stone-700 text-stone-300'
                  }`}
                >
                  <div className="w-full h-24 bg-[#fffdfa] rounded shadow flex flex-col justify-between p-1.5 overflow-hidden text-[#1c1917] text-[7px] leading-tight select-none">
                    <span className="font-bold border-b border-stone-200 pb-0.5 truncate text-[6px]">
                      {pItem?.chapterTitle || book.banglaTitle}
                    </span>
                    <span className="line-clamp-4 text-stone-600">
                      {pItem?.content || `পৃষ্ঠা ${pNum}`}
                    </span>
                    <span className="text-right text-[6px] text-stone-400 font-mono">{pNum}</span>
                  </div>
                  <span className="text-[10px] mt-1.5 font-mono">{pNum}</span>
                </button>
              );
            })}
          </aside>
        )}

        {/* Main Document Canvas View */}
        <main
          ref={pageContainerRef}
          className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center bg-[#383838]"
        >
          <div
            id="pdf-rendered-page-sheet"
            className="bg-[#ffffff] text-[#111111] rounded-sm shadow-2xl transition-transform duration-200 origin-top flex flex-col p-10 sm:p-16"
            style={{
              width: `${(zoom / 100) * 680}px`,
              minHeight: `${(zoom / 100) * 960}px`,
              fontFamily: settings.fontFamily,
              fontSize: `${(settings.fontSize * zoom) / 100}px`,
              lineHeight: settings.lineHeight,
            }}
          >
            {/* Document Header */}
            <div className="flex items-center justify-between border-b border-stone-300 pb-3 mb-6 text-xs text-stone-500 font-['Cinzel'] tracking-widest uppercase">
              <span>{pageData.headerText || `${book.banglaTitle} • পৃষ্ঠা ${currentPage}`}</span>
              <span>AYT BOOKS</span>
            </div>

            {/* Chapter Header */}
            {pageData.chapterTitle && (
              <div className="text-center my-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1b3d2f] font-['Hind_Siliguri']">
                  {pageData.chapterTitle}
                </h1>
                <div className="text-sm text-[#d4af37] font-serif mt-1">— ✦ —</div>
              </div>
            )}

            {/* Arabic / Quran block */}
            {pageData.verseArabic && (
              <div className="my-4 p-4 bg-stone-50 border-l-4 border-[#1b3d2f] text-right font-serif text-lg leading-loose">
                {pageData.verseArabic}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 whitespace-pre-line tracking-wide">
              {pageData.content}
            </div>

            {/* Moral Quote */}
            {pageData.moralQuote && (
              <div className="mt-8 p-4 bg-stone-100 border border-stone-300 rounded text-sm italic text-center font-['Hind_Siliguri']">
                💡 {pageData.moralQuote}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-stone-300 pt-3 mt-8 text-xs text-stone-400 font-mono">
              <span>AYT Books</span>
              <span className="font-bold">{currentPage}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
