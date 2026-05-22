import { supabase } from '../utils/supabaseClient';

export async function fetchProducts(userId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data ?? [];
}

export async function uploadLabel(file: File | Blob, path: string) {
  if (!(file instanceof File) && !(file instanceof Blob)) {
    throw new Error('Invalid file provided to uploadLabel');
  }
  try {
    const { data, error } = await supabase.storage
      .from('shipping-labels')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: (file as File).type || undefined, // ensure proper content type
      });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Storage upload error:', err);
    throw err;
  }
}

interface Order {
  [key: string]: string | number | boolean | null;
}

export async function createOrder(order: Order) {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();
  if (error) throw error;
  return data;
}