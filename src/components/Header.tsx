import React, { useState } from 'react';
import { Search, User, Menu, X, BookOpen, Heart, ExternalLink, Globe, Sparkles } from 'lucide-react';
import { ECOSYSTEM_LINKS } from '../data/booksData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenContact: () => void;
  savedCount: number;
  onOpenSaved: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenContact,
  savedCount,
  onOpenSaved
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [venturesOpen, setVenturesOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'হোম' },
    { id: 'books', label: 'বইসমূহ' },
    { id: 'shelves', label: 'বিষয়ভিত্তিক তাক' },
    { id: 'authors', label: 'লেখকবৃন্দ' },
    { id: 'new', label: 'নতুন প্রকাশনা' },
    { id: 'about', label: 'আমাদের সম্পর্কে' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setVenturesOpen(false);
    if (id === 'shelves') {
      const el = document.getElementById('shelves-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-md border-b border-[#E5E1DB] transition-all">
      {/* Top Banner Editorial Strip with Sister Ventures */}
      <div className="bg-[#1A1A1A] text-[#FDFCFB] text-xs py-1.5 px-4 border-b border-black/20">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left: Sister ventures buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-[#A6A29D] font-mono tracking-wider uppercase hidden sm:inline">
              সহযোগী প্ল্যাটফর্ম:
            </span>
            <div className="flex items-center gap-1.5">
              {ECOSYSTEM_LINKS.map((eco) => (
                <a
                  key={eco.id}
                  href={eco.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#2D2D2D] hover:bg-[#3D3D3D] text-[11px] font-sans text-[#FDFCFB] border border-white/10 hover:border-[#E0C268] transition-colors"
                  title={eco.tagline}
                >
                  <span>{eco.icon}</span>
                  <span className="font-semibold">{eco.name}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Contact & WhatsApp */}
          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            <span className="text-[#A6A29D] font-mono hidden md:inline">📞 +880 1786-840952</span>
            <a
              href="https://wa.me/8801786840952?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%2C%20AYT%20Books%20%E0%A6%A5%E0%A7%87%E0%A6%95%E0%A7%87%20%E0%A6%AC%E0%A6%87%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87।"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E0C268] hover:text-white transition-colors font-semibold tracking-wider flex items-center gap-1"
            >
              WhatsApp অর্ডার →
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with Editorial Style */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            id="header-logo-btn"
          >
            <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-[#E0C268] border border-[#E5E1DB] group-hover:bg-[#0F3D3E] transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline tracking-tight">
                <span className="font-serif italic text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">AYT</span>
                <span className="font-serif italic text-2xl sm:text-3xl font-normal text-[#5C5852] ml-0.5">Books.</span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C8882] font-semibold">জ্ঞানের পথে একটি ছোট্ট উদ্যোগ</p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`py-1 transition-all border-b-2 cursor-pointer ${
                  activeTab === link.id
                    ? 'text-[#1A1A1A] font-bold border-[#1A1A1A]'
                    : 'text-[#5C5852] border-transparent hover:text-[#1A1A1A] hover:border-[#8C8882]'
                }`}
                id={`nav-link-${link.id}`}
              >
                {link.label}
              </button>
            ))}

            {/* Sister Ventures Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setVenturesOpen(!venturesOpen)}
                className="py-1 px-2.5 rounded-full border border-[#E5E1DB] bg-[#F9F7F4] hover:bg-[#F2EFE9] text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E0C268]" />
                <span>আমাদের উদ্যোগসমূহ</span>
                <span className="text-[10px] opacity-60">▾</span>
              </button>

              {venturesOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#FDFCFB] border border-[#E5E1DB] rounded-xl shadow-xl p-2.5 space-y-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#8C8882] tracking-wider border-b border-[#E5E1DB]">
                    AYT Ecosystem Ventures
                  </div>
                  {ECOSYSTEM_LINKS.map((v) => (
                    <a
                      key={v.id}
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F9F7F4] transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{v.icon}</span>
                        <div>
                          <span className="text-xs font-bold text-[#1A1A1A] block">{v.name}</span>
                          <span className="text-[10px] text-[#5C5852]">{v.tagline}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-[#8C8882] group-hover:text-[#1A1A1A]" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons & Search */}
          <div className="flex items-center gap-3">
            {/* Editorial Style Search Bar */}
            <div
              onClick={onOpenSearch}
              className="hidden sm:flex items-center gap-2 bg-[#F9F7F4] border border-[#E5E1DB] rounded-full px-4 py-2 text-sm text-[#8C8882] hover:border-[#1A1A1A] hover:bg-white transition-all cursor-pointer w-44 md:w-52"
              id="header-search-bar"
            >
              <input
                type="text"
                placeholder="বই খুঁজুন..."
                readOnly
                className="bg-transparent border-none outline-none w-full text-xs text-[#1A1A1A] placeholder:italic placeholder:text-[#A6A29D] cursor-pointer"
              />
              <Search className="w-4 h-4 text-[#1A1A1A]" />
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-2 rounded-full hover:bg-[#F2EFE9] text-[#1A1A1A] transition-colors"
              aria-label="Search"
              id="mobile-search-btn"
            >
              <Search className="w-5 h-5 text-[#1A1A1A]" />
            </button>

            {/* Reading List / Wishlist */}
            <button
              onClick={onOpenSaved}
              className="p-2.5 rounded-full border border-[#E5E1DB] text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F9F7F4] transition-all relative cursor-pointer"
              title="সংরক্ষিত বইসমূহ"
              id="saved-books-btn"
            >
              <Heart className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1A1A1A] text-white text-[10px] rounded-full flex items-center justify-center font-bold font-mono">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Profile / Help Button */}
            <button
              onClick={onOpenContact}
              className="p-2.5 rounded-full border border-[#E5E1DB] text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F9F7F4] transition-all cursor-pointer"
              title="যোগাযোগ ও সহায়তা"
              id="user-account-btn"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-[#E5E1DB] text-[#1A1A1A] hover:bg-[#F2EFE9]"
              aria-label="Menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFCFB] border-b border-[#E5E1DB] px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  activeTab === link.id
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-[#1A1A1A] hover:bg-[#F2EFE9]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Sister Ventures in Mobile Drawer */}
          <div className="pt-3 border-t border-[#E5E1DB] space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#8C8882] tracking-wider block px-1">
              আমাদের সহযোগী প্ল্যাটফর্মসমূহ:
            </span>
            <div className="grid grid-cols-1 gap-2">
              {ECOSYSTEM_LINKS.map((eco) => (
                <a
                  key={eco.id}
                  href={eco.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#F9F7F4] border border-[#E5E1DB] text-xs font-semibold text-[#1A1A1A]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{eco.icon}</span>
                    <span>{eco.name} ({eco.badge})</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8C8882]" />
                </a>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E5E1DB]">
            <button
              onClick={() => {
                onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 text-center bg-[#1A1A1A] text-white rounded-md font-semibold text-sm shadow-xs"
            >
              যোগাযোগ ও অর্ডার ডেস্ক
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

