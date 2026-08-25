import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Box } from 'lucide-react';

interface RoomNavigatorProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onTiltUp: () => void;
  onTiltDown: () => void;
  onReset: () => void;
}

export const RoomNavigator: React.FC<RoomNavigatorProps> = ({
  onRotateLeft,
  onRotateRight,
  onTiltUp,
  onTiltDown,
  onReset,
}) => {
  return (
    <div
      id="ayt-room-navigator-widget"
      className="hidden md:flex absolute bottom-28 right-8 z-30 flex-col items-center select-none"
    >
      <div className="relative w-28 h-28 rounded-full bg-black/75 border-2 border-[#d4af37]/50 shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-xl flex items-center justify-center p-2">
        {/* Directional Arrow Controls */}
        <button
          onClick={onTiltUp}
          className="absolute top-1.5 left-1/2 -translate-x-1/2 p-1 text-stone-400 hover:text-[#d4af37] transition-colors"
          title="উপরে কাত করুন"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        <button
          onClick={onTiltDown}
          className="absolute bottom-1.5 left-1/2 -translate-x-1/2 p-1 text-stone-400 hover:text-[#d4af37] transition-colors"
          title="নিচে কাত করুন"
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        <button
          onClick={onRotateLeft}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-[#d4af37] transition-colors"
          title="বামে ঘোরান"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onRotateRight}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-[#d4af37] transition-colors"
          title="ডানে ঘোরান"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Center 3D Isometric Mini Room Icon */}
        <button
          onClick={onReset}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#2b1b10] to-[#4a321d] border border-[#d4af37]/60 flex flex-col items-center justify-center shadow-inner hover:scale-105 transition-transform"
          title="ভিউ রিসেট করুন"
        >
          <Box className="w-6 h-6 text-[#f1c40f]" />
          <span className="text-[7px] font-['Cinzel'] tracking-widest text-[#d4af37] mt-0.5 font-bold">
            3D ROOM
          </span>
        </button>
      </div>
    </div>
  );
};
