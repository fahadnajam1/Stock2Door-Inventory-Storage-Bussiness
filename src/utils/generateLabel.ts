import jsPDF from 'jspdf';

interface OrderItem {
  name?: string;
  sku?: string;
  qty?: number;
  [key: string]: unknown;
}

interface Order {
  ebayOrderId?: string;
  receiverName?: string;
  fullAddress?: string;
  postcode?: string;
  state?: string;
  items?: OrderItem[];
}

export function generateLabelPdf(order: Order) {
  // 4x6 inches standard shipping label (101.6 x 152.4 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [100, 150],
  });

  // Border wrapping the entire label
  doc.setLineWidth(0.5);
  doc.rect(2, 2, 96, 146);

  // Return Address (Top Left)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('FROM:', 5, 8);
  doc.setFont('helvetica', 'normal');
  doc.text('Stock2Door Fulfillment Center', 5, 12);
  doc.text('Warehouse & Logistics Dept', 5, 16);
  doc.text('Sydney, NSW 2000', 5, 20);

  // Postage Paid Placeholder (Top Right)
  doc.rect(70, 5, 25, 20);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('POSTAGE', 73, 11);
  doc.text('PAID', 77, 16);
  doc.text('AUSTRALIA', 72, 21);

  // Divider Line
  doc.setLineWidth(0.5);
  doc.line(2, 30, 98, 30);

  // "SHIP TO" Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SHIP TO:', 5, 38);

  // Receiver Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(order.receiverName ? String(order.receiverName).toUpperCase() : 'UNKNOWN RECEIVER', 15, 46);
  
  doc.setFont('helvetica', 'normal');
  const addressLines = doc.splitTextToSize(order.fullAddress || 'No Address Provided', 80);
  doc.text(addressLines, 15, 52);
  
  // Calculate offset after address
  const offset = 52 + (addressLines.length * 5);
  doc.setFont('helvetica', 'bold');
  const stateZip = `${order.state ? String(order.state).toUpperCase() : ''}  ${order.postcode || ''}`;
  doc.text(stateZip, 15, offset);

  // Mid Divider
  doc.line(2, offset + 10, 98, offset + 10);

  // Order Details Block
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER SUMMARY', 5, offset + 16);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tracking / Order ID: ${order.ebayOrderId || 'N/A'}`, 5, offset + 22);

  // Items Summary
  let y = offset + 28;
  if (order.items && order.items.length > 0) {
    doc.setFontSize(8);
    // Print max 4 items to save space
    order.items.slice(0, 4).forEach((item) => {
      const line = `${item.qty || 1}x ${item.name || 'Item'} (${item.sku || 'N/A'})`;
      const splitLine = doc.splitTextToSize(line, 90);
      doc.text(splitLine, 5, y);
      y += (splitLine.length * 4);
    });
    if (order.items.length > 4) {
      doc.text(`... and ${order.items.length - 4} more item(s)`, 5, y);
    }
  } else {
    doc.setFontSize(8);
    doc.text('No items attached to label.', 5, y);
  }

  // Bottom "Barcode" Placeholder Box
  doc.setLineWidth(0.5);
  doc.rect(10, 115, 80, 25);
  
  // Draw some fake barcode lines for professional look
  doc.setLineWidth(0.8);
  for(let i = 12; i < 88; i+= (Math.random() * 3 + 1)) {
    doc.line(i, 117, i, 133);
  }
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`${order.ebayOrderId || 'STOCK2DOOR'}`, 50, 138, { align: 'center' });

  return doc.output('blob');
}