'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase, FoodFlowOrder } from '../../lib/supabase';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Users,
  Settings,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Phone,
  MessageCircle,
  Eye,
  Edit2,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  Menu,
  Printer,
  ExternalLink,
  Save,
  Upload,
  RefreshCw,
  SlidersHorizontal,
  CreditCard,
  Building,
  Mail,
  MapPin,
  Tag,
  Download
} from 'lucide-react';

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================
type DashboardTab = 'overview' | 'products' | 'orders' | 'inventory' | 'customers' | 'settings';
type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  image: string;
  description?: string;
}

interface OrderItem {
  name: string;
  variant?: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  delivery_area: 'inside' | 'outside' | string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total_amount: number;
  payment_method: string;
  status: OrderStatus;
  created_at: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
}

interface StoreSettings {
  storeName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
  freeDeliveryThreshold: number;
  codEnabled: boolean;
  bkashEnabled: boolean;
  bkashNumber: string;
  nagadEnabled: boolean;
  nagadNumber: string;
}

// ==========================================
// INITIAL SEED DATA
// ==========================================
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Dhakai Pure Milk Butter (খাটি দুধের মাখন)',
    category: 'Dairy',
    price: 850,
    stock: 50,
    sku: 'DF-BUTTER-500',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
    description: '100% grass-fed farm churned pure butter from Sirajganj milk sheds.'
  },
  {
    id: 'prod-2',
    name: 'Premium Danadar Ghee (দানাদার গাওয়া ঘি)',
    category: 'Dairy',
    price: 1350,
    stock: 50,
    sku: 'DF-GHEE-900',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=400&q=80',
    description: 'Traditional bilona churned golden ghee with authentic aroma.'
  },
  {
    id: 'prod-3',
    name: 'Single-Origin Arabica Roast Coffee',
    category: 'Coffee',
    price: 920,
    stock: 35,
    sku: 'DF-COFFEE-250',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80',
    description: 'Hand-picked Bandarban highland Arabica beans medium-dark roasted.'
  },
  {
    id: 'prod-4',
    name: 'Pure Sundarban Wild Honey (সুন্দরবনের মধু)',
    category: 'Honey',
    price: 1100,
    stock: 40,
    sku: 'DF-HONEY-500',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
    description: 'Raw unfiltered honey sourced directly from natural hives in the Sundarbans.'
  },
  {
    id: 'prod-5',
    name: 'Organic Mustard Oil (ঘানি ভাঙা সরিষার তেল)',
    category: 'Oils',
    price: 360,
    stock: 60,
    sku: 'DF-OIL-1000',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
    description: 'Cold-pressed wooden expeller mustard seed oil with intense pungency.'
  }
];

