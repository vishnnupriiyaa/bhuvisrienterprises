import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Scissors, Truck } from 'lucide-react';
import { generateWhatsAppLink } from '../utils/formatters';

interface WhatsAppWidgetProps {
  onOpenCustomStudio: () => void;
  onOpenOrderLookup: () => void;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  onOpenCustomStudio,
  onOpenOrderLookup,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const sendWhatsApp = (text: string) => {
    const link = generateWhatsAppLink('919876543210', text);
    window.open(link, '_blank');
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    sendWhatsApp(`Hello Aura & Loom Concierge! ✨\n${customMsg.trim()}`);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="whatsapp-floating-trigger-btn"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-3 shadow-lg transition-all cursor-pointer"
          title="WhatsApp Concierge"
        >
          <MessageCircle size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden sm:inline">
            WhatsApp Concierge
          </span>
        </button>
      )}

      {/* Expanded Concierge Card */}
      {isOpen && (
        <div 
          id="whatsapp-concierge-card"
          className="w-80 sm:w-96 bg-[#F5F2ED] border border-[#DCD7D0] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-[#2A2A2A] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#25D366] text-white flex items-center justify-center">
                <MessageCircle size={18} />
              </div>
              <div>
                <h2 className="font-serif italic text-base">
                  Aura & Loom Stylist
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-[#A68A64] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-[#25D366]"></span>
                  <span>Online • Avg response &lt; 5 mins</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#DCD7D0] hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#EAE5DF] text-xs">
            <div className="bg-[#F5F2ED] p-3 border border-[#DCD7D0] text-[#2A2A2A] leading-relaxed">
              <p className="font-bold text-[10px] uppercase tracking-wider">Namaste! 🌸</p>
              <p className="mt-1 text-xs text-[#6B655E] font-light">
                How may our master artisans and personal stylists assist your wardrobe today?
              </p>
            </div>

            {/* Quick Action Options */}
            <div className="space-y-1.5">
              <button
                onClick={() => sendWhatsApp('Hello! I would like to request a live video drape inspection for a saree.')}
                className="w-full text-left p-2.5 bg-[#F5F2ED] hover:bg-[#DCD7D0] border border-[#DCD7D0] text-xs text-[#2A2A2A] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles size={13} className="text-[#A68A64]" />
                <span className="font-medium text-[11px]">Request Live Video Saree Drape</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenCustomStudio();
                }}
                className="w-full text-left p-2.5 bg-[#F5F2ED] hover:bg-[#DCD7D0] border border-[#DCD7D0] text-xs text-[#2A2A2A] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Scissors size={13} className="text-[#A68A64]" />
                <span className="font-medium text-[11px]">Book Bespoke Measurement Consult</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenOrderLookup();
                }}
                className="w-full text-left p-2.5 bg-[#F5F2ED] hover:bg-[#DCD7D0] border border-[#DCD7D0] text-xs text-[#2A2A2A] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Truck size={13} className="text-[#A68A64]" />
                <span className="font-medium text-[11px]">Track My Order Timeline</span>
              </button>
            </div>

            {/* Custom Query Input */}
            <form onSubmit={handleCustomSubmit} className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Ask our atelier stylists..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="flex-1 bg-[#F5F2ED] border border-[#DCD7D0] px-3 py-2 text-xs text-[#2A2A2A] focus:outline-none focus:border-[#2A2A2A]"
              />
              <button
                type="submit"
                className="px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
