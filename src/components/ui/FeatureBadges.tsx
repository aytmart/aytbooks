import React from 'react';
import { Cloud, CloudOff, Type, Bookmark, Eye, Glasses } from 'lucide-react';

interface FeatureBadgesProps {
  onOpenOfflineManager?: () => void;
  onOpenFontSettings?: () => void;
}

export const FeatureBadges: React.FC<FeatureBadgesProps> = ({
  onOpenOfflineManager,
  onOpenFontSettings,
}) => {
  return (
    <div
      id="ayt-feature-badges-strip"
      className="w-full py-5 px-4 sm:px-8 border-t border-[#d4af37]/20 bg-[#0a0806] flex items-center justify-around flex-wrap gap-6 text-xs text-stone-300 select-none z-20"
    >
      <div className="flex items-center gap-3 hover:text-[#d4af37] transition-colors cursor-default">
        <Cloud className="w-5 h-5 text-[#d4af37]" />
        <div>
          <div className="font-semibold text-stone-200 font-['Cinzel'] tracking-wide">Cross-Device</div>
          <div className="text-[11px] text-stone-400">Sync</div>
        </div>
      </div>

      <div
        onClick={onOpenOfflineManager}
        className="flex items-center gap-3 hover:text-emerald-400 transition-colors cursor-pointer"
      >
        <CloudOff className="w-5 h-5 text-emerald-400" />
        <div>
          <div className="font-semibold text-stone-200 font-['Cinzel'] tracking-wide">Offline</div>
          <div className="text-[11px] text-stone-400">Reading</div>
        </div>
      </div>

      <div
        onClick={onOpenFontSettings}
        className="flex items-center gap-3 hover:text-[#d4af37] transition-colors cursor-pointer"
      >
        <Type className="w-5 h-5 text-[#f39c12]" />
        <div>
          <div className="font-semibold text-stone-200 font-['Cinzel'] tracking-wide">Customizable</div>
          <div className="text-[11px] text-stone-400">Fonts</div>
        </div>
      </div>

      <div className="flex items-center gap-3 hover:text-[#d4af37] transition-colors cursor-default">
        <Bookmark className="w-5 h-5 text-[#5ec2d7]" />
        <div>
          <div className="font-semibold text-stone-200 font-['Cinzel'] tracking-wide">Bookmarks &</div>
          <div className="text-[11px] text-stone-400">Notes</div>
        </div>
      </div>

      <div className="flex items-center gap-3 hover:text-amber-400 transition-colors cursor-default">
        <Eye className="w-5 h-5 text-amber-400" />
        <div>
          <div className="font-semibold text-stone-200 font-['Cinzel'] tracking-wide">High Quality</div>
          <div className="text-[11px] text-stone-400">Reading</div>
        </div>
      </div>

      <div className="flex items-center gap-3 hover:text-indigo-400 transition-colors cursor-default">
        <Glasses className="w-5 h-5 text-indigo-400" />
        <div>
          <div className="font-semibold text-stone-200 font-['Cinzel'] tracking-wide">VR Reading</div>
          <div className="text-[11px] text-stone-400">(Experimental)</div>
        </div>
      </div>
    </div>
  );
};
