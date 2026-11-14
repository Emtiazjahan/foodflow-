import { FoodProduct } from '../types';

export const FOOD_PRODUCTS: FoodProduct[] = [
  {
    id: 'foodflow-butter',
    name: 'ফুডফ্লো ফ্রেশ মিল্ক বাটার (Pure Milk Butter)',
    nameEn: 'FoodFlow Pure Artisanal Milk Butter',
    category: 'ghee-oil',
    categoryName: 'মিল্ক বাটার ও ডেইরি',
    shortDesc: 'দেশি গরুর খাঁটি দুধের ননী থেকে তৈরি ১০০% ফ্রেশ ও প্রাকৃতিক মিল্ক বাটার (মাখন)।',
    description: 'কোনো প্রকার প্রিজারভেটিভ, কৃত্রিম রঙ বা অতিরিক্ত লবণ ছাড়া সিরাজগঞ্জের খামারের খাঁটি গরুর দুধের ক্রিম থেকে তৈরি ফ্রেশ মিল্ক বাটার। সকালের গরম টোস্ট, পরোটা, কিংবা বেকিং ও রান্নায় আনে অসাধারণ খাঁটি স্বাদ ও পুষ্টি।',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'bt-1', name: '২৫০ গ্রাম প্যাক (250g)', price: 320, originalPrice: 380, stock: 40 },
      { id: 'bt-2', name: '৫০০ গ্রাম প্যাক (500g)', price: 600, originalPrice: 700, stock: 25 },
      { id: 'bt-3', name: '১ কেজি ফ্যামিলি প্যাক (1 Kg)', price: 1150, originalPrice: 1350, stock: 15 }
    ],
    rating: 4.95,
    reviewCount: 168,
    badge: '১০০% ফ্রেশ মাখন',
    benefits: ['খাঁটি গরুর দুধের ননী থেকে তৈরি', 'লবণ ও কেমিক্যাল মুক্ত নিরাপদ মাখন', 'ভিটামিন এ ও ডি সমৃদ্ধ পুষ্টিকর'],
    origin: 'সিরাজগঞ্জ ও পাবনা খামার',
    inStock: true,
    reviews: [
      {
        id: 'rb-1',
        author: 'নাদিম আহমেদ',
        location: 'গুলশান, ঢাকা',
        rating: 5,
        date: '২ দিন আগে',
        comment: 'দোকানের বাটারের মতো কোনো কৃত্রিম গন্ধ নেই, একদম খাঁটি ননীর মাখনের আসল স্বাদ।'
      },
      {
        id: 'rb-2',
        author: 'শারমিন আক্তার',
        location: 'উত্তরা, ঢাকা',
        rating: 5,
        date: '৫ দিন আগে',
        comment: 'বাচ্চাদের প্রতিদিন সকালের নাস্তায় দিচ্ছি। অনেক সফট ও ফ্রেশ।'
      }
    ]
  },
  {
    id: 'foodflow-ghee',
    name: 'ফুডফ্লো প্রিমিয়াম দানাদার গাওয়া ঘি (Danadar Ghee)',
    nameEn: 'FoodFlow Premium Danadar Cow Ghee',
    category: 'ghee-oil',
    categoryName: 'গাওয়া ঘি',
    shortDesc: 'পাবনার দেশি গরুর দুধের ক্রিম জ্বাল দিয়ে তৈরি খাঁটি দানাদার গাওয়া ঘি।',
    description: 'কোনো প্রকার সুগন্ধি বা কৃত্রিম ফ্লেভার ছাড়া ঐতিহ্যবাহী পদ্ধতিতে প্রস্তুত গাওয়া ঘি। গরম ভাতে এক চামচ দিলেই পুরো ঘর মোহিত করা খাঁটি ঘ্রাণ ছড়িয়ে পড়ে। পোলাও, বিরিয়ানি ও যেকোনো রান্নার স্বাদ বহুগুণ বাড়িয়ে দেয়।',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'gh-1', name: '২৫০ গ্রাম জার (250g)', price: 440, originalPrice: 500, stock: 50 },
      { id: 'gh-2', name: '৫০০ গ্রাম জার (500g)', price: 820, originalPrice: 950, stock: 35 },
      { id: 'gh-3', name: '১ কেজি মেগা জার (1 Kg)', price: 1590, originalPrice: 1800, stock: 20 }
    ],
    rating: 4.98,
    reviewCount: 284,
    badge: 'সেরা গাওয়া ঘি',
    benefits: ['আসল দানাদার টেক্সচার ও প্রাকৃতিক সুবাস', 'হজমশক্তি বৃদ্ধি করে', '১০০% বিশুদ্ধ গরুর দুধের ননী'],
    origin: 'পাবনা ও সিরাজগঞ্জ বাথান',
    inStock: true,
    reviews: [
      {
        id: 'rg-1',
        author: 'মোঃ আরিফ হোসেন',
        location: 'ধানমন্ডি, ঢাকা',
        rating: 5,
        date: '১ দিন আগে',
        comment: 'ঘি এর আসল সুবাস আর দানা মুখে লেগে থাকে। গরম ভাতের সাথে খেলে মন ভরে যায়।'
      }
    ]
  },
  {
    id: 'foodflow-coffee',
    name: 'ফুডফ্লো অ্যারাবিকা রোস্টেড কফি (Artisanal Coffee)',
    nameEn: 'FoodFlow 100% Arabica Medium Dark Roast Coffee',
    category: 'honey-nuts',
    categoryName: 'প্রিমিয়াম কফি',
    shortDesc: 'পাহাড়ের তাজা কফি বিন থেকে ফ্রেশ রোস্টেড ও গ্রাউন্ড করা প্রিমিয়াম কফি।',
    description: 'বান্দরবানের পাহাড়ি বাগান ও প্রিমিয়াম অ্যারাবিকা কফি বিন থেকে সংগৃহীত। মিডিয়াম-ডার্ক রোস্টে তৈরি, যার প্রতিটি চুমুকে পাবেন চকলেট ও ক্যারামেলের স্মুথ নোট এবং তীব্র রিফ্রেশিং অ্যারোমা। ব্ল্যাক কফি, মিল্ক কফি কিংবা কোল্ড কফির জন্য সেরা।',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'cf-1', name: '১০০ গ্রাম কাঁচের জার (100g)', price: 350, originalPrice: 420, stock: 45 },
      { id: 'cf-2', name: '২৫০ গ্রাম প্রিমিয়াম প্যাক (250g)', price: 780, originalPrice: 900, stock: 30 },
      { id: 'cf-3', name: '৫০০ গ্রাম ফ্যামিলি প্যাক (500g)', price: 1450, originalPrice: 1680, stock: 15 }
    ],
    rating: 4.92,
    reviewCount: 195,
    badge: 'ফ্রেশ রোস্টেড',
    benefits: ['১০০% খাঁটি অ্যারাবিকা বিন', 'তীব্র মন মাতানো রিফ্রেশিং অ্যারোমা', 'ক্লান্তি দূর করে তাৎক্ষণিক চাঙ্গা করে'],
    origin: 'বান্দরবান হিল ট্র্যাক্টস',
    inStock: true,
    reviews: [
      {
        id: 'rc-1',
        author: 'তানজিল রাফাত',
        location: 'বনানী, ঢাকা',
        rating: 5,
        date: '৩ দিন আগে',
        comment: 'প্যাকেট খুললেই পুরো ঘর কফির গন্ধে ভরে যায়। টেস্ট খুবই স্মুথ, কোনো তিতকুটে ভাব নেই।'
      }
    ]
  },
  {
    id: 'foodflow-trio-combo',
    name: 'ফুডফ্লো ট্রায়ো কম্বো (বাটার + ঘি + কফি)',
    nameEn: 'FoodFlow Signature Breakfast Trio Combo',
    category: 'spices-rice',
    categoryName: 'স্পেশাল কম্বো অফার',
    shortDesc: '২৫০ গ্রাম মিল্ক বাটার + ২৫০ গ্রাম গাওয়া ঘি + ১০০ গ্রাম ফ্রেশ রোস্টেড কফি।',
    description: 'ফুডফ্লো এর সেরা তিনটি প্রিমিয়াম পণ্যের এক্সক্লুসিভ কম্বো প্যাক। আপনার সকালের হেলদি নাস্তা ও প্রাত্যহিক পুষ্টির জন্য একদম পারফেক্ট বান্ডেল। একসাথে নিলে পাচ্ছেন আকর্ষণীয় ছাড় ও ফ্রি ডেলিভারি!',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    variants: [
      { id: 'trio-1', name: 'স্ট্যান্ডার্ড কম্বো (২৫০গ্রাম বাটার + ২৫০গ্রাম ঘি + ১০০গ্রাম কফি)', price: 990, originalPrice: 1220, stock: 25 },
      { id: 'trio-2', name: 'মেগা কম্বো (৫০০গ্রাম বাটার + ৫০০গ্রাম ঘি + ২৫০গ্রাম কফি)', price: 1990, originalPrice: 2400, stock: 15 }
    ],
    rating: 4.99,
    reviewCount: 88,
    badge: 'স্পেশাল কম্বো অফার',
    benefits: ['এক প্যাকেটে সব পছন্দের পণ্য', '২০০৳ এর বেশি স্পেশাল ছাড়', 'ফ্রি হোম ডেলিভারি সুবিধা'],
    origin: 'ফুডফ্লো সিগনেচার কালেকশন',
    inStock: true,
    reviews: []
  }
];

export const FOOD_CATEGORIES = [
  { id: 'all', label: 'সব পণ্য (All 3 Products)' },
  { id: 'ghee-oil', label: 'মিল্ক বাটার ও গাওয়া ঘি' },
  { id: 'honey-nuts', label: 'রোস্টেড কফি' },
  { id: 'spices-rice', label: 'স্পেশাল ট্রায়ো কম্বো' }
];
