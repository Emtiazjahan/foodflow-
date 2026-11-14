'use client';

import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { STORE_CONFIG } from '../config';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-food-600 flex items-center justify-center text-white font-bold">
                🌱
              </div>
              <span className="text-xl font-bold text-white tracking-tight">FoodFlow</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ফুডফ্লো — প্রাকৃতিক ও স্বাস্থ্যসম্মত খাবারের এক বিশ্বস্ত পরিবার। খাঁটি গাওয়া ঘি, ঘানির তেল, সুন্দরবনের মধু এবং অর্গানিক মসলা সরাসরি আপনার ঘরে পৌঁছে দিতে আমরা বদ্ধপরিকর।
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-bold text-white mb-2">জরুরি লিংক</h4>
            <ul className="space-y-1.5">
              <li><a href="#catalog-section" className="hover:text-white">সব খাদ্যপণ্য</a></li>
              <li><span className="hover:text-white cursor-pointer">ডেলিভারি পলিসি</span></li>
              <li><span className="hover:text-white cursor-pointer">রিটার্ন ও রিফান্ড নীতি</span></li>
              <li><span className="hover:text-white cursor-pointer">আমাদের সম্পর্কে</span></li>
            </ul>
          </div>

          {/* Delivery & Payment */}
          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-bold text-white mb-2">ডেলিভারি চার্জ</h4>
            <p className="text-slate-400">
              • ঢাকা সিটি: ৬০৳ (২৪-৪৮ ঘণ্টা)<br />
              • সারা বাংলাদেশ: ১২০৳ (২-৩ দিন)<br />
              • ক্যাশ অন ডেলিভারি ও বিকাশ গ্রহণ করা হয়।
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-bold text-white mb-2">যোগাযোগের ঠিকানা</h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-food-500 shrink-0" />
                <a href={`tel:${STORE_CONFIG.supportPhoneRaw}`} className="hover:text-white font-semibold text-white">{STORE_CONFIG.supportPhone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-food-500 shrink-0" />
                <span>support@foodflowbd.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-food-500 shrink-0" />
                <span>মিরপুর-১০, ঢাকা-১২১৬, বাংলাদেশ</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} FoodFlow (ফুডফ্লো) বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-food-500" />
            <span>১০০% নিরাপদ ও নির্ভরযোগ্য কেনাকাটা</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
