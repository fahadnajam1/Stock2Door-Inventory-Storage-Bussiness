import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/useAuth';
import React from 'react';
import { Plus, Edit2, Trash2, LogOut, Package, Bell, X } from 'lucide-react';

// Dashboard receives no external props currently

interface Product {
  id: string;
  user_id: string;
  name: string;
  sku?: string | null;
  image_url?: string | null;
  metadata?: Record<string, string | number | boolean> | null;
  created_at?: string;
}

interface Order {
  id: string;
  user_id: string;
  status: string;
  tracking_number?: string | null;
  courier_name?: string | null;
  buyer_name?: string | null;
  created_at: string;
}

interface ToastNotification {
  id: number;
  message: string;
}

interface PublicUrlResponse {
  data: {
    publicUrl: string;
  };
}

export default function Dashboard({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { user, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const toastIdSeq = useRef(0);

  // form
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const ensureProfileExists = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { error } = await supabase.from('profiles').select('id').eq('id', user.id).single();
      if (error && error.code === 'PGRST116') {
        // not found -> create
        const { error: insertErr } = await supabase.from('profiles').insert({ id: user.id, full_name: user.user_metadata?.full_name ?? null });
        if (insertErr) console.error('create profile', insertErr);
      }
    } catch (err) {
      console.error('ensure profile', err);
    }
  }, [user?.id, user?.user_metadata?.full_name]);

  const fetchProducts = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('fetch products', error);
    } else if (data) {
      setProducts(data);
    }
    setLoading(false);
  }, [user?.id]);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('fetch orders', error);
    } else if (data) {
      setOrders(data as Order[]);
    }
  }, [user?.id]);

  const addToast = (message: string) => {
    const id = ++toastIdSeq.current;
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000); // 5 seconds duration
  };

  useEffect(() => {
    (async () => {
      await ensureProfileExists();
      await fetchProducts();
      await fetchOrders();
    })();
    
    if (!user?.id) return;

    // subscribe to realtime changes for orders
    const channel = supabase
      .channel('public:user_orders')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const updatedOrder = payload.new as Order;
          setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
          
          let alertMsg = `Order #${updatedOrder.id.substring(0,6)} has been updated.`;
          if (updatedOrder.status === 'Dispatched' && updatedOrder.tracking_number) {
            alertMsg = `Order #${updatedOrder.id.substring(0,6)} Dispatched! Tracking: ${updatedOrder.tracking_number}`;
          } else if (updatedOrder.status === 'Delivered') {
            alertMsg = `Order #${updatedOrder.id.substring(0,6)} has been Delivered!`;
          }
          addToast(alertMsg);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ensureProfileExists, fetchProducts, fetchOrders, user?.id]);

  const uploadImage = async (file: File) => {
    if (!user?.id) {
      setErrorMsg('Not authenticated');
      return null;
    }
    setErrorMsg(null);
    const path = `${user.id}/${Date.now()}_${file.name}`;
    try {
      const { error } = await supabase.storage
        .from('products')
        .upload(path, file, { cacheControl: '3600', upsert: true });

      if (error) {
        console.error('upload error', error);
        setErrorMsg(error.message ?? 'Image upload failed');
        return null;
      }

      // getPublicUrl may return different shapes depending on Supabase client version
      const urlResp: PublicUrlResponse = supabase.storage.from('products').getPublicUrl(path);
      const publicUrl = urlResp?.data?.publicUrl ?? null;

      if (!publicUrl) {
        console.error('getPublicUrl failed', { urlResp });
        setErrorMsg('Could not get public URL for image');
        return null;
      }

      return publicUrl as string;
    } catch (err: unknown) {
      console.error('upload exception', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setErrorMsg(`Image upload failed: ${errorMessage}`);
      return null;
    }
  };

  const resetForm = () => {
    setName('');
    setSku('');
    setQuantity(0);
    setImageFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!user?.id) return;
    setLoading(true);
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) {
          // uploadImage already set a helpful setErrorMsg
          setLoading(false);
          return;
        }
      }

      const payload = {
        user_id: user.id,
        name,
        sku: sku || null,
        image_url: imageUrl,
        metadata: { quantity },
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId).eq('user_id', user.id);
        if (error) {
          console.error('update product', error);
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) {
          console.error('insert product', error);
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
      }

      await fetchProducts();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name || '');
    setSku(p.sku || '');
    setQuantity((p.metadata?.quantity as number) || 0);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setLoading(true);
    const { error } = await supabase.from('products').delete().eq('id', id).eq('user_id', user?.id);
    if (error) {
      console.error('delete', error);
      setErrorMsg(error.message);
    } else {
      await fetchProducts();
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('auth user id', user?.id);
  }, [user?.id]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4">
        <div className="bg-white p-8 rounded-lg shadow">Please log in to view your dashboard.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome, {user.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Inventory</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {products.reduce((sum, p) => sum + ((p.metadata?.quantity as number) || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <button
              onClick={() => onNavigate?.('create-order')}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-gray-900 font-semibold">Create New Order</p>
                <p className="text-sm text-gray-600 mt-1">Start a new order</p>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Add Product Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-lg text-gray-900 mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">SKU / Item Code</label>
                  <input
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g., SKU-12345"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity in Stock</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100"
                  />
                </div>

                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {errorMsg}
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {editingId ? 'Save Changes' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-6">Your Products</h2>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-gray-600">Loading products...</div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No products yet</p>
                  <p className="text-gray-500 text-sm mt-1">Add your first product using the form on the left</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all">
                      {/* Product Image */}
                      <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{p.name}</h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          {p.sku && <p>SKU: <span className="font-medium">{p.sku}</span></p>}
                          <p>Quantity: <span className="font-medium">{p.metadata?.quantity ?? 0}</span></p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => startEdit(p)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-all text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-400" />
            Your Recent Orders
          </h2>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Order ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Buyer Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Tracking Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{o.id.substring(0, 8)}...</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-600">{o.buyer_name || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${o.status === 'Pending' ? 'bg-gray-100 text-gray-800' : o.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' : o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {o.tracking_number ? (
                          <span>
                            Tracking: <strong className="text-gray-900">{o.tracking_number}</strong>
                            {o.courier_name && <span className="text-gray-500 ml-1">({o.courier_name})</span>}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] animate-fadeInUp">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

