import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useVendorStore() {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchStore = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('storely_stores')
      .select('*')
      .eq('owner_id', user.id)
      .single();
    
    if (data) {
      setStore(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  return { store, loading, refetch: fetchStore };
}

export function useProducts(storeId: string | undefined) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProducts = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    const { data } = await supabase
      .from('storely_products')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data);
    setLoading(false);
  }, [storeId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}

export function useOrders(storeId: string | undefined) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchOrders = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    const { data } = await supabase
      .from('storely_orders')
      .select('*, customer:storely_customers(email)')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });
    
    if (data) {
      // Flatten the customer email back into the object for compatibility
      const flattened = data.map((o: any) => ({
        ...o,
        customer_email: o.customer?.email || 'No email'
      }));
      setOrders(flattened);
    }
    setLoading(false);
  }, [storeId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, refetch: fetchOrders };
}

export function useCustomers(storeId: string | undefined) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchCustomers = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    const { data } = await supabase
      .from('storely_customers')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });
    
    if (data) setCustomers(data);
    setLoading(false);
  }, [storeId]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return { customers, loading, refetch: fetchCustomers };
}

export function useDiscounts(storeId: string | undefined) {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchDiscounts = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    const { data } = await supabase
      .from('storely_discounts')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });
    
    if (data) setDiscounts(data);
    setLoading(false);
  }, [storeId]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  return { discounts, loading, refetch: fetchDiscounts };
}
