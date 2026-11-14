'use client';

import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, Phone, Sparkles } from 'lucide-react';
import { FOOD_CATEGORIES } from '../data/products';
import { STORE_CONFIG } from '../config';

interface HeroProps {
  onExplore: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onQuickOrderHero: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExplore,
  selectedCategory,
  onSelectCategory,
  onQuickOrderHero,
}) => {
  return (
    <section className="bg-gradient-to-b from-food-50/80 via-white to-slate-50 py-8 sm:py-14 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-food-600" />
              <span>ফুডফ্লো ব্র‍্যান্ড প্যাকেজিং • খাঁটি ও ফ্রেশ কোয়ালিটি</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-[1.25]">
              খাঁটি মিল্ক বাটার, গাওয়া ঘি <br />
              <span className="text-food-600">
                ও ফ্রেশ রোস্টেড অ্যারাবিকা কফি
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              আপনার সকালের স্বাস্থ্যকর নাস্তা ও দৈনিক ফ্রেশনেসের জন্য ফুডফ্লোর ৩টি বিশেষ সিগনেচার পণ্য — খাঁটি গরুর দুধের বাটার, ঐতিহ্যবাহী দানাদার গাওয়া ঘি এবং প্রিমিয়াম অ্যারাবিকা কফি।
            </p>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs sm:text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-food-600 shrink-0" />
                <span>১০০% খাঁটি ও নির্ভেজাল</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-food-600 shrink-0" />
                <span>ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-food-600 shrink-0" />
                <span>সারাদেশে হোম ডেলিভারি</span>
              </div>
            </div>

            {/* Order Call to Action */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onExplore}
                className="bg-food-600 hover:bg-food-700 text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>পণ্য দেখুন ও অর্ডার করুন</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <a
                href={`tel:${STORE_CONFIG.supportPhoneRaw}`}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm px-6 py-3.5 rounded-full transition-all shadow-sm flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-food-600" />
                <span>{STORE_CONFIG.supportPhone}</span>
              </a>
            </div>

          </div>

          {/* Right Image Showcase: Combo Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white aspect-[4/3] sm:aspect-square group">
              <img
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80"
                alt="ফুডফ্লো ট্রায়ো প্যাক"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Bottom Spotlight Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-100 shadow-md flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-food-700 font-bold uppercase tracking-wider">স্পেশাল কম্বো অফার</div>
                  <div className="text-sm sm:text-base font-bold text-slate-900">বাটার + ঘি + কফি ট্রায়ো প্যাক</div>
                </div>
                <div className="text-right">
                  <div className="text-food-700 font-black text-lg">৳৯৯০ <span className="text-xs text-slate-400 line-through">৳১২২০</span></div>
                  <button
                    onClick={onQuickOrderHero}
                    className="text-[11px] bg-food-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-food-700 transition-colors mt-0.5"
                  >
                    অর্ডার করুন
                  </button>
                </div>
              </div>
            </div>

            {/* Quality Badge */}
            <div className="absolute -top-3 -right-2 bg-emerald-600 text-white px-3.5 py-1.5 rounded-2xl shadow-lg text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>FoodFlow প্যাকেজিং</span>
            </div>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div id="catalog-section" className="mt-10 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {FOOD_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-food-600 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
