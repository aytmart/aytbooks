import React from 'react';
import { WHATSAPP_CONTACT } from '../data/booksData';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const waUrl = `https://wa.me/${WHATSAPP_CONTACT.number}?text=${encodeURIComponent(
    'আসসালামু আলাইকুম, আমি AYT Books ওয়েবসাইট থেকে বই অর্ডার / তথ্যের জন্য যোগাযোগ করছি।'
  )}`;

  return (
    <aside aria-label="WhatsApp Support">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#1F7A4D] hover:bg-[#18603C] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
        title="WhatsApp এ সরাসরি মেসেজ করুন"
        id="floating-whatsapp-btn"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute right-full mr-3 bg-[#14231C] text-white text-xs font-semibold py-1.5 px-3 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          💬 বই অর্ডার ও সহায়তা
        </span>
      </a>
    </aside>
  );
};
