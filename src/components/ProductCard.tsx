'use client';

import React, { useState } from 'react';
import { ShoppingBag, Star, Check, MessageCircle, ArrowRight } from 'lucide-react';
import { FoodProduct, FoodVariant } from '../types';

interface ProductCardProps {
  product: FoodProduct;
  onAddToCart: (product: FoodProduct, variant: FoodVariant) => void;
  onOpenProductPage: (product: FoodProduct) => void;
  whatsappNumber: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenProductPage,
  whatsappNumber,
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, activeVariant);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const whatsappMessage = encodeURIComponent(
    `আসসালামু আলাইকুম, আমি FoodFlow ওয়েবসাইট থেকে "${product.name}" (${activeVariant.name} - ৳${activeVariant.price}) অর্ডার করতে চাই।`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div
      onClick={() => onOpenProductPage(product)}
      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        {/* Product Image */}
        <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 bg-food-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {product.badge}
            </span>
          )}

          {/* Click to view detail banner */}
          <span className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <span>বিস্তারিত দেখুন</span>
            <ArrowRight className="w-3 h-3" />
          </span>

          <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded">
            উৎস: {product.origin}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-2 text-left">
          <div className="text-[11px] text-food-700 font-bold uppercase tracking-wider">
            {product.categoryName}
          </div>

          <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-food-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 font-normal line-clamp-2">
            {product.shortDesc}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-bold text-slate-800">{product.rating}</span>
            <span>({product.reviewCount} রিভিউ)</span>
          </div>

          {/* Variant Selector */}
          <div className="pt-2">
            <div className="text-[11px] text-slate-700 font-bold mb-1.5">সাইজ / পরিমাণ:</div>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariantIndex(idx);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                    selectedVariantIndex === idx
                      ? 'bg-food-50 border-food-600 text-food-800 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Price & Action Footer */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="flex items-baseline justify-between py-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              ৳{activeVariant.price}
            </span>
            {activeVariant.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ৳{activeVariant.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
            ক্যাশ অন ডেলিভারি
          </span>
        </div>

        {/* Action Buttons: 1. Order Now (Add & Checkout) + 2. Dedicated WhatsApp */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleAdd}
            className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-food-600 hover:bg-food-700 text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>ব্যাগে যোগ করা হয়েছে ✓</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>অর্ডার করুন (৳{activeVariant.price})</span>
              </>
            )}
          </button>

          {/* Dedicated WhatsApp Order Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp-এ অর্ডার</span>
          </a>
        </div>
      </div>
    </div>
  );
};
