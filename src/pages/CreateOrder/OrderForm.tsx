import React, { useState } from 'react';
import { generateLabelPdf } from '../../utils/generateLabel';
import { supabase } from '../../utils/supabaseClient';

interface OrderFormData {
  ebayOrderId: string;
  buyerName: string;
  orderDate: string;
  receiverName: string;
  fullAddress: string;
  postcode: string;
  state: string;
  courier: string;
}

interface Product {
  [key: string]: unknown;
}

export default function OrderForm({
  selectedProducts,
  onSubmit,
}: {
  selectedProducts: Product[];
  onSubmit: (data: OrderFormData & { items: Product[] }, file?: File) => Promise<void>;
}) {
  const [form, setForm] = useState<OrderFormData>({
    ebayOrderId: '',
    buyerName: '',
    orderDate: '',
    receiverName: '',
    fullAddress: '',
    postcode: '',
    state: '',
    courier: '',
  });
  const [labelFile, setLabelFile] = useState<File | undefined>();
  const [useUpload, setUseUpload] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      alert('Select at least one product.');
      return;
    }
    setSubmitting(true);
    try {
      let file = labelFile;
      if (!useUpload) {
        const blob = generateLabelPdf({ ...form, items: selectedProducts });
        file = new File([blob], `label-${form.ebayOrderId || Date.now()}.pdf`, {
          type: 'application/pdf',
        });
      }
      if (!file) {
        alert('Please upload a label or enable auto-generate.');
        return;
      }
      const path = `orders/${form.ebayOrderId}/label`;
      const { error } = await supabase.storage.from('shipping-labels').upload(path, file);
      if (error) throw error;
      await onSubmit({ ...form, items: selectedProducts }, file);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Error submitting order: ' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">eBay Order ID</label>
          <input
            value={form.ebayOrderId}
            onChange={(e) => setForm({ ...form, ebayOrderId: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-emerald-500"
            placeholder="E.g. 123-4567890-1234567"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Buyer Name</label>
          <input
            value={form.buyerName}
            onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-emerald-500"
            placeholder="Buyer full name"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Order Date</label>
          <input
            type="date"
            value={form.orderDate}
            onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Courier (optional)</label>
          <input
            value={form.courier}
            onChange={(e) => setForm({ ...form, courier: e.target.value })}
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-emerald-500"
            placeholder="Courier name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label className="block text-sm text-gray-700 mb-1">Delivery Address</label>
        <input
          value={form.receiverName}
          onChange={(e) => setForm({ ...form, receiverName: e.target.value })}
          placeholder="Receiver name"
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
        <textarea
          value={form.fullAddress}
          onChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
          placeholder="Full address"
          className="w-full px-3 py-2 border rounded-md text-sm"
          rows={3}
        />
        <div className="grid grid-cols-3 gap-3">
          <input
            value={form.postcode}
            onChange={(e) => setForm({ ...form, postcode: e.target.value })}
            placeholder="Postcode"
            className="px-3 py-2 border rounded-md text-sm"
          />
          <input
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            placeholder="State"
            className="px-3 py-2 border rounded-md text-sm"
          />
          <div />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center gap-4 mb-3">
          <label className="inline-flex items-center gap-2">
            <input type="radio" checked={useUpload} onChange={() => setUseUpload(true)} />
            <span className="text-sm text-gray-700">Upload label image/PDF</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" checked={!useUpload} onChange={() => setUseUpload(false)} />
            <span className="text-sm text-gray-700">Auto-generate PDF label</span>
          </label>
        </div>

        {useUpload ? (
          <div>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={(e) => setLabelFile(e.target.files?.[0])}
              className="text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">Accepted: PNG, JPG, PDF. Max 5MB.</p>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            A printable PDF label will be generated from the address fields above.
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setForm({
              ebayOrderId: '',
              buyerName: '',
              orderDate: '',
              receiverName: '',
              fullAddress: '',
              postcode: '',
              state: '',
              courier: '',
            });
            setLabelFile(undefined);
          }}
          className="px-4 py-2 border rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit Order'}
        </button>
      </div>
    </form>
  );
}