import React from 'react';
import { HelpCircle, Orbit, Smartphone, Search, ZoomIn, ZoomOut, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Compass } from 'lucide-react';

interface FloatingToolsProps {
  isSensorEnabled: boolean;
  onToggleSensor: () => void;
  onOpenHelp: () => void;
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const FloatingTools: React.FC<FloatingToolsProps> = ({
  isSensorEnabled,
  onToggleSensor,
  onOpenHelp,
  onResetView,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <>
      {/* Top Left Phone Tilt Indicator / Sensor Toggle (Desktop & Tablet) */}
      <div
        id="phone-tilt-sensor-banner"
        className="hidden sm:flex absolute top-16 left-8 z-30 items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/60 border border-[#d4af37]/30 shadow-lg backdrop-blur-md text-stone-200 text-xs font-['Hind_Siliguri'] select-none hover:bg-black/80 transition-all cursor-pointer"
        onClick={onToggleSensor}
      >
        <Smartphone className={`w-4 h-4 ${isSensorEnabled ? 'animate-bounce text-[#5ec2d7]' : 'text-[#d4af37]'}`} />
        <span className="text-[11px] text-stone-200">
          {isSensorEnabled ? 'Sensor Active: Tilt phone to explore' : 'Tilt your phone to explore the library'}
        </span>
      </div>

      {/* Left Vertical Action Pill (Orbit, Zoom, Help matching image.png) */}
      <div
        id="left-floating-tools-pill"
        className="absolute top-28 sm:top-32 left-2 sm:left-8 z-30 flex flex-col items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2.5 rounded-2xl bg-black/75 border border-stone-700/60 shadow-2xl backdrop-blur-md text-stone-300 select-none scale-90 sm:scale-100 origin-top-left"
      >
        <button
          id="tool-orbit-btn"
          onClick={onResetView}
          className="flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-xl hover:bg-white/10 hover:text-[#d4af37] transition-colors"
          title="Orbit / Reset View"
        >
          <Orbit className="w-4 h-4 text-[#d4af37]" />
          <span className="text-[9px] font-['Cinzel'] tracking-wider">Reset</span>
        </button>

        <div className="w-4 sm:w-5 h-[1px] bg-stone-700/60" />

        <button
          id="tool-zoom-in-btn"
          onClick={onZoomIn}
          className="flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-xl hover:bg-white/10 hover:text-[#d4af37] transition-colors"
          title="Zoom In (কাছে আসুন)"
        >
          <ZoomIn className="w-4 h-4 text-[#5ec2d7]" />
          <span className="text-[9px] font-['Cinzel'] tracking-wider">In</span>
        </button>

        <button
          id="tool-zoom-out-btn"
          onClick={onZoomOut}
          className="flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-xl hover:bg-white/10 hover:text-[#d4af37] transition-colors"
          title="Zoom Out (দূরে যান)"
        >
          <ZoomOut className="w-4 h-4 text-stone-300" />
          <span className="text-[9px] font-['Cinzel'] tracking-wider">Out</span>
        </button>

        <div className="w-4 sm:w-5 h-[1px] bg-stone-700/60" />

        <button
          id="tool-help-btn"
          onClick={onOpenHelp}
          className="flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-xl hover:bg-white/10 hover:text-[#d4af37] transition-colors"
          title="Help & Guide"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span className="text-[9px] font-['Cinzel'] tracking-wider">Help</span>
        </button>
      </div>
    </>
  );
};
