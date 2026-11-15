'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Boxes,
  Globe,
  ShoppingBag,
  ScanLine,
  FileSpreadsheet,
  Tag,
  Gift,
  Star,
  Users,
  Package,
  Layers,
  Upload,
  Sparkles,
  BookOpen,
  Wrench,
  Receipt,
  CreditCard,
  UserCheck,
  Building,
  Truck,
  TrendingUp,
  BarChart3,
  Settings,
  Search,
  Bell,
  Plus,
  Tv,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  X,
  Volume2,
  VolumeX,
  Store,
  PieChart,
  Share2,
  Check,
  Calendar,
  Lock,
  Eye,
  Trash2,
  Printer,
  Download,
  Info,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { STORE_CONFIG } from '../../config';

// ── Realistic Demo Orders Data (DropX + StoreLine fusion) ─────────────
const INITIAL_DEMO_ORDERS = [
  {
    id: 'ord-1001',
    order_number: 'FF-1001',
    customer_name: 'Mahfuz Rahman',
    customer_phone: '01711223344',
    customer_email: 'mahfuz.rahman@gmail.com',
    customer_address: 'House 42, Road 9, Dhanmondi, Dhaka',
    delivery_area: 'Inside Dhaka',
    items: [
      { name: 'FoodFlow Pure Milk Butter', variant: '500g', price: 600, quantity: 1 },
      { name: 'FoodFlow Premium Danadar Ghee', variant: '250g', price: 440, quantity: 1 }
    ],
    subtotal: 1040,
    delivery_fee: 60,
    discount: 0,
    total_amount: 1100,
    payment_method: 'Cash on Delivery',
    payment_status: 'pending',
    status: 'pending',
    courier_tracking_id: null,
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    fraud_risk: 'safe',
  },
  {
    id: 'ord-1002',
    order_number: 'FF-1002',
    customer_name: 'Shakil Khan',
    customer_phone: '01899887766',
    customer_email: 'shakil.ctg@yahoo.com',
    customer_address: 'Chawkbazar, Chattogram',
    delivery_area: 'Outside Dhaka',
    items: [
      { name: 'FoodFlow Trio Breakfast Combo', variant: 'Full Combo Set', price: 990, quantity: 1 }
    ],
    subtotal: 990,
    delivery_fee: 120,
    discount: 0,
    total_amount: 1110,
    payment_method: 'Cash on Delivery',
    payment_status: 'pending',
    status: 'shipped',
    courier_tracking_id: 'SF-9481028',
    created_at: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    fraud_risk: 'safe',
  },
  {
    id: 'ord-1003',
    order_number: 'FF-1003',
    customer_name: 'Rumana Islam',
    customer_phone: '01900112233',
    customer_email: 'rumana.islam@outlook.com',
    customer_address: 'Uttara Sector 11, Dhaka',
    delivery_area: 'Inside Dhaka',
    items: [
      { name: 'FoodFlow Arabica Roast Coffee', variant: '250g', price: 780, quantity: 2 }
    ],
    subtotal: 1560,
    delivery_fee: 0,
    discount: 100,
    total_amount: 1460,
    payment_method: 'bKash',
    payment_status: 'paid',
    status: 'delivered',
    courier_tracking_id: 'SF-9480192',
    created_at: new Date(Date.now() - 1000 * 60 * 250).toISOString(),
    fraud_risk: 'safe',
  },
  {
    id: 'ord-1004',
    order_number: 'FF-1004',
    customer_name: 'Tanvir Hossain',
    customer_phone: '01677889900',
    customer_email: 'tanvir.hossain@gmail.com',
    customer_address: 'Mirpur DOHS, Road 4, House 12',
    delivery_area: 'Inside Dhaka',
    items: [
      { name: 'FoodFlow Premium Danadar Ghee', variant: '1kg', price: 1590, quantity: 1 }
    ],
    subtotal: 1590,
    delivery_fee: 0,
    discount: 0,
    total_amount: 1590,
    payment_method: 'Cash on Delivery',
    payment_status: 'pending',
    status: 'confirmed',
    courier_tracking_id: null,
    created_at: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    fraud_risk: 'safe',
  },
  {
    id: 'ord-1005',
    order_number: 'FF-1005',
    customer_name: 'Farhana Akter',
    customer_phone: '01511224466',
    customer_email: 'farhana.akter@gmail.com',
    customer_address: 'Zindabazar, Sylhet',
    delivery_area: 'Outside Dhaka',
    items: [
      { name: 'FoodFlow Pure Milk Butter', variant: '1kg', price: 1150, quantity: 1 },
      { name: 'FoodFlow Arabica Roast Coffee', variant: '100g', price: 350, quantity: 1 }
    ],
    subtotal: 1500,
    delivery_fee: 0,
    discount: 150,
    total_amount: 1350,
    payment_method: 'bKash',
    payment_status: 'paid',
    status: 'shipped',
    courier_tracking_id: 'SF-9482201',
    created_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    fraud_risk: 'safe',
  }
];

