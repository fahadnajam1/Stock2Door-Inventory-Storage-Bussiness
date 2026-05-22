import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/useAuth';

interface Order {
  id: string;
  user_id: string;
  status?: string;
  tracking_number?: string | null;
  dispatch_date?: string | null;
  estimated_delivery_date?: string | null;
  courier_name?: string | null;
  buyer_name?: string;
  receiver_name?: string;
  full_address?: string;
  postcode?: string;
  state?: string;
  courier?: string;
  ebay_order_id?: string;
  items?: string; // JSON string or array
  label_path?: string;
  created_at?: string;
  profiles?: { id: string; full_name: string; created_at: string } | null;
  labels?: { url: string }[];
  delivery_status?: string;
  order_date?: string;
  [key: string]: unknown;
}

interface Product {
  id: string;
  name: string;
  sku: string | null;
  user_id: string;
  created_at: string;
  description?: string;
  image_url?: string;
}

interface Profile {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

interface OrderItem {
  sku: string;
  name?: string;
  qty?: number;
  [key: string]: unknown;
}

export default function Admin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<string, { items: OrderItem[]; products: Record<string, Product> }>>({});

  // small UI states for improved UX
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | string>('All');
  const [showOnlyWithLabels, setShowOnlyWithLabels] = useState(false);

  useEffect(() => {
    // Admin API base can be set via Vite env `VITE_ADMIN_API_URL` for production
    const ADMIN_API_BASE = import.meta.env.VITE_ADMIN_API_URL ?? '/api/admin';
    const checkAdminSession = async () => {
      try {
        const res = await fetch(`${ADMIN_API_BASE}/session`, { credentials: 'include' });
        const j = await res.json();
        setIsAdmin(!!j.admin);
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkAdminSession();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!user?.id) {
        console.log('No user ID');
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profileErr) {
          console.error('Profile fetch error:', profileErr);
          setLoading(false);
          return;
        }

        const role = (profile as { role: string } | null)?.role ?? 'customer';
        console.log('User role:', role);
        setIsAdmin(role === 'admin');

        if (role === 'admin') {
          console.log('Fetching admin data...');
          await Promise.all([fetchOrders(), fetchProducts(), fetchProfiles()]);
        } else {
          console.log('User is not admin');
        }
      } catch (err: unknown) {
        console.error('Init error:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user?.id]);

  const fetchOrders = async () => {
    console.log('Fetching orders...');
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('fetch orders error:', error);
      return;
    }
    
    console.log('Orders fetched:', data?.length ?? 0, data);
    setOrders((data ?? []) as Order[]);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('fetch products', error);
      return;
    }
    setProducts((data ?? []) as Product[]);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('profiles').select('id, full_name, role, created_at');
    if (error) {
      console.error('fetch profiles', error);
      return;
    }
    setProfiles(data ?? []);
  };

  // realtime updates: reflect new/updated/deleted orders immediately in admin UI
  useEffect(() => {
    // Supabase JS v2 realtime channel for Postgres changes
    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          try {
            if (payload.eventType === 'INSERT') {
              setOrders((prev) => {
                // avoid duplicate if already present
                if (prev.find((o) => o.id === payload.new.id)) return prev;
                return [payload.new as Order, ...prev];
              });
            } else if (payload.eventType === 'UPDATE') {
              setOrders((prev) => prev.map((o) => (o.id === payload.new.id ? (payload.new as Order) : o)));
            } else if (payload.eventType === 'DELETE') {
              setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
            }
          } catch (e) {
            console.error('realtime handling error', e);
          }
        }
      )
      .subscribe();

    return () => {
      // remove channel on cleanup
      supabase.removeChannel(channel);
    };
  }, []);

