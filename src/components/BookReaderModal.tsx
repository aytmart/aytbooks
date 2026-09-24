import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Book, StoryChapter } from '../types';
import { WHATSAPP_CONTACT, ECOSYSTEM_LINKS } from '../data/booksData';
import { parseTableOfContents, parseBengaliNumber, toBengaliNumber, ParsedChapter } from '../utils/bookPagination';
import { 
  X, ChevronLeft, ChevronRight, BookOpen, MessageCircle, 
  Sun, Moon, Type, Volume2, VolumeX, List, ZoomIn, ZoomOut, CheckCircle2,
  FileText, Download, Printer, Share2, Sparkles, MoveHorizontal, RotateCcw,
  Maximize2, Minimize2, ExternalLink, Search
} from 'lucide-react';

interface BookReaderModalProps {
  book: Book | null;
  onClose: () => void;
}

type ReaderTheme = 'cream' | 'sepia' | 'dark' | 'white';
type ViewMode = 'flipbook' | 'pdf' | 'scroll';

export const BookReaderModal: React.FC<BookReaderModalProps> = ({ book, onClose }) => {
  if (!book) return null;

  const [pageIndex, setPageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('flipbook');
  const [theme, setTheme] = useState<ReaderTheme>('cream');
  const [fontSize, setFontSize] = useState<number>(17);
  const [tocOpen, setTocOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [dragProgress, setDragProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState<boolean>(false);
  const [cornerHover, setCornerHover] = useState<'tr' | 'br' | 'tl' | 'bl' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pageInput, setPageInput] = useState<string>('');
  const [tocSearch, setTocSearch] = useState<string>('');
  const [bookSearchOpen, setBookSearchOpen] = useState<boolean>(false);
  const [bookSearchQuery, setBookSearchQuery] = useState<string>('');

  const bookContainerRef = useRef<HTMLDivElement>(null);

  // Play realistic paper flip sound using Web Audio API
  const playFlipSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = Math.floor(ctx.sampleRate * 0.14); // 140ms sound
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1300;
      filter.Q.value = 1.4;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {
      // Audio autoplay policy fallback
    }
  }, [soundEnabled]);

  // Construct comprehensive chapters list covering all 112 topics and full page spectrum
  const chapters: ParsedChapter[] = useMemo(() => {
    return parseTableOfContents(book.tableOfContents || [], book.chapters || [], book);
  }, [book]);

  // Real book total page count
  const maxPages = useMemo(() => {
    if (book.pages && book.pages > 10) return book.pages;
    if (chapters.length > 0) {
      return chapters[chapters.length - 1].pageEnd;
    }
    return 50;
  }, [book, chapters]);

  // Construct individual Book Pages array for the Flipbook
  // Page 0: Front Cover
  // Page 1: Inside Title / Preface
  // Page 2: Table of Contents (সূচিপত্র)
  // Page 3..maxPages: Chapter Content Pages (every page of the 414 pages rendered)
  // Last Page: Back Cover & Order Information
  const bookPages = useMemo(() => {
    interface PageData {
      id: string;
      pageNumber: number;
      type: 'cover' | 'title' | 'toc' | 'chapter' | 'back_cover';
      title?: string;
      subtitle?: string;
      chapterNumber?: number | string;
      quranVerse?: string;
      content?: string[];
      lesson?: string;
      pageRangeText?: string;
    }

    const pages: PageData[] = [];

    // Page 0: Cover
    pages.push({
      id: 'cover',
      pageNumber: 0,
      type: 'cover',
      title: book.title,
      subtitle: book.subtitle
    });

    // Page 1: Title & Publication Data
    pages.push({
      id: 'title-page',
      pageNumber: 1,
      type: 'title',
      title: book.title,
      subtitle: book.subtitle
    });

    // Page 2: Table of Contents
    pages.push({
      id: 'toc-page',
      pageNumber: 2,
      type: 'toc',
      title: 'বইয়ের সূচিপত্র ও বিষয়সূচী'
    });

    // Generate every single page from 3 to maxPages
    for (let p = 3; p <= maxPages; p++) {
      // Find chapter that contains page p
      let ch = chapters.find(c => p >= c.pageStart && p <= c.pageEnd);
      if (!ch) {
        // Nearest chapter
        for (let i = chapters.length - 1; i >= 0; i--) {
          if (p >= chapters[i].pageStart) {
            ch = chapters[i];
            break;
          }
        }
      }
      if (!ch && chapters.length > 0) {
        ch = chapters[0];
      }

      const chapterIndex = ch ? ch.chapterIndex : 1;
      const chapterTitle = ch ? ch.title : `অধ্যায় ${p}`;
      const chapterSubtitle = ch ? ch.subtitle : '';
      const contentList = ch && ch.content && ch.content.length > 0 ? ch.content : [book.summary || 'দ্বীন ও জীবনের আলোকবর্তিকা'];
      const quranVerse = ch ? ch.quranVerse : undefined;
      const lesson = ch ? ch.lesson : undefined;

      const totalChPages = ch ? Math.max(1, ch.pageEnd - ch.pageStart + 1) : 1;
      const pageOffset = ch ? Math.max(0, p - ch.pageStart) : 0;
      
      const pPerSlice = Math.max(1, Math.ceil(contentList.length / totalChPages));
      const startIdx = (pageOffset * pPerSlice) % contentList.length;
      let pageParagraphs = contentList.slice(startIdx, startIdx + pPerSlice);
      if (pageParagraphs.length === 0) pageParagraphs = contentList;

      pages.push({
        id: `page-${p}`,
        pageNumber: p,
        type: 'chapter',
        chapterNumber: toBengaliNumber(chapterIndex),
        title: chapterTitle,
        subtitle: chapterSubtitle,
        pageRangeText: ch ? `পৃষ্ঠা ${toBengaliNumber(ch.pageStart)}-${toBengaliNumber(ch.pageEnd)}` : `পৃষ্ঠা ${toBengaliNumber(p)}`,
        content: pageParagraphs,
        quranVerse: (pageOffset === 0 || !quranVerse) ? quranVerse : undefined,
        lesson: (pageOffset === totalChPages - 1) ? lesson : undefined
      });
    }

    // Back Cover
    pages.push({
      id: 'back-cover',
      pageNumber: maxPages + 1,
      type: 'back_cover',
      title: book.title
    });

    return pages;
  }, [book, chapters, maxPages]);

  const totalPages = bookPages.length;

  // Turn to next page with animation (1 page at a time)
  const handleNextPage = useCallback(() => {
    if (isFlipping) return;
    if (pageIndex < totalPages - 1) {
      setIsFlipping(true);
      setFlipDirection('next');
      playFlipSound();
      setTimeout(() => {
        setPageIndex(prev => Math.min(prev + 1, totalPages - 1));
        setIsFlipping(false);
        setFlipDirection(null);
      }, 450);
    }
  }, [isFlipping, pageIndex, totalPages, playFlipSound]);

  // Turn to previous page with animation (1 page at a time)
  const handlePrevPage = useCallback(() => {
    if (isFlipping) return;
    if (pageIndex > 0) {
      setIsFlipping(true);
      setFlipDirection('prev');
      playFlipSound();
      setTimeout(() => {
        setPageIndex(prev => Math.max(prev - 1, 0));
        setIsFlipping(false);
        setFlipDirection(null);
      }, 450);
    }
  }, [isFlipping, pageIndex, playFlipSound]);

  // Jump directly to a specific single page or chapter
  const handleJumpToPage = (targetIdx: number) => {
    playFlipSound();
    setPageIndex(Math.max(0, Math.min(targetIdx, totalPages - 1)));
    setTocOpen(false);
  };

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage, onClose]);

  // Pointer drag handling for physical page drag feel
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isFlipping) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragProgress(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    const width = bookContainerRef.current?.clientWidth || 600;
    const progress = deltaX / (width * 0.5);
    setDragProgress(progress);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragProgress < -0.25) {
      handleNextPage();
    } else if (dragProgress > 0.25) {
      handlePrevPage();
    }
    setDragProgress(0);
  };

  // Web Speech synthesis setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesisAvailable(true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleAudio = () => {
    if (!speechSynthesisAvailable) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const activePage = bookPages[pageIndex];
      const textToRead = [
        activePage?.title || '',
        ...(activePage?.content || []),
        activePage?.lesson ? `শিক্ষা: ${activePage.lesson}` : ''
      ].filter(Boolean).join('. ');

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handlePrintOrDownloadPDF = () => {
    window.print();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Theme styling definitions
  const themeStyles = {
    cream: {
      appBg: 'bg-[#1C1A17]',
      paper: 'bg-[#FDFCFB] text-[#1A1A1A]',
      pageBorder: 'border-[#E5E1DB]',
      pageShadow: 'shadow-2xl',
      spine: 'linear-gradient(to right, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.03) 8%, transparent 15%, transparent 85%, rgba(0,0,0,0.03) 92%, rgba(0,0,0,0.12) 100%)',
      headerBg: 'bg-[#F9F7F4] border-[#E5E1DB] text-[#1A1A1A]',
      badge: 'bg-[#F2EFE9] text-[#5C5852]'
    },
    sepia: {
      appBg: 'bg-[#2A231C]',
      paper: 'bg-[#F4ECD8] text-[#3D2E1E]',
      pageBorder: 'border-[#DECDB2]',
      pageShadow: 'shadow-2xl',
      spine: 'linear-gradient(to right, rgba(60,40,20,0.15) 0%, rgba(60,40,20,0.04) 8%, transparent 15%, transparent 85%, rgba(60,40,20,0.04) 92%, rgba(60,40,20,0.15) 100%)',
      headerBg: 'bg-[#EADDC2] border-[#DECDB2] text-[#3D2E1E]',
      badge: 'bg-[#E0D1B3] text-[#4A3825]'
    },
    dark: {
      appBg: 'bg-[#121212]',
      paper: 'bg-[#1F1F1F] text-[#E0DDD5]',
      pageBorder: 'border-[#333333]',
      pageShadow: 'shadow-2xl shadow-black',
      spine: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 8%, transparent 15%, transparent 85%, rgba(0,0,0,0.1) 92%, rgba(0,0,0,0.4) 100%)',
      headerBg: 'bg-[#181818] border-[#333333] text-[#E0DDD5]',
      badge: 'bg-[#2B2B2B] text-[#A6A29D]'
    },
    white: {
      appBg: 'bg-[#2B2B2B]',
      paper: 'bg-[#FFFFFF] text-[#111111]',
      pageBorder: 'border-[#DDDDDD]',
      pageShadow: 'shadow-2xl',
      spine: 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.02) 8%, transparent 15%, transparent 85%, rgba(0,0,0,0.02) 92%, rgba(0,0,0,0.1) 100%)',
      headerBg: 'bg-[#F5F5F5] border-[#DDDDDD] text-[#111111]',
      badge: 'bg-[#EEEEEE] text-[#555555]'
    }
  };

  const currentTheme = themeStyles[theme];

  // Active 1-Page Reader item
  const currentPage = bookPages[pageIndex] || bookPages[0];

  const waOrderText = `আসসালামু আলাইকুম, আমি AYT Books থেকে "${book.title}" বইটি অর্ডার করতে চাই।`;
  const waOrderLink = `https://wa.me/${WHATSAPP_CONTACT.number}?text=${encodeURIComponent(waOrderText)}`;

  // Helper to render a specific single page's authentic paper content
  const renderPageContent = (page: typeof bookPages[0] | null, isLeft: boolean = false) => {
    if (!page) {
      return (
        <div className={`w-full h-full flex items-center justify-center ${currentTheme.paper} p-8`}>
          <div className="text-center opacity-30">
            <BookOpen className="w-12 h-12 mx-auto mb-2" />
            <p className="font-serif text-xs">বইয়ের সমাপ্তি</p>
          </div>
        </div>
      );
    }

    if (page.type === 'cover') {
      return (
        <div className="w-full h-full bg-[#0F3D3E] text-[#FDFCFB] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden rounded-2xl border-l-6 border-[#C9A227] shadow-2xl">
          {/* Gold embossed border flourish */}
          <div className="absolute inset-3 border-2 border-[#C9A227]/40 rounded-xl pointer-events-none" />
          <div className="absolute inset-4 border border-[#C9A227]/20 rounded-lg pointer-events-none" />

          {/* Cover Header */}
          <div className="relative z-10 text-center pt-4 space-y-2">
            <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-[#E0C268] font-bold font-mono">
              AYT DIGITAL ARCHIVE · OFFICIAL BOOK
            </span>
            <div className="w-12 h-0.5 bg-[#C9A227] mx-auto opacity-75" />
          </div>

          {/* Title and Author Center */}
          <div className="relative z-10 text-center my-auto space-y-4 px-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#C9A227]/20 border border-[#C9A227]/50 flex items-center justify-center text-[#E0C268] text-2xl shadow-inner">
              📖
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#FDFCFB] leading-tight drop-shadow-md">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="font-serif text-xs sm:text-sm text-[#E0C268] italic max-w-sm mx-auto leading-relaxed">
                {book.subtitle}
              </p>
            )}
            <div className="pt-2">
              <span className="text-xs sm:text-sm text-[#FDFCFB]/90 font-serif block">
                লেখক: <strong>{book.author}</strong>
              </span>
              {book.editor && (
                <span className="text-[11px] text-[#FDFCFB]/70 font-serif block mt-0.5">
                  সম্পাদনা: {book.editor}
                </span>
              )}
            </div>
          </div>

          {/* Cover Footer */}
          <div className="relative z-10 text-center pb-2 text-[10px] text-[#C9A227] font-mono tracking-wider border-t border-[#C9A227]/30 pt-3">
            {book.publisher} · মোট পৃষ্ঠা: {toBengaliNumber(maxPages)}
          </div>
        </div>
      );
    }

    if (page.type === 'title') {
      return (
        <div className={`w-full h-full p-6 sm:p-10 flex flex-col justify-between ${currentTheme.paper} font-serif select-none`}>
          {/* Top Running Header */}
          <div className="flex items-center justify-between text-[11px] text-[#8C8882] border-b border-[#E5E1DB] pb-2 font-mono">
            <span>AYT BOOKS ARCHIVE</span>
            <span>পৃষ্ঠা ১</span>
          </div>

          {/* Title Page Content */}
          <div className="text-center my-auto space-y-4 max-w-md mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C8882] font-mono">
              OFFICIAL PUBLICATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif leading-tight">
              {book.title}
            </h2>
            {book.subtitle && (
              <p className="text-xs sm:text-sm text-[#5C5852] italic">
                {book.subtitle}
              </p>
            )}

            <div className="w-16 h-0.5 bg-[#1A1A1A] mx-auto my-4 opacity-20" />

            <div className="space-y-1.5 text-xs text-[#5C5852]">
              <p><strong>মূল রচনা:</strong> {book.author}</p>
              {book.editor && <p><strong>সম্পাদনা:</strong> {book.editor}</p>}
              <p><strong>প্রকাশনা:</strong> {book.publisher}</p>
              {book.edition && <p><strong>সংস্করণ:</strong> {book.edition}</p>}
              {book.isbn && <p className="font-mono text-[11px]"><strong>ISBN:</strong> {book.isbn}</p>}
            </div>

            <div className="p-3.5 bg-black/5 rounded-xl border border-black/10 text-xs text-justify leading-relaxed mt-4">
              <strong>পাঠক নোট:</strong> {book.summary}
            </div>
          </div>

          {/* Bottom page signature */}
          <div className="text-center text-[10px] text-[#8C8882] font-mono border-t border-[#E5E1DB] pt-2">
            সর্বস্বত্ব সংরক্ষিত · {book.publisher}
          </div>
        </div>
      );
    }

    if (page.type === 'toc') {
      return (
        <div className={`w-full h-full p-6 sm:p-10 flex flex-col justify-between ${currentTheme.paper} font-serif select-none`}>
          {/* Top Running Header */}
          <div className="flex items-center justify-between text-[11px] text-[#8C8882] border-b border-[#E5E1DB] pb-2 font-mono">
            <span>সূচিপত্র</span>
            <span>পৃষ্ঠা ২</span>
          </div>

          {/* Table of Contents List */}
          <div className="my-auto space-y-4">
            <h3 className="text-xl font-bold font-serif text-center pb-2 border-b border-black/10">
              সূচিপত্র ও অধ্যায় পরিচিতি ({toBengaliNumber(chapters.length)}টি অধ্যায় · {toBengaliNumber(maxPages)} পৃষ্ঠা)
            </h3>
            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => handleJumpToPage(ch.pageStart)}
                  className="w-full text-left p-2 rounded-lg hover:bg-black/5 border border-transparent hover:border-black/10 transition-colors flex items-baseline justify-between text-xs group cursor-pointer"
                >
                  <span className="font-medium group-hover:underline line-clamp-1">
                    {toBengaliNumber(ch.chapterIndex)}. {ch.title}
                  </span>
                  <span className="text-[#8C8882] font-mono text-[11px] shrink-0 ml-2">
                    পৃষ্ঠা {toBengaliNumber(ch.pageStart)} →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-[#8C8882] font-mono border-t border-[#E5E1DB] pt-2">
            যেকোনো অধ্যায়ে যেতে ক্লিক করুন
          </div>
        </div>
      );
    }

    if (page.type === 'back_cover') {
      return (
        <div className="w-full h-full bg-[#1A1A1A] text-[#FDFCFB] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden rounded-2xl border-r-6 border-[#C9A227] shadow-2xl">
          {/* Cover Header */}
          <div className="text-center pt-2 space-y-1">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#E0C268] font-bold font-mono">
              AYT BOOKS DIGEST · শেষ প্রচ্ছদ
            </span>
            <h3 className="font-serif text-xl font-bold text-[#FDFCFB]">
              {book.title}
            </h3>
          </div>

          {/* Back Cover Body */}
          <div className="my-auto space-y-4 max-w-md mx-auto text-center font-serif">
            <p className="text-xs sm:text-sm text-[#A6A29D] leading-relaxed text-justify">
              {book.summary}
            </p>

            {book.hasHardcopy ? (
              <div className="p-4 bg-[#262626] border border-[#3D3D3D] rounded-xl text-xs space-y-2">
                <div className="text-[#E0C268] font-bold text-sm">
                  হার্ডকপি মূল্য: {book.currency}{book.price}
                </div>
                <p className="text-[#A6A29D]">
                  সরাসরি WhatsApp এ বার্তা পাঠিয়ে মুদ্রিত বইটি সংগ্রহ করুন।
                </p>
                <a
                  href={waOrderLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-[#1F7A4D] hover:bg-[#18603C] text-white font-sans font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>হার্ডকপি অর্ডার করুন</span>
                </a>
              </div>
            ) : (
              <div className="p-4 bg-[#262626] border border-[#3D3D3D] rounded-xl text-xs space-y-2">
                <div className="text-emerald-400 font-bold text-sm">
                  অনলাইনে পড়ার জন্য উন্মুক্ত
                </div>
                <p className="text-[#A6A29D]">
                  এই বইটি সম্পূর্ণ অনলাইনে ফ্রি পড়ার জন্য রাখা হয়েছে। নিয়মিত পাঠ করুন ও অন্যদের সাথে শেয়ার করুন।
                </p>
              </div>
            )}
          </div>

          {/* Back Cover Footer */}
          <div className="text-center text-[10px] text-[#8C8882] font-mono border-t border-white/10 pt-3">
            {WHATSAPP_CONTACT.address} · {WHATSAPP_CONTACT.displayNumber}
          </div>
        </div>
      );
    }

    // Default Chapter page
    return (
      <div className={`w-full h-full p-6 sm:p-10 flex flex-col justify-between ${currentTheme.paper} rounded-2xl shadow-2xl select-none`}>
        {/* Top Running Header */}
        <div className="flex items-center justify-between text-[11px] text-[#8C8882] border-b border-black/10 pb-2 font-mono">
          <span className="line-clamp-1 font-serif">{book.title} {page.title ? `· ${page.title}` : ''}</span>
          <span className="font-bold">পৃষ্ঠা {toBengaliNumber(page.pageNumber)}</span>
        </div>

        {/* Chapter Body Content */}
        <div className="my-auto space-y-4 overflow-y-auto max-h-[68vh] pr-1" style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}>
          {page.title && (
            <div className="text-center pb-2 border-b border-black/5">
              <span className="text-[11px] text-[#8C8882] font-mono uppercase tracking-wider block">
                অধ্যায় {page.chapterNumber}
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold mt-0.5">
                {page.title}
              </h3>
              {page.subtitle && (
                <p className="text-xs text-[#8C8882] italic font-serif mt-1">
                  {page.subtitle}
                </p>
              )}
            </div>
          )}

          {page.quranVerse && (
            <div className="p-3 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-xl text-center text-xs font-serif italic text-[#0F3D3E] dark:text-[#E0C268]">
              {page.quranVerse}
            </div>
          )}

          <div className="space-y-3 font-serif">
            {(page.content || []).map((paragraph, idx) => (
              <p key={idx} className="indent-6 text-justify leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {page.lesson && (
            <div className="mt-4 p-3.5 bg-black/5 rounded-xl border border-black/10 text-xs font-serif">
              <strong className="text-[#0F3D3E] dark:text-[#E0C268] block mb-1">
                💡 গল্প ও অধ্যায় থেকে শিক্ষা:
              </strong>
              <p className="italic opacity-90">{page.lesson}</p>
            </div>
          )}
        </div>

        {/* Bottom Page Number & Flip Hint */}
        <div className="flex items-center justify-between text-[11px] text-[#8C8882] border-t border-black/10 pt-2 font-mono">
          <span className="text-[10px] opacity-70">AYT Books Digital Archive</span>
          <span className="font-bold text-[#E0C268]">পৃষ্ঠা {toBengaliNumber(page.pageNumber)} / {toBengaliNumber(maxPages)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 text-white backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Sticky Reader Toolbar */}
      <header className="h-14 px-3 sm:px-6 bg-[#1A1A1A] border-b border-white/10 flex items-center justify-between z-30 shrink-0 select-none">
        {/* Left: Book Info & Mode Switcher */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F3D3E] flex items-center justify-center text-[#E0C268] text-sm shrink-0 border border-white/10">
              📖
            </div>
            <div className="truncate max-w-[150px] sm:max-w-xs">
              <h3 className="font-serif font-bold text-xs sm:text-sm text-white truncate">
                {book.title}
              </h3>
              <p className="text-[10px] text-[#A6A29D] truncate">
                {book.author} · {book.publisher}
              </p>
            </div>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-black/40 border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('flipbook')}
              className={`py-1 px-2.5 rounded-md flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                viewMode === 'flipbook' ? 'bg-[#E0C268] text-[#1A1A1A]' : 'text-[#A6A29D] hover:text-white'
              }`}
              title="বাস্তব বইয়ের মতো ১-পাতা পেজ উল্টিয়ে পড়ার মোড"
            >
              <MoveHorizontal className="w-3.5 h-3.5" />
              <span>১-পেজ পেজ-ফ্লিপ</span>
            </button>
            <button
              onClick={() => setViewMode('pdf')}
              className={`py-1 px-2.5 rounded-md flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                viewMode === 'pdf' ? 'bg-[#E0C268] text-[#1A1A1A]' : 'text-[#A6A29D] hover:text-white'
              }`}
              title="১-পেজ অফিসিয়াল PDF ডকুমেন্ট ভিউয়ার"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>১-পেজ PDF</span>
            </button>
            <button
              onClick={() => setViewMode('scroll')}
              className={`py-1 px-2.5 rounded-md flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                viewMode === 'scroll' ? 'bg-[#E0C268] text-[#1A1A1A]' : 'text-[#A6A29D] hover:text-white'
              }`}
              title="মনোযোগ দিয়ে ১-পাতা পড়ার মোড"
            >
              <List className="w-3.5 h-3.5" />
              <span>১-পেজ রিডার</span>
            </button>
          </div>
        </div>

        {/* Right Controls: Jump to Page, Search, TOC, Sound, TTS, Font, Themes, Fullscreen, Close */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Jump to Page Input Box */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1">
            <span className="text-[11px] text-[#A6A29D] hidden md:inline">পৃষ্ঠা:</span>
            <input
              type="text"
              placeholder={`${pageIndex || 1}`}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = parseBengaliNumber(pageInput);
                  if (target >= 0 && target <= maxPages) {
                    handleJumpToPage(target);
                    setPageInput('');
                  }
                }
              }}
              className="w-10 sm:w-12 text-center text-xs bg-white/10 text-white rounded border border-white/20 py-0.5 font-mono focus:outline-hidden focus:border-[#E0C268]"
              title="পৃষ্ঠা নম্বর লিখে Enter চাপুন"
            />
            <button
              onClick={() => {
                const target = parseBengaliNumber(pageInput);
                if (target >= 0 && target <= maxPages) {
                  handleJumpToPage(target);
                  setPageInput('');
                }
              }}
              className="text-[10px] font-bold text-[#1A1A1A] bg-[#E0C268] hover:bg-[#C9A227] px-1.5 py-0.5 rounded cursor-pointer transition-colors"
            >
              যান
            </button>
          </div>

          {/* Book Search Button */}
          <button
            onClick={() => setBookSearchOpen(!bookSearchOpen)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              bookSearchOpen ? 'bg-[#E0C268] text-[#1A1A1A] border-[#E0C268]' : 'border-white/10 hover:bg-white/10 text-white'
            }`}
            title="বইয়ের বিষয়বস্তু খুঁজুন"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Table of Contents Button */}
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              tocOpen ? 'bg-[#E0C268] text-[#1A1A1A] border-[#E0C268]' : 'border-white/10 hover:bg-white/10 text-white'
            }`}
            title="সূচিপত্র"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Sound Toggle (Paper Flip SFX) */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              soundEnabled ? 'border-white/20 text-[#E0C268] bg-white/5' : 'border-white/10 text-[#8C8882]'
            }`}
            title={soundEnabled ? 'সাউন্ড অন (পেজ উল্টানোর শব্দ)' : 'সাউন্ড অফ'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* TTS Reciter */}
          {speechSynthesisAvailable && (
            <button
              onClick={handleToggleAudio}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isPlayingAudio ? 'bg-green-600 text-white border-green-500 animate-pulse' : 'border-white/10 hover:bg-white/10 text-white'
              }`}
              title={isPlayingAudio ? 'পাঠ থামান' : 'বাংলায় অডিও শুনুন'}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}

          {/* Font Size Adjuster */}
          <div className="hidden sm:flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg px-1.5 py-0.5">
            <button
              onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
              className="p-1 hover:text-[#E0C268] text-xs font-bold"
              title="ছোট ফন্ট"
            >
              A-
            </button>
            <span className="text-[11px] font-mono text-[#8C8882] px-1">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(24, prev + 1))}
              className="p-1 hover:text-[#E0C268] text-xs font-bold"
              title="বড় ফন্ট"
            >
              A+
            </button>
          </div>

          {/* Paper Theme Selectors */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setTheme('cream')}
              className={`w-5 h-5 rounded-full bg-[#FDFCFB] border transition-all ${
                theme === 'cream' ? 'border-[#E0C268] scale-110' : 'border-transparent opacity-60'
              }`}
              title="ক্রিম পেপার"
            />
            <button
              onClick={() => setTheme('sepia')}
              className={`w-5 h-5 rounded-full bg-[#F4ECD8] border transition-all ${
                theme === 'sepia' ? 'border-[#E0C268] scale-110' : 'border-transparent opacity-60'
              }`}
              title="সেপিয়া / প্রাচীন কাগজ"
            />
            <button
              onClick={() => setTheme('dark')}
              className={`w-5 h-5 rounded-full bg-[#1F1F1F] border transition-all ${
                theme === 'dark' ? 'border-[#E0C268] scale-110' : 'border-transparent opacity-60'
              }`}
              title="নাইট মোড"
            />
          </div>

          {/* Print / Download PDF */}
          <button
            onClick={handlePrintOrDownloadPDF}
            className="hidden sm:flex p-2 rounded-lg border border-white/10 hover:bg-white/10 text-white cursor-pointer"
            title="PDF প্রিন্ট / সেভ করুন"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg border border-white/10 hover:bg-white/10 text-white cursor-pointer"
            title="ফুলস্ক্রিন"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-red-600/80 text-white transition-colors cursor-pointer ml-1"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area based on ViewMode */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Book Search Dialog Modal */}
        {bookSearchOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-start justify-center p-4 sm:p-10 animate-in fade-in duration-150">
            <div className="bg-[#1A1A1A] border border-white/20 rounded-2xl w-full max-w-xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#E0C268]" />
                  <h3 className="font-serif font-bold text-white text-base">
                    বইয়ের ভেতরে অনুসন্ধান (Search in Book)
                  </h3>
                </div>
                <button
                  onClick={() => setBookSearchOpen(false)}
                  className="p-1 text-[#8C8882] hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8882]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="যেকোনো বিষয় লিখুন (যেমন: কিডনি, ব্রেন, নামাজ, জান্নাত, রোজা, বিগ ব্যাং)..."
                  value={bookSearchQuery}
                  onChange={(e) => setBookSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-black/50 border border-white/20 rounded-xl text-sm text-white placeholder-[#8C8882] focus:outline-hidden focus:border-[#E0C268]"
                />
              </div>

              {/* Search Results */}
              <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1">
                {bookSearchQuery.trim() ? (
                  (() => {
                    const q = bookSearchQuery.toLowerCase();
                    const results = chapters.filter(c => 
                      c.title.toLowerCase().includes(q) || 
                      (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
                      (c.content && c.content.some(p => p.toLowerCase().includes(q))) ||
                      (c.lesson && c.lesson.toLowerCase().includes(q))
                    );

                    if (results.length === 0) {
                      return (
                        <div className="text-center py-8 text-[#8C8882] text-xs font-serif">
                          “{bookSearchQuery}” বিষয়ে কোনো ফলাফল পাওয়া যায়নি। অন্য কোনো শব্দ দিয়ে খুঁজুন।
                        </div>
                      );
                    }

                    return results.map(ch => (
                      <button
                        key={ch.chapterIndex}
                        onClick={() => {
                          handleJumpToPage(ch.pageStart);
                          setBookSearchOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#E0C268]/50 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-baseline justify-between">
                          <span className="font-serif font-bold text-sm text-white group-hover:text-[#E0C268]">
                            {toBengaliNumber(ch.chapterIndex)}. {ch.title}
                          </span>
                          <span className="text-xs font-mono text-[#E0C268] bg-[#E0C268]/10 px-2 py-0.5 rounded shrink-0 ml-2">
                            পৃষ্ঠা {toBengaliNumber(ch.pageStart)}
                          </span>
                        </div>
                        {ch.subtitle && (
                          <p className="text-xs text-[#A6A29D] line-clamp-1 mt-1 font-serif">
                            {ch.subtitle}
                          </p>
                        )}
                      </button>
                    ));
                  })()
                ) : (
                  <div className="py-6 text-center text-xs text-[#8C8882] space-y-2 font-serif">
                    <p>জনপ্রিয় অনুসন্ধানসমূহ (ক্লিক করে সরাসরি পড়ুন):</p>
                    <div className="flex flex-wrap justify-center gap-2 pt-1">
                      {['কিডনি', 'ব্রেন', 'হৃদপিণ্ড', 'নামাজ', 'জান্নাত', 'হাশর', 'রোজা', 'বিগ ব্যাং', 'তওবা'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => setBookSearchQuery(tag)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-[#E0C268]/20 hover:text-[#E0C268] border border-white/10 rounded-lg text-xs transition-colors cursor-pointer text-[#D1CDCA]"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Table of Contents Drawer */}
        {tocOpen && (
          <aside className="w-72 sm:w-80 bg-[#1A1A1A] border-r border-white/10 p-5 overflow-y-auto z-40 space-y-4 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="font-serif font-bold text-sm text-[#FDFCFB] flex items-center gap-2">
                <List className="w-4 h-4 text-[#E0C268]" />
                <span>বইয়ের সূচিপত্র ({toBengaliNumber(chapters.length)}টি অধ্যায়)</span>
              </h4>
              <button onClick={() => setTocOpen(false)} className="p-1 hover:text-[#E0C268]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8C8882]" />
              <input
                type="text"
                placeholder="অধ্যায় বা বিষয় খুঁজুন..."
                value={tocSearch}
                onChange={(e) => setTocSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-[#8C8882] focus:outline-hidden focus:border-[#E0C268]"
              />
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => handleJumpToPage(0)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                  pageIndex === 0 ? 'bg-[#E0C268] text-[#1A1A1A]' : 'hover:bg-white/5 text-[#A6A29D]'
                }`}
              >
                <span>📖 প্রচ্ছদ (Cover)</span>
                <span className="font-mono text-[10px]">পৃষ্ঠা ০</span>
              </button>

              <button
                onClick={() => handleJumpToPage(2)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                  pageIndex === 2 ? 'bg-[#E0C268] text-[#1A1A1A]' : 'hover:bg-white/5 text-[#A6A29D]'
                }`}
              >
                <span>📜 ভূমিকা ও পূর্ণাঙ্গ সূচিপত্র</span>
                <span className="font-mono text-[10px]">পৃষ্ঠা ১-২</span>
              </button>

              {chapters
                .filter(ch => !tocSearch || ch.title.toLowerCase().includes(tocSearch.toLowerCase()) || String(ch.pageStart).includes(tocSearch) || toBengaliNumber(ch.pageStart).includes(tocSearch))
                .map((ch) => (
                  <button
                    key={ch.chapterIndex}
                    onClick={() => handleJumpToPage(ch.pageStart)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-serif flex items-baseline justify-between transition-colors ${
                      pageIndex >= ch.pageStart && pageIndex <= ch.pageEnd
                        ? 'bg-[#E0C268] text-[#1A1A1A] font-bold'
                        : 'hover:bg-white/5 text-[#D1CDCA]'
                    }`}
                  >
                    <span className="line-clamp-1">{toBengaliNumber(ch.chapterIndex)}. {ch.title}</span>
                    <span className="font-mono text-[10px] opacity-70 shrink-0 ml-1.5">
                      পৃষ্ঠা {toBengaliNumber(ch.pageStart)}
                    </span>
                  </button>
                ))}

              <button
                onClick={() => handleJumpToPage(totalPages - 1)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                  pageIndex >= totalPages - 2 ? 'bg-[#E0C268] text-[#1A1A1A]' : 'hover:bg-white/5 text-[#A6A29D]'
                }`}
              >
                <span>📕 শেষ প্রচ্ছদ ও অর্ডার তথ্য</span>
                <span className="font-mono text-[10px]">পৃষ্ঠা {toBengaliNumber(maxPages)}</span>
              </button>
            </div>
          </aside>
        )}

        {/* 1. REALISTIC 3D 1-PAGE FLIPBOOK VIEW */}
        {viewMode === 'flipbook' && (
          <main
            ref={bookContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`flex-1 flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 ${currentTheme.appBg} relative overflow-hidden select-none`}
            style={{ perspective: '2000px' }}
          >
            {/* 1-Page Realistic 3D Book Stage */}
            <div className="w-full max-w-xl sm:max-w-2xl h-[75vh] max-h-[740px] flex items-center justify-center relative">
              {/* Stacked Edge Shadow (representing physical page thickness) */}
              <div className="absolute inset-0 max-w-lg sm:max-w-xl mx-auto rounded-2xl bg-black/40 blur-xl -z-10 translate-y-3" />

              {/* Simulated stacked page edges on right side */}
              <div
                className="absolute top-3 bottom-3 -right-2 sm:-right-3 w-3 bg-[#E5E1DB] dark:bg-[#2A2A2A] rounded-r-md border-r border-black/20 opacity-75 -z-5"
                style={{
                  backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)'
                }}
              />

              {/* The Physical Single-Page Container */}
              <div className="w-full h-full max-w-lg sm:max-w-xl flex rounded-2xl overflow-hidden border border-black/20 shadow-2xl relative">
                <div
                  className="w-full h-full relative overflow-hidden"
                  onMouseEnter={() => setCornerHover('br')}
                  onMouseLeave={() => setCornerHover(null)}
                >
                  {renderPageContent(currentPage)}

                  {/* Left Spine Shadow for authentic book binding feel */}
                  <div
                    className="absolute top-0 bottom-0 left-0 w-8 pointer-events-none z-10"
                    style={{
                      background: 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 60%, transparent 100%)'
                    }}
                  />

                  {/* Interactive Left Corner Curl on Hover (Turn to Previous Page) */}
                  {pageIndex > 0 && (
                    <div
                      onClick={handlePrevPage}
                      className="absolute top-0 left-0 w-12 h-12 cursor-pointer group z-20"
                      title="পূর্ববর্তী পেজ উল্টান (◄)"
                    >
                      <div className="absolute top-0 left-0 w-0 h-0 border-t-[36px] border-t-[#C9A227]/80 border-r-[36px] border-r-transparent transition-all group-hover:border-t-[48px] group-hover:border-r-[48px] drop-shadow-md" />
                      <span className="absolute top-1 left-1 text-[9px] text-[#1A1A1A] font-bold">◄</span>
                    </div>
                  )}

                  {/* Interactive Right Corner Curl on Hover (Turn to Next Page) */}
                  {pageIndex < totalPages - 1 && (
                    <div
                      onClick={handleNextPage}
                      className="absolute bottom-0 right-0 w-14 h-14 cursor-pointer group z-20"
                      title="পরবর্তী পেজ উল্টান (ক্লিক বা ড্র্যাগ করুন)"
                    >
                      <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[40px] border-b-[#C9A227]/90 border-l-[40px] border-l-transparent transition-all group-hover:border-b-[54px] group-hover:border-l-[54px] drop-shadow-lg" />
                      <span className="absolute bottom-1 right-1 text-[9px] text-[#1A1A1A] font-bold">►</span>
                    </div>
                  )}
                </div>

                {/* ANIMATED 3D PAGE FLIP LAYER (1-Page Realistic Turn) */}
                {isFlipping && (
                  <div
                    className="absolute inset-0 overflow-hidden shadow-2xl z-30 pointer-events-none rounded-2xl"
                    style={{
                      transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                      animation: flipDirection === 'next' ? 'singlePageFlipNext 0.45s cubic-bezier(0.25, 1, 0.5, 1) forwards' : 'singlePageFlipPrev 0.45s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div className={`w-full h-full ${currentTheme.paper} shadow-2xl p-8 flex items-center justify-center border border-black/10`}>
                      <div className="w-full h-full border border-black/10 rounded-xl flex items-center justify-center text-xs font-serif opacity-40">
                        <span className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#E0C268]" />
                          <span>পৃষ্ঠা উল্টানো হচ্ছে...</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Side Floating Next / Prev Arrows */}
              <button
                onClick={handlePrevPage}
                disabled={pageIndex === 0 || isFlipping}
                className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A1A1A]/90 hover:bg-[#E0C268] text-white hover:text-[#1A1A1A] border border-white/20 shadow-xl flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer z-30"
                title="পূর্ববর্তী পেজ (◄)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNextPage}
                disabled={pageIndex >= totalPages - 1 || isFlipping}
                className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A1A1A]/90 hover:bg-[#E0C268] text-white hover:text-[#1A1A1A] border border-white/20 shadow-xl flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer z-30"
                title="পরবর্তী পেজ (►)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Page Navigation & Interactive Slider */}
            <div className="w-full max-w-xl sm:max-w-2xl mt-4 px-4 py-2.5 rounded-full bg-[#1A1A1A]/80 border border-white/10 backdrop-blur-md flex items-center justify-between gap-4 text-xs">
              <span className="font-mono text-[#E0C268] text-xs font-bold shrink-0">
                পৃষ্ঠা {toBengaliNumber(currentPage?.pageNumber ?? (pageIndex + 1))} / {toBengaliNumber(maxPages)}
              </span>

              {/* Quick Jump Page Slider (step=1) */}
              <input
                type="range"
                min="0"
                max={totalPages - 1}
                step="1"
                value={pageIndex}
                onChange={(e) => handleJumpToPage(Number(e.target.value))}
                className="flex-1 accent-[#E0C268] cursor-pointer h-1.5 bg-white/20 rounded-lg"
              />

              <div className="flex items-center gap-1 text-[11px] text-[#A6A29D] shrink-0">
                <span className="hidden sm:inline">১ পাতা উল্টাতে তীর চাপুন বা সোয়াইপ করুন</span>
                <span>📖</span>
              </div>
            </div>
          </main>
        )}

        {/* 2. PRINTABLE 1-PAGE PDF VIEW MODE */}
        {viewMode === 'pdf' && (
          <main className="flex-1 overflow-y-auto bg-[#242220] p-4 sm:p-6 flex flex-col items-center justify-start text-[#1A1A1A]">
            {/* Top 1-Page PDF Navigation Bar */}
            <div className="w-full max-w-2xl mb-4 px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-xl flex items-center justify-between text-xs text-white shadow-md">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#E0C268] font-bold">
                  PDF পৃষ্ঠা {toBengaliNumber(currentPage?.pageNumber ?? (pageIndex + 1))} / {toBengaliNumber(maxPages)}
                </span>
                <span className="text-[11px] text-[#8C8882] hidden sm:inline">· {book.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={pageIndex === 0}
                  className="px-2.5 py-1 bg-white/10 hover:bg-[#E0C268] hover:text-[#1A1A1A] rounded disabled:opacity-20 font-semibold cursor-pointer transition-colors"
                >
                  ◄ পূর্ববর্তী
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={pageIndex >= totalPages - 1}
                  className="px-2.5 py-1 bg-[#E0C268] hover:bg-[#C9A227] text-[#1A1A1A] rounded disabled:opacity-20 font-bold cursor-pointer transition-colors"
                >
                  পরবর্তী ►
                </button>
                <button
                  onClick={handlePrintOrDownloadPDF}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-[#D1CDCA] cursor-pointer"
                  title="এই পৃষ্ঠাটি প্রিন্ট করুন"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* The 1-Page Printable PDF Sheet */}
            <div className="max-w-2xl w-full bg-white shadow-2xl rounded-md border border-[#D5D0C7] p-8 sm:p-12 md:p-14 min-h-[720px] flex flex-col justify-between font-serif relative">
              {/* PDF Document Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#1A1A1A] text-[11px] text-[#5C5852] font-mono">
                <span>AYT DIGITAL ARCHIVE · OFFICIAL PDF PUBLICATION</span>
                <span className="font-bold">পৃষ্ঠা {toBengaliNumber(currentPage?.pageNumber ?? (pageIndex + 1))}</span>
              </div>

              {/* PDF Single Page Content */}
              <div className="my-auto py-6 space-y-5">
                {currentPage?.type === 'cover' ? (
                  <div className="text-center py-10 space-y-6">
                    <span className="text-xs uppercase tracking-[0.3em] text-[#8C8882] font-mono font-bold">
                      বইয়ের মূল প্রচ্ছদ
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A]">
                      {book.title}
                    </h1>
                    {book.subtitle && (
                      <p className="text-base text-[#5C5852] italic max-w-lg mx-auto">
                        {book.subtitle}
                      </p>
                    )}
                    <div className="pt-4 text-sm text-[#1A1A1A] space-y-1">
                      <p>লেখক: <strong>{book.author}</strong></p>
                      {book.editor && <p>সম্পাদনা: <strong>{book.editor}</strong></p>}
                      <p>প্রকাশক: <strong>{book.publisher}</strong></p>
                      <p className="text-xs text-[#8C8882] pt-2">মোট পৃষ্ঠা: {toBengaliNumber(maxPages)}</p>
                    </div>
                  </div>
                ) : currentPage?.type === 'title' ? (
                  <div className="text-center py-6 space-y-5">
                    <h2 className="text-2xl font-bold">{book.title}</h2>
                    <p className="text-xs text-[#5C5852] leading-relaxed max-w-lg mx-auto text-justify">
                      {book.summary}
                    </p>
                    <div className="p-4 bg-[#F9F7F4] border border-[#E5E1DB] rounded-lg text-xs space-y-1">
                      <p><strong>আইডি:</strong> AYT-BK-{book.id}</p>
                      <p><strong>ডিজিটাল সংস্করণ:</strong> ৩.০ (পূর্ণাঙ্গ {toBengaliNumber(maxPages)} পৃষ্ঠা)</p>
                      <p><strong>যোগাযোগ:</strong> {WHATSAPP_CONTACT.displayNumber}</p>
                    </div>
                  </div>
                ) : currentPage?.type === 'toc' ? (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-center border-b pb-2">
                      সূচিপত্র ও বিষয় পরিচিতি ({toBengaliNumber(chapters.length)}টি অধ্যায়)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-h-[460px] overflow-y-auto pr-1">
                      {chapters.map(ch => (
                        <button
                          key={ch.chapterIndex}
                          onClick={() => handleJumpToPage(ch.pageStart)}
                          className="flex items-baseline justify-between p-2 rounded hover:bg-[#F0EDE6] border border-[#E5E1DB] text-left transition-colors cursor-pointer"
                        >
                          <span className="line-clamp-1 font-medium">{toBengaliNumber(ch.chapterIndex)}. {ch.title}</span>
                          <span className="font-mono text-[10px] text-[#8C8882] shrink-0 ml-1">পৃষ্ঠা {toBengaliNumber(ch.pageStart)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : currentPage?.type === 'back_cover' ? (
                  <div className="text-center py-8 space-y-4">
                    <h3 className="text-xl font-bold">{book.title}</h3>
                    <p className="text-xs text-[#5C5852] leading-relaxed text-justify max-w-md mx-auto">
                      {book.summary}
                    </p>
                    <div className="p-4 bg-[#F9F7F4] border rounded-lg text-xs">
                      <p className="font-bold text-emerald-700">অনলাইনে সম্পূর্ণ বইটি পড়ার জন্য উন্মুক্ত</p>
                      <p className="text-[#8C8882] mt-1">হার্ডকপি অর্ডার: {WHATSAPP_CONTACT.displayNumber}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center pb-2 border-b border-black/10">
                      <span className="text-[11px] text-[#8C8882] font-mono uppercase block">
                        অধ্যায় {currentPage?.chapterNumber}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-0.5">
                        {currentPage?.title}
                      </h2>
                      {currentPage?.subtitle && (
                        <p className="text-xs text-[#8C8882] italic mt-1 font-serif">
                          {currentPage.subtitle}
                        </p>
                      )}
                    </div>

                    {currentPage?.quranVerse && (
                      <div className="p-3.5 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-lg text-center text-xs italic text-[#1A1A1A]">
                        {currentPage.quranVerse}
                      </div>
                    )}

                    <div className="space-y-3 text-sm text-[#2E2C29] leading-relaxed font-serif text-justify">
                      {(currentPage?.content || []).map((p, idx) => (
                        <p key={idx} className="indent-6">{p}</p>
                      ))}
                    </div>

                    {currentPage?.lesson && (
                      <div className="p-3 bg-[#F9F7F4] border-l-3 border-[#1A1A1A] rounded-r-lg text-xs italic">
                        <strong>উপলব্ধি ও শিক্ষা:</strong> {currentPage.lesson}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PDF Document Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1A1A1A] text-[11px] text-[#5C5852] font-mono">
                <span>AYT Books ডিজিটাল লাইব্রেরি · Bogura, Bangladesh</span>
                <span className="font-bold">পৃষ্ঠা {toBengaliNumber(currentPage?.pageNumber ?? (pageIndex + 1))} / {toBengaliNumber(maxPages)}</span>
              </div>
            </div>

            {/* Bottom 1-Page PDF Switcher */}
            <div className="w-full max-w-2xl mt-4 px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-xl flex items-center justify-between gap-4 text-xs text-white">
              <button
                onClick={handlePrevPage}
                disabled={pageIndex === 0}
                className="px-3 py-1 bg-white/10 hover:bg-[#E0C268] hover:text-[#1A1A1A] rounded disabled:opacity-20 font-semibold cursor-pointer transition-colors"
              >
                ◄ পূর্ববর্তী
              </button>
              <input
                type="range"
                min="0"
                max={totalPages - 1}
                step="1"
                value={pageIndex}
                onChange={(e) => handleJumpToPage(Number(e.target.value))}
                className="flex-1 accent-[#E0C268] cursor-pointer h-1.5 bg-white/20 rounded-lg"
              />
              <button
                onClick={handleNextPage}
                disabled={pageIndex >= totalPages - 1}
                className="px-3 py-1 bg-[#E0C268] hover:bg-[#C9A227] text-[#1A1A1A] rounded disabled:opacity-20 font-bold cursor-pointer transition-colors"
              >
                পরবর্তী ►
              </button>
            </div>
          </main>
        )}

        {/* 3. 1-PAGE DISTRACTION-FREE CLEAN READER MODE */}
        {viewMode === 'scroll' && (
          <main className={`flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start ${currentTheme.paper}`}>
            {/* Top Reader Page Status */}
            <div className="w-full max-w-2xl mb-4 pb-2 border-b border-black/10 flex items-center justify-between text-xs opacity-75 font-mono">
              <span className="font-medium">{book.title}</span>
              <span className="font-bold text-[#C9A227]">পৃষ্ঠা {toBengaliNumber(currentPage?.pageNumber ?? (pageIndex + 1))} / {toBengaliNumber(maxPages)}</span>
            </div>

            {/* 1-Page Content Container */}
            <article className="max-w-2xl w-full my-auto space-y-6 pb-8 font-serif" style={{ fontSize: `${fontSize}px` }}>
              {currentPage?.title && (
                <div className="text-center pb-3 border-b border-black/10">
                  {currentPage.chapterNumber && (
                    <span className="text-xs font-mono uppercase tracking-wider block opacity-70">
                      অধ্যায় {currentPage.chapterNumber}
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-bold mt-1">
                    {currentPage.title}
                  </h1>
                  {currentPage.subtitle && (
                    <p className="text-xs italic opacity-70 mt-1">
                      {currentPage.subtitle}
                    </p>
                  )}
                </div>
              )}

              {currentPage?.quranVerse && (
                <div className="p-3.5 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-xl text-center text-xs italic">
                  {currentPage.quranVerse}
                </div>
              )}

              <div className="space-y-4 leading-relaxed text-justify">
                {(currentPage?.content || []).map((p, idx) => (
                  <p key={idx} className="indent-6">{p}</p>
                ))}
              </div>

              {currentPage?.lesson && (
                <div className="p-4 bg-black/5 border-l-4 border-[#1A1A1A] rounded-r-xl text-xs italic">
                  <strong>উপলব্ধি ও শিক্ষা:</strong> {currentPage.lesson}
                </div>
              )}
            </article>

            {/* Bottom 1-Page Navigation Controls */}
            <div className="w-full max-w-2xl mt-auto pt-6 border-t border-black/10 flex items-center justify-between gap-3 text-xs">
              <button
                onClick={handlePrevPage}
                disabled={pageIndex === 0}
                className="px-4 py-2 bg-black/10 hover:bg-[#E0C268] hover:text-[#1A1A1A] rounded-lg disabled:opacity-20 font-bold transition-colors cursor-pointer"
              >
                ← পূর্ববর্তী পৃষ্ঠা
              </button>

              <span className="font-mono font-bold text-xs opacity-80">
                {toBengaliNumber(currentPage?.pageNumber ?? (pageIndex + 1))} / {toBengaliNumber(maxPages)}
              </span>

              <button
                onClick={handleNextPage}
                disabled={pageIndex >= totalPages - 1}
                className="px-4 py-2 bg-[#E0C268] hover:bg-[#C9A227] text-[#1A1A1A] rounded-lg disabled:opacity-20 font-bold transition-colors cursor-pointer"
              >
                পরবর্তী পৃষ্ঠা →
              </button>
            </div>
          </main>
        )}
      </div>

      {/* Bottom Floating Bar */}
      <footer className="h-12 px-4 bg-[#141414] border-t border-white/10 flex items-center justify-between text-xs z-30 shrink-0">
        <div className="flex items-center gap-2 text-[#A6A29D]">
          <BookOpen className="w-4 h-4 text-[#E0C268]" />
          <span className="hidden sm:inline">অনলাইনে ফ্রি পড়ুন ও উপভোগ করুন</span>
          <span className="text-[#E0C268] font-semibold">· মূল্য: {book.currency}{book.price}</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={waOrderLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg bg-[#1F7A4D] hover:bg-[#18603C] text-white font-semibold text-xs shadow-sm transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp এ অর্ডার করুন</span>
          </a>
        </div>
      </footer>

      {/* Global CSS Keyframes for realistic single page flipping */}
      <style>{`
        @keyframes singlePageFlipNext {
          0% {
            transform: rotateY(0deg);
            transform-origin: left center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            opacity: 1;
          }
          40% {
            transform: rotateY(-60deg) skewY(-2deg);
            transform-origin: left center;
            box-shadow: -20px 20px 40px rgba(0,0,0,0.4);
            opacity: 0.9;
          }
          100% {
            transform: rotateY(-110deg) skewY(-3deg);
            transform-origin: left center;
            box-shadow: -30px 20px 50px rgba(0,0,0,0.05);
            opacity: 0;
          }
        }
        @keyframes singlePageFlipPrev {
          0% {
            transform: rotateY(-110deg) skewY(-3deg);
            transform-origin: left center;
            box-shadow: -30px 20px 50px rgba(0,0,0,0.05);
            opacity: 0;
          }
          40% {
            transform: rotateY(-60deg) skewY(-2deg);
            transform-origin: left center;
            box-shadow: -20px 20px 40px rgba(0,0,0,0.4);
            opacity: 0.9;
          }
          100% {
            transform: rotateY(0deg);
            transform-origin: left center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
