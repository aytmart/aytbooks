import React from 'react';
import { Sparkles } from 'lucide-react';

export const QuoteBar: React.FC = () => {
  return (
    <div className="bg-[#1A1A1A] text-[#FDFCFB] py-6 px-4 text-center border-t border-black/20">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 text-center">
        <Sparkles className="w-4 h-4 text-[#E0C268] shrink-0 hidden sm:inline" />
        <p className="font-serif text-sm sm:text-base md:text-lg leading-relaxed text-[#FDFCFB]">
          <span className="text-[#E0C268] font-bold font-serif italic">“রব্বি জিদনি ইলমা”</span> — “হে আমার পালনকর্তা, আমাকে জ্ঞান বৃদ্ধি করে দাও” <span className="text-xs text-[#A6A29D] font-mono tracking-wider">(সূরা তাহা: ২০:১৪)</span>
        </p>
        <Sparkles className="w-4 h-4 text-[#E0C268] shrink-0 hidden sm:inline" />
      </div>
    </div>
  );
};