  const updateOrder = async (orderId: string, patch: Partial<Order>) => {
    setLoading(true);
    try {
      // If tracking number added, ensure status becomes Dispatched
      if (patch.tracking_number && !patch.status) patch.status = 'Dispatched';

      const { error } = await supabase.from('orders').update(patch).eq('id', orderId);
      if (error) throw error;
      await fetchOrders();
    } catch (err) {
      console.error('update order', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = async (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    if (orderDetails[orderId]) {
      setExpandedOrderId(orderId);
      return;
    }

    try {
      const { data: ord, error: ordErr } = await supabase
        .from('orders')
        .select('id, items')
        .eq('id', orderId)
        .single();
      if (ordErr) throw ordErr;

      const items: OrderItem[] =
        typeof ord?.items === 'string' ? JSON.parse(ord.items) : (ord?.items ?? []);

      // gather SKUs and product IDs (handle both cases)
      const skus = Array.from(new Set(items.map((it: OrderItem) => (it.sku ? String(it.sku).trim() : '')).filter(Boolean)));
      const pids = Array.from(new Set(items.map((it: OrderItem) => (it.product_id ? String(it.product_id).trim() : '')).filter(Boolean)));

      const productsMap: Record<string, Product> = {};

      // fetch by SKU if any
      if (skus.length > 0) {
        const { data: prodsBySku, error: skuErr } = await supabase
          .from('products')
          .select('id, name, sku, created_at, image_url, user_id') // removed description (doesn't exist)
          .in('sku', skus);
        if (skuErr) throw skuErr;
        (prodsBySku ?? []).forEach((p: Product) => {
          if (p.sku) productsMap[String(p.sku)] = p;
          productsMap[String(p.id)] = p; // also map by id for fallback
        });
      }

      // fetch by id if any (and not already fetched)
      if (pids.length > 0) {
        const missingIds = pids.filter((id) => !productsMap[id]);
        if (missingIds.length > 0) {
          const { data: prodsById, error: idErr } = await supabase
            .from('products')
            .select('id, name, sku, created_at, image_url, user_id') // removed description
            .in('id', missingIds);
          if (idErr) throw idErr;
          (prodsById ?? []).forEach((p: Product) => {
            if (p.sku) productsMap[String(p.sku)] = p;
            productsMap[String(p.id)] = p;
          });
        }
      }

      setOrderDetails((prev) => ({ ...prev, [orderId]: { items, products: productsMap } }));
      setExpandedOrderId(orderId);
    } catch (err) {
      console.error('fetch order details:', err);
    }
  };

  const statuses = useMemo(() => {
    const set = new Set<string>(orders.map((o) => o.status || '').filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (statusFilter !== 'All') list = list.filter((o) => o.status === statusFilter);
    if (showOnlyWithLabels) list = list.filter((o) => o.labels && o.labels.length > 0);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          (o.profiles?.full_name ?? o.buyer_name ?? o.user_id ?? '').toLowerCase().includes(q) ||
          (o.tracking_number ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, statusFilter, showOnlyWithLabels, query]);

  if (loading) return <div className="max-w-6xl mx-auto py-24 px-4">Loading...</div>;

  // Show login form when there's no admin session
  if (!isAdmin)
    return (
      <div className="max-w-md mx-auto py-24 px-4">
        <h2 className="text-xl font-semibold mb-4">Admin sign in</h2>
        <AdminLoginForm onSignedIn={() => { setLoading(true); setTimeout(() => { setLoading(false); setIsAdmin(true); }, 300); }} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="flex items-center justify-between mb-8 pt-9">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Manage orders, products and customers</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-500">Signed in as</div>
            <div className="font-medium text-gray-800">{user?.email ?? 'Admin'}</div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Orders" value={orders.length} color="emerald">
          <span className="text-xs text-gray-500">Total orders</span>
        </StatCard>
        <StatCard title="Products" value={products.length} color="blue">
          <span className="text-xs text-gray-500">Active products</span>
        </StatCard>
        <StatCard title="Customers" value={profiles.length} color="purple">
          <span className="text-xs text-gray-500">Registered customers</span>
        </StatCard>
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700">Quick actions</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => fetchOrders()} className="px-3 py-2 text-sm bg-emerald-50 text-emerald-700 rounded border border-emerald-100">Refresh Orders</button>
              <button onClick={() => { setQuery(''); setStatusFilter('All'); setShowOnlyWithLabels(false); }} className="px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded border border-gray-100">Reset</button>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-4">Tip: Use search to quickly locate orders</div>
        </div>
      </section>

      <section className="mb-8 bg-white rounded-lg border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 w-full md:w-1/2">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search orders, customer or tracking..."
                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <svg className="w-4 h-4 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"/></svg>
            </div>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-md px-3 py-2">
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <label className="inline-flex items-center text-sm gap-2">
              <input type="checkbox" checked={showOnlyWithLabels} onChange={(e) => setShowOnlyWithLabels(e.target.checked)} className="rounded border-gray-200" />
              <span className="text-sm text-gray-600">Has label</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">Showing</div>
            <div className="text-sm font-medium">{filteredOrders.length}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Tracking</th>
                <th className="px-4 py-3 text-left">Dispatch</th>
                <th className="px-4 py-3 text-left">ETA</th>
                <th className="px-4 py-3 text-left">Label</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((o) => (
                <React.Fragment key={o.id}>
                  <tr className="hover:bg-emerald-50" onClick={() => handleOrderClick(o.id)} style={{ cursor: 'pointer' }}>
                    <td className="px-4 py-3 text-gray-800 font-medium">{o.id}</td>
                    <td className="px-4 py-3 text-gray-800">{o.profiles?.full_name ?? o.buyer_name ?? o.user_id}</td>
                    <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                    <td className="px-4 py-3 text-gray-800">{o.tracking_number ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-800">{o.dispatch_date ? new Date(o.dispatch_date).toLocaleString() : '—'}</td>
                    <td className="px-4 py-3 text-gray-800">{o.estimated_delivery_date ? new Date(o.estimated_delivery_date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3">
                      {o.labels && o.labels.length > 0 ? (
                        <a href={o.labels[0].url} target="_blank" rel="noreferrer" className="text-emerald-700 underline">View</a>
                      ) : <span className="text-sm text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={(e) => { e.stopPropagation(); updateOrder(o.id, { status: 'Packed' }); }} className="px-2 py-1 bg-white border border-gray-100 rounded text-sm shadow-sm hover:bg-gray-50">Packed</button>
                        <button onClick={(e) => { e.stopPropagation(); updateOrder(o.id, { status: 'Dispatched' }); }} className="px-2 py-1 bg-white border border-gray-100 rounded text-sm shadow-sm hover:bg-gray-50">Dispatch</button>
                        <button onClick={(e) => { e.stopPropagation(); updateOrder(o.id, { status: 'Delivered', delivery_status: 'Delivered' }); }} className="px-2 py-1 bg-emerald-600 text-white rounded text-sm">Delivered</button>
                        <OrderShippingInline order={o} onSave={(patch) => updateOrder(o.id, patch)} />
                      </div>
                    </td>
                  </tr>

                  {expandedOrderId === o.id && (
                    <tr>
                      <td colSpan={8} className="bg-white px-4 py-4">
                        <div className="space-y-4">
                          {/* ORDER DETAILS */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded">
                            <div>
                              <div className="text-xs text-gray-500 font-medium">eBay Order ID</div>
                              <div className="text-sm font-medium text-gray-800">{o.ebay_order_id ?? '—'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Order Date</div>
                              <div className="text-sm font-medium text-gray-800">{o.order_date ? new Date(o.order_date).toLocaleDateString() : '—'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Buyer</div>
                              <div className="text-sm font-medium text-gray-800">{o.buyer_name ?? '—'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Receiver</div>
                              <div className="text-sm font-medium text-gray-800">{o.receiver_name ?? '—'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Address</div>
                              <div className="text-sm font-medium text-gray-800">{o.full_address ?? '—'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Postcode</div>
                              <div className="text-sm font-medium text-gray-800">{o.postcode ?? '—'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">State</div>
                              <div className="text-sm font-medium text-gray-800">{o.state ?? '—'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Courier</div>
                              <div className="text-sm font-medium text-gray-800">{o.courier ?? '—'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Label</div>
                              <div className="text-sm">
                                {o.label_path ? (
                                  <a href={o.label_path} target="_blank" rel="noreferrer" className="text-emerald-700 underline">Download Label</a>
                                ) : (
                                  <span className="text-gray-500">—</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* PRODUCTS/ITEMS */}
                          <div>
                            <div className="text-sm font-semibold text-gray-700 mb-3">Items in Order:</div>
                            {(orderDetails[o.id]?.items?.length ?? 0) === 0 ? (
                              <div className="text-gray-500">No items data</div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {orderDetails[o.id].items.map((it: OrderItem, idx: number) => {
                                  const prod = orderDetails[o.id].products[String(it.sku)];
                                  return (
                                    <div key={idx} className="flex items-start gap-3 border rounded p-3 bg-white">
                                      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center overflow-hidden rounded flex-shrink-0">
                                        {prod?.image_url ? (
                                          <img src={prod.image_url} alt={prod.name} className="object-cover w-full h-full" />
                                        ) : (
                                          <div className="text-xs text-gray-400 text-center">No image</div>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-800">{prod?.name ?? it.name ?? 'Unknown'}</div>
                                        <div className="text-xs text-gray-500 mt-1">SKU: {it.sku ?? '—'}</div>
                                        <div className="text-xs text-gray-500">Qty: {it.qty ?? 1}</div>
                                        {prod?.description && (
                                          <div className="text-xs text-gray-600 mt-1">{prod.description}</div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-500">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-3">Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.slice(0, 6).map((p) => (
              <div key={p.id} className="border rounded p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{p.name}</div>
                    <div className="text-sm text-gray-600">SKU: {p.sku ?? '-'}</div>
                  </div>

                  {/* Visible View button */}
                  <div className="ml-4">
                    <button
                      onClick={async () => {
                        const pid = String(p.id);
                        if (expandedProductId === pid) {
                          setExpandedProductId(null);
                          setSelectedProductDetails(null);
                          return;
                        }
                        try {
                          const { data, error } = await supabase.from('products').select('id, name, sku, created_at, image_url, user_id').eq('id', p.id).single(); // avoid selecting non-existent columns
                           if (error) {
                             console.error('fetch product detail', error);
                             return;
                           }
                           setSelectedProductDetails(data as Product);
                           setExpandedProductId(pid);
                         } catch (err) {
                           console.error('fetch product detail', err);
                         }
                      }}
                      aria-label={`view-product-${p.id}`}
                      style={{ display: 'inline-block' }}
                      className="text-sm px-3 py-1 border rounded bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      {expandedProductId === String(p.id) ? 'Hide' : 'View'}
                    </button>
                  </div>
                </div>

                {expandedProductId === String(p.id) && selectedProductDetails && (
                  <div className="mt-3 text-sm text-gray-700">
                    <div><strong>Description:</strong> {selectedProductDetails.description ?? '—'}</div>
                    <div className="mt-1"><strong>Created:</strong> {new Date(selectedProductDetails.created_at).toLocaleString()}</div>
                  </div>
                )}
              </div>
            ))}
            {products.length === 0 && <div className="text-gray-500">No products</div>}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-3">Customers</h3>
          <ul className="space-y-3">
            {profiles.slice(0, 8).map((pr) => (
              <li key={pr.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{pr.full_name ?? pr.id}</div>
                  <div className="text-xs text-gray-500">Role: {pr.role}</div>
                </div>
                <div className="text-sm text-gray-400">{new Date(pr.created_at).toLocaleDateString()}</div>
              </li>
            ))}
            {profiles.length === 0 && <div className="text-gray-500">No customers</div>}
          </ul>
        </div>
      </section>
    </div>
  );
}

/* Small presentational components */

function StatCard({ title, value, color, children }: { title: string; value: number; color?: 'emerald' | 'blue' | 'purple'; children?: React.ReactNode }) {
  const bg = color === 'blue' ? 'from-blue-500 to-blue-400' : color === 'purple' ? 'from-purple-500 to-purple-400' : 'from-emerald-600 to-emerald-400';
  return (
    <div className={`bg-gradient-to-r ${bg} text-white rounded-lg shadow-sm p-4 flex flex-col justify-between`}>
      <div className="text-xs font-medium opacity-90">{title}</div>
      <div className="mt-4 flex items-end justify-between">
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="mt-2 text-sm opacity-90">{children}</div>
    </div>
  );
}

function StatusPill({ status }: { status?: string }) {
  const s = (status ?? '').toLowerCase();
  const bg =
    s.includes('deliv') ? 'bg-green-100 text-green-800' :
    s.includes('dispatch') || s.includes('dispatched') ? 'bg-amber-100 text-amber-800' :
    s.includes('pack') ? 'bg-sky-100 text-sky-800' :
    'bg-gray-100 text-gray-800';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bg}`}>{status ?? 'Unknown'}</span>;
}

/* inline shipping quick form: opens a compact modal-like inline area */
function OrderShippingInline({ order, onSave }: { order: Order; onSave: (patch: Partial<Order>) => void }) {
  const [open, setOpen] = useState(false);
  const [courier, setCourier] = useState(order.courier_name ?? '');
  const [tracking, setTracking] = useState(order.tracking_number ?? '');

  return (
    <div>
      <button onClick={() => setOpen((v) => !v)} className="px-2 py-1 text-xs bg-white border border-gray-100 rounded hover:bg-gray-50">Ship</button>
      {open && (
        <div className="mt-2 p-3 bg-white border border-gray-100 rounded shadow-sm absolute z-50">
          <div className="flex gap-2">
            <input value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="Courier" className="px-2 py-1 border rounded text-sm" />
            <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Tracking" className="px-2 py-1 border rounded text-sm" />
            <button onClick={() => { onSave({ courier_name: courier || null, tracking_number: tracking || null }); setOpen(false); }} className="px-2 py-1 bg-emerald-600 text-white rounded text-sm">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple admin login form — used when no user or to switch to admin account
function AdminLoginForm({ onSignedIn }: { onSignedIn?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const j = await res.json();
      if (!res.ok) {
        setError(j?.error ?? 'Unauthorized');
      } else {
        onSignedIn?.();
      }
    } catch {
      setError('Sign in failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 p-6">
          <h2 className="text-white text-xl font-semibold">Admin Sign In</h2>
          <p className="text-emerald-50 text-sm mt-1">Secure area — authorised personnel only</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded">{error}</div>}

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              aria-label="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
              placeholder="admin@example.com"
              required
              autoComplete="username"
            />
          </label>

          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Password</span>
            </div>
            <input
              type="password"
              aria-label="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </label>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center text-sm">
              <input type="checkbox" className="rounded border-gray-200" />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium shadow-sm disabled:opacity-60"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="pt-3 text-center text-xs text-gray-400">
            By signing in you agree to company policies. Unauthorized access is prohibited.
          </div>
        </form>
      </div>
    </div>
  );
}

