'use client';

import React from 'react';
import { FoodProduct, FoodVariant } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles } from 'lucide-react';

interface CatalogProps {
  products: FoodProduct[];
  selectedCategory: string;
  onAddToCart: (product: FoodProduct, variant: FoodVariant) => void;
  onOpenProductPage: (product: FoodProduct) => void;
  whatsappNumber: string;
}

export const Catalog: React.FC<CatalogProps> = ({
  products,
  selectedCategory,
  onAddToCart,
  onOpenProductPage,
  whatsappNumber,
}) => {
  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4 text-left">
        <div>
          <div className="flex items-center gap-1.5 text-food-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ফুডফ্লো সিগনেচার কালেকশন</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            আমাদের খাদ্যপণ্য
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            যে কোনো পণ্যের উপর ক্লিক করে বিস্তারিত গুণাগুণ দেখতে পারেন অথবা সরাসরি অর্ডার করতে পারেন।
          </p>
        </div>

        <div className="text-sm text-slate-500 font-medium">
          মোট {products.length}টি পণ্য
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <p className="text-slate-500 text-base mb-2">কোনো পণ্য পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onOpenProductPage={onOpenProductPage}
              whatsappNumber={whatsappNumber}
            />
          ))}
        </div>
      )}
    </section>
  );
};
