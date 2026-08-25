import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, ReadingSettings, ReadingMode } from './types';
import { BOOK_CATEGORIES, INITIAL_BOOKS } from './data/booksData';
import { StorageService, DEFAULT_SETTINGS } from './services/storageService';
import { Library3DCanvas } from './components/library/Library3DCanvas';
import { BookSpotlightStage } from './components/library/BookSpotlightStage';
import { BookAnimationTransition } from './components/library/BookAnimationTransition';
import { TableReadingMode } from './components/reader/TableReadingMode';
import { FullscreenPdfMode } from './components/reader/FullscreenPdfMode';
import { ImmersiveReadingMode } from './components/reader/ImmersiveReadingMode';
import { VRReadingMode } from './components/reader/VRReadingMode';
import { Header } from './components/ui/Header';
import { BottomDock } from './components/ui/BottomDock';
import { FloatingTools } from './components/ui/FloatingTools';
import { FeatureBadges } from './components/ui/FeatureBadges';
import { SearchModal } from './components/ui/SearchModal';
import { CategoriesModal } from './components/ui/CategoriesModal';
import { MyBooksModal } from './components/ui/MyBooksModal';
import { SettingsModal } from './components/ui/SettingsModal';
import { TOCModal } from './components/ui/TOCModal';
import { Classic2DLibrary } from './components/ui/Classic2DLibrary';
import { RoomNavigator } from './components/ui/RoomNavigator';
import { ReadingModesShowcase } from './components/ui/ReadingModesShowcase';
import { BookOpen, Sparkles, HelpCircle, X, Maximize2, Moon, Eye, Glasses } from 'lucide-react';

