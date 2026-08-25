import React from 'react';
import { X, Type, Sun, Volume2, ShieldCheck, RefreshCw, Eye } from 'lucide-react';
import { ReadingSettings, ReaderTheme } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReadingSettings;
  onUpdateSettings: (settings: Partial<ReadingSettings>) => void;
  is2DView: boolean;
  onToggle2DView: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  is2DView,
  onToggle2DView,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="ayt-settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        id="ayt-settings-modal-box"
        className="w-full max-w-lg rounded-3xl bg-stone-900 border border-[#d4af37]/40 shadow-2xl flex flex-col overflow-hidden text-stone-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#d4af37] tracking-widest uppercase font-['Cinzel']">
              READER PREFERENCES
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh] font-['Hind_Siliguri'] text-sm">
          {/* 1. Theme Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-3">
              রিডিং থিম (Themes)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'light', name: 'লাইট', bg: 'bg-[#faf6ed]', text: 'text-stone-900', border: 'border-stone-300' },
                { id: 'sepia', name: 'সেপিয়া', bg: 'bg-[#f4ebd0]', text: 'text-[#2c1d11]', border: 'border-[#dfd0af]' },
                { id: 'dark', name: 'ডার্ক', bg: 'bg-[#1c1815]', text: 'text-stone-200', border: 'border-stone-700' },
                { id: 'oled', name: 'ওলেড', bg: 'bg-[#000000]', text: 'text-stone-100', border: 'border-stone-800' },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => onUpdateSettings({ theme: th.id as ReaderTheme })}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border-2 transition-all ${th.bg} ${th.text} ${
                    settings.theme === th.id ? 'border-[#d4af37] ring-2 ring-[#d4af37]/30 scale-105' : th.border
                  }`}
                >
                  <span className="text-xs font-bold">{th.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Font Size */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-2">
              <span>ফন্ট সাইজ (Font Size)</span>
              <span className="font-mono text-stone-300 text-sm">{settings.fontSize}px</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-400">A</span>
              <input
                type="range"
                min={14}
                max={26}
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: parseInt(e.target.value) })}
                className="flex-1 accent-[#d4af37] h-2 bg-stone-800 rounded-lg cursor-pointer"
              />
              <span className="text-lg font-bold text-stone-200">A</span>
            </div>
          </div>

          {/* 3. Font Family */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-2">
              ফন্ট স্টাইল (Font Family)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'Noto Serif Bengali', name: 'নোতো সেরিফ (বই টাইপ)' },
                { id: 'Hind Siliguri', name: 'হিন্দ শিলিগুড়ি (ক্লিন)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateSettings({ fontFamily: f.id as any })}
                  className={`p-2.5 rounded-xl border text-xs text-center transition-all ${
                    settings.fontFamily === f.id
                      ? 'bg-[#d4af37]/20 border-[#d4af37] text-white font-bold'
                      : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-white'
                  }`}
                  style={{ fontFamily: f.id }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Audio & Ambient */}
          <div className="space-y-3 border-t border-stone-800 pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              অডিও ও সাউন্ড
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-800/60 border border-stone-700/60">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-[#5ec2d7]" />
                <span>পৃষ্ঠা উল্টানোর বাস্তবিক শব্দ (Page Turn Sound)</span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEffects}
                onChange={(e) => onUpdateSettings({ soundEffects: e.target.checked })}
                className="w-4 h-4 accent-[#d4af37] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* 5. Accessibility & Motion */}
          <div className="space-y-3 border-t border-stone-800 pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              অ্যাক্সেসিবিলিটি ও মোশন (Accessibility)
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-800/60 border border-stone-700/60">
              <div>
                <div className="font-semibold text-stone-200">রিডিউসড মোশন (Reduced Motion)</div>
                <p className="text-[11px] text-stone-400">অ্যানিমেশন ও ক্যামেরার দ্রুত নড়াচড়া বন্ধ রাখবে</p>
              </div>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => onUpdateSettings({ reducedMotion: e.target.checked })}
                className="w-4 h-4 accent-[#d4af37] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-800/60 border border-stone-700/60">
              <div>
                <div className="font-semibold text-stone-200">ক্লাসিক 2D লাইব্রেরি ভিউ</div>
                <p className="text-[11px] text-stone-400">লো-পাওয়ার বা সাধারণ ব্রাউজারের জন্য অপ্টিমাইজড</p>
              </div>
              <button
                onClick={onToggle2DView}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  is2DView ? 'bg-[#d4af37] text-black' : 'bg-stone-700 text-stone-300'
                }`}
              >
                {is2DView ? '2D সক্রিয়' : '3D সক্রিয়'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-stone-950 font-bold font-['Hind_Siliguri'] text-xs shadow-md"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
