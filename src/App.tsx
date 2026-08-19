import React, { useState, useEffect } from 'react';
import { BOOKS_DATA, CATEGORIES } from './data/booksData';
import { Book, ShelfId } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ThematicShelves } from './components/ThematicShelves';
import { FeatureBand } from './components/FeatureBand';
import { QuoteBar } from './components/QuoteBar';
import { BookDetailModal } from './components/BookDetailModal';
import { BookReaderModal } from './components/BookReaderModal';
import { PregnancyRoutineModal } from './components/PregnancyRoutineModal';
import { AllBooksView } from './components/AllBooksView';
import { AuthorsView } from './components/AuthorsView';
import { AboutContactView } from './components/AboutContactView';
import { SmartSearchOverlay } from './components/SmartSearchOverlay';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { Heart, X, BookOpen, Trash2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<ShelfId | 'all'>('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [isRoutineOpen, setIsRoutineOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSavedOpen, setIsSavedOpen] = useState<boolean>(false);
  const [savedBookIds, setSavedBookIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ayt_saved_books');
      return stored ? JSON.parse(stored) : ['srishtikarta-ke', 'sheshbarer-moto'];
    } catch {
      return ['srishtikarta-ke', 'sheshbarer-moto'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ayt_saved_books', JSON.stringify(savedBookIds));
    } catch {}
  }, [savedBookIds]);

  const handleToggleSave = (bookId: string) => {
    setSavedBookIds(prev =>
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  const handleViewCategory = (catId: ShelfId) => {
    setSelectedCategory(catId);
    setActiveTab('books');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetail = (book: Book) => {
    setSelectedBook(book);
  };

  const handleOpenReader = (book: Book) => {
    setSelectedBook(null);
    setReadingBook(book);
  };

  const savedBooks = BOOKS_DATA.filter(b => savedBookIds.includes(b.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB] text-[#1A1A1A]">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenContact={() => setActiveTab('about')}
        savedCount={savedBookIds.length}
        onOpenSaved={() => setIsSavedOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Hero Section matching the user's reference image */}
            <Hero
              onExploreShelves={() => {
                const el = document.getElementById('shelves-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onExploreBooks={() => {
                setSelectedCategory('all');
                setActiveTab('books');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 2x2 Thematic Shelves matching the user's reference image */}
            <ThematicShelves
              books={BOOKS_DATA}
              onSelectBook={handleOpenDetail}
              onReadBook={handleOpenReader}
              onViewCategory={handleViewCategory}
              onToggleSave={handleToggleSave}
              savedBookIds={savedBookIds}
            />

            {/* 4-Item Feature Band from the reference image */}
            <FeatureBand />

            {/* Quranic Quote Bar from the reference image */}
            <QuoteBar />
          </div>
        )}

        {activeTab === 'books' && (
          <AllBooksView
            books={BOOKS_DATA}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectBook={handleOpenDetail}
            onReadBook={handleOpenReader}
            onToggleSave={handleToggleSave}
            savedBookIds={savedBookIds}
          />
        )}

        {activeTab === 'new' && (
          <AllBooksView
            books={BOOKS_DATA.filter(b => b.isNewRelease || b.specialType === 'pregnancy_routine')}
            selectedCategory="all"
            onSelectCategory={setSelectedCategory}
            onSelectBook={handleOpenDetail}
            onReadBook={handleOpenReader}
            onToggleSave={handleToggleSave}
            savedBookIds={savedBookIds}
          />
        )}

        {activeTab === 'authors' && (
          <AuthorsView
            onSelectBook={handleOpenDetail}
            onReadBook={handleOpenReader}
          />
        )}

        {activeTab === 'about' && (
          <AboutContactView />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={handleViewCategory}
      />

      {/* Floating WhatsApp Quick Contact button */}
      <FloatingWhatsApp />

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onRead={handleOpenReader}
          onOpenRoutine={() => setIsRoutineOpen(true)}
          isSaved={savedBookIds.includes(selectedBook.id)}
          onToggleSave={handleToggleSave}
        />
      )}

      {/* Fullscreen Book Reader Modal */}
      {readingBook && (
        <BookReaderModal
          book={readingBook}
          onClose={() => setReadingBook(null)}
        />
      )}

      {/* Pregnancy Routine Interactive Modal */}
      {isRoutineOpen && (
        <PregnancyRoutineModal
          onClose={() => setIsRoutineOpen(false)}
        />
      )}

      {/* Smart Search Overlay */}
      <SmartSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        books={BOOKS_DATA}
        onSelectBook={handleOpenDetail}
        onReadBook={handleOpenReader}
      />

      {/* Saved Books / Wishlist Drawer */}
      {isSavedOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#FDFCFB] border-l border-[#E5E1DB] h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 text-[#1A1A1A]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E1DB] mb-4">
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  <span>সংরক্ষিত পড়ার তালিকা ({savedBooks.length})</span>
                </h3>
                <button
                  onClick={() => setIsSavedOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F2EFE9] text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto space-y-3 pr-1">
                {savedBooks.length === 0 ? (
                  <p className="text-center py-12 text-sm text-[#8C8882] font-serif">
                    কোনো বই সংরক্ষিত নেই। বইয়ের কার্ডের হার্ট আইকনে ক্লিক করে সংরক্ষণ করুন।
                  </p>
                ) : (
                  savedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="p-3.5 rounded-xl border border-[#E5E1DB] hover:border-[#1A1A1A] bg-[#F9F7F4] flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-14 rounded-xs shrink-0 flex items-center justify-center text-[7px] text-white font-bold p-1 text-center shadow-xs"
                          style={{ backgroundColor: book.coverColor }}
                        >
                          {book.title.slice(0, 10)}
                        </div>
                        <div>
                          <h4 className="font-serif text-xs font-bold line-clamp-1">{book.title}</h4>
                          <span className="text-[11px] text-[#8C8882] block">{book.author}</span>
                          <span className="text-xs font-bold text-[#1A1A1A] font-mono">{book.currency}{book.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setIsSavedOpen(false);
                            handleOpenReader(book);
                          }}
                          className="p-2 rounded-md bg-[#1A1A1A] text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="পড়ুন"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleSave(book.id)}
                          className="p-2 rounded-md bg-[#F2EFE9] hover:bg-red-50 hover:text-red-600 text-[#5C5852] border border-[#E5E1DB] transition-colors cursor-pointer"
                          title="সরান"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {savedBooks.length > 0 && (
              <button
                onClick={() => setSavedBookIds([])}
                className="w-full py-2.5 rounded-md border border-[#E5E1DB] text-red-600 text-xs font-semibold uppercase tracking-wider hover:bg-red-50 transition-colors cursor-pointer"
              >
                সব তালিকা মুছুন
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
