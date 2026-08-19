import React from 'react';
import { BookOpen, Sparkles, MoveHorizontal, MessageCircle, HeartHandshake } from 'lucide-react';

export const FeatureBand: React.FC = () => {
  const features = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#E0C268]" />,
      title: 'ফ্রি পড়ুন',
      desc: 'লাইব্রেরির সব বই অনলাইনে পড়ার জন্য উন্মুক্ত'
    },
    {
      icon: <MoveHorizontal className="w-5 h-5 text-[#1A1A1A]" />,
      title: 'বাস্তব পেজ-ফ্লিপ বই',
      desc: 'আসল বইয়ের মতো পাতা উল্টে পড়ার ডিজিটাল অভিজ্ঞতা'
    },
    {
      icon: <BookOpen className="w-5 h-5 text-[#1A1A1A]" />,
      title: 'অনলাইন লাইব্রেরি',
      desc: 'মোবাইল বা কম্পিউটারে যেকোনো সময় সহজ পাঠ'
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-[#1F7A4D]" />,
      title: 'হার্ডকপি অর্ডার (৳৪০০)',
      desc: '‘সৃষ্টিকর্তা কে?’ বইটির মুদ্রিত কপি WhatsApp এ অর্ডার করুন'
    }
  ];

  return (
    <section className="bg-[#F9F7F4] py-8 sm:py-10 border-b border-[#E5E1DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 bg-[#FDFCFB] border border-[#E5E1DB] rounded-xl p-4 sm:p-4.5 shadow-xs hover:border-[#1A1A1A] transition-all group"
            >
              <div className="w-11 h-11 rounded-lg bg-[#F2EFE9] border border-[#E5E1DB] flex items-center justify-center shrink-0 group-hover:bg-[#1A1A1A] transition-colors">
                <div className="group-hover:text-white transition-colors">
                  {item.icon}
                </div>
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#1A1A1A] mb-0.5">
                  {item.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#5C5852] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

