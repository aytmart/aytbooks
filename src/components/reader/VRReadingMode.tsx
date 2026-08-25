import React, { useEffect, useState } from 'react';
import { ArrowLeft, Glasses, RefreshCw } from 'lucide-react';
import { Book, ReadingSettings } from '../../types';

interface VRReadingModeProps {
  book: Book;
  currentPage: number;
  onPageChange: (page: number) => void;
  onBackToLibrary: () => void;
  settings: ReadingSettings;
}

export const VRReadingMode: React.FC<VRReadingModeProps> = ({
  book,
  currentPage,
  onPageChange,
  onBackToLibrary,
  settings,
}) => {
  const [gyro, setGyro] = useState({ alpha: 0, beta: 0, gamma: 0 });

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && e.beta !== null && e.gamma !== null) {
        setGyro({
          alpha: e.alpha,
          beta: e.beta,
          gamma: e.gamma,
        });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  const pageData = book.pages.find((p) => p.pageNumber === currentPage) || {
    pageNumber: currentPage,
    content: `[পৃষ্ঠা ${currentPage}]`,
  };

  const renderEyeView = (eye: 'left' | 'right') => {
    const eyeOffset = eye === 'left' ? -2 : 2;
    const transformStyle = {
      transform: `perspective(800px) rotateY(${(gyro.gamma / 5) + eyeOffset}deg) rotateX(${-(gyro.beta - 45) / 6}deg)`,
      transformOrigin: 'center center',
    };

    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-4 sm:p-8 bg-[#0a0705] border-r border-stone-800 relative overflow-hidden select-none">
        {/* VR Horizon indicator */}
        <div className="absolute top-4 left-4 text-[10px] text-stone-500 font-mono">
          VR EYE: {eye.toUpperCase()}
        </div>

        {/* Floating 3D Page */}
        <div
          className="w-full max-w-sm max-h-[70vh] bg-[#fbf4de] text-[#2c1d11] p-6 rounded-2xl shadow-2xl overflow-y-auto transition-transform duration-75"
          style={transformStyle}
        >
          <div className="text-[10px] text-stone-500 border-b border-stone-300 pb-1 mb-3 flex justify-between font-['Cinzel']">
            <span>{book.banglaTitle}</span>
            <span>পৃষ্ঠা {currentPage}</span>
          </div>

          {pageData.chapterTitle && (
            <div className="text-center font-bold text-base text-[#b8860b] mb-2 font-['Hind_Siliguri']">
              {pageData.chapterTitle}
            </div>
          )}

          <div className="text-xs leading-relaxed whitespace-pre-line font-['Hind_Siliguri']">
            {pageData.content}
          </div>
        </div>

        {/* VR Page Turn Tap Zones */}
        <div className="w-full max-w-sm flex items-center justify-between mt-4 text-[11px] text-stone-400">
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className="px-3 py-1 bg-stone-900/80 rounded-full border border-stone-700"
          >
            ← পূর্ববর্তী
          </button>
          <span className="font-mono text-[#d4af37]">{currentPage} / {book.pagesCount}</span>
          <button
            onClick={() => currentPage < book.pagesCount && onPageChange(currentPage + 1)}
            className="px-3 py-1 bg-stone-900/80 rounded-full border border-stone-700"
          >
            পরবর্তী →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div id="ayt-vr-mode-view" className="relative w-full h-full flex flex-col bg-black text-white">
      {/* Top Exit VR Bar */}
      <div className="w-full px-6 py-2 bg-stone-950 border-b border-stone-800 flex items-center justify-between z-30">
        <button
          onClick={onBackToLibrary}
          className="flex items-center gap-2 px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-xs font-['Hind_Siliguri']"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>VR থেকে বের হন</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#d4af37] font-['Hind_Siliguri']">
          <Glasses className="w-4 h-4" />
          <span>মোবাইল ভিআর হেডসেটে দেখতে ফোন অনুভূমিক (Landscape) রাখুন</span>
        </div>
      </div>

      {/* Stereoscopic Split Screen */}
      <div className="flex-1 flex flex-col md:flex-row w-full h-full overflow-hidden">
        {renderEyeView('left')}
        {renderEyeView('right')}
      </div>
    </div>
  );
};
