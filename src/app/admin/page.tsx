'use client';

import React, { useState, useEffect } from 'react';
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
  FolderTree,
  Truck,
  History,
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
  ChevronDown,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  X,
  Volume2,
  VolumeX,
  Store,
  DollarSign,
  PieChart,
  Share2,
  Check,
  Calendar,
  Lock,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { STORE_CONFIG } from '../../config';

// ── Realistic Demo Data Sets ──────────────────────────────────────────
const DEMO_METRICS = {
  orders: 14,
  bookedSales: 18450,
  deliveredSales: 12680,
  estimateFromOrders: 21200,
  placedCount: 14,
  shippedCount: 9,
  topProducts: [
    { name: 'FoodFlow Pure Milk Butter (500g)', sku: 'FF-MB-500', sold: 28, revenue: 16800 },
    { name: 'FoodFlow Premium Danadar Ghee (1kg)', sku: 'FF-GH-1000', sold: 19, revenue: 30210 },
    { name: 'FoodFlow Arabica Roast Coffee (250g)', sku: 'FF-CF-250', sold: 15, revenue: 11700 },
    { name: 'FoodFlow Trio Breakfast Combo', sku: 'FF-TRIO', sold: 11, revenue: 10890 },
  ],
  sources: [
    { name: 'Direct Storefront Web', percentage: 68, amount: 14416 },
    { name: 'WhatsApp 1-Click Orders', percentage: 24, amount: 5088 },
    { name: 'Facebook / Messenger', percentage: 8, amount: 1696 },
  ]
};

const EMPTY_METRICS = {
  orders: 0,
  bookedSales: 0,
  deliveredSales: 0,
  estimateFromOrders: 0,
  placedCount: 0,
  shippedCount: 0,
  topProducts: [],
  sources: []
};

