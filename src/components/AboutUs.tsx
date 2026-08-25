import React from 'react';
import { Heart, Leaf, Sparkles, Mail, MessageCircle, Printer } from 'lucide-react';

interface AboutUsProps {
  onBrowseCollection: () => void;
  onBackHome?: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onBrowseCollection, onBackHome }) => {
  return (
    <section id="about-us" className="border-b border-[#DCD7D0] bg-[#F5F2ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A68A64] font-bold mb-4">About BhuviSri Enterprises</span>
          <h2 className="font-serif italic text-4xl sm:text-5xl text-[#2A2A2A] leading-tight mb-3">Where Art Meets Elegance</h2>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#6B655E] mb-5">Quality • Creativity • Trust</p>
          <p className="text-sm text-[#6B655E] leading-relaxed max-w-lg mb-4">
            Welcome to BhuviSri Enterprises, your one-stop destination for professional printing solutions, elegant fashion, and lifestyle essentials. We bring together quality, creativity, and personalized service to meet both your personal and business needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 mb-10">
            <div className="p-5 bg-[#EAE5DF] border border-[#DCD7D0]"><Printer size={18} className="text-[#A68A64] mb-3" /><h3 className="font-bold text-[10px] uppercase tracking-[0.15em] mb-2">Our Printing Services</h3><p className="text-xs text-[#6B655E] leading-relaxed">Customized corporate and personal printing solutions, including customized gift printing.</p></div>
            <div className="p-5 bg-[#EAE5DF] border border-[#DCD7D0]"><Sparkles size={18} className="text-[#A68A64] mb-3" /><h3 className="font-bold text-[10px] uppercase tracking-[0.15em] mb-2">Fashion & Lifestyle</h3><p className="text-xs text-[#6B655E] leading-relaxed">Sarees, ethnic and western garments, fashion jewellery, accessories, artistic gifts, and novelties for every occasion.</p></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[['Quality Products', Heart], ['Creative Solutions', Sparkles], ['Personalized Service', Leaf], ['Trusted Experience', Heart]].map(([label, Icon]) => {
              const FeatureIcon = Icon as typeof Heart;
              return <div key={label as string} className="p-4 border border-[#DCD7D0] bg-[#FAF7F2]"><FeatureIcon size={16} className="text-[#A68A64] mb-3" /><span className="block text-[9px] uppercase tracking-wider text-[#2A2A2A] leading-relaxed">{label as string}</span></div>;
            })}
          </div>
          <p className="text-sm text-[#6B655E] leading-relaxed max-w-2xl mb-5">
            Whether you need a striking business card, a beautiful invitation, customized printing, an elegant saree, or fashionable accessories, BhuviSri Enterprises brings quality and elegance together under one roof.
          </p>
          <div className="border-t border-[#DCD7D0] pt-4 mb-8">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2A2A2A] mb-2">Get in Touch</h3>
            <div className="flex flex-col sm:flex-row gap-2 text-xs text-[#6B655E]"><a href="https://wa.me/918008889317" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#25D366]"><MessageCircle size={14} /> Bhuvaneshwari · 8008889317</a><a href="mailto:bhuvisri.enterprises@gmail.com" className="flex items-center gap-1.5 hover:text-[#A68A64]"><Mail size={14} /> bhuvisri.enterprises@gmail.com</a></div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={onBrowseCollection} className="px-6 py-3 bg-[#2A2A2A] text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#404040] cursor-pointer">
              Browse Collection
            </button>
            {onBackHome && <button onClick={onBackHome} className="px-6 py-3 border border-[#2A2A2A] text-[#2A2A2A] text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#EAE5DF] cursor-pointer">
              Back to Home
            </button>}
          </div>
        </div>

      </div>
    </section>
  );
};