// Clean Production State: No mock/demo orders
const DEFAULT_ORDERS: Order[] = [];

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'FoodFlow (ফুডফ্লো)',
  tagline: 'খাঁটি ও পুষ্টিকর খাবারের বিশ্বস্ত অনলাইন শপ',
  description: 'Handcrafted organic food staples, farm-churned dairy, and artisan staples directly from local growers in Bangladesh.',
  logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
  phone: '01311164090',
  email: 'contact@foodflow.com.bd',
  address: 'Level 4, House 18, Block B, Banani, Dhaka-1213, Bangladesh',
  deliveryInsideDhaka: 70,
  deliveryOutsideDhaka: 130,
  freeDeliveryThreshold: 2000,
  codEnabled: true,
  bkashEnabled: true,
  bkashNumber: '01311164090',
  nagadEnabled: true,
  nagadNumber: '01311164090'
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function StoreManagementDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [categories, setCategories] = useState<string[]>(['All', 'Dairy', 'Coffee', 'Honey', 'Oils']);

  // Filters & Search
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [inventoryStockFilter, setInventoryStockFilter] = useState<'all' | 'available' | 'low' | 'out'>('all');

  // Modals & Drawers
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Dairy',
    price: '',
    stock: '',
    sku: '',
    image: '',
    description: ''
  });

  // Settings Temp Form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(DEFAULT_SETTINGS);

  // Syncing & Realtime state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Live Supabase Order Sync ──
  const fetchLiveOrders = async () => {
    setIsSyncing(true);
    try {
      // 1. Fetch from Supabase cloud database
      const { data: dbOrders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch note:', error.message);
      }

      // 2. Fetch local storage orders
      let localOrders: any[] = [];
      try {
        const l1 = JSON.parse(localStorage.getItem('foodflow_local_orders') || '[]');
        const l2 = JSON.parse(localStorage.getItem('foodflow_mgmt_orders') || '[]');
        localOrders = [...l1, ...l2];
      } catch (e) {}

      // Clean any accidental legacy reset lock
      localStorage.removeItem('foodflow_demo_reset_v2');

      // 3. Combine & deduplicate orders
      const combined = [...(dbOrders || []), ...localOrders];
      const seen = new Set<string>();
      const uniqueOrders: Order[] = [];

      for (const ord of combined) {
        const key = ord.order_number || ord.id;
        if (!key || seen.has(key)) continue;
        // Skip mock/demo orders
        if (['ord-1001', 'ord-1002', 'ord-1003', 'ord-1004', 'FF-1001', 'FF-1002', 'FF-1003', 'FF-1004'].includes(key)) continue;
        seen.add(key);

        // Map status
        let normalizedStatus: OrderStatus = 'pending';
        if (ord.status === 'confirmed' || ord.status === 'processing' || ord.status === 'shipped') {
          normalizedStatus = 'processing';
        } else if (ord.status === 'delivered' || ord.status === 'completed') {
          normalizedStatus = 'completed';
        } else if (ord.status === 'cancelled') {
          normalizedStatus = 'cancelled';
        }

        uniqueOrders.push({
          id: ord.id ? String(ord.id) : `ord-${ord.order_number}`,
          order_number: ord.order_number || 'FF-000000',
          customer_name: ord.customer_name || 'Customer',
          customer_phone: ord.customer_phone || 'N/A',
          customer_email: ord.customer_email || '',
          customer_address: ord.customer_address || 'Dhaka, Bangladesh',
          delivery_area: ord.delivery_area || 'inside',
          items: Array.isArray(ord.items) ? ord.items : [],
          subtotal: Number(ord.subtotal) || 0,
          delivery_fee: Number(ord.delivery_fee) || 0,
          discount: Number(ord.discount) || 0,
          total_amount: Number(ord.total_amount) || 0,
          payment_method: ord.payment_method || 'Cash on Delivery',
          status: normalizedStatus,
          created_at: ord.created_at || new Date().toISOString()
        });
      }

      setOrders(uniqueOrders);
      setLastSyncedAt(new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      try {
        localStorage.setItem('foodflow_mgmt_orders', JSON.stringify(uniqueOrders));
      } catch (e) {}
    } catch (err) {
      console.error('Error fetching live orders:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // ── Load from LocalStorage & Supabase on mount ──
  useEffect(() => {
    try {
      const savedProds = localStorage.getItem('foodflow_mgmt_products');
      if (savedProds) setProducts(JSON.parse(savedProds));

      const savedSettings = localStorage.getItem('foodflow_mgmt_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setSettingsForm(parsed);
      }

      const savedCats = localStorage.getItem('foodflow_mgmt_categories');
      if (savedCats) setCategories(JSON.parse(savedCats));

      // Quick-load cached orders before Supabase returns
      const savedOrders = localStorage.getItem('foodflow_mgmt_orders') || localStorage.getItem('foodflow_local_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        const realOrders = parsed.filter((o: any) => !['ord-1001', 'ord-1002', 'ord-1003', 'ord-1004', 'FF-1001', 'FF-1002', 'FF-1003', 'FF-1004'].includes(o.id || o.order_number));
        setOrders(realOrders);
      }
    } catch (e) {
      console.error('LocalStorage load error', e);
    }

    // Live sync from Supabase
    fetchLiveOrders();

    // Subscribe to Supabase Realtime channel
    const channel = supabase
      .channel('admin_realtime_orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          fetchLiveOrders();
          if (payload.eventType === 'INSERT') {
            const newOrd = payload.new as any;
            showToast(`🔔 নতুন অর্ডার এসেছে: ${newOrd?.order_number || 'নতুন অর্ডার'} (${newOrd?.customer_name || ''})`);
          }
        }
      )
      .subscribe();

    // Listen for local tab events
    const handleNewOrder = (event: any) => {
      const newOrderData = event.detail;
      if (newOrderData) {
        setOrders(prev => {
          if (prev.some(o => o.order_number === newOrderData.order_number)) return prev;
          return [newOrderData, ...prev];
        });
        showToast(`🎉 New order received from ${newOrderData.customer_name}!`);
      }
    };
    window.addEventListener('foodflow_new_order', handleNewOrder);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('foodflow_new_order', handleNewOrder);
    };
  }, []);

  // ── Save to LocalStorage ──
  useEffect(() => {
    try {
      localStorage.setItem('foodflow_mgmt_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('foodflow_mgmt_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('foodflow_mgmt_settings', JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('foodflow_mgmt_categories', JSON.stringify(categories));
    } catch (e) {}
  }, [categories]);

  // ==========================================
  // COMPUTED STATS & LISTS
  // ==========================================
  const totalProducts = products.length;
  const totalOrders = orders.length;

  // Customers dynamically derived from unique phone numbers
  const customersList: Customer[] = useMemo(() => {
    const map = new Map<string, Customer>();
    orders.forEach(ord => {
      const phoneKey = ord.customer_phone?.trim() || ord.customer_name;
      const existing = map.get(phoneKey);
      if (existing) {
        existing.total_orders += 1;
        existing.total_spent += Number(ord.total_amount) || 0;
        if (new Date(ord.created_at) > new Date(existing.last_order_date)) {
          existing.last_order_date = ord.created_at;
          existing.address = ord.customer_address || existing.address;
        }
      } else {
        map.set(phoneKey, {
          id: 'cust-' + phoneKey,
          name: ord.customer_name || 'Valued Customer',
          phone: ord.customer_phone || 'N/A',
          email: ord.customer_email || 'customer@foodflow.bd',
          address: ord.customer_address || 'Dhaka, Bangladesh',
          total_orders: 1,
          total_spent: Number(ord.total_amount) || 0,
          last_order_date: ord.created_at
        });
      }
    });
    return Array.from(map.values());
  }, [orders]);

  const totalCustomers = customersList.length;
  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  }, [orders]);

  // Inventory segmentation
  const availableStockProducts = products.filter(p => p.stock > 10);
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = productCategoryFilter === 'All' || p.category.toLowerCase() === productCategoryFilter.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.sku.toLowerCase().includes(productSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, productCategoryFilter, productSearch]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const matchSearch = o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer_phone.includes(orderSearch);
      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    if (inventoryStockFilter === 'available') return availableStockProducts;
    if (inventoryStockFilter === 'low') return lowStockProducts;
    if (inventoryStockFilter === 'out') return outOfStockProducts;
    return products;
  }, [products, inventoryStockFilter, availableStockProducts, lowStockProducts, outOfStockProducts]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customersList.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase())
    );
  }, [customersList, customerSearch]);

  // Recent 5 Orders for Overview
  const recentOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  }, [orders]);

  // ==========================================
  // HANDLERS
  // ==========================================
  // Product Save (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('Please fill in product name and price');
      return;
    }

    if (editingProduct) {
      // Update
      setProducts(prev => prev.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: productForm.name,
            category: productForm.category,
            price: Number(productForm.price),
            stock: Number(productForm.stock) || 0,
            sku: productForm.sku || p.sku,
            image: productForm.image || p.image,
            description: productForm.description
          };
        }
        return p;
      }));
      showToast(`Updated "${productForm.name}" successfully!`);
    } else {
      // Create
      const newProd: Product = {
        id: 'prod-' + Date.now(),
        name: productForm.name,
        category: productForm.category || 'General',
        price: Number(productForm.price),
        stock: Number(productForm.stock) || 0,
        sku: productForm.sku || `DF-SKU-${Math.floor(100 + Math.random() * 900)}`,
        image: productForm.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
        description: productForm.description
      };
      setProducts(prev => [newProd, ...prev]);
      showToast(`Added "${newProd.name}" to catalog!`);
    }

    // Reset
    setIsAddProductOpen(false);
    setEditingProduct(null);
    setProductForm({ name: '', category: 'Dairy', price: '', stock: '', sku: '', image: '', description: '' });
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price.toString(),
      stock: prod.stock.toString(),
      sku: prod.sku,
      image: prod.image,
      description: prod.description || ''
    });
    setIsAddProductOpen(true);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast(`Deleted "${name}"`);
    }
  };

  // Inline Quick Stock Update
  const updateProductStock = (id: string, newStock: number) => {
    const valid = Math.max(0, newStock);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: valid } : p));
    showToast('Stock quantity updated');
  };

  // Inline Price Update
  const updateProductPrice = (id: string, newPrice: number) => {
    const valid = Math.max(0, newPrice);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price: valid } : p));
    showToast('Product price updated');
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const targetOrder = orders.find(o => o.id === orderId || o.order_number === orderId);
    setOrders(prev => prev.map(o => (o.id === orderId || o.order_number === orderId) ? { ...o, status: newStatus } : o));
    if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.order_number === orderId)) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Order status set to ${newStatus.toUpperCase()}`);

    // Update in Supabase
    if (targetOrder?.order_number) {
      try {
        await supabase.from('orders').update({ status: newStatus }).eq('order_number', targetOrder.order_number);
      } catch (e) {
        console.warn('Supabase status update error:', e);
      }
    }
  };

  // Export Orders to CSV
  const exportOrdersToCSV = () => {
    if (filteredOrders.length === 0) {
      alert('No orders to export!');
      return;
    }
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Address', 'Delivery Area', 'Items', 'Subtotal', 'Delivery Fee', 'Discount', 'Total Amount', 'Payment Method', 'Status'];
    const rows = filteredOrders.map(o => [
      `"${o.order_number}"`,
      `"${new Date(o.created_at).toLocaleString()}"`,
      `"${(o.customer_name || '').replace(/"/g, '""')}"`,
      `"${o.customer_phone || ''}"`,
      `"${(o.customer_address || '').replace(/"/g, '""')}"`,
      `"${o.delivery_area || ''}"`,
      `"${(Array.isArray(o.items) ? o.items : []).map(i => `${i?.name || 'Item'} (x${i?.quantity || 1})`).join('; ').replace(/"/g, '""')}"`,
      o.subtotal,
      o.delivery_fee,
      o.discount,
      o.total_amount,
      `"${o.payment_method}"`,
      `"${o.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `foodflow_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported to CSV file successfully!');
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    if (confirm('Are you sure you want to clear all mock/demo orders and test customer records? Real products and settings will be preserved.')) {
      setOrders([]);
      localStorage.removeItem('foodflow_mgmt_orders');
      localStorage.removeItem('foodflow_orders');
      localStorage.removeItem('foodflow_local_orders');
      localStorage.removeItem('foodflow_demo_reset_v2');
      showToast('All demo orders cleared! Dashboard is now 100% clean for real business.');
    }
  };

  // Category Add
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      alert('Category already exists!');
      return;
    }
    setCategories(prev => [...prev, trimmed]);
    setNewCategoryName('');
    showToast(`Category "${trimmed}" added!`);
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(settingsForm);
    showToast('Settings saved successfully!');
  };

  // Helper for Order Status Badge
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pending
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Processing
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Cancelled
          </span>
        );
    }
  };

  // Helper for Stock Status Badge
  const renderStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          Out of Stock
        </span>
      );
    }
    if (stock <= 10) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          Low Stock ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        In Stock ({stock})
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row font-sans antialiased selection:bg-indigo-600 selection:text-white">
      
      {/* ── TOAST NOTIFICATION ────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-800 text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── MOBILE HEADER BAR ─────────────────────────────────────── */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
            FF
          </div>
          <span className="font-bold text-slate-900 text-base">{settings.storeName.split(' ')[0]} Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── SIDEBAR NAVIGATION ─────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand identity */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-sm">
              FF
            </div>
            <div className="leading-tight">
              <span className="font-bold text-slate-900 text-sm block tracking-tight">
                {settings.storeName.split(' ')[0]}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Store Management</span>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="md:hidden text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'products'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className={`w-4 h-4 ${activeTab === 'products' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Product Management</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {totalProducts}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Order Management</span>
            </div>
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'inventory'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Boxes className={`w-4 h-4 ${activeTab === 'inventory' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Inventory</span>
            </div>
            {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                {lowStockProducts.length + outOfStockProducts.length} alert
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('customers'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'customers'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className={`w-4 h-4 ${activeTab === 'customers' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Customers</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {totalCustomers}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'settings'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>Settings</span>
          </button>
        </nav>

        {/* Storefront View Link */}
        <div className="p-3 border-t border-slate-200">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition group"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              View Live Storefront
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </Link>
        </div>
      </aside>

      {/* ── BACKDROP FOR MOBILE MENU ───────────────────────────────── */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-slate-900 capitalize">
              {activeTab === 'overview' && 'Store Overview'}
              {activeTab === 'products' && 'Product Management'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'inventory' && 'Inventory Management'}
              {activeTab === 'customers' && 'Customer Directory'}
              {activeTab === 'settings' && 'Store Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchLiveOrders}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition disabled:opacity-60 cursor-pointer"
              title="Sync live orders with Supabase cloud"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : lastSyncedAt ? `Synced ${lastSyncedAt}` : 'Sync Cloud'}</span>
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Store Ready
            </span>

            {/* Quick Actions */}
            {activeTab === 'products' && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ name: '', category: 'Dairy', price: '', stock: '', sku: '', image: '', description: '' });
                  setIsAddProductOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Product
              </button>
            )}
          </div>
        </header>

        {/* Content Container */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

          {/* ========================================================= */}
          {/* 1. OVERVIEW SECTION                                       */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* 4 Clean Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Products */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500 block mb-1">Total Products</span>
                    <span className="text-2xl font-bold text-slate-900">{totalProducts}</span>
                    <span className="text-[11px] text-emerald-600 font-medium block mt-1">
                      {availableStockProducts.length} in stock
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500 block mb-1">Total Orders</span>
                    <span className="text-2xl font-bold text-slate-900">{totalOrders}</span>
                    <span className="text-[11px] text-amber-600 font-medium block mt-1">
                      {orders.filter(o => o.status === 'pending').length} pending fulfillment
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>

                {/* Total Customers */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500 block mb-1">Total Customers</span>
                    <span className="text-2xl font-bold text-slate-900">{totalCustomers}</span>
                    <span className="text-[11px] text-slate-500 font-medium block mt-1">Unique shoppers</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500 block mb-1">Total Revenue</span>
                    <span className="text-2xl font-bold text-slate-900">৳{totalRevenue.toLocaleString()}</span>
                    <span className="text-[11px] text-emerald-600 font-medium block mt-1">Net gross sales</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Sales Overview Chart (Minimal & Clean) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Sales Overview</h2>
                    <p className="text-xs text-slate-500">Revenue activity over the last 7 days</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    Last 7 Days
                  </span>
                </div>

                {/* Visual SVG Bar Chart */}
                <div className="pt-4">
                  <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 border-b border-slate-200 pb-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                      const dayVal = orders
                        .filter(o => new Date(o.created_at).getDay() === (idx + 1) % 7)
                        .reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
                      const maxVal = Math.max(1000, ...orders.map(o => Number(o.total_amount) || 0));
                      const heightPercent = dayVal > 0 ? Math.min(100, Math.round((dayVal / maxVal) * 90) + 10) : 4;
                      return (
                        <div key={idx} className="flex flex-col items-center gap-2 group">
                          <span className="text-[10px] font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition">
                            ৳{dayVal}
                          </span>
                          <div className="w-full bg-slate-100 rounded-t-lg flex items-end h-32 overflow-hidden">
                            <div 
                              style={{ height: `${heightPercent}%` }} 
                              className={`w-full rounded-t-lg transition-all duration-300 ${dayVal > 0 ? 'bg-indigo-600 group-hover:bg-indigo-500' : 'bg-slate-200'}`}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-slate-500 truncate w-full text-center">
                            {day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Recent Orders</h2>
                    <p className="text-xs text-slate-500">Latest customer transactions from storefront</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    View All Orders <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4 font-semibold">Order</th>
                        <th className="py-3 px-4 font-semibold">Customer</th>
                        <th className="py-3 px-4 font-semibold">Items</th>
                        <th className="py-3 px-4 font-semibold">Total Amount</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <ShoppingBag className="w-7 h-7 mx-auto text-slate-300 mb-2" />
                            <p className="font-semibold text-slate-700 text-xs">No customer orders yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Orders placed by customers on your live store will appear here immediately.</p>
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            #{order.order_number}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800 block">{order.customer_name}</span>
                            <span className="text-[11px] text-slate-400">{order.customer_phone}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {(Array.isArray(order.items) ? order.items : []).map(it => `${it?.name || 'Item'} (${it?.quantity || 1}x)`).join(', ')}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            ৳{order.total_amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            {renderStatusBadge(order.status)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* 2. PRODUCT MANAGEMENT SECTION                             */}
          {/* ========================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by title or SKU..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                {/* Category filter pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        productCategoryFilter === cat
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition whitespace-nowrap flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Categories
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4 font-semibold">Product Info</th>
                        <th className="py-3 px-4 font-semibold">Category</th>
                        <th className="py-3 px-4 font-semibold">Price (৳)</th>
                        <th className="py-3 px-4 font-semibold">Stock Quantity</th>
                        <th className="py-3 px-4 font-semibold">Stock Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block leading-tight">{prod.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">SKU: {prod.sku}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-600">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">৳{prod.price}</span>
                              <button
                                onClick={() => {
                                  const p = prompt(`Enter new price for ${prod.name}:`, prod.price.toString());
                                  if (p && !isNaN(Number(p))) updateProductPrice(prod.id, Number(p));
                                }}
                                className="text-slate-400 hover:text-indigo-600 p-1"
                                title="Quick Edit Price"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateProductStock(prod.id, prod.stock - 1)}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-bold text-slate-900">{prod.stock}</span>
                              <button
                                onClick={() => updateProductStock(prod.id, prod.stock + 1)}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {renderStockBadge(prod.stock)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditProduct(prod)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. ORDER MANAGEMENT SECTION                               */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Filter Tabs & Search */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Status Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
                  {[
                    { id: 'all', label: 'All Orders', count: orders.length },
                    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
                    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
                    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
                    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setOrderStatusFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                        orderStatusFilter === tab.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        orderStatusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Search & Export */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search by order #, phone..."
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <button
                    onClick={fetchLiveOrders}
                    disabled={isSyncing}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold whitespace-nowrap transition disabled:opacity-60 cursor-pointer"
                    title="Refresh orders from Supabase cloud database"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Orders'}</span>
                  </button>

                  <button
                    onClick={exportOrdersToCSV}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold whitespace-nowrap transition"
                    title="Export filtered orders to Excel/CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4 font-semibold">Order</th>
                        <th className="py-3 px-4 font-semibold">Customer</th>
                        <th className="py-3 px-4 font-semibold">Items</th>
                        <th className="py-3 px-4 font-semibold">Amount</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold">Update Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            No orders found in this view.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-900 block">#{order.order_number}</span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(order.created_at).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800 block">{order.customer_name}</span>
                              <span className="text-[11px] text-slate-400">{order.customer_phone}</span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                              {(Array.isArray(order.items) ? order.items : []).map(i => `${i?.name || 'Item'} (x${i?.quantity || 1})`).join(', ')}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              ৳{order.total_amount.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4">
                              {renderStatusBadge(order.status)}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-indigo-600"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                  title="View Full Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <a
                                  href={`https://wa.me/88${order.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${order.customer_name}, your FoodFlow order #${order.order_number} (৳${order.total_amount}) has been received!`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. INVENTORY SECTION                                      */}
          {/* ========================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              
              {/* 3 Inventory Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div 
                  onClick={() => setInventoryStockFilter('available')}
                  className={`p-5 rounded-2xl border cursor-pointer transition ${
                    inventoryStockFilter === 'available'
                      ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-medium text-slate-500 block mb-1">Available Stock</span>
                  <span className="text-2xl font-bold text-emerald-700">{availableStockProducts.length}</span>
                  <span className="text-[11px] text-slate-500 block mt-1">Healthy stock level (&gt; 10 units)</span>
                </div>

                <div 
                  onClick={() => setInventoryStockFilter('low')}
                  className={`p-5 rounded-2xl border cursor-pointer transition ${
                    inventoryStockFilter === 'low'
                      ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-medium text-slate-500 block mb-1">Low Stock Products</span>
                  <span className="text-2xl font-bold text-amber-700">{lowStockProducts.length}</span>
                  <span className="text-[11px] text-amber-600 block mt-1">Needs reordering soon (≤ 10 units)</span>
                </div>

                <div 
                  onClick={() => setInventoryStockFilter('out')}
                  className={`p-5 rounded-2xl border cursor-pointer transition ${
                    inventoryStockFilter === 'out'
                      ? 'bg-rose-50/50 border-rose-300 ring-2 ring-rose-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-medium text-slate-500 block mb-1">Out-of-Stock Products</span>
                  <span className="text-2xl font-bold text-rose-700">{outOfStockProducts.length}</span>
                  <span className="text-[11px] text-rose-600 block mt-1">0 inventory units remaining</span>
                </div>
              </div>

              {/* Stock Filter Bar */}
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Filter View:</span>
                  {(['all', 'available', 'low', 'out'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setInventoryStockFilter(f)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition ${
                        inventoryStockFilter === f
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f === 'all' ? 'All Inventory' : f}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Showing {filteredInventory.length} products
                </span>
              </div>

              {/* Stock Updates Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4 font-semibold">Product Name</th>
                        <th className="py-3 px-4 font-semibold">SKU</th>
                        <th className="py-3 px-4 font-semibold">Category</th>
                        <th className="py-3 px-4 font-semibold">Current Stock</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Quick Stock Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredInventory.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                            <span>{item.name}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{item.sku}</td>
                          <td className="py-3.5 px-4 text-slate-600">{item.category}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                            {item.stock} units
                          </td>
                          <td className="py-3.5 px-4">
                            {renderStockBadge(item.stock)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => updateProductStock(item.id, item.stock - 5)}
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600"
                                title="Reduce 5 units"
                              >
                                -5
                              </button>
                              <button
                                onClick={() => updateProductStock(item.id, item.stock - 1)}
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600"
                                title="Reduce 1 unit"
                              >
                                -1
                              </button>
                              <button
                                onClick={() => updateProductStock(item.id, item.stock + 1)}
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600"
                                title="Add 1 unit"
                              >
                                +1
                              </button>
                              <button
                                onClick={() => updateProductStock(item.id, item.stock + 10)}
                                className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold text-indigo-700"
                                title="Restock +10 units"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* 5. CUSTOMERS SECTION                                      */}
          {/* ========================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              
              {/* Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search customers by name, phone or email..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredCustomers.length} total customers
                </span>
              </div>

              {/* Customers Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4 font-semibold">Customer</th>
                        <th className="py-3 px-4 font-semibold">Contact Info</th>
                        <th className="py-3 px-4 font-semibold">Address</th>
                        <th className="py-3 px-4 font-semibold">Orders Count</th>
                        <th className="py-3 px-4 font-semibold">Total Spent</th>
                        <th className="py-3 px-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomers.map(cust => (
                        <tr key={cust.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                              {cust.name.charAt(0)}
                            </div>
                            <span>{cust.name}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800 block">{cust.phone}</span>
                            <span className="text-[11px] text-slate-400">{cust.email}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                            {cust.address}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {cust.total_orders} {cust.total_orders === 1 ? 'order' : 'orders'}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-700">
                            ৳{cust.total_spent.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedCustomer(cust)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition"
                            >
                              Customer Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* 6. SETTINGS SECTION                                       */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Store Information */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Building className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900">Store Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Store Name</label>
                    <input
                      type="text"
                      value={settingsForm.storeName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Store Description</label>
                    <textarea
                      value={settingsForm.description}
                      onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Store Logo */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Upload className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900">Store Logo</h2>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={settingsForm.logoUrl}
                    alt="Store Logo"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50"
                  />
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Logo Image URL</label>
                    <input
                      type="text"
                      value={settingsForm.logoUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Phone className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Customer Care Phone</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Official Email</label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Store Address / Warehouse Location</label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Charges */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900">Delivery Charges</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Inside Dhaka (৳)</label>
                    <input
                      type="number"
                      value={settingsForm.deliveryInsideDhaka}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryInsideDhaka: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Outside Dhaka (৳)</label>
                    <input
                      type="number"
                      value={settingsForm.deliveryOutsideDhaka}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryOutsideDhaka: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Free Delivery Above (৳)</label>
                    <input
                      type="number"
                      value={settingsForm.freeDeliveryThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900">Payment Methods</h2>
                </div>

                <div className="space-y-4">
                  {/* COD */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
                      <span className="text-[11px] text-slate-500">Allow customers to pay cash when product arrives</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.codEnabled}
                        onChange={(e) => setSettingsForm({ ...settingsForm, codEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* bKash */}
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-slate-800 block">bKash Payment</span>
                        <span className="text-[11px] text-slate-500">Enable mobile wallet payment via bKash</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsForm.bkashEnabled}
                          onChange={(e) => setSettingsForm({ ...settingsForm, bkashEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    {settingsForm.bkashEnabled && (
                      <input
                        type="text"
                        value={settingsForm.bkashNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                        placeholder="bKash Merchant/Personal Account Number"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    )}
                  </div>

                  {/* Nagad */}
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-slate-800 block">Nagad Payment</span>
                        <span className="text-[11px] text-slate-500">Enable mobile wallet payment via Nagad</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsForm.nagadEnabled}
                          onChange={(e) => setSettingsForm({ ...settingsForm, nagadEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    {settingsForm.nagadEnabled && (
                      <input
                        type="text"
                        value={settingsForm.nagadNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, nagadNumber: e.target.value })}
                        placeholder="Nagad Merchant/Personal Account Number"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Reset Demo Data Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <RefreshCw className="w-5 h-5 text-rose-600" />
                  <h2 className="text-sm font-bold text-slate-900">Reset Demo Data & Start Fresh</h2>
                </div>
                <p className="text-xs text-slate-500">
                  Clear all historical mock/demo orders and test customer records to begin with a clean ৳0 revenue baseline for real business. Product inventory and store settings will remain intact.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={handleResetDemoData}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Demo Orders (Reset to ৳0)
                  </button>
                </div>
              </div>

              {/* Submit Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition"
                >
                  <Save className="w-4 h-4" />
                  Save Store Settings
                </button>
              </div>

            </form>
          )}

        </div>
      </main>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT                                 */}
      {/* ========================================================= */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Pure Milk Butter (খাটি মাখন)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="e.g. DF-BUTTER-500"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Price (৳)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 850"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="e.g. 25"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Short Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={2}
                  placeholder="Farm-fresh details or ingredients..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MANAGE CATEGORIES                                  */}
      {/* ========================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Manage Product Categories</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name (e.g. Spices)"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Add
                </button>
              </form>

              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Existing Categories</span>
                {categories.filter(c => c !== 'All').map(c => (
                  <div key={c} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs font-medium text-slate-700">
                    <span>{c}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category "${c}"?`)) {
                          setCategories(prev => prev.filter(cat => cat !== c));
                          showToast(`Category "${c}" removed`);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DRAWER: ORDER DETAILS                                     */}
      {/* ========================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div id="printable-invoice" className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Order #{selectedOrder.order_number}</h3>
                <span className="text-xs text-slate-400">
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs">
              {/* Status Selector */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Current Status</span>
                  <div className="mt-1">{renderStatusBadge(selectedOrder.status)}</div>
                </div>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white font-medium"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 text-xs block">Customer Details</span>
                <div className="p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-slate-700">
                  <div className="font-bold text-slate-900 text-sm">{selectedOrder.customer_name}</div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedOrder.customer_phone}</span>
                  </div>
                  {selectedOrder.customer_email && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{selectedOrder.customer_email}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-1.5 text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{selectedOrder.customer_address}</span>
                  </div>
                </div>
              </div>

              {/* Items Purchased */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 text-xs block">Items Ordered</span>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  {(Array.isArray(selectedOrder.items) ? selectedOrder.items : []).map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800 block">{it.name}</span>
                        {it.variant && <span className="text-[10px] text-slate-400">{it.variant}</span>}
                        <span className="text-[11px] text-slate-500">Qty: {it.quantity} × ৳{it.price}</span>
                      </div>
                      <span className="font-bold text-slate-900">৳{it.quantity * it.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>৳{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charge:</span>
                  <span>৳{selectedOrder.delivery_fee}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount:</span>
                    <span>-৳{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span className="text-indigo-600">৳{selectedOrder.total_amount}</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-1">
                  Payment Method: <span className="font-medium text-slate-700">{selectedOrder.payment_method}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/88${selectedOrder.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Salam ${selectedOrder.customer_name}, confirming your order #${selectedOrder.order_number} for ৳${selectedOrder.total_amount}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-center flex items-center justify-center gap-1.5 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CUSTOMER DETAILS & PURCHASE HISTORY               */}
      {/* ========================================================= */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedCustomer.name}</h3>
                <span className="text-xs text-slate-400">Customer Profile</span>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs">
              {/* Profile Card */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-base flex items-center justify-center">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{selectedCustomer.name}</h4>
                    <span className="text-[11px] text-slate-400 block">{selectedCustomer.phone}</span>
                    <span className="text-[11px] text-slate-400 block">{selectedCustomer.email}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-slate-600 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                  <span>{selectedCustomer.address}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Total Orders</span>
                  <span className="text-lg font-bold text-slate-900">{selectedCustomer.total_orders}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Lifetime Spent</span>
                  <span className="text-lg font-bold text-emerald-700">৳{selectedCustomer.total_spent.toLocaleString()}</span>
                </div>
              </div>

              {/* Purchase History */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 text-xs block">Purchase History</span>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  {orders
                    .filter(o => o.customer_phone?.trim() === selectedCustomer.phone?.trim())
                    .map(ord => (
                      <div key={ord.id} className="p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">#{ord.order_number}</span>
                          <span className="font-bold text-slate-800">৳{ord.total_amount}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>{new Date(ord.created_at).toLocaleDateString()}</span>
                          {renderStatusBadge(ord.status)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
