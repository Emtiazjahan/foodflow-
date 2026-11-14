'use client';

import React from 'react';
import { ShieldCheck, Truck, RefreshCw, PhoneCall } from 'lucide-react';
import { STORE_CONFIG } from '../config';

export const TrustSection: React.FC = () => {
  const points = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-food-600" />,
      title: '১০০% খাঁটি ও নির্ভেজাল',
      desc: 'খামারের নিজস্ব তত্ত্বাবধানে তৈরি মাখন, খাঁটি গাওয়া ঘি ও রোস্টেড কফি।'
    },
    {
      icon: <Truck className="w-8 h-8 text-food-600" />,
      title: 'ক্যাশ অন ডেলিভারি',
      desc: 'অগ্রিম কোনো টাকা দিতে হবে না, পণ্য হাতে পেয়ে দেখে টাকা দিন।'
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-food-600" />,
      title: 'রিপ্লেসমেন্ট সুবিধা',
      desc: 'পণ্যের গুণগত মানে কোনো সমস্যা পেলে সাথে সাথে পরিবর্তনের গ্যারান্টি।'
    },
    {
      icon: <PhoneCall className="w-8 h-8 text-food-600" />,
      title: 'সহজ হেল্পলাইন সাপোর্ট',
      desc: `যেকোনো তথ্যের জন্য সরাসরি কল বা হোয়াটসঅ্যাপ করুন: ${STORE_CONFIG.supportPhone}`
    }
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            কেন ফুডফ্লো (FoodFlow) থেকে নেবেন?
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            আপনার পরিবারের সুস্বাস্থ্য ও ভরসার প্রতীক
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-food-50/50 border border-food-100 flex flex-col items-center text-center space-y-3 hover:bg-food-50 transition-colors"
            >
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                {pt.icon}
              </div>
              <h3 className="font-bold text-base text-slate-900">
                {pt.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
