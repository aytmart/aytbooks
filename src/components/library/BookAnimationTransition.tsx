import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Book } from '../../types';
import { soundEngine } from '../../utils/audio';

interface BookAnimationTransitionProps {
  book: Book;
  onAnimationComplete: () => void;
  reducedMotion: boolean;
}

export const BookAnimationTransition: React.FC<BookAnimationTransitionProps> = ({
  book,
  onAnimationComplete,
  reducedMotion,
}) => {
  const [phase, setPhase] = useState<'pulling' | 'gliding' | 'opening'>('pulling');

  useEffect(() => {
    soundEngine.playBookThud();

    if (reducedMotion) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 400);
      return () => clearTimeout(timer);
    }

    const t1 = setTimeout(() => {
      setPhase('gliding');
    }, 600);

    const t2 = setTimeout(() => {
      setPhase('opening');
      soundEngine.playPageTurn();
    }, 1200);

    const t3 = setTimeout(() => {
      onAnimationComplete();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onAnimationComplete, reducedMotion]);

  return (
    <div
      id="book-transition-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md pointer-events-none"
    >
      <div className="relative flex flex-col items-center justify-center w-full max-w-lg perspective-[1200px]">
        {/* Animated 3D Book */}
        <motion.div
          id="animated-3d-book-mesh"
          initial={{
            scale: 0.45,
            y: -140,
            rotateY: 25,
            rotateX: 10,
            opacity: 0.3,
          }}
          animate={
            phase === 'pulling'
              ? {
                  scale: 0.85,
                  y: -40,
                  rotateY: 10,
                  rotateX: 5,
                  opacity: 1,
                }
              : phase === 'gliding'
              ? {
                  scale: 1.0,
                  y: 40,
                  rotateY: 0,
                  rotateX: 15,
                  opacity: 1,
                }
              : {
                  scale: 1.15,
                  y: 10,
                  rotateY: 0,
                  rotateX: 20,
                  opacity: 1,
                }
          }
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-64 h-88 rounded-r-xl shadow-2xl overflow-hidden border-2 border-[#d4af37]/60"
          style={{
            backgroundColor: book.coverColor,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 35px rgba(212, 175, 55, 0.25)',
          }}
        >
          {/* Leather texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10" />

          {/* Gold embossed frames */}
          <div className="absolute inset-4 border-2 border-[#d4af37]/70 rounded-md pointer-events-none" />
          <div className="absolute inset-6 border border-[#d4af37]/40 rounded-sm pointer-events-none" />

          {/* Spine shadow on left */}
          <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

          {/* Book Details */}
          <div className="relative z-10 p-8 flex flex-col items-center justify-between h-full text-center">
            <div className="text-xs tracking-widest text-[#d4af37] font-['Cinzel'] uppercase font-bold">
              AYT BOOKS
            </div>

            <div>
              <div className="w-12 h-12 rounded-full border border-[#d4af37]/60 flex items-center justify-center text-[#d4af37] text-lg mx-auto mb-3">
                ✦
              </div>
              <h2 className="text-xl font-bold text-white font-['Hind_Siliguri'] leading-tight drop-shadow-md">
                {book.banglaTitle}
              </h2>
              {book.subtitle && (
                <p className="text-xs text-[#f4ecd8]/80 font-['Hind_Siliguri'] mt-1.5 line-clamp-2">
                  {book.subtitle}
                </p>
              )}
            </div>

            <div className="text-sm font-medium text-[#e5c158] font-['Hind_Siliguri']">
              {book.author}
            </div>
          </div>

          {/* Opening flap animation */}
          {phase === 'opening' && (
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -160 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0 origin-left bg-[#fdf8eb] rounded-r-xl border border-stone-300 shadow-inner z-20"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="p-6 text-stone-800 text-xs font-['Hind_Siliguri']">
                <div className="text-center font-bold text-sm text-[#1b3d2f] border-b pb-2 mb-3">
                  {book.banglaTitle}
                </div>
                <div className="text-[11px] text-stone-600 line-clamp-6">
                  {book.description}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Status Text below */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 px-4 py-1.5 rounded-full bg-stone-900/90 border border-[#d4af37]/40 text-xs text-[#d4af37] font-['Hind_Siliguri'] tracking-wide"
        >
          {phase === 'pulling' && 'শেলফ থেকে বইটি নেওয়া হচ্ছে...'}
          {phase === 'gliding' && 'পড়ার টেবিলে রাখা হচ্ছে...'}
          {phase === 'opening' && 'বইটি খোলা হচ্ছে...'}
        </motion.div>
      </div>
    </div>
  );
};
