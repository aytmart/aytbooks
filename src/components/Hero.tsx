import React from 'react';
import { BookOpen, Sparkles, Compass } from 'lucide-react';

interface HeroProps {
  onExploreShelves: () => void;
  onExploreBooks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreShelves, onExploreBooks }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDFCFB] via-[#F9F7F4] to-[#F2EFE9] py-16 sm:py-20 md:py-24 border-b border-[#E5E1DB]">
      {/* Background Ambience & Lighting Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {/* Subtle repeating geometric background */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%231A1A1A' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Warm light glow center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#C9A227]/10 blur-[120px] rounded-full" />
      </div>

      {/* Decorative Elements on Left & Right matching the uploaded image */}
      {/* Left Plant Decor (Stylized SVG illustration matching image vibe) */}
      <div className="absolute left-0 bottom-0 top-6 pointer-events-none hidden md:block w-48 lg:w-64 opacity-70">
        <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
          {/* Ceramic Pot */}
          <ellipse cx="60" cy="270" rx="45" ry="12" fill="#4B4844" opacity="0.8" />
          <path d="M25 270 L35 200 H85 L95 270 Z" fill="#5C5852" />
          <ellipse cx="60" cy="200" rx="25" ry="6" fill="#3D3A36" />
          {/* Green Plant Leaves */}
          <path d="M60 200 Q40 140 10 120 Q30 90 60 190" fill="#2D4A3E" />
          <path d="M60 190 Q80 130 110 90 Q100 60 60 180" fill="#3D6656" />
          <path d="M60 180 Q30 110 20 60 Q50 50 60 170" fill="#1B332B" />
          <path d="M60 170 Q70 90 90 40 Q110 70 60 160" fill="#4A7C69" />
          <path d="M60 160 Q40 80 50 20 Q70 40 60 150" fill="#2D4A3E" />
        </svg>
      </div>

      {/* Right Glowing Traditional Lantern Decor matching image */}
      <div className="absolute right-4 sm:right-8 lg:right-16 bottom-4 pointer-events-none hidden sm:block w-36 lg:w-48 opacity-85">
        <svg viewBox="0 0 160 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
          {/* Top Hanging Ring */}
          <circle cx="80" cy="24" r="14" stroke="#C9A227" strokeWidth="4" />
          <path d="M70 38 L90 38 L85 55 L75 55 Z" fill="#C9A227" />
          {/* Dome */}
          <path d="M80 55 C50 65, 40 85, 40 100 H120 C120 85, 110 65, 80 55 Z" fill="#2D2D2D" stroke="#E5E1DB" strokeWidth="1.5" />
          {/* Glass Lantern Body with glowing warm light */}
          <path d="M40 100 L45 220 L115 220 L120 100 Z" fill="#1A1A1A" stroke="#C9A227" strokeWidth="1.5" />
          {/* Inner Light Window */}
          <rect x="52" y="110" width="56" height="98" rx="6" fill="#FDE047" opacity="0.25" />
          <circle cx="80" cy="155" r="28" fill="#FBBF24" opacity="0.65" />
          <circle cx="80" cy="155" r="16" fill="#FEF08A" opacity="0.85" />
          {/* Islamic Lattice Filigree Pattern on Lantern */}
          <path d="M52 110 L108 208 M108 110 L52 208" stroke="#8C8882" strokeWidth="1.5" opacity="0.6" />
          <path d="M80 110 V208 M52 159 H108" stroke="#8C8882" strokeWidth="1.5" opacity="0.5" />
          {/* Bottom Stand */}
          <path d="M40 220 H120 L130 250 H30 Z" fill="#2D2D2D" stroke="#E5E1DB" strokeWidth="1.5" />
          <ellipse cx="80" cy="250" rx="50" ry="10" fill="#1A1A1A" />
        </svg>
      </div>

      {/* Center Content */}
      <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
        {/* Eyebrow badge with Free Reading Announcement */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 bg-[#1A1A1A] text-white rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-4 shadow-sm border border-white/10">
          <span className="flex items-center gap-1 text-[#E0C268]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ডিজিটাল লাইব্রেরি</span>
          </span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-[#FDFCFB]/90 font-normal">অনলাইনে সম্পূর্ণ ফ্রি পড়ুন</span>
        </div>

        {/* Main Headline with Editorial Font Pairing */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-[#1A1A1A] leading-[1.25] tracking-tight mb-4 sm:mb-5">
          জ্ঞান অন্বেষণের <span className="italic text-[#5C5852] font-normal">শুরু হোক</span> <span className="text-[#1A1A1A]">এখানেই</span>
        </h1>

        {/* Subtitle / Lead */}
        <p className="text-base sm:text-lg md:text-xl text-[#5C5852] max-w-2xl mx-auto font-serif leading-relaxed mb-8 sm:mb-9">
          ইসলামিক, শিক্ষামূলক ও জীবন ঘনিষ্ঠ প্রতিটি বই অনলাইনে ফ্রি পড়ুন
        </p>

        {/* Action Button matching Editorial theme */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreShelves}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-md bg-[#1A1A1A] hover:bg-neutral-800 text-[#FDFCFB] text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] shadow-sm hover:shadow-md transition-all cursor-pointer border border-[#1A1A1A]"
            id="hero-see-books-btn"
          >
            <BookOpen className="w-4 h-4 text-[#E0C268]" />
            <span>ফ্রি পড়ুন</span>
          </button>

          <button
            onClick={onExploreBooks}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-transparent hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] border border-[#1A1A1A] transition-all cursor-pointer"
            id="hero-catalog-btn"
          >
            <Compass className="w-4 h-4" />
            <span>বইয়ের ক্যাটালগ</span>
          </button>
        </div>
      </div>
    </section>
  );
};
