import React from 'react';
import { BookOpen, Maximize2, Moon, Sliders, Type, Columns, MoreHorizontal, ChevronLeft, ChevronRight, Share2, ZoomIn } from 'lucide-react';
import { Book } from '../../types';

interface ReadingModesShowcaseProps {
  onSelectMode: (mode: 'table' | 'pdf' | 'immersive') => void;
  activeBook?: Book | null;
}

export const ReadingModesShowcase: React.FC<ReadingModesShowcaseProps> = ({
  onSelectMode,
  activeBook,
}) => {
  return (
    <div
      id="ayt-reading-modes-showcase"
      className="w-full bg-[#0e0b08] border-t border-[#d4af37]/30 py-6 px-4 sm:px-8 select-none"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Table Reading Mode Card */}
        <div
          onClick={() => onSelectMode('table')}
          className="group relative rounded-2xl bg-gradient-to-b from-[#211710] to-[#120d09] border border-[#d4af37]/40 shadow-2xl overflow-hidden hover:border-[#f1c40f] transition-all cursor-pointer flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-3.5 flex items-center justify-between border-b border-[#d4af37]/20 bg-black/40">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              <span className="text-xs font-bold text-stone-200 font-['Cinzel'] tracking-wide">
                Table Reading Mode
              </span>
            </div>
            <Maximize2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#d4af37] transition-colors" />
          </div>

          {/* Realistic Book on Wooden Table Preview */}
          <div className="relative h-48 bg-gradient-to-b from-[#1f150e] to-[#0c0805] p-4 flex items-center justify-center overflow-hidden">
            {/* Ambient table spotlight */}
            <div className="absolute inset-0 bg-radial from-amber-600/15 via-transparent to-black pointer-events-none" />

            {/* Left/Right Navigation arrows */}
            <button className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-stone-300 flex items-center justify-center border border-stone-700">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-stone-300 flex items-center justify-center border border-stone-700">
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Open 3D Style Book Graphic */}
            <div className="relative w-72 h-36 rounded-md bg-[#fdf6e6] shadow-[0_10px_25px_rgba(0,0,0,0.8)] border border-amber-900/30 flex overflow-hidden">
              {/* Left Page */}
              <div className="w-1/2 p-2.5 border-r border-amber-900/20 text-[6px] text-stone-800 leading-tight font-serif flex flex-col justify-between">
                <div>
                  <div className="font-bold text-amber-900 text-[7px] mb-1">বিসমিল্লাহির রাহমানির রাহিম</div>
                  <div className="text-stone-700">
                    জ্ঞান অন্বেষণ প্রত্যেক মুসলিমের জন্য ফরজ। যে ব্যক্তি জ্ঞান অন্বেষণের পথে চলে, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন।
                  </div>
                </div>
                <div className="text-center text-[5px] text-stone-400">AYT Books • 46</div>
              </div>
              {/* Right Page */}
              <div className="w-1/2 p-2.5 text-[6px] text-stone-800 leading-tight font-serif flex flex-col justify-between bg-[#fbf3e0]">
                <div>
                  <div className="font-bold text-amber-900 text-[7px] mb-1">জ্ঞানের মহত্ত্ব ও আলোকবর্তিকা</div>
                  <div className="text-stone-700">
                    কিতাব হলো হৃদয়ের আলো ও জীবনের পরম দিশা। সত্য ও প্রজ্ঞার পথ চিরন্তন ও অবিনশ্বর।
                  </div>
                </div>
                <div className="text-center text-[5px] text-stone-400">AYT Books • 47</div>
              </div>
            </div>
          </div>

          {/* Bottom Table Controls */}
          <div className="p-3 bg-black/50 border-t border-[#d4af37]/20 flex items-center justify-between text-[11px] text-stone-300 font-['Hind_Siliguri']">
            <button className="flex items-center gap-1 hover:text-[#d4af37]">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <span className="font-mono text-stone-400 text-[10px]">47 / 182</span>
            <button className="flex items-center gap-1 hover:text-[#d4af37]">
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Fullscreen PDF Mode Card */}
        <div
          onClick={() => onSelectMode('pdf')}
          className="group relative rounded-2xl bg-gradient-to-b from-[#181a1f] to-[#0c0d10] border border-cyan-500/40 shadow-2xl overflow-hidden hover:border-cyan-400 transition-all cursor-pointer flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-3.5 flex items-center justify-between border-b border-cyan-500/20 bg-black/40">
            <div className="flex items-center gap-2">
              <Columns className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-stone-200 font-['Cinzel'] tracking-wide">
                Fullscreen PDF Mode
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
              <Share2 className="w-3 h-3" />
              <span>120%</span>
              <ZoomIn className="w-3 h-3" />
            </div>
          </div>

          {/* PDF Viewer Layout Preview */}
          <div className="relative h-48 bg-[#1f232b] flex overflow-hidden">
            {/* Left Thumbnail Sidebar */}
            <div className="w-16 bg-[#13161c] border-r border-stone-800 p-1.5 space-y-1.5 flex flex-col items-center">
              <div className="w-12 h-10 bg-white/10 rounded border border-stone-700 text-[6px] text-stone-400 flex items-center justify-center">
                45
              </div>
              <div className="w-12 h-10 bg-cyan-500/20 rounded border border-cyan-400 text-[6px] text-cyan-300 font-bold flex items-center justify-center">
                46
              </div>
              <div className="w-12 h-10 bg-white/10 rounded border border-stone-700 text-[6px] text-stone-400 flex items-center justify-center">
                47
              </div>
            </div>

            {/* Centered Document Page */}
            <div className="flex-1 bg-white p-4 flex flex-col justify-between shadow-inner text-stone-900 font-serif">
              <div>
                <h4 className="text-[10px] font-bold text-stone-900 border-b pb-1 mb-1">
                  The Wisdom of Life
                </h4>
                <p className="text-[6px] text-stone-700 leading-normal">
                  Life is a journey of learning, discovering, and becoming. Every experience, whether good or bad, shapes us in ways we may not always understand. The key is to stay curious, keep seeking knowledge, and remain grateful for every moment.
                </p>
                <p className="text-[6px] text-stone-700 leading-normal mt-1">
                  True wisdom comes not just from reading books, but from understanding life and using that understanding to make this world a better place.
                </p>
              </div>
              <div className="text-[5px] text-stone-400 text-center font-mono">Page 46 of 182</div>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="p-3 bg-black/50 border-t border-cyan-500/20 flex items-center justify-between text-[11px] text-stone-300">
            <span className="text-[10px] text-stone-400">PDF Reader with Thumbnail Index</span>
            <span className="text-cyan-400 font-semibold text-[10px]">Open Document ↗</span>
          </div>
        </div>

        {/* 3. Immersive Reading Mode Card */}
        <div
          onClick={() => onSelectMode('immersive')}
          className="group relative rounded-2xl bg-gradient-to-b from-[#241a12] to-[#140e0a] border border-amber-500/40 shadow-2xl overflow-hidden hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-3.5 flex items-center justify-between border-b border-amber-500/20 bg-black/40">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-stone-200 font-['Cinzel'] tracking-wide">
                Immersive Reading Mode
              </span>
            </div>
            <Maximize2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-400 transition-colors" />
          </div>

          {/* Dark Atmospheric Night Desk Preview */}
          <div className="relative h-48 bg-gradient-to-b from-[#18110a] via-[#2a1d10] to-[#0d0905] p-4 flex items-center justify-center overflow-hidden">
            {/* Candle/Lamp glow in dark */}
            <div className="absolute top-4 right-8 w-16 h-16 rounded-full bg-amber-500/20 blur-xl pointer-events-none" />

            {/* Glowing open book in dark room */}
            <div className="relative w-68 h-32 rounded bg-[#f5ecd5] shadow-[0_0_30px_rgba(245,190,100,0.35)] p-3 text-stone-900 font-serif flex">
              <div className="w-1/2 pr-2 border-r border-amber-900/20 text-[6px] leading-tight">
                <div className="font-bold text-amber-900 text-[7px] mb-1">অধ্যায় ৩: আত্মশুদ্ধি</div>
                <div className="text-stone-800">
                  নিঃশব্দ রাতের একাগ্রতা আত্মাকে পরিশুদ্ধ করে। মনোযোগ সহকারে পড়ুন ও চিন্তা করুন।
                </div>
              </div>
              <div className="w-1/2 pl-2 text-[6px] leading-tight">
                <div className="font-bold text-amber-900 text-[7px] mb-1">চিন্তার আলো</div>
                <div className="text-stone-800">
                  যে ব্যক্তি ইলম অনুযায়ী আমল করে, আল্লাহ তাকে এমন জ্ঞানের সন্ধান দেন যা সে জানত না।
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Reading Toolbar Preview */}
          <div className="p-2.5 bg-black/60 border-t border-amber-500/20 flex items-center justify-around text-[10px] text-stone-300 font-['Cinzel']">
            <div className="flex flex-col items-center gap-0.5 hover:text-amber-400">
              <Moon className="w-3 h-3 text-amber-400" />
              <span>Theme</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 hover:text-amber-400">
              <Type className="w-3 h-3 text-stone-400" />
              <span>Font</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 hover:text-amber-400">
              <Columns className="w-3 h-3 text-stone-400" />
              <span>Layout</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 hover:text-amber-400">
              <MoreHorizontal className="w-3 h-3 text-stone-400" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
