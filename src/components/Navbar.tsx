'use client';

import React, { useState } from 'react';
import { ShoppingBag, Search, Phone, MessageCircle, Menu, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: string) => void;
  onGoHome: () => void;
  whatsappNumber: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onGoHome,
  whatsappNumber,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const generalWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'আসসালামু আলাইকুম, আমি FoodFlow থেকে পণ্য অর্ডার করতে চাই।'
  )}`;

  return (
    <>
      {/* Top Notice Bar */}
      <div className="bg-food-700 text-white text-[13px] py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2">
            <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded">ক্যাশ অন ডেলিভারি</span>
            <span>সারা দেশে ক্যাশ অন ডেলিভারি সুবিধা | আগে পণ্য দেখে পরে মূল্য দিন</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium justify-center">
            <a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" /> হোয়াটসঅ্যাপ সাপোর্ট
            </a>
          </div>
        </div>
      </div>

      {/* Main Clean Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div
            onClick={onGoHome}
            className="cursor-pointer flex items-center gap-2.5 shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-food-600 flex items-center justify-center text-white shadow-sm font-bold text-xl">
              🌱
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-900 leading-none flex items-center gap-1">
                <span>Food</span>
                <span className="text-food-600">Flow</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium tracking-wide">
                বাটার • ঘি • কফি
              </div>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="বাটার, ঘি বা কফি খুঁজুন..."
              className="w-full bg-slate-100 hover:bg-slate-50 border border-slate-200 focus:border-food-600 rounded-full pl-10 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                মুছুন
              </button>
            )}
          </div>

          {/* Right: Phone & Cart Button */}
          <div className="flex items-center gap-3">
            <a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp অর্ডার</span>
            </a>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-food-600 hover:bg-food-700 text-white px-4 py-2 rounded-full transition-all shadow-sm font-bold"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-extrabold">
                ৳{cartTotal.toLocaleString()}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden px-4 pt-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="বাটার, ঘি বা কফি খুঁজুন..."
              className="w-full bg-slate-100 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </header>
    </>
  );
};
