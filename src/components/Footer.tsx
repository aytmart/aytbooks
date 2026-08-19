import React from 'react';
import { CATEGORIES, WHATSAPP_CONTACT, ECOSYSTEM_LINKS } from '../data/booksData';
import { ShelfId } from '../types';
import { BookOpen, Phone, Mail, MapPin, ExternalLink, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onSelectCategory: (catId: ShelfId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  return (
    <footer className="bg-[#1A1A1A] text-[#A6A29D] pt-14 pb-10 border-t border-[#2D2D2D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Sister Platforms Top Bar in Footer */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#242424] border border-[#333333] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center text-[#E0C268] border border-white/10 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#FDFCFB]">
                আমাদের সহযোগী প্ল্যাটফর্ম ও অন্যান্য উদ্যোগসমূহ
              </h4>
              <p className="text-xs text-[#8C8882]">
                জ্ঞান, কৃষি, প্রযুক্তি ও ই-কমার্সের সমন্বিত সেবা
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {ECOSYSTEM_LINKS.map((eco) => (
              <a
                key={eco.id}
                href={eco.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1A1A1A] hover:bg-neutral-800 text-[#FDFCFB] text-xs font-semibold border border-white/15 hover:border-[#E0C268] transition-all group"
              >
                <span>{eco.icon}</span>
                <span>{eco.name}</span>
                <span className="text-[10px] text-[#A6A29D] font-mono">({eco.badge})</span>
                <ExternalLink className="w-3 h-3 text-[#A6A29D] group-hover:text-white" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#2D2D2D]">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#262626] flex items-center justify-center text-[#E0C268] border border-[#3D3D3D]">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold text-[#FDFCFB]">
                AYT<span className="text-[#E0C268] italic font-normal">Books</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A6A29D] leading-relaxed font-serif">
              বাংলা ভাষায় মানসম্মত ও জীবনমুখী বইয়ের ডিজিটাল লাইব্রেরি ও আর্কাইভ। প্রতিটি বই অনলাইনে ফ্রিতে পড়ুন এবং সরাসরি WhatsApp এ সংগ্রহ করুন।
            </p>
            <p className="text-xs text-[#E0C268] font-serif italic tracking-wide">
              “জ্ঞানের পথে একটি মার্জিত উদ্যোগ”
            </p>
          </div>

          {/* Quick Pages */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-widest text-[#FDFCFB] border-b border-[#2D2D2D] pb-2">
              পেজসমূহ
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#FDFCFB] transition-colors cursor-pointer">
                  হোমপেজ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('books')} className="hover:text-[#FDFCFB] transition-colors cursor-pointer">
                  সকল বই
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shelves')} className="hover:text-[#FDFCFB] transition-colors cursor-pointer">
                  বিষয়ভিত্তিক তাক
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('authors')} className="hover:text-[#FDFCFB] transition-colors cursor-pointer">
                  লেখকবৃন্দ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#FDFCFB] transition-colors cursor-pointer">
                  আমাদের সম্পর্কে
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-widest text-[#FDFCFB] border-b border-[#2D2D2D] pb-2">
              ক্যাটাগরি
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-[#FDFCFB] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3 text-xs sm:text-sm">
            <h4 className="font-serif font-bold text-sm uppercase tracking-widest text-[#FDFCFB] border-b border-[#2D2D2D] pb-2">
              যোগাযোগ ও অর্ডার
            </h4>
            <ul className="space-y-2.5 font-mono">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#E0C268] shrink-0 mt-0.5" />
                <span className="font-sans">{WHATSAPP_CONTACT.displayNumber}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#E0C268] shrink-0 mt-0.5" />
                <span className="font-sans">{WHATSAPP_CONTACT.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E0C268] shrink-0 mt-0.5" />
                <span className="font-sans">{WHATSAPP_CONTACT.address}</span>
              </li>
              <li className="pt-1 font-sans">
                <a
                  href={`https://wa.me/${WHATSAPP_CONTACT.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-md bg-[#1F7A4D] hover:bg-[#18603C] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  <span>💬 WhatsApp অর্ডার</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6E6A64] gap-4">
          <p>© {new Date().getFullYear()} AYT Books Archive. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1 text-[#A6A29D] font-serif">
            <span>জ্ঞান অন্বেষণে নিবেদিত</span>
            <span>·</span>
            <span>Made for Bengali Readers</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

