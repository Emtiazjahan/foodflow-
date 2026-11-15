'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Phone, MapPin, Truck, ShieldCheck, Download } from 'lucide-react';
import { CartItem, OrderConfirmation } from '../types';
import { supabase } from '../lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  city: 'Inside Dhaka' | 'Outside Dhaka';
  discount: number;
  onOrderSuccess: (order: OrderConfirmation) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  city,
  discount,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedCity, setSelectedCity] = useState<'Inside Dhaka' | 'Outside Dhaka'>(city);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmation | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.selectedVariant.price * item.quantity, 0);
  const deliveryFee = subtotal >= 1500 ? 0 : (selectedCity === 'Inside Dhaka' ? 60 : 120);
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার নাম, ফোন নম্বর এবং সম্পূর্ণ ঠিকানা পূরণ করুন।');
      return;
    }

    if (!/^01[3-9]\d{8}$/.test(customerPhone.trim())) {
      setErrorMsg('অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি ফোন নম্বর দিন (যেমন: 01712345678)।');
      return;
    }

    setIsSubmitting(true);
    const orderNum = `FF-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      order_number: orderNum,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_address: deliveryAddress.trim(),
      delivery_area: selectedCity,
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        variant: i.selectedVariant.name,
        price: i.selectedVariant.price,
        quantity: i.quantity,
        image: i.product.image,
      })),
      subtotal,
      delivery_fee: deliveryFee,
      discount,
      total_amount: grandTotal,
      payment_method: paymentMethod === 'cod' ? 'Cash on Delivery' : 'bKash',
      status: 'pending'
    };

    // Save to LocalStorage for instant local dashboard sync
    try {
      const existing = JSON.parse(localStorage.getItem('foodflow_local_orders') || '[]');
      const newLocalOrder = {
        ...orderPayload,
        id: 'ord-' + Date.now(),
        created_at: new Date().toISOString()
      };
      localStorage.setItem('foodflow_local_orders', JSON.stringify([newLocalOrder, ...existing]));
      window.dispatchEvent(new CustomEvent('foodflow_new_order', { detail: newLocalOrder }));
    } catch (e) {
      console.warn('Local order storage note:', e);
    }

    // Save to Supabase (async)
    supabase.from('orders').insert([orderPayload]).then(({ error }) => {
      if (error) {
        console.warn('Supabase order insert note:', error.message);
      }
    }).catch((err) => {
      console.warn('Supabase network error:', err);
    });

    setTimeout(() => {
      const order: OrderConfirmation = {
        orderNumber: orderNum,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        city: selectedCity,
        paymentMethod,
        items: items.map((i) => ({
          name: i.product.name,
          variantName: i.selectedVariant.name,
          price: i.selectedVariant.price,
          quantity: i.quantity,
          image: i.product.image,
        })),
        subtotal,
        deliveryFee,
        discount,
        grandTotal,
        createdAt: new Date().toLocaleDateString('bn-BD', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };

      setConfirmedOrder(order);
      onOrderSuccess(order);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="fixed inset-0" onClick={confirmedOrder ? onClose : undefined} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-base">FoodFlow</span>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-semibold text-food-700">
              {confirmedOrder ? 'অর্ডার সফল হয়েছে!' : 'সহজ চেকআউট'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {confirmedOrder ? (
            /* Success Screen */
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  ধন্যবাদ, {confirmedOrder.customerName}!
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। দ্রুত ডেলিভারির জন্য আমাদের প্রতিনিধি আপনার ফোনে কল করবেন।
                </p>
              </div>

              {/* Order Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs sm:text-sm space-y-2.5">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">অর্ডার নম্বর:</span>
                  <span className="font-bold text-slate-900">{confirmedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">মোবাইল নম্বর:</span>
                  <span className="font-semibold text-slate-800">{confirmedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ঠিকানা:</span>
                  <span className="font-medium text-slate-800 text-right max-w-xs">{confirmedOrder.deliveryAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">পেমেন্ট পদ্ধতি:</span>
                  <span className="font-semibold text-emerald-700">
                    {confirmedOrder.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা)' : 'বিকাশ / নগদ'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                  <span>সর্বমোট প্রদেয় বিল:</span>
                  <span className="text-food-700">৳{confirmedOrder.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>রসিদ প্রিন্ট / সেভ করুন</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-8 py-2.5 rounded-xl bg-food-600 text-white font-bold text-xs hover:bg-food-700 shadow-sm"
                >
                  আরও কেনাকাটা করুন
                </button>
              </div>
            </div>
          ) : (
            /* Order Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আপনার নাম লিখুন *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="যেমন: মোঃ জাহিদ হাসান"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-food-600"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ১১ ডিজিটের মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="যেমন: 01712345678"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-food-600"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সম্পূর্ণ ডেলিভারি ঠিকানা *
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="বাসা/রোড নম্বর, এলাকা, থানা ও জেলা"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-food-600"
                />
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ডেলিভারি এলাকা নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                  <div
                    onClick={() => setSelectedCity('Inside Dhaka')}
                    className={`p-3 rounded-xl border cursor-pointer text-center ${
                      selectedCity === 'Inside Dhaka'
                        ? 'bg-food-50 border-food-600 text-food-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    ঢাকা সিটির ভিতরে (৬০৳)
                  </div>
                  <div
                    onClick={() => setSelectedCity('Outside Dhaka')}
                    className={`p-3 rounded-xl border cursor-pointer text-center ${
                      selectedCity === 'Outside Dhaka'
                        ? 'bg-food-50 border-food-600 text-food-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    ঢাকার বাইরে (১২০৳)
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  পেমেন্ট পদ্ধতি:
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-center gap-2 ${
                      paymentMethod === 'cod'
                        ? 'bg-food-50 border-food-600 text-food-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>💵 ক্যাশ অন ডেলিভারি</span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-center gap-2 ${
                      paymentMethod === 'bkash'
                        ? 'bg-food-50 border-food-600 text-food-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>📱 বিকাশ / নগদ</span>
                  </div>
                </div>
              </div>

              {/* Bill Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>পণ্যের মোট মূল্য:</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-food-700 font-semibold">
                    <span>কুপন ছাড়:</span>
                    <span>-৳{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>{deliveryFee === 0 ? 'ফ্রি' : `৳${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>সর্বমোট বিল:</span>
                  <span className="text-food-700">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-food-600 hover:bg-food-700 disabled:opacity-50 text-white font-bold text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                ) : (
                  <span>অর্ডার নিশ্চিত করুন (৳{grandTotal.toLocaleString()})</span>
                )}
              </button>

              <div className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-food-600" />
                <span>পণ্য হাতে পেয়ে চেক করে টাকা দেওয়ার নিশ্চয়তা</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
