'use client';

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, Star, ShoppingBag, Phone, MessageCircle, Heart, Share2, Check } from 'lucide-react';
import { FoodProduct, FoodVariant } from '../types';

interface ProductPageProps {
  product: FoodProduct;
  allProducts: FoodProduct[];
  onBackToHome: () => void;
  onSelectProduct: (p: FoodProduct) => void;
  onAddToCart: (product: FoodProduct, variant: FoodVariant, quantity: number) => void;
  onDirectCheckout: (product: FoodProduct, variant: FoodVariant, quantity: number) => void;
  whatsappNumber: string;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  allProducts,
  onBackToHome,
  onSelectProduct,
  onAddToCart,
  onDirectCheckout,
  whatsappNumber,
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const images = [product.image, ...(product.additionalImages || [])];
  const currentImage = images[selectedImageIndex] || images[0];

  const handleAddToCart = () => {
    onAddToCart(product, activeVariant, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    onDirectCheckout(product, activeVariant, quantity);
  };

  // Dedicated WhatsApp Message targeting this exact product and selected variant
  const whatsappMessage = encodeURIComponent(
    `আসসালামু আলাইকুম, আমি FoodFlow ওয়েবসাইট থেকে "${product.name}" (${activeVariant.name} - ৳${activeVariant.price * quantity}, পরিমাণ: ${quantity}টি) অর্ডার করতে চাই। ডেলিভারির বিস্তারিত জানাবেন।`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const relatedProducts = allProducts.filter((p) => p.id !== product.id);

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb & Back Button */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-food-600 bg-white border border-slate-200 px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← সব পণ্য দেখুন (হোমপেজ)</span>
          </button>

          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            <span>হোম</span>
            <span className="mx-2">/</span>
            <span>{product.categoryName}</span>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-semibold">{product.name}</span>
          </div>
        </div>

        {/* Main Product Stage */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Dedicated Gallery (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-food-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    {product.badge}
                  </span>
                )}

                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-md">
                  উৎস: {product.origin}
                </span>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-food-600 shadow-md scale-105'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Safe Food Credentials */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-food-50/60 rounded-2xl border border-food-100 text-center text-xs font-medium text-slate-700">
                <div>
                  <div className="text-food-700 font-bold">১০০% খাঁটি</div>
                  <div className="text-[11px] text-slate-500">প্রাকৃতিক উপাদান</div>
                </div>
                <div>
                  <div className="text-food-700 font-bold">ক্যাশ অন ডেলিভারি</div>
                  <div className="text-[11px] text-slate-500">দেখে মূল্য দিন</div>
                </div>
                <div>
                  <div className="text-food-700 font-bold">দ্রুত ডেলিভারি</div>
                  <div className="text-[11px] text-slate-500">২৪-৭২ ঘণ্টা</div>
                </div>
              </div>
            </div>

            {/* Right: Buy & Details (6 cols) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <span className="text-xs font-bold text-food-700 uppercase tracking-wider bg-food-100 px-3 py-1 rounded-full">
                  {product.categoryName}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {product.name}
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                  {product.nameEn}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-800">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} জন কাস্টমার রিভিউ করেছেন)</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-slate-900">
                    ৳{activeVariant.price * quantity}
                  </span>
                  {activeVariant.originalPrice && (
                    <span className="ml-2 text-sm text-slate-400 line-through">
                      ৳{activeVariant.originalPrice * quantity}
                    </span>
                  )}
                  <div className="text-xs text-slate-500 mt-0.5">
                    প্রতি একক: ৳{activeVariant.price} ({activeVariant.name})
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                    স্টকে আছে (রেডি ডেলিভারি)
                  </span>
                </div>
              </div>

              {/* Dedicated Variant Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  প্যাকেটের পরিমাণ / সাইজ নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedVariantIndex === idx
                          ? 'bg-food-50 border-food-600 ring-2 ring-food-600/20 text-slate-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{v.name}</div>
                      <div className="text-sm font-extrabold text-food-700 mt-0.5">৳{v.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Picker */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-xs font-bold text-slate-800">সংখ্যা (Quantity):</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-white rounded-l-xl font-bold text-base"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-base text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-white rounded-r-xl font-bold text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Instant Buy + Dedicated WhatsApp Order */}
              <div className="space-y-3 pt-3">
                
                {/* 1. Cash on Delivery Buy Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 rounded-xl bg-food-600 hover:bg-food-700 text-white font-extrabold text-base transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>ক্যাশ অন ডেলিভারিতে অর্ডার করুন (৳{activeVariant.price * quantity})</span>
                </button>

                {/* 2. Direct Dedicated WhatsApp Order Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>এই পণ্যটি WhatsApp-এ অর্ডার করুন</span>
                </a>

                {/* 3. Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200"
                >
                  <ShoppingBag className="w-4 h-4 text-food-700" />
                  <span>{justAdded ? 'ব্যাগে যোগ হয়েছে ✓' : 'শপিং ব্যাগে যোগ করুন'}</span>
                </button>
              </div>

              {/* Delivery info */}
              <div className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-food-600 shrink-0" />
                  <span>ঢাকা সিটিতে ৬০৳ এবং ঢাকার বাইরে ১২০৳ ডেলিভারি চার্জ।</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-food-600 shrink-0" />
                  <span>পণ্য হাতে পেয়ে দেখে নেওয়ার ১০০% গ্যারান্টি।</span>
                </div>
              </div>

            </div>

          </div>

          {/* Description & Benefits */}
          <div className="mt-12 pt-8 border-t border-slate-200 space-y-4 text-left">
            <h3 className="text-lg font-bold text-slate-900">
              পণ্যের বিস্তারিত গুণাগুণ ও বিবরণ
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {product.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {product.benefits.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-food-600 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-10 pt-8 border-t border-slate-200 text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              কাস্টমার রিভিউ ({product.reviews.length})
            </h3>

            {product.reviews.length === 0 ? (
              <p className="text-slate-500 text-xs py-2">
                এই ব্যাচের কাস্টমার রিভিউগুলো শীঘ্রই আপডেট করা হচ্ছে। আপনি পণ্যটি গ্রহণ করার পর আপনার অভিজ্ঞতা শেয়ার করুন।
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.reviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{r.author} ({r.location})</span>
                      <span className="text-slate-400">{r.date}</span>
                    </div>
                    <div className="flex text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Other Brand Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 text-left">
            <h3 className="text-xl font-bold text-slate-900">
              ফুডফ্লো এর অন্যান্য খাদ্যপণ্য
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
                >
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 border border-slate-200 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-food-700 uppercase">{rel.categoryName}</span>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-food-600 transition-colors line-clamp-1">
                      {rel.name}
                    </h4>
                    <div className="text-sm font-extrabold text-food-700 mt-1">
                      ৳{rel.variants[0]?.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
