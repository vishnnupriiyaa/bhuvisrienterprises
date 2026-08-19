import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const openWhatsApp = () => {
    window.open('https://wa.me/919876543210', '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      aria-label="Open WhatsApp"
      onClick={openWhatsApp}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-colors hover:bg-[#1EBE5D] cursor-pointer"
    >
      <MessageCircle size={26} strokeWidth={2.25} />
    </button>
  );
};
