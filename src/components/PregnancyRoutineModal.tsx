import React, { useState } from 'react';
import { PREGNANCY_ROUTINE, PREGNANCY_TIPS } from '../data/routineData';
import { X, Check, Droplets, Heart, Clock, AlertTriangle, ShieldCheck, Printer } from 'lucide-react';

interface PregnancyRoutineModalProps {
  onClose: () => void;
}

export const PregnancyRoutineModal: React.FC<PregnancyRoutineModalProps> = ({ onClose }) => {
  const [completedTimes, setCompletedTimes] = useState<string[]>([]);
  const [waterGlasses, setWaterGlasses] = useState<number>(0);

  const toggleComplete = (time: string) => {
    setCompletedTimes(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#FDFCFB] border border-[#E5E1DB] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl my-auto text-[#1A1A1A] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1A1A1A] text-[#FDFCFB] p-5 sm:p-6 flex items-center justify-between shrink-0 border-b border-[#2D2D2D]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-semibold mb-1 text-[#E0C268]">
              <Heart className="w-3.5 h-3.5 fill-[#E0C268] text-[#E0C268]" />
              <span className="uppercase tracking-widest text-[10px]">মা ও শিশুর ইসলামিক সুস্থতা চার্ট</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold">
              গর্ভবতী মায়ের দৈনিক রুটিন
            </h2>
            <p className="text-xs sm:text-sm text-[#A6A29D] font-serif mt-0.5">
              আগের সিজারিয়ান | ২ বছর বয়সী মেয়ের সাথে সমন্বয় ও ২৪ ঘণ্টার পূর্ণাঙ্গ আমল
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-md bg-[#262626] border border-[#3D3D3D] hover:bg-[#333] text-white transition-colors cursor-pointer"
              title="প্রিন্ট চার্ট"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Water & Health Tracker Widget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Water Tracker (8-10 glasses) */}
            <div className="p-4 rounded-xl bg-[#F9F7F4] border border-[#E5E1DB] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span>দৈনিক পানি গ্রহণের ট্র্যাকার (৮-১০ গ্লাস)</span>
                </span>
                <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-[#FDFCFB] px-2 py-0.5 rounded border border-[#E5E1DB]">
                  {waterGlasses}/১০ গ্লাস
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setWaterGlasses(idx + 1)}
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                      idx < waterGlasses 
                        ? 'bg-[#1A1A1A] text-white shadow-xs scale-105' 
                        : 'bg-[#FDFCFB] text-gray-400 border border-[#E5E1DB] hover:bg-gray-100'
                    }`}
                  >
                    🥛
                  </button>
                ))}
              </div>
            </div>

            {/* Crucial C-Section & Child Lifting Precaution */}
            <div className="p-4 rounded-xl bg-[#F9F7F4] border border-[#E5E1DB] text-xs text-[#5C5852]">
              <strong className="flex items-center gap-1.5 text-amber-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>মেয়ের বিষয়ে বিশেষ সতর্কতা</span>
              </strong>
              <p className="leading-relaxed text-[11.5px] font-serif">
                মেয়েকে হুট করে কোলে তুলবেন না (ভারী উত্তোলন সিজারের দাগ ও পেটের জন্য ঝুঁকিপূর্ণ)। 
                দৌড়ে পিছে যাওয়া বা ঝুঁকে পড়া এড়িয়ে চলুন। বিশ্রামের সময়টুকু পরিবারের অন্য সদস্যকে মেয়ের দায়িত্ব দিন।
              </p>
            </div>
          </div>

          {/* Time Slot Table / Interactive Cards */}
          <div className="border border-[#E5E1DB] rounded-xl overflow-hidden shadow-xs">
            <div className="bg-[#F2EFE9] px-4 py-3 border-b border-[#E5E1DB] grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              <div className="col-span-3 sm:col-span-3">সময়</div>
              <div className="col-span-6 sm:col-span-5">কী করবেন (আমল ও স্বাস্থ্য)</div>
              <div className="col-span-3 sm:col-span-4">মেয়ের সাথে সমন্বয় (২ বছর)</div>
            </div>

            <div className="divide-y divide-[#E5E1DB] text-xs sm:text-sm">
              {PREGNANCY_ROUTINE.map((item, idx) => {
                const isChecked = completedTimes.includes(item.time);

                return (
                  <div
                    key={idx}
                    onClick={() => toggleComplete(item.time)}
                    className={`grid grid-cols-12 p-3 sm:p-4 items-center cursor-pointer transition-colors ${
                      isChecked ? 'bg-[#F2EFE9]/70' : 'hover:bg-[#F9F7F4]'
                    }`}
                  >
                    {/* Time Slot */}
                    <div className="col-span-3 sm:col-span-3 font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white' : 'border-[#E5E1DB] bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-xs sm:text-xs leading-tight font-serif">{item.time}</span>
                    </div>

                    {/* Routine Activity */}
                    <div className="col-span-6 sm:col-span-5 pr-2 text-[#1A1A1A] font-serif leading-snug text-xs sm:text-sm">
                      {item.activity}
                    </div>

                    {/* Child / Family Coordination */}
                    <div className="col-span-3 sm:col-span-4 text-xs text-[#5C5852] font-serif bg-[#F9F7F4] p-2 rounded-lg border border-[#E5E1DB] leading-relaxed">
                      {item.childCoordination}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Extra Tips from PDF */}
          <div className="bg-[#F9F7F4] p-4 sm:p-5 rounded-xl border border-[#E5E1DB] space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E0C268]" />
              <span>সারাদিনে অতিরিক্ত গুরুত্বপূর্ণ স্বাস্থ্যবিধি</span>
            </h4>
            <ul className="space-y-1 text-xs text-[#5C5852] font-serif list-disc list-inside leading-relaxed">
              {PREGNANCY_TIPS.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F2EFE9] border-t border-[#E5E1DB] flex items-center justify-between text-xs">
          <span className="text-[#8C8882] font-serif">AYT Books Health & Family Archive</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-[#1A1A1A] hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
