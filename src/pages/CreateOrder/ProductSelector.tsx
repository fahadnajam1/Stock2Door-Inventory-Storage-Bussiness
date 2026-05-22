import { useEffect, useState } from 'react';
import { fetchProducts } from '../../services/orderService';

interface Product {
  id: string | number;
  name?: string;
  sku?: string;
  description?: string;
  [key: string]: unknown;
}

interface ProductWithQty extends Product {
  qty: number;
}

export default function ProductSelector({
  userId,
  onChange,
}: {
  userId: string;
  onChange: (items: ProductWithQty[]) => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (!userId) {
      setProducts([]);
      return;
    }
    (async () => {
      try {
        const p = await fetchProducts(userId);
        setProducts(p);
      } catch (err) {
        setProducts([]);
        console.error(err);
      }
    })();
  }, [userId]);

  const toggle = (prod: Product) => {
    const next = { ...selected };
    const key = String(prod.id);
    if (next[key]) delete next[key];
    else next[key] = 1;
    setSelected(next);
    const items = products
      .filter((p) => next[String(p.id)])
      .map((p) => ({ ...p, qty: next[String(p.id)] || 1 } as ProductWithQty));
    onChange(items);
  };

  const setQty = (id: string | number, qty: number) => {
    const key = String(id);
    const next = { ...selected, [key]: qty };
    if (qty <= 0) delete next[key];
    setSelected(next);
    const items = products
      .filter((p) => next[String(p.id)])
      .map((p) => ({ ...p, qty: next[String(p.id)] || 1 } as ProductWithQty));
    onChange(items);
  };

  const filtered = products.filter((p) =>
    String(p.name ?? p.sku ?? '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products by name or SKU"
          className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <div className="text-sm text-gray-500">{filtered.length} found</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="py-2">Select</th>
              <th className="py-2">Product</th>
              <th className="py-2">SKU</th>
              <th className="py-2 text-right">Qty</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={String(p.id)} className="hover:bg-gray-50">
                <td className="py-3">
                  <input
                    type="checkbox"
                    checked={!!selected[String(p.id)]}
                    onChange={() => toggle(p)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="py-3">
                  <div className="text-sm font-medium text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.description ?? ''}</div>
                </td>
                <td className="py-3 text-sm text-gray-600">{p.sku}</td>
                <td className="py-3 text-right">
                  <input
                    type="number"
                    min={1}
                    value={selected[String(p.id)] ?? ''}
                    onChange={(e) => setQty(p.id, Number(e.target.value || 0))}
                    className="w-20 px-2 py-1 border rounded-md text-sm text-right"
                    disabled={!selected[String(p.id)]}
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-sm text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}