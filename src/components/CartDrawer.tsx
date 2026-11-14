'use client';

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, qty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedCheckout: () => void;
  city: 'Inside Dhaka' | 'Outside Dhaka';
  onCityChange: (city: 'Inside Dhaka' | 'Outside Dhaka') => void;
  discount: number;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
  city,
  onCityChange,
  discount,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.selectedVariant.price * item.quantity, 0);
  const deliveryFee = subtotal >= 1500 ? 0 : (city === 'Inside Dhaka' ? 60 : 120);
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = onApplyPromo(promoInput.trim().toUpperCase());
    if (ok) {
      setPromoMsg('কুপন ডিসকাউন্ট সফলভাবে যুক্ত হয়েছে!');
      setPromoInput('');
    } else {
      setPromoMsg('ভুল কুপন কোড। "FOODFLOW" ব্যবহার করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-food-600" />
              <h2 className="text-lg font-bold text-slate-900">আপনার শপিং ব্যাগ</h2>
              <span className="text-xs bg-food-100 text-food-800 font-bold px-2 py-0.5 rounded-full">
                {items.reduce((acc, i) => acc + i.quantity, 0)} টি
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Note */}
          <div className="px-6 py-2.5 bg-food-50 border-b border-food-100 text-xs text-food-800 flex items-center justify-between font-medium">
            <span>১৫০০৳ এর বেশি অর্ডারে ফ্রি ডেলিভারি!</span>
            {subtotal >= 1500 ? (
              <span className="font-bold text-emerald-700">ফ্রি ডেলিভারি আনলকড ✓</span>
            ) : (
              <span>আরও ৳{1500 - subtotal} এর পণ্য কিনুন</span>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">আপনার ব্যাগ খালি</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  তাজা ও খাঁটি পণ্য বেছে নিন এবং আপনার পরিবারের জন্য নিশ্চিন্তে অর্ডার করুন।
                </p>
                <button
                  onClick={onClose}
                  className="mt-3 px-6 py-2.5 rounded-full bg-food-600 text-white font-bold text-xs hover:bg-food-700 transition-colors"
                >
                  পণ্য দেখুন
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-3.5 flex gap-3.5">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                          title="মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        পরিমাণ: {item.selectedVariant.name}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white rounded-l-lg font-bold text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white rounded-r-lg font-bold text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-sm font-bold text-slate-900">
                        ৳{(item.selectedVariant.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Delivery & Checkout Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              
              {/* City Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">ডেলিভারি এরিয়া নির্বাচন করুন:</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => onCityChange('Inside Dhaka')}
                    className={`py-2 px-3 rounded-xl border transition-all text-center ${
                      city === 'Inside Dhaka'
                        ? 'bg-food-600 text-white border-food-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    ঢাকা সিটির ভিতরে (৬০৳)
                  </button>
                  <button
                    type="button"
                    onClick={() => onCityChange('Outside Dhaka')}
                    className={`py-2 px-3 rounded-xl border transition-all text-center ${
                      city === 'Outside Dhaka'
                        ? 'bg-food-600 text-white border-food-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    ঢাকার বাইরে (১২০৳)
                  </button>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handlePromoSubmit} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="ডিসকাউন্ট কুপন (FOODFLOW)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 uppercase focus:outline-none focus:border-food-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                  >
                    প্রয়োগ
                  </button>
                </div>
                {promoMsg && <div className="text-[11px] text-food-700 font-medium">{promoMsg}</div>}
                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-food-700 bg-food-50 px-2 py-1 rounded-lg">
                    <span>কুপন কোড: {appliedPromo}</span>
                    <button type="button" onClick={onRemovePromo} className="underline text-slate-500 text-[10px]">বাতিল</button>
                  </div>
                )}
              </form>

              {/* Summary */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>পণ্যের মূল্য</span>
                  <span className="font-bold text-slate-900">৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-food-700 font-semibold">
                    <span>কুপন ছাড়</span>
                    <span>-৳{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-bold text-slate-900">
                    {deliveryFee === 0 ? 'ফ্রি' : `৳${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>সর্বমোট বিল</span>
                  <span className="text-food-700 text-lg">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Order Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedCheckout();
                }}
                className="w-full py-3.5 rounded-xl bg-food-600 hover:bg-food-700 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>অর্ডার কনফার্ম করতে এগিয়ে যান</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-food-600" />
                <span>ক্যাশ অন ডেলিভারি | কোনো অগ্রিম পেমেন্টের ঝুঁকি নেই</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