export default function StoreLineExactDashboard() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'orders' | 'inventory' | 'settings'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [storeName, setStoreName] = useState('Dhakai Food');
  
  // Interactive Modals & Panels
  const [useDemoData, setUseDemoData] = useState(false);
  const [hourlyFilter, setHourlyFilter] = useState<'Combined' | 'Today' | 'Yesterday'>('Combined');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [notificationsBanner, setNotificationsBanner] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Search & Filter Inputs
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('Today');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Metrics
  const activeMetrics = useDemoData ? DEMO_METRICS : EMPTY_METRICS;

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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-[13px] antialiased selection:bg-indigo-600 selection:text-white">
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
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm shrink-0">
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
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto shadow-sm">
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
                    ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
                    : 'hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${currentTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`} />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>

              <button
                onClick={() => setCurrentTab('inventory')}
                title="Inventory Dashboard"
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition ${
                  currentTab === 'inventory'
                    ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
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
                    ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
                    : 'hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 shrink-0 text-slate-400" />
                  {!sidebarCollapsed && <span>Web Orders</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                    {activeMetrics.orders}
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

          {/* Reports Section */}
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
                ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
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

            {/* Demo Data Toggle Pill (Feature Request) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => {
                  setUseDemoData(false);
                  triggerToast('Reset dashboard to Zero / Empty state');
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
                  triggerToast('Loaded realistic Dhakai Food order metrics!');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  useDemoData ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
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
                className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200 shadow-sm cursor-pointer"
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
            {/* 1. Header & Controls */}
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
                  onClick={() => triggerToast('Dashboard refreshed with latest data')}
                  className="p-1.5 bg-white border border-[#E2E8F0] rounded-xl text-slate-700 hover:bg-slate-50 transition shadow-sm"
                  title="Refresh"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. Promotional Banner Card (Matches Screenshot 1) */}
            <div className="bg-gradient-to-r from-[#EFF6FF] via-[#F5F3FF] to-[#FAF5FF] rounded-2xl border border-indigo-100/90 p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200/60">
                  Intro offer
                </span>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Get Pro for ৳297 — first 3 months
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
                    <span>৳99/month for 3 months</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
                    <span>Then ৳1,490/month</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
                    <span>Full refund within 7 days</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 shrink-0">
                {/* 7 Days Money Back Circular Seal */}
                <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-indigo-300 flex flex-col items-center justify-center text-center bg-white/60 shadow-sm">
                  <span className="text-[17px] font-black text-indigo-700 leading-none">7</span>
                  <span className="text-[7px] text-indigo-600 uppercase font-extrabold tracking-wider mt-0.5">Days</span>
                  <div className="text-[5px] text-slate-400 font-bold uppercase tracking-tighter">Guarantee</div>
                </div>

                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Pro · ৳297 / 3 months</span>
                </button>
              </div>
            </div>

            {/* 3. Dismissible Browser Notification Bar */}
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

            {/* 4. 4-Column KPI Summary Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Orders */}
              <div className="bg-white p-4.5 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                    <span>Orders</span>
                    <Info className="w-3 h-3 text-slate-300 cursor-help" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {activeMetrics.orders}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
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
                    ৳{activeMetrics.bookedSales.toLocaleString()}
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
                    ৳{activeMetrics.deliveredSales.toLocaleString()}
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
                    ৳{activeMetrics.estimateFromOrders.toLocaleString()}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* 5. Middle Analytics Row (2/3 + 1/3 Grid) */}
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
                      <p className="text-sm font-bold text-slate-900">{activeMetrics.placedCount}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Shipped / delivered</span>
                      <p className="text-sm font-bold text-slate-900">{activeMetrics.shippedCount}</p>
                    </div>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="h-56 w-full pt-4 flex flex-col justify-between">
                  <div className="flex-1 border-b border-dashed border-slate-200 relative flex items-end">
                    {useDemoData ? (
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
                        <line x1="0" y1="35" x2="500" y2="35" stroke="#F1F5F9" strokeDasharray="4 4" />
                        <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F5F9" strokeDasharray="4 4" />
                        <line x1="0" y1="115" x2="500" y2="115" stroke="#F1F5F9" strokeDasharray="4 4" />
                        {/* Area Placed */}
                        <path d="M 0,150 L 0,120 Q 150,90 280,50 T 500,30 L 500,150 Z" fill="rgba(79, 70, 229, 0.06)" />
                        {/* Line Placed */}
                        <path d="M 0,120 Q 150,90 280,50 T 500,30" fill="none" stroke="#4F46E5" strokeWidth="2.5" />
                        {/* Line Shipped */}
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
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
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

                {!useDemoData ? (
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
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        Direct Web Orders
                      </span>
                      <span className="font-bold text-slate-900">72% (10)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium pt-2">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        WhatsApp Orders
                      </span>
                      <span className="font-bold text-slate-900">28% (4)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Conversion Rate</span>
                  <span className="font-semibold text-slate-800">{useDemoData ? '3.8%' : '0%'}</span>
                </div>
              </div>
            </div>

            {/* 6. Lower Analytics Row (2/3 + 1/3 Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left (8 cols) — Hourly Web Orders */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Hourly Web Orders</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">2026-11-15 vs 2026-11-14</p>
                  </div>
                  {/* Segmented Filter: Combined / Today / Yesterday */}
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
                    {useDemoData ? (
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
                        {/* Today series */}
                        {(hourlyFilter === 'Combined' || hourlyFilter === 'Today') && (
                          <path
                            d="M 0,90 Q 120,70 250,40 T 500,15"
                            fill="none"
                            stroke="#4F46E5"
                            strokeWidth="2.5"
                          />
                        )}
                        {/* Yesterday series */}
                        {(hourlyFilter === 'Combined' || hourlyFilter === 'Yesterday') && (
                          <path
                            d="M 0,95 Q 120,85 250,60 T 500,40"
                            fill="none"
                            stroke="#94A3B8"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                          />
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
                      <span className="w-4 h-0.5 bg-indigo-600"></span>
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

                {!useDemoData ? (
                  <div className="py-12 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 mx-auto flex items-center justify-center text-slate-400 mb-2.5">
                      <Package className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">No data available</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Top performing items will display here</p>
                  </div>
                ) : (
                  <div className="space-y-3 py-2">
                    {activeMetrics.topProducts.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-slate-800 truncate">{p.name}</span>
                        </div>
                        <span className="font-bold text-slate-900 shrink-0">৳{p.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div 
                  onClick={() => setCurrentTab('inventory')}
                  className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold cursor-pointer hover:underline"
                >
                  <span>View all products</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 7. Bottom 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Col 1 — Orders by Source */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Orders by Source</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">All · {dateRange}</p>
                </div>

                {!useDemoData ? (
                  <div className="py-10 text-center text-slate-400">
                    <PieChart className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                    <p className="text-xs font-semibold text-slate-600">No data available</p>
                  </div>
                ) : (
                  <div className="space-y-3 py-3">
                    {activeMetrics.sources.map((s, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-700">{s.name}</span>
                          <span className="font-bold text-slate-900">{s.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${s.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
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

                {!useDemoData ? (
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
                  
                  {/* Plan Usage Bars */}
                  <div className="mt-4 space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Plan usage</span>
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                        <span>Products</span>
                        <span className="font-bold text-slate-900">5 / 30</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '16.6%' }}></div>
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
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm shadow-indigo-600/20"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ── VIEW 2: WEB ORDERS (FULFILLMENT & STEADFAST) ─────────── */}
        {currentTab === 'orders' && (
          <main className="p-6 space-y-5 max-w-[1440px] w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Web Orders</h1>
                <p className="text-xs text-slate-500 mt-0.5">Live customer checkout orders, call verification, and courier booking</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerToast('Orders refreshed')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
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

            {/* Orders Table Container */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-[#E2E8F0] uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer & Phone</th>
                      <th className="py-3 px-4">Address / Zone</th>
                      <th className="py-3 px-4">Amount / Pay</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Courier Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <span className="bg-slate-100 px-2 py-1 rounded text-slate-800">#FF-1001</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">Mahfuz Rahman</div>
                        <div className="text-slate-400 font-mono text-[11px]">01711223344</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>House 42, Road 9, Dhanmondi, Dhaka</div>
                        <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          Inside Dhaka
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">৳1,100</div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Cash on Delivery</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          pending
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => triggerToast('Booked Steadfast Parcel: SF-918239')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Book Steadfast</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
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
                    <button className="text-indigo-600 font-bold hover:underline">Edit</button>
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tagline</label>
                  <input
                    type="text"
                    defaultValue="খাঁটি ও পুষ্টিকর খাবারের বিশ্বস্ত অনলাইন শপ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
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

      {/* ── MODAL 1: FILTERS DRAWER / POPOVER ──────────────────────── */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-600" />
                <span>Filter Dashboard</span>
              </h3>
              <button onClick={() => setShowFilterModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Date Range</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Today', 'Yesterday', 'Last 7 Days', 'This Month', 'All Time'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setDateRange(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        dateRange === r
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Order Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped / In Courier</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setDateRange('Today');
                  setStatusFilter('all');
                  setShowFilterModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setShowFilterModal(false);
                  triggerToast(`Filters applied: ${dateRange}`);
                }}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition"
              >
                Apply Filters
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
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
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
              <div className="p-5 rounded-2xl border-2 border-indigo-600 bg-indigo-50/30 relative">
                <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-600 text-white uppercase tracking-wider">
                  Intro Deal
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">Pro Merchant</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">৳297</span>
                  <span className="text-xs text-slate-500">/ first 3 months</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Then ৳1,490/month. Cancel anytime.</p>
                
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-600" /> Unlimited Products & Catalog</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-600" /> Steadfast Courier 1-Click Booking</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-600" /> Custom Domain (.com / .com.bd)</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-600" /> WhatsApp & SMS Order Confirmations</li>
                </ul>

                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    triggerToast('Upgrade request received! Redirecting to payment...');
                  }}
                  className="w-full mt-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
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

      {/* ── MODAL 3: QUICK ADD MODAL ──────────────────────────────── */}
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
                <Package className="w-4 h-4 text-indigo-600" />
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
                  triggerToast('Coupon modal opened');
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