export default function App() {
  // App state
  const [books] = useState<Book[]>(INITIAL_BOOKS);
  const [categories] = useState(BOOK_CATEGORIES);
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);

  // View state
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [spotlightBook, setSpotlightBook] = useState<Book | null>(null);
  const [transitioningBook, setTransitioningBook] = useState<Book | null>(null);
  const [readingMode, setReadingMode] = useState<ReadingMode>('table');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);
  const [searchWaypoint, setSearchWaypoint] = useState<{ x: number; z: number; title: string } | null>(null);
  const [is2DView, setIs2DView] = useState(true);
  const [isSensorEnabled, setIsSensorEnabled] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMyBooksOpen, setIsMyBooksOpen] = useState(false);
  const [myBooksTab, setMyBooksTab] = useState<'continue' | 'bookmarks' | 'offline'>('continue');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTOCOpen, setIsTOCOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [zoomAction, setZoomAction] = useState<{ type: 'in' | 'out' | 'reset'; timestamp: number } | null>(null);
  const [orbitAction, setOrbitAction] = useState<{ dir: 'left' | 'right' | 'up' | 'down'; timestamp: number } | null>(null);

  // Load saved settings & last read book
  useEffect(() => {
    const savedSettings = StorageService.getSettings();
    setSettings(savedSettings);

    // Auto fade welcome message after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  // Update Settings handler
  const handleUpdateSettings = (newSettings: Partial<ReadingSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  // Find last read book
  const lastReadId = StorageService.getLastReadBookId();
  const lastReadBook = books.find((b) => b.id === lastReadId) || null;

  // Handle Book Selection: Pulls book out to front spotlight stage (Does NOT auto open reader)
  const handleSelectBook = (book: Book, startPage?: number) => {
    const progress = StorageService.getProgress(book.id);
    const initialPage = startPage || progress?.currentPage || 1;
    setCurrentPage(initialPage);
    setSpotlightBook(book);
  };

  // Open the book for reading (from spotlight stage button or direct open)
  const handleOpenBook = (book: Book, startPage?: number) => {
    const progress = StorageService.getProgress(book.id);
    const initialPage = startPage || progress?.currentPage || 1;
    setCurrentPage(initialPage);
    setSpotlightBook(null);

    if (settings.reducedMotion || is2DView) {
      setSelectedBook(book);
    } else {
      setTransitioningBook(book);
    }
  };

  // Dismiss spotlight stage and return back to library view
  const handleDismissSpotlight = () => {
    setSpotlightBook(null);
  };

  // When physical 3D animation ends
  const handleAnimationComplete = () => {
    if (transitioningBook) {
      setSelectedBook(transitioningBook);
      setTransitioningBook(null);
    }
  };

  // Handle Page Change & save progress
  const handlePageChange = (page: number) => {
    if (!selectedBook) return;
    setCurrentPage(page);
    StorageService.saveProgress({
      bookId: selectedBook.id,
      currentPage: page,
      totalPages: selectedBook.pagesCount,
      percent: Math.round((page / selectedBook.pagesCount) * 100),
      lastReadTime: Date.now(),
      completed: page >= selectedBook.pagesCount,
      timeSpentSeconds: 60,
    });
  };

  // Exit reader back to library
  const handleBackToLibrary = () => {
    setSelectedBook(null);
  };

  // Mobile Gyroscope sensor toggle
  const handleToggleSensor = async () => {
    if (!isSensorEnabled) {
      // For iOS 13+ devices, request permission
      if (
        typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
      ) {
        try {
          const res = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
          if (res === 'granted') {
            setIsSensorEnabled(true);
          }
        } catch {
          setIsSensorEnabled(true);
        }
      } else {
        setIsSensorEnabled(true);
      }
    } else {
      setIsSensorEnabled(false);
    }
  };

  return (
    <div
      id="ayt-books-app-root"
      className="relative w-screen h-screen overflow-hidden bg-[#0c0906] text-[#f4ecd8] font-['Plus_Jakarta_Sans'] antialiased select-none"
    >
      {/* 1. READER ACTIVE VIEW */}
      {selectedBook ? (
        <div id="active-book-reader-container" className="relative w-full h-full flex flex-col">
          {/* Mode Switcher Floating Bar */}
          <div
            id="reader-mode-switcher-bar"
            className="absolute top-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 p-1 rounded-full bg-stone-950/85 border border-[#d4af37]/40 shadow-xl backdrop-blur-md text-xs font-['Hind_Siliguri']"
          >
            <button
              onClick={() => setReadingMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                readingMode === 'table'
                  ? 'bg-[#d4af37] text-stone-950 font-bold shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>টেবিল মোড</span>
            </button>

            <button
              onClick={() => setReadingMode('fullscreen')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                readingMode === 'fullscreen'
                  ? 'bg-[#d4af37] text-stone-950 font-bold shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>পিডিএফ ভিউ</span>
            </button>

            <button
              onClick={() => setReadingMode('immersive')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                readingMode === 'immersive'
                  ? 'bg-[#d4af37] text-stone-950 font-bold shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>ইমার্সিভ মোড</span>
            </button>

            <button
              onClick={() => setReadingMode('vr')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                readingMode === 'vr'
                  ? 'bg-[#d4af37] text-stone-950 font-bold shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Glasses className="w-3.5 h-3.5" />
              <span>VR মোড</span>
            </button>
          </div>

          {/* Active Mode Rendering */}
          <div className="flex-1 w-full h-full overflow-hidden">
            {readingMode === 'table' && (
              <TableReadingMode
                book={selectedBook}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onBackToLibrary={handleBackToLibrary}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onOpenSettingsModal={() => setIsSettingsOpen(true)}
                onOpenTOC={() => setIsTOCOpen(true)}
              />
            )}

            {readingMode === 'fullscreen' && (
              <FullscreenPdfMode
                book={selectedBook}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onBackToLibrary={handleBackToLibrary}
                settings={settings}
                onOpenSettingsModal={() => setIsSettingsOpen(true)}
              />
            )}

            {readingMode === 'immersive' && (
              <ImmersiveReadingMode
                book={selectedBook}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onBackToLibrary={handleBackToLibrary}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onOpenSettingsModal={() => setIsSettingsOpen(true)}
              />
            )}

            {readingMode === 'vr' && (
              <VRReadingMode
                book={selectedBook}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onBackToLibrary={handleBackToLibrary}
                settings={settings}
              />
            )}
          </div>
        </div>
      ) : (
        /* 2. 3D VIRTUAL LIBRARY HOMEPAGE */
        <div id="virtual-library-homepage" className="relative w-full h-full flex flex-col overflow-y-auto overflow-x-hidden bg-[#0c0906]">
          {/* Header Navigation */}
          <Header
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenCategories={() => setIsCategoriesOpen(true)}
            onOpenMyBooks={(tab) => {
              setMyBooksTab(tab || 'continue');
              setIsMyBooksOpen(true);
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
            lastReadBook={lastReadBook}
            onSelectBook={handleSelectBook}
            is2DView={is2DView}
            onToggle2DView={() => setIs2DView(!is2DView)}
          />

          {/* 3D Viewport Hero Section */}
          <div className="relative w-full h-screen min-h-[640px] flex-shrink-0 flex flex-col justify-between overflow-hidden">
            {/* Welcome Message Overlay */}
            <AnimatePresence>
              {showWelcome && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="absolute top-24 sm:top-20 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none px-4 w-full max-w-md"
                >
                  <div className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-[#d4af37] uppercase font-['Cinzel']">
                    Welcome to
                  </div>
                  <h1 className="text-xl sm:text-4xl font-extrabold text-white font-['Cinzel'] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] mt-0.5">
                    AYT Books Library
                  </h1>
                  <p className="hidden sm:block text-xs sm:text-sm text-stone-300 font-['Hind_Siliguri'] mt-1 tracking-wider drop-shadow">
                    Explore. Open. Read. Learn. (বইটিতে ক্লিক করে পড়ার টেবিলে খুলুন)
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3D Library Canvas OR 2D Classic Fallback */}
            <div className="relative flex-1 w-full h-full overflow-hidden">
              {is2DView ? (
                <Classic2DLibrary
                  categories={categories}
                  books={books}
                  onSelectBook={handleSelectBook}
                />
              ) : (
                <Library3DCanvas
                  books={books}
                  categories={categories}
                  onSelectBook={handleSelectBook}
                  selectedCategory={activeCategoryIndex !== null ? categories[activeCategoryIndex]?.id || null : null}
                  activeCategoryIndex={activeCategoryIndex}
                  onClearCategoryFocus={() => setActiveCategoryIndex(null)}
                  searchWaypoint={searchWaypoint}
                  onClearWaypoint={() => setSearchWaypoint(null)}
                  isSensorEnabled={isSensorEnabled}
                  reducedMotion={settings.reducedMotion}
                  zoomAction={zoomAction}
                  orbitAction={orbitAction}
                />
              )}
            </div>

            {/* Floating Tools on Left (Orbit, Zoom, Help matching image.png) */}
            {!is2DView && (
              <FloatingTools
                isSensorEnabled={isSensorEnabled}
                onToggleSensor={handleToggleSensor}
                onOpenHelp={() => setIsHelpOpen(true)}
                onResetView={() => {
                  setActiveCategoryIndex(null);
                  setZoomAction({ type: 'reset', timestamp: Date.now() });
                }}
                onZoomIn={() => setZoomAction({ type: 'in', timestamp: Date.now() })}
                onZoomOut={() => setZoomAction({ type: 'out', timestamp: Date.now() })}
              />
            )}

            {/* Bottom Right Room Navigator (Matching image.png directional controls) */}
            {!is2DView && (
              <RoomNavigator
                onRotateLeft={() => setOrbitAction({ dir: 'left', timestamp: Date.now() })}
                onRotateRight={() => setOrbitAction({ dir: 'right', timestamp: Date.now() })}
                onTiltUp={() => setOrbitAction({ dir: 'up', timestamp: Date.now() })}
                onTiltDown={() => setOrbitAction({ dir: 'down', timestamp: Date.now() })}
                onReset={() => {
                  setActiveCategoryIndex(null);
                  setZoomAction({ type: 'reset', timestamp: Date.now() });
                }}
              />
            )}

            {/* Bottom Floating Navigation Dock */}
            <BottomDock
              onOpenCategories={() => setIsCategoriesOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenContinueReading={() => {
                setMyBooksTab('continue');
                setIsMyBooksOpen(true);
              }}
              onOpenMyBooks={() => {
                setMyBooksTab('bookmarks');
                setIsMyBooksOpen(true);
              }}
              onOpenSettings={() => setIsSettingsOpen(true)}
              lastReadBook={lastReadBook}
              onOpenLastBook={() => lastReadBook && handleSelectBook(lastReadBook)}
            />
          </div>

          {/* Bottom Row Reading Modes Showcase (Matching image.png Table, PDF, Immersive Mode Cards) */}
          <ReadingModesShowcase
            activeBook={lastReadBook || books[0]}
            onSelectMode={(mode) => {
              const target = lastReadBook || books[0];
              setReadingMode(mode);
              handleSelectBook(target);
            }}
          />

          {/* Bottom Feature Badges (Matching image.png) */}
          <FeatureBadges
            onOpenOfflineManager={() => {
              setMyBooksTab('offline');
              setIsMyBooksOpen(true);
            }}
            onOpenFontSettings={() => setIsSettingsOpen(true)}
          />
        </div>
      )}

      {/* 3. Book Spotlight Stage (Brings selected book to front with 2 buttons: "বইটি পড়ুন" and "লাইব্রেরিতে ফিরে যান") */}
      {spotlightBook && (
        <BookSpotlightStage
          book={spotlightBook}
          onOpenBook={(b) => handleOpenBook(b)}
          onBackToLibrary={handleDismissSpotlight}
          reducedMotion={settings.reducedMotion}
        />
      )}

      {/* 4. Physical Book Pull-out Opening Animation */}
      {transitioningBook && (
        <BookAnimationTransition
          book={transitioningBook}
          onAnimationComplete={handleAnimationComplete}
          reducedMotion={settings.reducedMotion}
        />
      )}

      {/* 5. MODALS */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        books={books}
        onSelectBook={handleSelectBook}
        onFocusShelf={(shelfIdx) => {
          setActiveCategoryIndex(shelfIdx);
          setIsSearchOpen(false);
        }}
        onLocateBook={(book, coords) => {
          setSearchWaypoint({ x: coords.x, z: coords.z, title: book.banglaTitle });
          setIsSearchOpen(false);
        }}
      />

      <CategoriesModal
        isOpen={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
        categories={categories}
        books={books}
        onSelectCategory={(shelfIdx) => {
          setActiveCategoryIndex(shelfIdx);
          setIsCategoriesOpen(false);
        }}
      />

      <MyBooksModal
        isOpen={isMyBooksOpen}
        onClose={() => setIsMyBooksOpen(false)}
        books={books}
        onSelectBook={handleSelectBook}
        initialTab={myBooksTab}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        is2DView={is2DView}
        onToggle2DView={() => setIs2DView(!is2DView)}
      />

      {selectedBook && (
        <TOCModal
          isOpen={isTOCOpen}
          onClose={() => setIsTOCOpen(false)}
          book={selectedBook}
          currentPage={currentPage}
          onSelectPage={handlePageChange}
        />
      )}

      {/* 5. Library Help / Guide Modal */}
      {isHelpOpen && (
        <div
          id="ayt-help-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="w-full max-w-lg rounded-3xl bg-stone-900 border border-[#d4af37]/40 shadow-2xl p-6 text-stone-200 font-['Hind_Siliguri']">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-lg font-bold text-white">৩ডি লাইব্রেরি গাইড</h3>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
                <strong className="text-[#d4af37] block mb-1">🖱️ কম্পিউটার / ডেস্কটপ:</strong>
                মাউস দিয়ে ড্র্যাগ করে লাইব্রেরি ৩৬০° ঘুরিয়ে দেখুন। মাউসের স্ক্রল হুইল দিয়ে জুম ইন ও জুম আউট করুন।
              </div>
              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
                <strong className="text-[#5ec2d7] block mb-1">📱 মোবাইল ফোন ও সেন্সর:</strong>
                আঙুল দিয়ে ড্র্যাগ ও পিঞ্চ করুন। অথবা ওপরের <strong>'ফোন ঘুরিয়ে ৩৬০°'</strong> বোতামে চাপ দিলে মোবাইল যেদিকে কাত করবেন লাইব্রেরিও সেদিকে ঘুরবে।
              </div>
              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
                <strong className="text-emerald-400 block mb-1">📖 বই পড়া ও টেবিল মোড:</strong>
                যেকোনো বইয়ে ক্লিক করলে বইটি পড়ার টেবিলে এসে খুলবে। কীবোর্ড তীরচিহ্ন বা সোয়াইপ করে পৃষ্ঠা উল্টানো যায়।
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#d4af37] text-stone-950 font-bold text-xs"
              >
                বুঝেছি, ধন্যবাদ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
