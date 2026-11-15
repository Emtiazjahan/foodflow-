-- ============================================================
-- FoodFlow (ফুডফ্লো) — Supabase Orders Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/zvlrkoumgmlvcezkaxqo/sql/new
-- ============================================================

-- 1. Create the orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    delivery_area TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    delivery_fee NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'Cash on Delivery',
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Allow anyone to place an order from checkout
CREATE POLICY "Allow public insert into orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow reading orders (for admin dashboard and order receipt)
CREATE POLICY "Allow public select orders"
ON public.orders
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow updating order status (e.g. pending -> confirmed -> delivered)
CREATE POLICY "Allow public update orders"
ON public.orders
FOR UPDATE
TO anon, authenticated
USING (true);
