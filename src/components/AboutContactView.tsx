import React, { useState } from 'react';
import { WHATSAPP_CONTACT, ECOSYSTEM_LINKS } from '../data/booksData';
import { 
  Phone, MessageCircle, Mail, MapPin, Clock, Heart, 
  BookOpen, ShieldCheck, Send, CheckCircle2, Building, ExternalLink, Globe, Sparkles 
} from 'lucide-react';

export const AboutContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullText = `নাম: ${name}\nফোন: ${phone}\nমেসেজ: ${message}`;
    const url = `https://wa.me/${WHATSAPP_CONTACT.number}?text=${encodeURIComponent(fullText)}`;
    window.open(url, '_blank');
    setSent(true);
  };

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* About Section Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C8882] font-bold block mb-2">
          Our Heritage & Mission
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-3">
          AYT Books সম্পর্কে
        </h1>
        <p className="text-base sm:text-lg text-[#5C5852] leading-relaxed font-serif">
          বাংলা ভাষাভাষী পাঠকদের জন্য একটি নির্ভরযোগ্য, মার্জিত, সহজ ও ফ্রি অনলাইন লাইব্রেরি ও ডিজিটাল আর্কাইভ গড়ে তোলাই আমাদের লক্ষ্য।
        </p>
        <div className="w-16 h-0.5 bg-[#1A1A1A] mx-auto mt-4" />
      </div>

      {/* Story & Philosophy Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="bg-[#F9F7F4] rounded-2xl p-6 sm:p-8 border border-[#E5E1DB] shadow-xs flex flex-col justify-between hover:border-[#1A1A1A] transition-colors">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#F2EFE9] border border-[#E5E1DB] text-[#1A1A1A] flex items-center justify-center text-xl mb-4 font-bold">
              📖
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
              পড়ুন ফ্রিতে
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5852] font-serif leading-relaxed">
              আমরা বিশ্বাস করি বই সংগ্রহের আগে পাঠকের সেটি পূর্ণাঙ্গ পড়ে দেখার অধিকার আছে। তাই আমাদের প্রতিটি বইয়ের মূল বিষয়বস্তু অনলাইনে ফ্রি পড়ার সুবিধা রাখা হয়েছে।
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#E5E1DB] flex items-center gap-1.5 text-xs text-[#1A1A1A] font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#E0C268]" />
            <span>ডিজিটাল উন্মুক্ত জ্ঞান</span>
          </div>
        </div>

        <div className="bg-[#F9F7F4] rounded-2xl p-6 sm:p-8 border border-[#E5E1DB] shadow-xs flex flex-col justify-between hover:border-[#1A1A1A] transition-colors">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#F2EFE9] border border-[#E5E1DB] text-[#1A1A1A] flex items-center justify-center text-xl mb-4 font-bold">
              🕌
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
              বিশুদ্ধ দ্বীন ও জীবনমুখী জ্ঞান
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5852] font-serif leading-relaxed">
              সৃষ্টিতত্ত্ব, বিজ্ঞান ও কুরআন, পারিবারিক শান্তি, শিশুর সঠিক লালন-পালন এবং আত্মশুদ্ধি বিষয়ক নির্বাচিত ও মানসম্মত কন্টেন্ট প্রকাশে আমরা দায়বদ্ধ।
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#E5E1DB] flex items-center gap-1.5 text-xs text-[#1A1A1A] font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#E0C268]" />
            <span>কুরআন ও সুন্নাহর নির্দেশনা</span>
          </div>
        </div>

        <div className="bg-[#F9F7F4] rounded-2xl p-6 sm:p-8 border border-[#E5E1DB] shadow-xs flex flex-col justify-between hover:border-[#1A1A1A] transition-colors">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#F2EFE9] border border-[#E5E1DB] text-[#1A1A1A] flex items-center justify-center text-xl mb-4 font-bold">
              💬
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
              সহজ WhatsApp অর্ডার
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5852] font-serif leading-relaxed">
              জটিল অনলাইন চেকআউটের বদলে সরাসরি WhatsApp এ কথা বলে সহজে বই সংগ্রহ করতে পারবেন। সারা দেশে নির্ভরযোগ্য হোম ডেলিভারি ব্যবস্থা রয়েছে।
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#E5E1DB] flex items-center gap-1.5 text-xs text-[#1A1A1A] font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#E0C268]" />
            <span>সরাসরি যোগাযোগ</span>
          </div>
        </div>
      </div>

      {/* AYT Ecosystem & Sister Ventures Buttons & Showcase */}
      <div className="bg-[#F9F7F4] rounded-2xl p-6 sm:p-10 border border-[#E5E1DB]">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C8882] font-bold block mb-2">
            Our Ecosystem & Sister Ventures
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            আমাদের অন্যান্য সহযোগী প্রকল্প ও প্ল্যাটফর্ম
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5852] font-serif mt-1">
            জ্ঞানচর্চা, কৃষি, আধুনিক প্রযুক্তি ও ই-কমার্সের সমন্বয়ে গড়ে ওঠা আমাদের উদ্যোগসমূহ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ECOSYSTEM_LINKS.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FDFCFB] rounded-xl p-5 border border-[#E5E1DB] hover:border-[#1A1A1A] hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#F2EFE9] text-[#1A1A1A] border border-[#E5E1DB]">
                    {item.badge}
                  </span>
                </div>
                <h4 className="font-serif text-lg font-bold text-[#1A1A1A] group-hover:text-[#0F3D3E] transition-colors flex items-center gap-1.5">
                  <span>{item.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-xs text-[#5C5852] font-serif mt-1 leading-relaxed">
                  {item.tagline}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E5E1DB] flex items-center justify-between text-xs text-[#1A1A1A] font-semibold">
                <span className="text-[11px] text-[#8C8882] font-mono">{item.nameEn}</span>
                <span className="inline-flex items-center gap-1 text-[#1A1A1A] group-hover:underline">
                  ভিজিট করুন →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Social Cause: বয়স্ক কল্যাণ সমিতি */}
      <div className="bg-[#1A1A1A] text-[#FDFCFB] rounded-2xl p-6 sm:p-10 border border-[#2D2D2D] shadow-sm">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#E0C268] font-semibold font-sans">
            Social Commitment & Humanitarian Service
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDFCFB]">
            বয়স্ক কল্যাণ সমিতি, শান্তির ঠিকানা
          </h2>
          <p className="text-xs sm:text-sm text-[#A6A29D] font-serif leading-relaxed">
            লেখক ও গবেষক সৈয়দ আব্দুল আউয়াল প্রবীণ ও অসহায় মানুষের ধর্মীয় অনুশাসনে সেবা দেওয়ার লক্ষ্যে ‘বয়স্ক কল্যাণ সমিতি’ প্রতিষ্ঠা করেছেন। এ প্রতিষ্ঠানের মাধ্যমে অসহায় বয়স্কদের স্বাস্থ্য ও আত্মিক সেবা নিশ্চিত করা হয়।
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="bg-[#262626] text-[#FDFCFB] px-3.5 py-1.5 rounded-md border border-[#3D3D3D]">📍 সীমাবাড়ী, চান্দাইকোনা, শেরপুর, বগুড়া</span>
            <span className="bg-[#262626] text-[#E0C268] font-mono px-3.5 py-1.5 rounded-md border border-[#3D3D3D]">📞 01713-728938</span>
          </div>
        </div>
      </div>

      {/* Contact Grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            সরাসরি যোগাযোগ করুন
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5852] font-serif mt-1">
            বই অর্ডার, প্রকাশনা পরামর্শ অথবা যেকোনো তথ্যের জন্য নিচের মাধ্যমে যোগাযোগ করুন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Info Cards */}
          <div className="lg:col-span-6 space-y-4">
            {/* WhatsApp Contact Box */}
            <div className="p-6 rounded-2xl bg-[#F9F7F4] border border-[#E5E1DB] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1F7A4D]/15 text-[#1F7A4D] flex items-center justify-center shrink-0 text-xl font-bold">
                💬
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 block">সবচেয়ে দ্রুত যোগাযোগ</span>
                <h4 className="font-serif font-bold text-lg text-[#1A1A1A]">WhatsApp হেল্পলাইন</h4>
                <p className="text-xs text-[#5C5852] my-1 font-serif">
                  বই অর্ডার, মূল্য ও ডেলিভারি সংক্রান্ত যেকোনো প্রশ্নের জন্য সরাসরি মেসেজ দিন।
                </p>
                <a
                  href="https://wa.me/8801786840952"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#1F7A4D] hover:underline mt-1 font-mono"
                >
                  <span>+880 1786-840952</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Direct Phone Numbers */}
            <div className="p-6 rounded-2xl bg-[#F9F7F4] border border-[#E5E1DB] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F2EFE9] border border-[#E5E1DB] text-[#1A1A1A] flex items-center justify-center shrink-0 text-xl">
                <Phone className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif font-bold text-base text-[#1A1A1A]">সরাসরি ফোন কল</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#FDFCFB] border border-[#E5E1DB]">
                    <span className="text-[#8C8882] block text-[10px] uppercase tracking-wider">প্রধান কার্যালয়:</span>
                    <strong className="text-[#1A1A1A] font-mono">+880 1786-840952</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FDFCFB] border border-[#E5E1DB]">
                    <span className="text-[#8C8882] block text-[10px] uppercase tracking-wider">প্রকাশনা ডেস্ক:</span>
                    <strong className="text-[#1A1A1A] font-mono">01713-728938</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution Outlets */}
            <div className="p-6 rounded-2xl bg-[#F9F7F4] border border-[#E5E1DB] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F2EFE9] border border-[#E5E1DB] text-[#1A1A1A] flex items-center justify-center shrink-0">
                <Building className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <div className="flex-1 text-xs space-y-2 text-[#5C5852] font-serif">
                <h4 className="font-serif font-bold text-base text-[#1A1A1A]">বই প্রাপ্তিস্থান ও প্রধান কার্যালয়</h4>
                <p>
                  <strong className="text-[#1A1A1A]">প্রধান কার্যালয় ও আর্কাইভ:</strong> সীমাবাড়ী, চান্দাইকোনা, শেরপুর, বগুড়া (ফোন: 01713-728938 / +880 1786-840952)।
                </p>
                <p>
                  <strong className="text-[#1A1A1A]">বায়তুল মোকাররম শাখা:</strong> ফিরোজ ইসলামিক বুক হাউস, ৮৬ বায়তুল মোকাররম (উত্তর গেইট), ঢাকা-১০০০।
                </p>
                <p>
                  <strong className="text-[#1A1A1A]">অনলাইন অর্ডার ও হোম ডেলিভারি:</strong> দেশের যেকোনো প্রান্ত থেকে WhatsApp এর মাধ্যমে সরাসরি অর্ডার করা যাবে।
                </p>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="lg:col-span-6 bg-[#F9F7F4] p-6 sm:p-8 rounded-2xl border border-[#E5E1DB] shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-1">
              মেসেজ পাঠান
            </h3>
            <p className="text-xs text-[#5C5852] mb-6 font-serif">
              আপনার নাম ও বার্তা লিখে সাবমিট করলে সরাসরি WhatsApp এ মেসেজ পাঠানো হবে
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5C5852] mb-1">আপনার নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মুহাম্মদ আব্দুল্লাহ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E1DB] bg-[#FDFCFB] focus:outline-none focus:border-[#1A1A1A] text-sm text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5C5852] mb-1">ফোন / WhatsApp নম্বর *</label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 01712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E1DB] bg-[#FDFCFB] focus:outline-none focus:border-[#1A1A1A] text-sm font-mono text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5C5852] mb-1">আপনার বার্তা / বইয়ের অনুরোধ *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="আপনি কোন বইটি খুঁজছেন বা আপনার কোনো প্রশ্ন..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E1DB] bg-[#FDFCFB] focus:outline-none focus:border-[#1A1A1A] text-sm resize-none text-[#1A1A1A]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-md bg-[#1A1A1A] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#E0C268]" />
                <span>WhatsApp এ মেসেজ পাঠান</span>
              </button>

              {sent && (
                <p className="text-xs text-green-700 font-semibold text-center mt-2 font-serif">
                  ✓ ধন্যবাদ! আপনার বার্তাটি WhatsApp এ প্রেরিত হয়েছে।
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

