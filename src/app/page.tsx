'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Catalog } from '../components/Catalog';
import { ProductPage } from '../components/ProductPage';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { TrustSection } from '../components/TrustSection';
import { Footer } from '../components/Footer';

import { FOOD_PRODUCTS } from '../data/products';
import { STORE_CONFIG } from '../config';
import { FoodProduct, FoodVariant, CartItem, OrderConfirmation } from '../types';
import { Sparkles } from 'lucide-react';

export default function FoodFlowHome() {
  const [activeView, setActiveView] = useState<'home' | 'product'>('home');
  const [dedicatedProduct, setDedicatedProduct] = useState<FoodProduct>(FOOD_PRODUCTS[0]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [city, setCity] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // LocalStorage cart persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem('foodflow_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('foodflow_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Switch to dedicated product page
  const handleOpenProductPage = (product: FoodProduct) => {
    setDedicatedProduct(product);
    setActiveView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return FOOD_PRODUCTS.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Cart operations
  const handleAddToCart = (product: FoodProduct, variant: FoodVariant, quantity: number = 1) => {
    const itemId = `${product.id}-${variant.id}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { id: itemId, product, selectedVariant: variant, quantity }];
    });
    showToast(`"${product.name}" (${variant.name}) ব্যাগে যুক্ত হয়েছে`);
  };

  const handleUpdateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i))
      );
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleDirectCheckout = (product: FoodProduct, variant: FoodVariant, quantity: number = 1) => {
    handleAddToCart(product, variant, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleApplyPromo = (code: string) => {
    if (code === STORE_CONFIG.activePromoCode || code === 'EID10') {
      setAppliedPromo(code);
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const handleOrderSuccess = (order: OrderConfirmation) => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.selectedVariant.price * item.quantity, 0);
  const discount = appliedPromo ? Math.round((cartTotal * STORE_CONFIG.promoDiscountPercentage) / 100) : 0;

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickOrderHero = () => {
    const heroProduct = FOOD_PRODUCTS[3] || FOOD_PRODUCTS[0];
    handleDirectCheckout(heroProduct, heroProduct.variants[0], 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Header */}
      <Navbar
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (activeView === 'product') setActiveView('home');
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (activeView === 'product') setActiveView('home');
        }}
        onGoHome={handleBackToHome}
        whatsappNumber={STORE_CONFIG.whatsappNumber}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'home' ? (
          <>
            <Hero
              onExplore={scrollToCatalog}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onQuickOrderHero={handleQuickOrderHero}
            />

            <Catalog
              products={filteredProducts}
              selectedCategory={selectedCategory}
              onAddToCart={handleAddToCart}
              onOpenProductPage={handleOpenProductPage}
              whatsappNumber={STORE_CONFIG.whatsappNumber}
            />

            <TrustSection />
          </>
        ) : (
          <ProductPage
            product={dedicatedProduct}
            allProducts={FOOD_PRODUCTS}
            onBackToHome={handleBackToHome}
            onSelectProduct={handleOpenProductPage}
            onAddToCart={handleAddToCart}
            onDirectCheckout={handleDirectCheckout}
            whatsappNumber={STORE_CONFIG.whatsappNumber}
          />
        )}
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
        city={city}
        onCityChange={setCity}
        discount={discount}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        city={city}
        discount={discount}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fadeIn border border-slate-700">
          <Sparkles className="w-4 h-4 text-food-500" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