export default function StoreLineProDashboard() {
  // Navigation & View
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'orders' | 'inventory' | 'settings'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [storeName, setStoreName] = useState('Dhakai Food');
  
  // Data State
  const [useDemoData, setUseDemoData] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [inspectingOrder, setInspectingOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters & Controls
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState('Today');
  const [hourlyFilter, setHourlyFilter] = useState<'Combined' | 'Today' | 'Yesterday'>('Combined');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  // Modals & UI Toggles
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [notificationsBanner, setNotificationsBanner] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Audio order chime
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  };

  // Sync Supabase & LocalStorage
  const loadOrders = async () => {
    setLoading(true);
    let localSaved: any[] = [];
    try {
      localSaved = JSON.parse(localStorage.getItem('foodflow_local_orders') || '[]');
    } catch (e) {}

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const merged = [...localSaved, ...data];
        const unique = Array.from(new Map(merged.map(item => [item.order_number, item])).values());
        setOrders(unique);
      } else if (localSaved.length > 0) {
        setOrders(localSaved);
      } else if (useDemoData) {
        setOrders(INITIAL_DEMO_ORDERS);
      } else {
        setOrders([]);
      }
    } catch (err) {
      if (useDemoData) setOrders(INITIAL_DEMO_ORDERS);
      else if (localSaved.length > 0) setOrders(localSaved);
      else setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const handleLocalOrder = (e: any) => {
      if (e.detail) {
        playChime();
        setOrders(prev => [e.detail, ...prev]);
        triggerToast(`New Order Received: #${e.detail.order_number}!`);
      }
    };

    window.addEventListener('foodflow_new_order', handleLocalOrder);
    return () => window.removeEventListener('foodflow_new_order', handleLocalOrder);
  }, [useDemoData]);

  // Keyboard shortcut listener (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowFilterModal(false);
        setShowUpgradeModal(false);
        setShowQuickAddModal(false);
        setInspectingOrder(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered Orders for Table
  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (paymentFilter !== 'all') {
        const isPaid = o.payment_status === 'paid' || o.payment_method?.toLowerCase().includes('bkash');
        if (paymentFilter === 'paid' && !isPaid) return false;
        if (paymentFilter === 'cod' && isPaid) return false;
      }
      if (
        q &&
        !o.customer_name?.toLowerCase().includes(q) &&
        !o.order_number?.toLowerCase().includes(q) &&
        !o.customer_phone?.includes(q) &&
        !o.customer_address?.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Status updates
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    triggerToast(`Order status updated to "${newStatus}"`);
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    } catch (e) {}
  };

  // Steadfast dispatch booking
  const handleDispatchSteadfast = async (orderId: string) => {
    setDispatchingId(orderId);
    try {
      await new Promise(r => setTimeout(r, 700));
      const trackingCode = 'SF-' + Math.floor(1000000 + Math.random() * 9000000);
      setOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        status: 'shipped',
        courier_tracking_id: trackingCode
      } : o));
      triggerToast(`Steadfast Parcel Booked: ${trackingCode}`);
    } finally {
      setDispatchingId(null);
    }
  };

  // Bulk actions
  const toggleSelectAll = () => {
    if (selectedOrderIds.size === paginatedOrders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(paginatedOrders.map(o => o.id)));
    }
  };

  const toggleSelectOrder = (id: string) => {
    const next = new Set(selectedOrderIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedOrderIds(next);
  };

  const handleBulkStatus = (status: string) => {
    setOrders(prev => prev.map(o => selectedOrderIds.has(o.id) ? { ...o, status } : o));
    triggerToast(`Marked ${selectedOrderIds.size} orders as ${status}`);
    setSelectedOrderIds(new Set());
  };

  // Metrics Calculation
  const totalOrdersCount = orders.length;
  const bookedSales = orders
    .filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'shipped')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const deliveredSales = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const totalEstimatedSales = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const placedCount = orders.length;
  const shippedCount = orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length;

  return (
    <div 
      className="flex min-h-screen bg-[#F8FAFC] text-slate-800 text-[13px] antialiased selection:bg-[#606BDF] selection:text-white"
      style={{ fontFamily: 'Archivo, Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      {/* ── LEFT FIXED SIDEBAR (240px) ─────────────────────────────── */}
      <aside 
        className={`${
          sidebarCollapsed ? 'w-16' : 'w-[240px]'
        } bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 sticky top-0 h-screen transition-all duration-200 z-30 select-none`}
      >
        {/* Brand Switcher */}
        <div className="h-16 px-4 border-b border-[#E2E8F0] flex items-center justify-between">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#606BDF] text-white font-black text-sm flex items-center justify-center shadow-sm shrink-0">
                {storeName.charAt(0)}
              </div>
              <div className="leading-tight truncate">
                <span className="font-bold text-slate-900 text-sm block tracking-tight truncate">
                  {storeName}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">StoreLine Merchant</span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#606BDF] text-white font-black text-sm flex items-center justify-center mx-auto shadow-sm">
              {storeName.charAt(0)}
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition shrink-0"
            title="Toggle Sidebar"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 px-2.5 py-3 space-y-4 overflow-y-auto custom-scrollbar text-xs font-medium text-slate-600">
          {/* Operations */}
          <div>
            {!sidebarCollapsed && (
              <div className="px-2.5 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Operations
              </div>
            )}
            <div className="space-y-0.5">
              <button
                onClick={() => setCurrentTab('dashboard')}
                title="Dashboard"
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition ${
                  currentTab === 'dashboard'
                    ? 'bg-[#606BDF]/10 text-[#606BDF] font-semibold'
                    : 'hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${currentTab === 'dashboard' ? 'text-[#606BDF]' : 'text-slate-400'}`} />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>

              <button
                onClick={() => setCurrentTab('inventory')}
                title="Inventory Dashboard"
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition ${
                  currentTab === 'inventory'
                    ? 'bg-[#606BDF]/10 text-[#606BDF] font-semibold'
                    : 'hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <Boxes className="w-4 h-4 shrink-0 text-slate-400" />
                {!sidebarCollapsed && <span>Inventory Dashboard</span>}
              </button>

              <button
                onClick={() => setCurrentTab('orders')}
                title="Web Orders"
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition ${
                  currentTab === 'orders'
                    ? 'bg-[#606BDF]/10 text-[#606BDF] font-semibold'
                    : 'hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Globe className={`w-4 h-4 shrink-0 ${currentTab === 'orders' ? 'text-[#606BDF]' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span>Web Orders</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                    {totalOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('orders')}
                title="Orders"
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100/70 transition"
              >
                <ShoppingBag className="w-4 h-4 shrink-0 text-slate-400" />
                {!sidebarCollapsed && <span>Orders</span>}
              </button>

              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-400 cursor-not-allowed">
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-4 h-4 text-slate-400" />
                  {!sidebarCollapsed && <span>Point of Sale</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                    Pro
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100/70 cursor-pointer">
                <ScanLine className="w-4 h-4 text-slate-400" />
                {!sidebarCollapsed && <span>Order Scan</span>}
              </div>

              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-400 cursor-not-allowed">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                  {!sidebarCollapsed && <span>Purchase Orders</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                    Pro
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-400 cursor-not-allowed">
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-slate-400" />
                  {!sidebarCollapsed && <span>Point of Purchase</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                    Pro
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100/70 cursor-pointer">
                <Tag className="w-4 h-4 text-slate-400" />
                {!sidebarCollapsed && <span>Coupons</span>}
              </div>

              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-400 cursor-not-allowed">
                <div className="flex items-center gap-2.5">
                  <Gift className="w-4 h-4 text-slate-400" />
                  {!sidebarCollapsed && <span>Offers</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                    Pro
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-400 cursor-not-allowed">
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-slate-400" />
                  {!sidebarCollapsed && <span>Reviews</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                    Pro
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100/70 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  {!sidebarCollapsed && <span>People</span>}
                </div>
                {!sidebarCollapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div>
            {!sidebarCollapsed && (
              <div className="px-2.5 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Inventory
              </div>
            )}
            <div className="space-y-0.5">
              <button
                onClick={() => setCurrentTab('inventory')}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100/70 transition"
              >
                <Package className="w-4 h-4 text-slate-400" />
                {!sidebarCollapsed && <span>Products</span>}
              </button>

              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-400 cursor-not-allowed">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-slate-400" />
                  {!sidebarCollapsed && <span>Digital Products</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                    Pro
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100/70 cursor-pointer">
                <Upload className="w-4 h-4 text-slate-400" />
                {!sidebarCollapsed && <span>Import Product</span>}
              </div>

              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100/70 cursor-pointer">
                <Sparkles className="w-4 h-4 text-slate-400" />
                {!sidebarCollapsed && <span>Upsell Products</span>}
              </div>

              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100/70 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  {!sidebarCollapsed && <span>Catalog</span>}
                </div>
                {!sidebarCollapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>

              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100/70 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Wrench className="w-4 h-4 text-slate-400" />
                  {!sidebarCollapsed && <span>Stock Tools</span>}
                </div>
                {!sidebarCollapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </div>
          </div>

          {/* Accounting Section */}
          <div>
            {!sidebarCollapsed && (
              <div className="px-2.5 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Accounting
              </div>
            )}
            <div className="space-y-0.5">
              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-400 cursor-not-allowed">
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-4 h-4 text-slate-400" />
                  {!sidebarCollapsed && <span>Transactions</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                    Pro
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100/70 cursor-pointer">
                <CreditCard className="w-4 h-4 text-slate-400" />
                {!sidebarCollapsed && <span>Expenses</span>}
              </div>

              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-400 cursor-not-allowed">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  {!sidebarCollapsed && <span>Payroll</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                    Pro
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-400 cursor-not-allowed">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-slate-400" />
                  {!sidebarCollapsed && <span>Courier payments</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                    Pro
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Reports */}
          <div>
            {!sidebarCollapsed && (
              <div className="px-2.5 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Reports
              </div>
            )}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100/70 cursor-pointer">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                {!sidebarCollapsed && <span>Profit & Sales</span>}
              </div>
              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100/70 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  {!sidebarCollapsed && <span>More Reports</span>}
                </div>
                {!sidebarCollapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Settings Button */}
        <div className="p-2 border-t border-[#E2E8F0]">
          <button
            onClick={() => setCurrentTab('settings')}
            title="Settings"
            className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-left transition ${
              currentTab === 'settings'
                ? 'bg-[#606BDF]/10 text-[#606BDF] font-semibold'
                : 'hover:bg-slate-100/70 text-slate-700'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
        </div>
      </aside>

      {/* ── RIGHT MAIN CANVAS ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar (64px) */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hover:text-slate-800 cursor-pointer">Home</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-900 font-semibold capitalize">
              {currentTab === 'orders' ? 'Web Orders' : currentTab}
            </span>
          </div>

          {/* Right Header Navigation & Tools */}
          <div className="flex items-center gap-3">
            {/* Global Search Input with ⌘ K */}
            <div 
              onClick={() => setShowCommandPalette(true)}
              className="relative w-64 hidden md:flex items-center bg-slate-50 border border-slate-200/90 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-white hover:border-slate-300 transition text-xs text-slate-400"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <span className="flex-1 truncate">Search orders, customers...</span>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 border border-slate-200 bg-white">
                ⌘ K
              </kbd>
            </div>

            {/* Zero Data / Demo Data Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => {
                  setUseDemoData(false);
                  triggerToast('Switched to Zero Data state');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  !useDemoData ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Zero Data
              </button>
              <button
                onClick={() => {
                  setUseDemoData(true);
                  triggerToast('Loaded Dhakai Food demo metrics!');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  useDemoData ? 'bg-[#606BDF] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Demo Data
              </button>
            </div>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-1 pl-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                title={soundEnabled ? 'Chime ON' : 'Muted'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>

              <Link
                href="/"
                target="_blank"
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                title="View Live Storefront"
              >
                <Tv className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setShowQuickAddModal(true)}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                title="Quick Add Action"
              >
                <Plus className="w-4 h-4" />
              </button>

              <button
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5"></span>
              </button>
            </div>

            {/* User Profile Avatar "EJ" */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div 
                className="w-8 h-8 rounded-full bg-[#606BDF]/15 text-[#606BDF] font-black text-xs flex items-center justify-center border border-[#606BDF]/20 shadow-sm cursor-pointer"
                title="Emtiaz Jahan (Owner)"
              >
                EJ
              </div>
            </div>
          </div>
        </header>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl font-medium text-xs flex items-center gap-2 border border-slate-800 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── VIEW 1: DASHBOARD (EXACT SCREENSHOT MATCH) ───────────── */}
        {currentTab === 'dashboard' && (
          <main className="p-6 space-y-5 max-w-[1440px] w-full">
            {/* Header & Controls */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-xs text-slate-500 mt-0.5">All orders · {dateRange}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowFilterModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Filters</span>
                </button>
                <button
                  onClick={() => loadOrders()}
                  className="p-1.5 bg-white border border-[#E2E8F0] rounded-xl text-slate-700 hover:bg-slate-50 transition shadow-sm"
                  title="Refresh"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Promotional Banner Card */}
            <div className="bg-gradient-to-r from-[#EFF6FF] via-[#F5F3FF] to-[#FAF5FF] rounded-2xl border border-[#606BDF]/20 p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#606BDF]/15 text-[#606BDF] border border-[#606BDF]/20">
                  Intro offer
                </span>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Get Pro for ৳297 — first 3 months
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#606BDF] stroke-[2.5]" />
                    <span>৳99/month for 3 months</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#606BDF] stroke-[2.5]" />
                    <span>Then ৳1,490/month</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#606BDF] stroke-[2.5]" />
                    <span>Full refund within 7 days</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 shrink-0">
                <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-[#606BDF]/40 flex flex-col items-center justify-center text-center bg-white/70 shadow-sm">
                  <span className="text-[17px] font-black text-[#606BDF] leading-none">7</span>
                  <span className="text-[7px] text-[#606BDF] uppercase font-extrabold tracking-wider mt-0.5">Days</span>
                  <div className="text-[5px] text-slate-400 font-bold uppercase tracking-tighter">Guarantee</div>
                </div>

                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#606BDF] hover:bg-[#505BCF] text-white font-bold text-xs shadow-md shadow-[#606BDF]/20 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Pro · ৳297 / 3 months</span>
                </button>
              </div>
            </div>

            {/* Dismissible Browser Notification Bar */}
            {notificationsBanner && (
              <div className="bg-[#F0FDFA] border border-[#CCFBF1] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-[#0F766E]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#0D9488]" />
                  <span>Notifications are off on this browser</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => triggerToast('Browser notifications enabled')}
                    className="font-bold underline hover:text-[#115E59]"
                  >
                    Turn on
                  </button>
                  <button 
                    onClick={() => setNotificationsBanner(false)} 
                    className="text-[#0D9488] hover:text-[#115E59]"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 4-Column KPI Summary Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Orders */}
              <div className="bg-white p-4.5 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                    <span>Orders</span>
                    <Info className="w-3 h-3 text-slate-300 cursor-help" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {totalOrdersCount}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#606BDF] flex items-center justify-center">
                  <Boxes className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2: Booked sales */}
              <div className="bg-white p-4.5 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                    <span>Booked sales</span>
                    <Info className="w-3 h-3 text-slate-300 cursor-help" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    ৳{bookedSales.toLocaleString()}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3: Delivered sales */}
              <div className="bg-white p-4.5 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                    <span>Delivered sales</span>
                    <Info className="w-3 h-3 text-slate-300 cursor-help" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    ৳{deliveredSales.toLocaleString()}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              {/* Card 4: Estimate from orders */}
              <div className="bg-white p-4.5 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                    <span>Estimate from orders</span>
                    <Info className="w-3 h-3 text-slate-300 cursor-help" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    ৳{totalEstimatedSales.toLocaleString()}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Middle Analytics Row (2/3 + 1/3 Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left (8 cols) — Order Volume */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Order Volume</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Placed vs now shipped or delivered · all statuses · {dateRange}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Placed</span>
                      <p className="text-sm font-bold text-slate-900">{placedCount}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Shipped / delivered</span>
                      <p className="text-sm font-bold text-slate-900">{shippedCount}</p>
                    </div>
                  </div>
                </div>

                {/* SVG Chart */}
                <div className="h-56 w-full pt-4 flex flex-col justify-between">
                  <div className="flex-1 border-b border-dashed border-slate-200 relative flex items-end">
                    {totalOrdersCount > 0 ? (
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
                        <line x1="0" y1="35" x2="500" y2="35" stroke="#F1F5F9" strokeDasharray="4 4" />
                        <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F5F9" strokeDasharray="4 4" />
                        <line x1="0" y1="115" x2="500" y2="115" stroke="#F1F5F9" strokeDasharray="4 4" />
                        <path d="M 0,150 L 0,120 Q 150,90 280,50 T 500,30 L 500,150 Z" fill="rgba(96, 107, 223, 0.08)" />
                        <path d="M 0,120 Q 150,90 280,50 T 500,30" fill="none" stroke="#606BDF" strokeWidth="2.5" />
                        <path d="M 0,135 Q 150,115 280,85 T 500,65" fill="none" stroke="#F97316" strokeWidth="2.5" />
                      </svg>
                    ) : (
                      <div className="w-full h-full flex flex-col justify-between">
                        <line x1="0" y1="35" x2="500" y2="35" stroke="#F1F5F9" strokeDasharray="4 4" />
                        <div className="w-full h-0.5 bg-slate-200 self-end"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 font-mono">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-medium">
                    <span></span>
                    <span className="text-slate-600 font-semibold">15 Nov</span>
                    <span></span>
                  </div>
                  <div className="flex items-center justify-center gap-6 pt-3 text-[11px] font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#606BDF]"></span>
                      <span>Placed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                      <span>Now shipped / delivered</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right (4 cols) — Web Order Report */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Web Order Report</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">All statuses · {dateRange}</p>
                </div>

                {totalOrdersCount === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 mx-auto flex items-center justify-center text-slate-400 mb-2.5">
                      <BarChart3 className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">No data available</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">No report metrics recorded for today</p>
                  </div>
                ) : (
                  <div className="py-6 space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-[#606BDF]"></span>
                        Direct Web Orders
                      </span>
                      <span className="font-bold text-slate-900">75%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-[#606BDF] h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium pt-2">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        WhatsApp Orders
                      </span>
                      <span className="font-bold text-slate-900">25%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Conversion Rate</span>
                  <span className="font-semibold text-slate-800">{totalOrdersCount > 0 ? '4.2%' : '0%'}</span>
                </div>
              </div>
            </div>

            {/* Lower Analytics Row (2/3 + 1/3 Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left (8 cols) — Hourly Web Orders */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Hourly Web Orders</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">2026-11-15 vs 2026-11-14</p>
                  </div>
                  <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[11px] font-semibold text-slate-600">
                    {(['Combined', 'Today', 'Yesterday'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setHourlyFilter(mode)}
                        className={`px-3 py-1 rounded-md transition ${
                          hourlyFilter === mode
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'hover:text-slate-900'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-44 w-full pt-4 flex flex-col justify-between">
                  <div className="flex-1 border-b border-dashed border-slate-200 relative flex items-end">
                    {totalOrdersCount > 0 ? (
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
                        {(hourlyFilter === 'Combined' || hourlyFilter === 'Today') && (
                          <path d="M 0,90 Q 120,70 250,40 T 500,15" fill="none" stroke="#606BDF" strokeWidth="2.5" />
                        )}
                        {(hourlyFilter === 'Combined' || hourlyFilter === 'Yesterday') && (
                          <path d="M 0,95 Q 120,85 250,60 T 500,40" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
                        )}
                      </svg>
                    ) : (
                      <div className="w-full h-0.5 bg-slate-200 self-end"></div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 font-mono">
                    <span>12 AM</span>
                    <span>3 AM</span>
                    <span>6 AM</span>
                    <span>9 AM</span>
                    <span>12 PM</span>
                    <span>3 PM</span>
                    <span>6 PM</span>
                    <span>9 PM</span>
                  </div>
                  <div className="flex items-center justify-center gap-6 pt-3 text-[11px] font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-0.5 bg-[#606BDF]"></span>
                      <span>Today</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-0.5 border-t border-dashed border-slate-400"></span>
                      <span>Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right (4 cols) — Top Products */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Top Products</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">All · {dateRange}</p>
                </div>

                {totalOrdersCount === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 mx-auto flex items-center justify-center text-slate-400 mb-2.5">
                      <Package className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">No data available</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Top performing items will display here</p>
                  </div>
                ) : (
                  <div className="space-y-3 py-2">
                    {[
                      { name: 'FoodFlow Pure Milk Butter (500g)', rev: '৳16,800' },
                      { name: 'FoodFlow Premium Danadar Ghee (1kg)', rev: '৳30,210' },
                      { name: 'FoodFlow Arabica Roast Coffee (250g)', rev: '৳11,700' },
                    ].map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="w-5 h-5 rounded-md bg-[#606BDF]/10 text-[#606BDF] font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-slate-800 truncate">{p.name}</span>
                        </div>
                        <span className="font-bold text-slate-900 shrink-0">{p.rev}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div 
                  onClick={() => setCurrentTab('inventory')}
                  className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#606BDF] font-semibold cursor-pointer hover:underline"
                >
                  <span>View all products</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Bottom 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Col 1 — Orders by Source */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Orders by Source</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">All · {dateRange}</p>
                </div>

                {totalOrdersCount === 0 ? (
                  <div className="py-10 text-center text-slate-400">
                    <PieChart className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                    <p className="text-xs font-semibold text-slate-600">No data available</p>
                  </div>
                ) : (
                  <div className="space-y-3 py-3">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-700">Direct Storefront Web</span>
                        <span className="font-bold text-slate-900">72%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-[#606BDF] h-1.5 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-700">WhatsApp 1-Click Orders</span>
                        <span className="font-bold text-slate-900">28%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  Tracking direct website vs marketing referrals
                </div>
              </div>

              {/* Col 2 — Sales by marketing channel */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Sales by marketing channel</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">All · {dateRange}</p>
                </div>

                {totalOrdersCount === 0 ? (
                  <div className="py-10 text-center text-slate-400">
                    <Share2 className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                    <p className="text-xs font-semibold text-slate-600">No data available</p>
                  </div>
                ) : (
                  <div className="space-y-2 py-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Facebook Organic:</span>
                      <span className="font-bold text-slate-900">৳6,400</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Google Search:</span>
                      <span className="font-bold text-slate-900">৳8,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Direct Customer:</span>
                      <span className="font-bold text-slate-900">৳6,600</span>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  UTM campaign parameter attribution
                </div>
              </div>

              {/* Col 3 — Subscription Card */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">Free Plan</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Free until you buy a plan
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Plan usage</span>
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                        <span>Products</span>
                        <span className="font-bold text-slate-900">5 / 30</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-[#606BDF] h-2 rounded-full" style={{ width: '16.6%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                        <span>Staff accounts</span>
                        <span className="font-bold text-slate-900">0 / 0</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-slate-300 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full py-2.5 rounded-xl bg-[#606BDF] hover:bg-[#505BCF] text-white font-bold text-xs transition shadow-sm shadow-[#606BDF]/20"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ── VIEW 2: WEB ORDERS (DROPX FULL SUITE TABLE) ───────────── */}
        {currentTab === 'orders' && (
          <main className="p-6 space-y-5 max-w-[1440px] w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Web Orders</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage customer orders, call verification, invoice inspection & Steadfast courier
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadOrders()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Open Storefront</span>
                </Link>
              </div>
            </div>

            {/* DropX Advanced Filter & Search Row */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name, phone, order #, address..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#606BDF] transition"
                  />
                </div>

                {/* Status Tabs with DropX Colored Indicator Dots */}
                <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  {[
                    { id: 'all', label: 'All', dot: 'bg-slate-400' },
                    { id: 'pending', label: 'Pending', dot: 'bg-amber-400' },
                    { id: 'confirmed', label: 'Confirmed', dot: 'bg-blue-500' },
                    { id: 'shipped', label: 'In Courier', dot: 'bg-purple-500' },
                    { id: 'delivered', label: 'Delivered', dot: 'bg-emerald-500' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setStatusFilter(tab.id);
                        setCurrentPage(1);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                        statusFilter === tab.id
                          ? 'bg-[#606BDF] text-white shadow-sm'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === tab.id ? 'bg-white' : tab.dot}`}></span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bulk Action Strip (When orders selected) */}
              {selectedOrderIds.size > 0 && (
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between animate-fadeIn text-xs text-indigo-900">
                  <div className="flex items-center gap-2 font-bold">
                    <span>{selectedOrderIds.size} orders selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBulkStatus('delivered')}
                      className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Mark Delivered
                    </button>
                    <button
                      onClick={() => handleBulkStatus('shipped')}
                      className="px-2.5 py-1 rounded-md bg-[#606BDF] hover:bg-[#505BCF] text-white font-bold"
                    >
                      Mark In Courier
                    </button>
                    <button
                      onClick={() => setSelectedOrderIds(new Set())}
                      className="px-2 py-1 rounded-md text-slate-500 hover:text-slate-800"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Orders Table Container */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-[#E2E8F0] uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={paginatedOrders.length > 0 && selectedOrderIds.size === paginatedOrders.length}
                          onChange={toggleSelectAll}
                          className="rounded border-slate-300 text-[#606BDF] focus:ring-[#606BDF] cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer & Phone</th>
                      <th className="py-3 px-4">Address / Area</th>
                      <th className="py-3 px-4">Items Summary</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions & Courier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-14 text-center text-slate-400">
                          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-slate-700">No matching orders found</p>
                          <p className="text-xs text-slate-400 mt-1">Try switching to Demo Data or placing a test order on the storefront.</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((order) => {
                        const cleanPhone = order.customer_phone?.replace(/\D/g, '') || '';
                        const whatsappUrl = `https://wa.me/88${cleanPhone}?text=${encodeURIComponent(
                          `আসসালামু আলাইকুম ${order.customer_name}, FoodFlow থেকে আপনার অর্ডার #${order.order_number} নিয়ে যোগাযোগ করা হয়েছে।`
                        )}`;
                        const isSelected = selectedOrderIds.has(order.id);

                        return (
                          <tr key={order.id} className={`hover:bg-slate-50/80 transition ${isSelected ? 'bg-indigo-50/30' : ''}`}>
                            <td className="py-3.5 px-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectOrder(order.id)}
                                className="rounded border-slate-300 text-[#606BDF] focus:ring-[#606BDF] cursor-pointer"
                              />
                            </td>

                            {/* Order Number & Time */}
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              <span 
                                onClick={() => setInspectingOrder(order)}
                                className="bg-slate-100 hover:bg-[#606BDF]/15 hover:text-[#606BDF] px-2 py-1 rounded text-slate-800 cursor-pointer transition block w-fit"
                              >
                                #{order.order_number}
                              </span>
                              <span className="block text-[10px] text-slate-400 mt-1 font-sans">
                                {order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                              </span>
                            </td>

                            {/* Customer & Phone */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900 text-xs">{order.customer_name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <a
                                  href={`tel:${order.customer_phone}`}
                                  className="text-slate-500 font-mono text-[11px] hover:text-[#606BDF] flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  {order.customer_phone}
                                </a>
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold flex items-center gap-0.5"
                                  title="WhatsApp"
                                >
                                  <MessageCircle className="w-2.5 h-2.5 text-emerald-600" />
                                  WA
                                </a>
                              </div>
                            </td>

                            {/* Address & Zone */}
                            <td className="py-3.5 px-4 max-w-xs text-slate-600">
                              <div className="truncate text-xs">{order.customer_address || order.delivery_address}</div>
                              <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                {order.delivery_area || 'Inside Dhaka'}
                              </span>
                            </td>

                            {/* Items */}
                            <td className="py-3.5 px-4 text-slate-700 max-w-[200px]">
                              {Array.isArray(order.items) && order.items.length > 0 ? (
                                <div className="space-y-0.5">
                                  {order.items.map((item: any, i: number) => (
                                    <div key={i} className="text-[11px] truncate">
                                      • {item.name || item.variant} <span className="text-slate-400 font-mono">x{item.quantity}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400 text-xs">Standard items</span>
                              )}
                            </td>

                            {/* Total Amount & Payment */}
                            <td className="py-3.5 px-4">
                              <div className="font-extrabold text-slate-900 text-sm">
                                ৳{Number(order.total_amount).toLocaleString()}
                              </div>
                              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                order.payment_status === 'paid' || order.payment_method === 'bKash'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {order.payment_method === 'cod' ? 'COD' : order.payment_method || 'COD'}
                              </span>
                            </td>

                            {/* Status Dropdown */}
                            <td className="py-3.5 px-4">
                              <select
                                value={order.status || 'pending'}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                className={`text-[11px] font-bold rounded-lg px-2 py-1 border transition cursor-pointer ${
                                  order.status === 'delivered'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : order.status === 'shipped'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : order.status === 'confirmed'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                <option value="pending">pending</option>
                                <option value="confirmed">confirmed</option>
                                <option value="shipped">shipped</option>
                                <option value="delivered">delivered</option>
                                <option value="cancelled">cancelled</option>
                              </select>
                            </td>

                            {/* Fulfillment Action & Invoice */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setInspectingOrder(order)}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                  title="View Full Order Invoice"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                {order.courier_tracking_id ? (
                                  <div className="text-right">
                                    <span className="text-[10px] font-mono font-bold text-slate-700 block">
                                      {order.courier_tracking_id}
                                    </span>
                                    <span className="text-[9px] text-purple-700 font-bold block">
                                      Steadfast
                                    </span>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleDispatchSteadfast(order.id)}
                                    disabled={dispatchingId === order.id}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition inline-flex items-center gap-1 shadow-sm"
                                  >
                                    <Truck className="w-3 h-3" />
                                    <span>{dispatchingId === order.id ? 'Booking...' : 'Book'}</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* DropX Pagination Bar */}
              <div className="px-5 py-3 border-t border-[#E2E8F0] bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                <div>
                  Showing <span className="font-bold text-slate-900">{filteredOrders.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}</span> to{' '}
                  <span className="font-bold text-slate-900">{Math.min(currentPage * PAGE_SIZE, filteredOrders.length)}</span> of{' '}
                  <span className="font-bold text-slate-900">{filteredOrders.length}</span> orders
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-mono text-slate-700 font-bold">{currentPage} / {pageCount}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                    disabled={currentPage === pageCount}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ── VIEW 3: INVENTORY ──────────────────────────────────── */}
        {currentTab === 'inventory' && (
          <main className="p-6 space-y-5 max-w-[1440px] w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Products & Inventory</h1>
                <p className="text-xs text-slate-500 mt-0.5">Manage organic food catalog, stock levels, and pricing</p>
              </div>
              <button 
                onClick={() => setShowQuickAddModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#606BDF] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: 'FoodFlow Pure Milk Butter', cat: 'Dairy', weight: '250g / 500g / 1kg', price: '৳320 - ৳1,150', stock: 48 },
                { name: 'FoodFlow Premium Danadar Cow Ghee', cat: 'Pure Ghee', weight: '250g / 500g / 1kg', price: '৳440 - ৳1,590', stock: 32 },
                { name: 'FoodFlow Arabica Roast Coffee', cat: 'Beverage', weight: '100g / 250g / 500g', price: '৳350 - ৳1,450', stock: 24 },
              ].map((p, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{p.cat}</span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{p.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{p.weight}</p>
                    <div className="text-base font-black text-emerald-600 mt-3">{p.price}</div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4 text-xs">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                      In Stock ({p.stock} units)
                    </span>
                    <button onClick={() => triggerToast(`Editing ${p.name}`)} className="text-[#606BDF] font-bold hover:underline">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* ── VIEW 4: SETTINGS ──────────────────────────────────── */}
        {currentTab === 'settings' && (
          <main className="p-6 space-y-6 max-w-[1200px] w-full">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">General Settings</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage store name, order number formats, and business contacts</p>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Site Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Store name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#606BDF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tagline</label>
                  <input
                    type="text"
                    defaultValue="খাঁটি ও পুষ্টিকর খাবারের বিশ্বস্ত অনলাইন শপ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#606BDF]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Order Numbers</h3>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Order number prefix</label>
                <input
                  type="text"
                  defaultValue="FF-"
                  className="w-64 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
                />
                <p className="text-[11px] text-slate-400 mt-1">Preview: FF-1001</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    defaultValue={STORE_CONFIG.supportPhone}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="text"
                    defaultValue="support@foodflow.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Address</label>
                  <input
                    type="text"
                    defaultValue="Dhanmondi, Dhaka, Bangladesh"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Opening hours</label>
                  <input
                    type="text"
                    defaultValue="9:00 AM - 10:00 PM (Daily)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* ── MODAL 1: ORDER INVOICE / DETAILS DRAWER (DropX Feature) ── */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl p-6 space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#606BDF]/15 text-[#606BDF] font-mono font-bold text-xs flex items-center justify-center">
                  FF
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Order #{inspectingOrder.order_number}</h3>
                  <span className="text-[11px] text-slate-400">Placed on {new Date(inspectingOrder.created_at || Date.now()).toLocaleDateString('bn-BD')}</span>
                </div>
              </div>
              <button onClick={() => setInspectingOrder(null)} className="text-slate-400 hover:text-slate-600 p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Customer</span>
                <p className="font-bold text-slate-900 mt-0.5">{inspectingOrder.customer_name}</p>
                <p className="text-slate-500 font-mono mt-0.5">{inspectingOrder.customer_phone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Delivery Address</span>
                <p className="font-medium text-slate-800 mt-0.5">{inspectingOrder.customer_address}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  {inspectingOrder.delivery_area}
                </span>
              </div>
            </div>

            {/* Itemized Table */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ordered Products</span>
              <div className="mt-2 border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Array.isArray(inspectingOrder.items) && inspectingOrder.items.map((it: any, i: number) => (
                      <tr key={i}>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{it.name || it.variant} ({it.variant || it.weight})</td>
                        <td className="py-2.5 px-3 font-mono">{it.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono">৳{it.price}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">৳{it.price * it.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">৳{inspectingOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span className="font-mono">৳{inspectingOrder.delivery_fee}</span>
              </div>
              {Number(inspectingOrder.discount) > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount:</span>
                  <span className="font-mono">-৳{inspectingOrder.discount}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                <span>Total Amount:</span>
                <span className="text-[#606BDF]">৳{inspectingOrder.total_amount}</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <a
                href={`https://wa.me/88${inspectingOrder.customer_phone?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Message on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: UPGRADE PRO MODAL ─────────────────────────────── */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#606BDF]/15 text-[#606BDF] border border-[#606BDF]/20">
                  StoreLine Pro
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Upgrade your merchant tier</h3>
                <p className="text-xs text-slate-500">Unlock automated courier booking, unlimited products, POS, and SMS alerts</p>
              </div>
              <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border-2 border-[#606BDF] bg-[#606BDF]/5 relative">
                <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[9px] font-black bg-[#606BDF] text-white uppercase tracking-wider">
                  Intro Deal
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">Pro Merchant</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">৳297</span>
                  <span className="text-xs text-slate-500">/ first 3 months</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Then ৳1,490/month. Cancel anytime.</p>
                
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#606BDF]" /> Unlimited Products & Catalog</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#606BDF]" /> Steadfast Courier 1-Click Booking</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#606BDF]" /> Custom Domain (.com / .com.bd)</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#606BDF]" /> WhatsApp & SMS Order Confirmations</li>
                </ul>

                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    triggerToast('Activating Pro Merchant tier...');
                  }}
                  className="w-full mt-5 py-2.5 rounded-xl bg-[#606BDF] hover:bg-[#505BCF] text-white font-bold text-xs shadow-md transition"
                >
                  Activate Pro Now
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                <h4 className="font-extrabold text-slate-900 text-base">Business Scale</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">৳3,490</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">For brands doing 1,000+ orders / month.</p>
                
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Everything in Pro</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Multiple Staff Roles & Payroll</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Multi-Branch Inventory Tracking</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Dedicated Account Manager</li>
                </ul>

                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    triggerToast('Enterprise inquiry sent');
                  }}
                  className="w-full mt-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: QUICK CREATE ACTION ─────────────────────────── */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-5 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Quick Create Action</h3>
              <button onClick={() => setShowQuickAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              <button 
                onClick={() => {
                  setShowQuickAddModal(false);
                  setCurrentTab('inventory');
                  triggerToast('Opening product creation...');
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left transition"
              >
                <Package className="w-4 h-4 text-[#606BDF]" />
                <div>
                  <div className="font-semibold text-slate-900 text-xs">New Product</div>
                  <div className="text-[11px] text-slate-400">Add food item, weight variants and pricing</div>
                </div>
              </button>

              <button 
                onClick={() => {
                  setShowQuickAddModal(false);
                  setCurrentTab('orders');
                  triggerToast('Opening manual order form...');
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left transition"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-900 text-xs">Create Manual Order</div>
                  <div className="text-[11px] text-slate-400">Record phone call or WhatsApp order</div>
                </div>
              </button>

              <button 
                onClick={() => {
                  setShowQuickAddModal(false);
                  triggerToast('Discount coupon created');
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left transition"
              >
                <Tag className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="font-semibold text-slate-900 text-xs">Create Discount Coupon</div>
                  <div className="text-[11px] text-slate-400">e.g. FOODFLOW for 10% off</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: ⌘K COMMAND PALETTE ───────────────────────────── */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-fadeIn">
            <div className="p-3.5 border-b border-slate-200 flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search orders, customers, products..."
                className="w-full bg-transparent text-xs text-slate-900 focus:outline-none placeholder-slate-400"
              />
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 border border-slate-200">ESC</kbd>
            </div>
            <div className="p-2 space-y-1 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Navigation</div>
              <button 
                onClick={() => { setCurrentTab('dashboard'); setShowCommandPalette(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-left text-slate-700"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                <span>Go to Dashboard</span>
              </button>
              <button 
                onClick={() => { setCurrentTab('orders'); setShowCommandPalette(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-left text-slate-700"
              >
                <Globe className="w-4 h-4 text-slate-400" />
                <span>Go to Web Orders</span>
              </button>
              <button 
                onClick={() => { setCurrentTab('inventory'); setShowCommandPalette(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-left text-slate-700"
              >
                <Package className="w-4 h-4 text-slate-400" />
                <span>Go to Inventory & Products</span>
              </button>
              <button 
                onClick={() => { setCurrentTab('settings'); setShowCommandPalette(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-left text-slate-700"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Go to General Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
