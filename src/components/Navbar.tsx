import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  Truck
} from 'lucide-react';
import { ProductCategory, UserProfile } from '../types';

interface NavbarProps {
  activeCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  onOpenUserAccount: () => void;
  onOpenOrderLookup: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currency: 'INR' | 'USD';
  onToggleCurrency: () => void;
  currentUser: UserProfile | null;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAdmin,
  onOpenUserAccount,
  onOpenOrderLookup,
  searchQuery,
  onSearchChange,
  currency,
  onToggleCurrency,
  currentUser,
  isAdminLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Collection' },
    { id: 'sarees', label: 'Sarees' },
    { id: 'ethnic', label: 'Ethnic' },
    { id: 'western', label: 'Western' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'custom', label: 'Customized' },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#F5F2ED]/95 backdrop-blur-md border-b border-[#DCD7D0] transition-all">
      {/* Top Announcement & Quick Tools Bar */}
      <div id="top-announcement-bar" className="bg-[#2A2A2A] text-[#F5F2ED] text-[11px] py-2 px-4 sm:px-8 border-b border-[#3E3E3E]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 tracking-[0.15em] uppercase text-[10px]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A68A64] animate-pulse"></span>
            <span>Express Shipping</span>
          </div>

          <div className="flex items-center gap-5 text-[10px] uppercase tracking-[0.2em]">
            <button 
              id="header-track-order-btn"
              onClick={onOpenOrderLookup}
              className="flex items-center gap-1.5 hover:text-[#A68A64] transition-colors cursor-pointer"
            >
              <Truck size={12} />
              <span>Order Track</span>
            </button>

            <button
              id="currency-toggle-btn"
              onClick={onToggleCurrency}
              className="border border-[#555] px-2 py-0.5 hover:border-[#A68A64] font-mono transition-colors"
            >
              {currency === 'INR' ? 'INR ₹' : 'USD $'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Architectural Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20 gap-1 sm:gap-4">
          
          {/* Left Categories (Desktop) */}
          <div className="hidden lg:flex items-center gap-7 text-[11px] uppercase tracking-[0.2em] font-medium text-[#2A2A2A]">
            <button
              onClick={() => onSelectCategory('all')}
              className={`hover:opacity-60 transition-opacity cursor-pointer ${
                activeCategory === 'all' ? 'font-bold border-b border-[#2A2A2A] pb-0.5' : ''
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => onSelectCategory('sarees')}
              className={`hover:opacity-60 transition-opacity cursor-pointer ${
                activeCategory === 'sarees' ? 'font-bold border-b border-[#2A2A2A] pb-0.5' : ''
              }`}
            >
              Sarees
            </button>
            <button
              onClick={() => onSelectCategory('ethnic')}
              className={`hover:opacity-60 transition-opacity cursor-pointer ${
                activeCategory === 'ethnic' ? 'font-bold border-b border-[#2A2A2A] pb-0.5' : ''
              }`}
            >
              Ethnic
            </button>
            <button
              onClick={() => onSelectCategory('western')}
              className={`hover:opacity-60 transition-opacity cursor-pointer ${
                activeCategory === 'western' ? 'font-bold border-b border-[#2A2A2A] pb-0.5' : ''
              }`}
            >
              Western
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2A2A2A] focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Brand Logo - Geometric & Serif Italic Luxury */}
          <div className="min-w-0 text-center">
            <button 
              onClick={() => { onSelectCategory('all'); }}
              className="inline-flex flex-col items-center group cursor-pointer"
            >
              <span className="font-serif text-xl sm:text-3xl tracking-[0.12em] uppercase italic text-[#2A2A2A] group-hover:opacity-80 transition-opacity">
                BhuviSri Enterprises
              </span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-[#A68A64] font-medium -mt-1">
                Heritage Couture
              </span>
            </button>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-6 text-[11px] uppercase tracking-[0.2em] font-medium">
            
            {/* Search Toggle / Input */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-[#EAE5DF] px-3 py-1.5 border border-[#DCD7D0]">
                  <Search size={14} className="text-[#6B655E]" />
                  <input
                    id="search-input-field"
                    type="text"
                    placeholder="Search catalog..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                    className="bg-transparent border-none text-[11px] text-[#2A2A2A] placeholder-[#6B655E] focus:outline-none ml-2 w-28 sm:w-44 tracking-normal normal-case"
                  />
                  <button 
                    onClick={() => { setShowSearchInput(false); onSearchChange(''); }}
                    className="text-[#6B655E] hover:text-[#2A2A2A] ml-1"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <button
                  id="search-toggle-btn"
                  onClick={() => setShowSearchInput(true)}
                  className="p-1 text-[#2A2A2A] hover:opacity-60 transition-opacity cursor-pointer"
                  title="Search products"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* User Account / Profile */}
            <button
              id="user-profile-btn"
              onClick={onOpenUserAccount}
              className="hover:opacity-60 transition-opacity flex items-center gap-1.5 cursor-pointer"
            >
              <User size={18} className="text-[#2A2A2A]" />
              <span className="hidden xl:inline">{currentUser ? currentUser.name.split(' ')[0] : 'Login'}</span>
            </button>

            {/* Wishlist */}
            <button
              id="wishlist-btn"
              onClick={onOpenWishlist}
              className="p-1 hover:opacity-60 transition-opacity cursor-pointer relative"
              title="Saved Wishlist"
            >
              <Heart size={18} className="text-[#2A2A2A]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A68A64] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Bag */}
            <button
              id="cart-drawer-trigger-btn"
              onClick={onOpenCart}
              className="flex items-center justify-center gap-2 bg-[#2A2A2A] text-white p-2 sm:px-4 hover:bg-[#404040] transition-colors cursor-pointer text-[10px] tracking-[0.2em] uppercase font-bold"
            >
              <div className="relative">
                <ShoppingBag size={15} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#A68A64] text-white text-[8px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Bag {cartCount > 0 ? `(${cartCount})` : ''}</span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="lg:hidden bg-[#EAE5DF] border-b border-[#DCD7D0] px-6 py-5 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-4 text-xs uppercase tracking-[0.2em]">
            <div className="pb-3 border-b border-[#DCD7D0]">
              <p className="text-[10px] text-[#A68A64] font-bold mb-3">Collections</p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left py-2 px-3 border border-[#DCD7D0] ${
                      activeCategory === cat.id
                        ? 'bg-[#2A2A2A] text-white font-medium'
                        : 'bg-[#F5F2ED] text-[#2A2A2A]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col space-y-2 border-t border-[#DCD7D0] text-[11px] text-[#2A2A2A]">
              <button
                onClick={() => { onOpenOrderLookup(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 py-2 text-left hover:text-[#A68A64]"
              >
                <Truck size={14} />
                <span>Track Order</span>
              </button>

              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 py-2 text-left text-[#A68A64] font-semibold"
              >
                <ShieldCheck size={14} />
                <span>Brand Owner Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
