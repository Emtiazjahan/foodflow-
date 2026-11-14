export interface FoodVariant {
  id: string;
  name: string; // e.g. "500g", "1 Kg", "250ml"
  price: number; // in BDT (৳)
  originalPrice?: number;
  stock: number;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
}

export interface FoodProduct {
  id: string;
  name: string;
  nameEn: string;
  category: 'ghee-oil' | 'honey-nuts' | 'spices-rice' | 'pickles' | 'daily-fresh';
  categoryName: string;
  shortDesc: string;
  description: string;
  image: string;
  additionalImages?: string[];
  variants: FoodVariant[];
  selectedVariantIndex?: number;
  rating: number;
  reviewCount: number;
  badge?: string; // e.g. "বেস্ট সেলার", "১০০% খাঁটি", "নতুন"
  benefits: string[];
  origin: string; // e.g. "সিরাজগঞ্জ", "সুন্দরবন", "দিনাজপুর"
  inStock: boolean;
  reviews: Review[];
}

export interface CartItem {
  id: string;
  product: FoodProduct;
  selectedVariant: FoodVariant;
  quantity: number;
}

export interface OrderConfirmation {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: 'Inside Dhaka' | 'Outside Dhaka';
  paymentMethod: 'cod' | 'bkash';
  items: {
    name: string;
    variantName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  createdAt: string;
}
