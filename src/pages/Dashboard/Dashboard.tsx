import { supabase } from '../../utils/supabaseClient';
import { useEffect, useState } from 'react';

interface Order {
  id: string;
  user_id: string;
  created_at: string;
  status?: string;
  ebay_order_id?: string;
  buyer_name?: string;
  receiver_name?: string;
  full_address?: string;
  postcode?: string;
  state?: string;
  courier?: string;
  items?: string;
  label_path?: string;
  [key: string]: unknown;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  useEffect(() => {
    (async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        
        if (!user?.id) {
          setLoading(false);
          return;
        }
        
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        const userIsAdmin = profile?.role === 'admin';
        setIsAdmin(userIsAdmin);
        
        // Fetch orders based on user role
        let query = supabase.from('orders').select('*');
        
        if (userIsAdmin) {
          query = query.order('created_at', { ascending: false });
        } else {
          query = query.eq('user_id', user.id).order('created_at', { ascending: false });
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard {isAdmin ? '(Admin)' : '(Customer)'}</h1>
      <div>{orders.length} orders found</div>
      
      {loading ? (
        <p>Loading...</p>
      ) : orders.length > 0 ? (
        <div>
          {orders.map((order) => (
            <div key={order.id} style={{ border: '1px solid #ddd', marginBottom: '10px', padding: '10px' }}>
              <div
                onClick={() => toggleExpand(order.id)}
                style={{ cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '10px' }}
              >
                Order {order.id?.substring(0, 8)}... | {order.status || 'Pending'} | {new Date(order.created_at).toLocaleDateString()}
              </div>
              
              {expandedOrderId === order.id && (
                <div style={{ padding: '10px', backgroundColor: '#fafafa' }}>
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>eBay Order ID:</strong> {order.ebay_order_id || 'N/A'}</p>
                  <p><strong>Buyer:</strong> {order.buyer_name || 'N/A'}</p>
                  <p><strong>Receiver:</strong> {order.receiver_name || 'N/A'}</p>
                  <p><strong>Address:</strong> {order.full_address || 'N/A'}</p>
                  <p><strong>Postcode:</strong> {order.postcode || 'N/A'}</p>
                  <p><strong>State:</strong> {order.state || 'N/A'}</p>
                  <p><strong>Courier:</strong> {order.courier || 'N/A'}</p>
                  <p><strong>Status:</strong> {order.status || 'Pending'}</p>
                  <p><strong>Label:</strong> {order.label_path ? <a href={order.label_path} target="_blank" rel="noopener noreferrer">Download</a> : 'N/A'}</p>
                  
                  {order.items && (
                    <div>
                      <strong>Items:</strong>
                      <pre>{JSON.stringify(JSON.parse(order.items), null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}