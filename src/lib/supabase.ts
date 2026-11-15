import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zvlrkoumgmlvcezkaxqo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_q-4jZFeLSnjy9PQ0-WtfcQ_CJ1f5ThD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FoodFlowOrder {
  id?: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_area: string;
  items: Array<{
    id: string;
    name: string;
    weight: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total_amount: number;
  payment_method: string;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  created_at?: string;
}
