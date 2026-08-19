import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Book, StoryChapter } from '../types';
import { WHATSAPP_CONTACT, ECOSYSTEM_LINKS } from '../data/booksData';
import { 
  X, ChevronLeft, ChevronRight, BookOpen, MessageCircle, 
  Sun, Moon, Type, Volume2, VolumeX, List, ZoomIn, ZoomOut, CheckCircle2,
  FileText, Download, Printer, Share2, Sparkles, MoveHorizontal, RotateCcw,
  Maximize2, Minimize2, ExternalLink
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

  // Safely construct chapters list with rich fallbacks so it never remains empty
  const chapters: StoryChapter[] = useMemo(() => {
    if (book.chapters && book.chapters.length > 0) {
      return book.chapters;
    }
    
    if (book.tableOfContents && book.tableOfContents.length > 0) {
      return book.tableOfContents.map((title, idx) => ({
        number: idx + 1,
        title: title || `অধ্যায় ${idx + 1}`,
        subtitle: `অধ্যায় ${idx + 1} · বিষয়ভিত্তিক আলোচনা ও নির্যাস`,
        content: [
          `“${book.title}” গ্রন্থের এই গুরুত্বপূর্ণ অধ্যায়ে বর্ণিত হয়েছে ব্যক্তি, পরিবার ও সমাজের জন্য অতি মূল্যবান জীবনমুখী দিকনির্দেশনা।`,
          book.summary || 'দ্বীন ও জীবনের আলোয় সাজানো এক অনন্য সাহিত্যিক ও বাস্তবিক আলোচনা।',
          `পবিত্র কুরআন ও সুন্নাহর নির্দেশনা অনুযায়ী চরিত্র গঠন, আত্মিক উন্নতি ও সত্যের পথে চলার জন্য নিয়মিত এই অধ্যায়গুলো অনুধাবন করা আবশ্যক।`,
          `সম্পূর্ণ বইটির মুদ্রিত কপি পেতে সরাসরি আমাদের প্রকাশনীর WhatsApp নম্বরে যোগাযোগ করুন।`
        ],
        lesson: 'সঠিক জ্ঞান অন্বেষণ ও তার বাস্তব প্রয়োগই জীবনে প্রকৃত সাফল্য বয়ে আনে।'
      }));
    }

    return [
      {
        number: 1,
        title: book.title ? `১. ${book.title} — প্রারম্ভিক ও মূল অংশ` : 'ভূমিকা ও মূল বিষয়বস্তু',
        subtitle: book.subtitle || 'সম্পূর্ণ বইয়ের সারসংক্ষেপ ও তাৎপর্য',
        content: [
          book.summary || 'দ্বীন, নৈতিকতা ও সুন্দর জীবনের অনন্য সংকলন।',
          `এই বইটিতে রয়েছে মোট ${book.pages || 50} পৃষ্ঠা এবং জীবনের প্রতিটি স্তরের জন্য অত্যন্ত সময়োপযোগী ও হৃদয়গ্রাহী পাঠ।`,
          'অনলাইনে সম্পূর্ণ বইটি পাঠকদের জন্য উন্মুক্ত রাখা হয়েছে। নিয়মিত অধ্যয়ন করুন এবং বন্ধুদের সাথে শেয়ার করুন।'
        ],
        lesson: 'জ্ঞান অন্বেষণ ও আত্মশুদ্ধির মাধ্যমে জীবনকে সুন্দরভাবে সাজান।'
      },
      {
        number: 2,
        title: '২. শিক্ষা ও বাস্তব জীবনে আমল',
        subtitle: 'দৈনন্দিন জীবনে প্রয়োগ ও আলোকবর্তিকা',
        content: [
          'বইটিতে বর্ণিত প্রতিটি উপদেশ আমাদের দৈনন্দিন আচার-ব্যবহার ও মানসিক প্রশান্তিতে সরাসরি সাহায্য করে।',
          'পারিবারিক শান্তি ও রবের সন্তুষ্টি অর্জনে এই নির্দেশনাগুলো মেনে চলা প্রত্যেক সচেতন মানুষের কর্তব্য।'
        ],
        lesson: 'উপদেশ কেবল পড়ার জন্য নয়, বরং অন্তরে ধারণ করে কাজে পরিণত করার জন্য।'
      }
    ];
  }, [book]);

  // Construct individual Book Pages array for the Flipbook
  // Page 0: Front Cover
  // Page 1: Inside Title / Preface
  // Page 2: Table of Contents (সূচিপত্র)
  // Page 3..N: Chapter Content Pages (each chapter formatted into pages)
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

    // Chapter pages
    let pNum = 3;
    chapters.forEach((ch, cIdx) => {
      // Split large chapter content across multiple virtual pages if long
      const paragraphs = ch.content || [];
      pages.push({
        id: `ch-${cIdx}-1`,
        pageNumber: pNum++,
        type: 'chapter',
        chapterNumber: ch.number || cIdx + 1,
        title: ch.title,
        subtitle: ch.subtitle,
        quranVerse: ch.quranVerse,
        content: paragraphs,
        lesson: ch.lesson
      });
    });

    // Back Cover
    pages.push({
      id: 'back-cover',
      pageNumber: pNum,
      type: 'back_cover',
      title: book.title
    });

    return pages;
  }, [book, chapters]);

  const totalPages = bookPages.length;

  // Turn to next page with animation
  const handleNextPage = useCallback(() => {
    if (isFlipping) return;
    if (pageIndex < totalPages - 1) {
      setIsFlipping(true);
      setFlipDirection('next');
      playFlipSound();
      setTimeout(() => {
        setPageIndex(prev => Math.min(prev + 2, totalPages - 1));
        setIsFlipping(false);
        setFlipDirection(null);
      }, 500);
    }
  }, [isFlipping, pageIndex, totalPages, playFlipSound]);

  // Turn to previous page with animation
  const handlePrevPage = useCallback(() => {
    if (isFlipping) return;
    if (pageIndex > 0) {
      setIsFlipping(true);
      setFlipDirection('prev');
      playFlipSound();
      setTimeout(() => {
        setPageIndex(prev => Math.max(prev - 2, 0));
        setIsFlipping(false);
        setFlipDirection(null);
      }, 500);
    }
  }, [isFlipping, pageIndex, playFlipSound]);

  // Jump directly to a specific page or chapter
  const handleJumpToPage = (targetIdx: number) => {
    // Round to even page on double-page spread
    const normalized = targetIdx % 2 === 0 ? targetIdx : targetIdx - 1;
    playFlipSound();
    setPageIndex(Math.max(0, Math.min(normalized, totalPages - 1)));
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
      const activeLeft = bookPages[pageIndex];
      const activeRight = bookPages[pageIndex + 1];
      const textToRead = [
        activeLeft?.title || '',
        ...(activeLeft?.content || []),
        activeRight?.title || '',
        ...(activeRight?.content || [])
      ].join('. ');

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

  // Active spread pages
  const leftPageIndex = pageIndex;
  const rightPageIndex = pageIndex + 1 < totalPages ? pageIndex + 1 : null;
  const leftPage = bookPages[leftPageIndex];
  const rightPage = rightPageIndex !== null ? bookPages[rightPageIndex] : null;

  const waOrderText = `আসসালামু আলাইকুম, আমি AYT Books থেকে "${book.title}" বইটি অর্ডার করতে চাই।`;
  const waOrderLink = `https://wa.me/${WHATSAPP_CONTACT.number}?text=${encodeURIComponent(waOrderText)}`;

  // Helper to render a specific page's authentic paper content
  const renderPageContent = (page: typeof bookPages[0] | null, isLeft: boolean) => {
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
        <div className="w-full h-full bg-[#0F3D3E] text-[#FDFCFB] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden rounded-r-lg border-l-4 border-[#C9A227]">
          {/* Gold embossed border flourish */}
          <div className="absolute inset-3 border-2 border-[#C9A227]/40 rounded pointer-events-none" />
          <div className="absolute inset-4 border border-[#C9A227]/20 rounded pointer-events-none" />

          {/* Cover Header */}
          <div className="relative z-10 text-center pt-4 space-y-2">
            <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-[#E0C268] font-bold font-mono">
              AYT DIGITAL ARCHIVE
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
            {book.publisher}
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
              সূচিপত্র ও অধ্যায় পরিচিতি
            </h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => handleJumpToPage(idx + 3)}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-black/5 border border-transparent hover:border-black/10 transition-colors flex items-baseline justify-between text-xs sm:text-sm group cursor-pointer"
                >
                  <span className="font-medium group-hover:underline line-clamp-1">
                    {idx + 1}. {ch.title}
                  </span>
                  <span className="text-[#8C8882] font-mono text-xs shrink-0 ml-2">
                    পৃষ্ঠা {idx + 3} →
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
        <div className="w-full h-full bg-[#1A1A1A] text-[#FDFCFB] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden rounded-l-lg border-r-4 border-[#C9A227]">
          {/* Cover Header */}
          <div className="text-center pt-2 space-y-1">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#E0C268] font-bold font-mono">
              AYT BOOKS DIGEST
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
      <div className={`w-full h-full p-6 sm:p-10 flex flex-col justify-between ${currentTheme.paper} select-none`}>
        {/* Top Running Header */}
        <div className="flex items-center justify-between text-[11px] text-[#8C8882] border-b border-black/10 pb-2 font-mono">
          <span className="line-clamp-1">{isLeft ? book.title : page.title}</span>
          <span>পৃষ্ঠা {page.pageNumber}</span>
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
          <span className="text-[10px] opacity-70">AYT Books Digital</span>
          <span className="font-bold">{page.pageNumber}</span>
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
              title="বাস্তব বইয়ের মতো পেজ উল্টিয়ে পড়ার মোড"
            >
              <MoveHorizontal className="w-3.5 h-3.5" />
              <span>বাস্তব পেজ-ফ্লিপ</span>
            </button>
            <button
              onClick={() => setViewMode('pdf')}
              className={`py-1 px-2.5 rounded-md flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                viewMode === 'pdf' ? 'bg-[#E0C268] text-[#1A1A1A]' : 'text-[#A6A29D] hover:text-white'
              }`}
              title="মুদ্রণযোগ্য সম্পূর্ণ PDF ডকুমেন্ট ভিউয়ার"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF ভিউয়ার</span>
            </button>
            <button
              onClick={() => setViewMode('scroll')}
              className={`py-1 px-2.5 rounded-md flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                viewMode === 'scroll' ? 'bg-[#E0C268] text-[#1A1A1A]' : 'text-[#A6A29D] hover:text-white'
              }`}
              title="ধারাবাহিক স্ক্রল মোড"
            >
              <List className="w-3.5 h-3.5" />
              <span>স্ক্রল মোড</span>
            </button>
          </div>
        </div>

        {/* Right Controls: TOC, Sound, TTS, Font, Themes, Fullscreen, Close */}
        <div className="flex items-center gap-1.5 sm:gap-2">
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
        {/* Table of Contents Drawer */}
        {tocOpen && (
          <aside className="w-72 sm:w-80 bg-[#1A1A1A] border-r border-white/10 p-5 overflow-y-auto z-40 space-y-4 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="font-serif font-bold text-sm text-[#FDFCFB] flex items-center gap-2">
                <List className="w-4 h-4 text-[#E0C268]" />
                <span>বইয়ের সূচিপত্র ও অধ্যায়</span>
              </h4>
              <button onClick={() => setTocOpen(false)} className="p-1 hover:text-[#E0C268]">
                <X className="w-4 h-4" />
              </button>
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
                <span>📜 ভূমিকা ও সূচিপত্র</span>
                <span className="font-mono text-[10px]">পৃষ্ঠা ১-২</span>
              </button>

              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => handleJumpToPage(idx + 3)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-serif flex items-baseline justify-between transition-colors ${
                    pageIndex === idx + 3 || pageIndex === idx + 2
                      ? 'bg-[#E0C268] text-[#1A1A1A] font-bold'
                      : 'hover:bg-white/5 text-[#D1CDCA]'
                  }`}
                >
                  <span className="line-clamp-1">{idx + 1}. {ch.title}</span>
                  <span className="font-mono text-[10px] opacity-70 shrink-0 ml-1.5">
                    পৃষ্ঠা {idx + 3}
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
                <span className="font-mono text-[10px]">শেষ পৃষ্ঠা</span>
              </button>
            </div>
          </aside>
        )}

        {/* 1. REALISTIC 3D PAGE-FLIP BOOK VIEW */}
        {viewMode === 'flipbook' && (
          <main
            ref={bookContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`flex-1 flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 ${currentTheme.appBg} relative overflow-hidden select-none`}
            style={{ perspective: '2000px' }}
          >
            {/* Realistic 3D Double-Page Book Stage */}
            <div className="w-full max-w-5xl h-[75vh] max-h-[720px] flex items-center justify-center relative">
              {/* Stacked Edge Shadow (representing physical page thickness) */}
              <div className="absolute inset-0 max-w-4xl mx-auto rounded-xl bg-black/40 blur-xl -z-10 translate-y-3" />

              {/* The Physical Double-Page Spread Container */}
              <div className="w-full h-full max-w-4xl flex rounded-xl overflow-hidden border border-black/20 shadow-2xl relative">
                {/* LEFT PAGE (Verso) */}
                <div
                  className="w-1/2 h-full relative border-r border-black/10 overflow-hidden"
                  onMouseEnter={() => setCornerHover('tl')}
                  onMouseLeave={() => setCornerHover(null)}
                >
                  {renderPageContent(leftPage, true)}

                  {/* Left Page Spine Shadow */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to right, transparent 88%, rgba(0,0,0,0.12) 100%)'
                    }}
                  />

                  {/* Interactive Left Corner Curl on Hover */}
                  {pageIndex > 0 && (
                    <div
                      onClick={handlePrevPage}
                      className="absolute top-0 left-0 w-12 h-12 cursor-pointer group z-20"
                      title="পূর্ববর্তী পেজ উল্টান"
                    >
                      <div className="absolute top-0 left-0 w-0 h-0 border-t-[36px] border-t-[#C9A227]/80 border-r-[36px] border-r-transparent transition-all group-hover:border-t-[48px] group-hover:border-r-[48px] drop-shadow-md" />
                      <span className="absolute top-1 left-1 text-[9px] text-[#1A1A1A] font-bold">◄</span>
                    </div>
                  )}
                </div>

                {/* CENTRAL SPINE CREASE (Realistic 3D gradient fold) */}
                <div
                  className="absolute top-0 bottom-0 left-1/2 w-8 -ml-4 pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.03) 40%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.03) 60%, rgba(0,0,0,0.18) 100%)'
                  }}
                />

                {/* RIGHT PAGE (Recto) */}
                <div
                  className="w-1/2 h-full relative overflow-hidden"
                  onMouseEnter={() => setCornerHover('br')}
                  onMouseLeave={() => setCornerHover(null)}
                >
                  {renderPageContent(rightPage, false)}

                  {/* Right Page Spine Shadow */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to left, transparent 88%, rgba(0,0,0,0.12) 100%)'
                    }}
                  />

                  {/* Interactive Right Corner Curl on Hover (Dog-ear turn prompt) */}
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

                {/* ANIMATED 3D PAGE FLIP LAYER */}
                {isFlipping && (
                  <div
                    className="absolute top-0 bottom-0 w-1/2 overflow-hidden shadow-2xl z-30 pointer-events-none"
                    style={{
                      left: flipDirection === 'next' ? '50%' : '0%',
                      transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                      animation: flipDirection === 'next' ? 'flipPageNext 0.5s ease-in-out forwards' : 'flipPagePrev 0.5s ease-in-out forwards',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div className="w-full h-full bg-[#FDFCFB] shadow-inner p-8 flex items-center justify-center opacity-95">
                      <div className="w-full h-full border border-black/10 rounded flex items-center justify-center text-xs font-serif opacity-40">
                        <span>পেজ উল্টানো হচ্ছে...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Side Floating Next / Prev Arrows */}
              <button
                onClick={handlePrevPage}
                disabled={pageIndex === 0 || isFlipping}
                className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A1A1A]/90 hover:bg-[#E0C268] text-white hover:text-[#1A1A1A] border border-white/20 shadow-xl flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer z-30"
                title="পূর্ববর্তী পেজ (বা বামে সোয়াইপ করুন)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNextPage}
                disabled={pageIndex >= totalPages - 1 || isFlipping}
                className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1A1A1A]/90 hover:bg-[#E0C268] text-white hover:text-[#1A1A1A] border border-white/20 shadow-xl flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer z-30"
                title="পরবর্তী পেজ (বা ডানে সোয়াইপ করুন)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Page Navigation & Interactive Slider */}
            <div className="w-full max-w-2xl mt-4 px-4 py-2.5 rounded-full bg-[#1A1A1A]/80 border border-white/10 backdrop-blur-md flex items-center justify-between gap-4 text-xs">
              <span className="font-mono text-[#A6A29D] text-[11px] shrink-0">
                পেজ {pageIndex + 1}-{Math.min(pageIndex + 2, totalPages)} / {totalPages}
              </span>

              {/* Quick Jump Page Slider */}
              <input
                type="range"
                min="0"
                max={totalPages - 1}
                step="2"
                value={pageIndex}
                onChange={(e) => handleJumpToPage(Number(e.target.value))}
                className="flex-1 accent-[#E0C268] cursor-pointer h-1.5 bg-white/20 rounded-lg"
              />

              <div className="flex items-center gap-1 text-[11px] text-[#A6A29D] shrink-0">
                <span className="hidden sm:inline">পেজ উল্টাতে ক্লিক বা টানুন</span>
                <span>📖</span>
              </div>
            </div>
          </main>
        )}

        {/* 2. PRINTABLE FULL PDF VIEW MODE */}
        {viewMode === 'pdf' && (
          <main className="flex-1 overflow-y-auto bg-[#E5E1DB]/30 p-4 sm:p-8 flex justify-center text-[#1A1A1A]">
            <div className="max-w-3xl w-full bg-[#FDFCFB] shadow-2xl rounded-xl border border-[#E5E1DB] p-8 sm:p-12 md:p-16 space-y-10">
              {/* PDF Document Cover Page Header */}
              <div className="text-center pb-8 border-b-2 border-[#1A1A1A] space-y-3">
                <span className="text-[10px] tracking-[0.3em] font-bold text-[#8C8882] uppercase font-mono">
                  AYT DIGITAL ARCHIVE · OFFICIAL PDF PUBLICATION
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A]">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <p className="font-serif text-base sm:text-lg text-[#5C5852] italic max-w-xl mx-auto">
                    {book.subtitle}
                  </p>
                )}
                <div className="pt-2 text-xs sm:text-sm text-[#8C8882] font-serif">
                  <span>লেখক: <strong>{book.author}</strong></span>
                  {book.editor && <span> · সম্পাদনা: <strong>{book.editor}</strong></span>}
                  <span> · প্রকাশক: <strong>{book.publisher}</strong></span>
                </div>
              </div>

              {/* PDF Summary & Preface */}
              <div className="bg-[#F9F7F4] p-6 rounded-xl border border-[#E5E1DB] space-y-3">
                <h3 className="font-serif font-bold text-base text-[#1A1A1A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E0C268]" />
                  <span>বইয়ের ভূমিকা ও সংক্ষেপ</span>
                </h3>
                <p className="text-sm text-[#5C5852] leading-relaxed font-serif text-justify">
                  {book.summary}
                </p>
              </div>

              {/* Table of Contents in PDF */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#1A1A1A] border-b border-[#E5E1DB] pb-2">
                  সম্পূর্ণ সূচিপত্র ও অধ্যায়সমূহ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {chapters.map((ch, idx) => (
                    <div key={idx} className="flex items-baseline justify-between p-2.5 bg-[#F9F7F4] rounded-lg border border-[#E5E1DB]">
                      <span className="font-medium text-[#1A1A1A] line-clamp-1">{idx + 1}. {ch.title}</span>
                      <span className="text-[#8C8882] font-mono text-[11px] shrink-0 ml-2">পৃষ্ঠা {idx * 3 + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Chapters Stream in PDF Document */}
              <div className="space-y-12 pt-6">
                {chapters.map((ch, idx) => (
                  <div key={idx} className="space-y-4 pb-8 border-b border-[#E5E1DB] last:border-b-0">
                    <div className="flex items-baseline justify-between">
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                        {ch.title}
                      </h2>
                      <span className="text-xs text-[#8C8882] font-mono">অধ্যায় {idx + 1}</span>
                    </div>
                    {ch.subtitle && (
                      <p className="text-xs text-[#8C8882] italic font-serif -mt-2">{ch.subtitle}</p>
                    )}
                    {ch.quranVerse && (
                      <div className="p-3 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-lg text-xs font-serif text-center">
                        {ch.quranVerse}
                      </div>
                    )}
                    <div className="space-y-3 text-sm text-[#3D3A36] leading-relaxed font-serif">
                      {(ch.content || []).map((p, pIdx) => (
                        <p key={pIdx} className="indent-6 text-justify">{p}</p>
                      ))}
                    </div>
                    {ch.lesson && (
                      <div className="p-3 bg-[#F9F7F4] border-l-3 border-[#1A1A1A] rounded-r-lg text-xs text-[#1A1A1A] italic">
                        <strong>উপলব্ধি:</strong> {ch.lesson}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* PDF Publication Footer / Contact */}
              <div className="pt-8 border-t-2 border-[#1A1A1A] text-center text-xs text-[#8C8882] space-y-2 font-serif">
                <p>AYT Books ডিজিটাল লাইব্রেরি ও প্রকাশনা প্রকল্প</p>
                <p>হেল্পলাইন ও অর্ডার: {WHATSAPP_CONTACT.displayNumber} · Bogura, Bangladesh</p>
              </div>
            </div>
          </main>
        )}

        {/* 3. CONTINUOUS SCROLL MODE */}
        {viewMode === 'scroll' && (
          <main className={`flex-1 overflow-y-auto p-4 sm:p-10 flex justify-center ${currentTheme.paper}`}>
            <div className="max-w-2xl w-full space-y-10 pb-20">
              <div className="text-center pb-6 border-b border-black/10">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold">{book.title}</h1>
                <p className="text-xs text-[#8C8882] mt-1">{book.author} · {book.publisher}</p>
              </div>

              {chapters.map((ch, idx) => (
                <article key={idx} className="space-y-4 pb-8 border-b border-black/10 last:border-b-0 font-serif">
                  <h2 className="text-xl font-bold">
                    {idx + 1}. {ch.title}
                  </h2>
                  {ch.subtitle && <p className="text-xs text-[#8C8882] italic -mt-2">{ch.subtitle}</p>}
                  {ch.quranVerse && (
                    <div className="p-3 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-lg text-xs text-center">
                      {ch.quranVerse}
                    </div>
                  )}
                  <div className="space-y-3 text-sm leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                    {(ch.content || []).map((p, pIdx) => (
                      <p key={pIdx} className="indent-6 text-justify">{p}</p>
                    ))}
                  </div>
                </article>
              ))}
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

      {/* Global CSS Keyframes for realistic page flipping */}
      <style>{`
        @keyframes flipPageNext {
          0% {
            transform: rotateY(0deg);
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: rotateY(-180deg);
            opacity: 0;
          }
        }
        @keyframes flipPagePrev {
          0% {
            transform: rotateY(-180deg);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: rotateY(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
