import { useEffect, useState } from 'react';
import ProductSelector from './ProductSelector';
import OrderForm from './OrderForm';
import { uploadLabel } from '../../services/orderService';
import { supabase } from '../../utils/supabaseClient';
import { ArrowLeft, ShoppingCart, CheckCircle, Loader } from 'lucide-react';

interface OrderItem {
  id?: string | number;
  name?: string;
  sku?: string;
  qty?: number;
  [key: string]: unknown;
}

interface OrderData {
  ebayOrderId?: string;
  buyerName?: string;
  orderDate?: string;
  receiverName?: string;
  fullAddress?: string;
  postcode?: string;
  state?: string;
  courier?: string;
  items?: OrderItem[];
}

export default function CreateOrder({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        console.log('Auth user:', user?.id);  // <-- verify user ID is logged
        if (user?.id) setUserId(user.id);
        else setUserId('');
      } catch {
        setUserId('');
      }
    })();
  }, []);

  const handleSubmit = async (orderData: OrderData, labelFile?: File) => {
    if (!userId) {
      alert('Please sign in before creating an order.');
      return;
    }
    
    // Label is mandatory
    if (!labelFile) {
      alert('Please upload a shipping label before submitting the order.');
      return;
    }
    
    setLoading(true);
    try {
      let labelPath: string | null = null;
      
      // Upload label (mandatory, will throw if fails)
      console.log('File to upload:', labelFile);
      console.log('Is File instance:', labelFile instanceof File);
      console.log('File size:', labelFile?.size);
      console.log('File type:', labelFile?.type);

      if (!(labelFile instanceof File)) {
        alert('Invalid label file. Please re-select the file.');
        setLoading(false);
        return;
      }

      // keep extension in filename and include user folder
      const fileName = `${userId}/${Date.now()}-${labelFile.name}`;
      console.log('Upload path:', fileName);

      try {
        const response = await uploadLabel(labelFile, fileName);
        labelPath = response?.path || null;
        if (!labelPath) throw new Error('Upload failed: no path returned');
      } catch (uploadErr) {
        console.error('Label upload error:', uploadErr);
        alert('Failed to upload label. Check file type/size and bucket settings.');
        setLoading(false);
        return;
      }
      
      const payload = {
        user_id: userId,
        ebay_order_id: orderData.ebayOrderId ?? null,
        buyer_name: orderData.buyerName ?? null,
        order_date: orderData.orderDate ?? null,
        receiver_name: orderData.receiverName ?? null,
        // full_address: orderData.fullAddress ?? null,
        postcode: orderData.postcode ?? null,
        state: orderData.state ?? null,
        courier: orderData.courier ?? null,
        label_path: labelPath,
        items: JSON.stringify(orderData.items ?? []),
        status: 'Pending',
        created_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert([payload])
        // avoid returning full column list (prevents columns=... in URL)
        .select('id')
        .single();
        
      if (error) throw error;

      // Deduct product inventory
      if (orderData.items && orderData.items.length > 0) {
        for (const item of orderData.items) {
          if (!item.id) continue;
          const { data: p } = await supabase
            .from('products')
            .select('id, metadata')
            .eq('id', item.id)
            .eq('user_id', userId)
            .single();
          
          if (p) {
            const currentQty = Number(p.metadata?.quantity) || 0;
            const deductQty = Number(item.qty) || 1;
            const newQty = Math.max(0, currentQty - deductQty);
            
            await supabase
              .from('products')
              .update({ 
                metadata: { 
                  ...(p.metadata as Record<string, unknown> || {}), 
                  quantity: newQty 
                } 
              })
              .eq('id', p.id);
          }
        }
      }

      setSuccessMsg('Order created: ' + (data?.id ?? 'unknown'));
      setTimeout(() => {
        onNavigate?.('dashboard');
      }, 2000);
    } catch (err: unknown) {
      console.error('Error submitting order:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert('Error: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between pt-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate?.('dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
              <p className="text-sm text-gray-600 mt-0.5">Manage and submit your orders</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate?.('dashboard')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Selection Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Select Products</h2>
                  <p className="text-sm text-gray-600 mt-0.5">Choose items to include in this order</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <ProductSelector userId={userId} onChange={setItems} />
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-600 mt-0.5">Fill in shipping and order information</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <OrderForm selectedProducts={items} onSubmit={handleSubmit} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Order Summary</h3>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">No products selected</p>
                  <p className="text-xs text-gray-400 mt-1">Add items from the selector above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((it) => (
                    <div
                      key={String(it.id ?? Math.random())}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{String(it.name ?? 'Untitled')}</div>
                        <div className="text-xs text-gray-500 mt-0.5">SKU: {String(it.sku ?? '—')}</div>
                      </div>
                      <div className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        ×{String(it.qty ?? 1)}
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Total Items:</span>{' '}
                      <span className="font-bold text-emerald-600">
                        {items.reduce((sum, it) => sum + ((it.qty as number) || 1), 0)}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-emerald-900">Order Status</h3>
              </div>
              <p className="text-sm text-emerald-800 mb-4 leading-relaxed">
                All orders are submitted as "Pending" and will be processed by the warehouse team.
              </p>
              <button
                onClick={() => onNavigate?.('dashboard')}
                className="w-full px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Go to Dashboard
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Loading Modal */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <Loader className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Submitting Order</h3>
            <p className="text-gray-600 text-sm">Please wait while we process your order...</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successMsg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center animate-fadeInUp">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Order Created Successfully!</h3>
            <p className="text-gray-600 text-sm mb-6">{successMsg}</p>
            <p className="text-xs text-gray-500">Redirecting to dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
}

