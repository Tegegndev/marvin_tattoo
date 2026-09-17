import { CartItem } from '../types';

export interface OrderReceiptData {
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  deliveryMethod: 'STUDIO_PICKUP' | 'KAMPALA_DISPATCH' | string;
  deliveryAddress?: string;
  deliveryNotes?: string;
  paymentMethod: 'MTN_MOMO' | 'AIRTEL_MONEY' | 'CARD' | 'CASH' | string;
  paymentStatus?: string;
  items: CartItem[];
  subtotal: number;
  dispatchFee: number;
  total: number;
  createdAt?: string | Date;
}

export function generateReceiptHTML(data: OrderReceiptData): string {
  const dateStr = data.createdAt
    ? new Date(data.createdAt).toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

  const paymentLabel = {
    MTN_MOMO: 'MTN Mobile Money',
    AIRTEL_MONEY: 'Airtel Money',
    CARD: 'Visa / Mastercard',
    CASH: 'Cash on Counter',
  }[data.paymentMethod] || data.paymentMethod;

  const fulfillmentLabel =
    data.deliveryMethod === 'STUDIO_PICKUP'
      ? 'Studio Pickup (New Pioneer Mall, Shop No. Pi55, Level 5, Burton Street, Kampala)'
      : `Kampala Dispatch: ${data.deliveryAddress || 'Address on record'}`;

  const itemsHtml = data.items
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 8px; font-size: 13px; color: #111827; font-weight: 500;">
          <div style="font-weight: 600;">${item.product.name}</div>
          <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">${item.product.category || 'Supplies'}</div>
        </td>
        <td style="padding: 10px 8px; font-size: 13px; text-align: center; color: #374151;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 8px; font-size: 13px; text-align: right; color: #374151; font-family: monospace;">
          UGX ${item.product.price.toLocaleString()}
        </td>
        <td style="padding: 10px 8px; font-size: 13px; text-align: right; font-weight: 600; color: #111827; font-family: monospace;">
          UGX ${(item.product.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official Receipt - ${data.orderNumber} - Marvin Tattoos Atelier</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 20px;
    }
    .receipt-container {
      max-width: 680px;
      margin: 0 auto;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 32px;
      background: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #881337;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #881337;
      margin: 0;
    }
    .brand-sub {
      font-size: 11px;
      color: #4b5563;
      margin-top: 4px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .order-badge {
      text-align: right;
    }
    .order-num {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      font-family: monospace;
    }
    .order-date {
      font-size: 12px;
      color: #6b7280;
      margin-top: 2px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
      background: #f9fafb;
      padding: 16px;
      border-radius: 6px;
      border: 1px solid #f3f4f6;
    }
    .info-block h4 {
      margin: 0 0 6px 0;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      font-weight: 700;
    }
    .info-block p {
      margin: 2px 0;
      font-size: 13px;
      color: #1f2937;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #f3f4f6;
      padding: 10px 8px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #374151;
      font-weight: 700;
      border-bottom: 2px solid #e5e7eb;
    }
    .totals {
      width: 280px;
      margin-left: auto;
      margin-bottom: 28px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
      color: #4b5563;
    }
    .totals-row.grand {
      border-top: 2px solid #881337;
      padding-top: 10px;
      margin-top: 6px;
      font-size: 16px;
      font-weight: 800;
      color: #881337;
    }
    .footer {
      border-top: 1px dashed #d1d5db;
      padding-top: 20px;
      text-align: center;
      font-size: 11px;
      color: #6b7280;
      line-height: 1.6;
    }
    .stamp {
      display: inline-block;
      border: 2px solid #059669;
      color: #059669;
      padding: 4px 12px;
      border-radius: 4px;
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    @media print {
      body {
        padding: 0;
      }
      .receipt-container {
        border: none;
        box-shadow: none;
        padding: 0;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <div>
        <h1 class="brand-title">Marvin Tattoo Studio</h1>
        <div class="brand-sub">Official Order &amp; Fulfillment Receipt</div>
        <div style="font-size: 11px; color: #6b7280; margin-top: 3px;">
          New Pioneer Mall, Shop No. Pi55, Level 5, Burton Street, Kampala · +256 705 748774
        </div>
      </div>
      <div class="order-badge">
        <div class="stamp">OFFICIALLY LOGGED</div>
        <div class="order-num">${data.orderNumber}</div>
        <div class="order-date">${dateStr}</div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-block">
        <h4>Client Information</h4>
        <p><strong>${data.clientName}</strong></p>
        <p>${data.clientPhone}</p>
        <p>${data.clientEmail}</p>
      </div>
      <div class="info-block">
        <h4>Fulfillment &amp; Payment</h4>
        <p><strong>Method:</strong> ${data.deliveryMethod === 'STUDIO_PICKUP' ? 'Studio Pickup' : 'Kampala Dispatch'}</p>
        <p><strong>Location:</strong> ${data.deliveryMethod === 'STUDIO_PICKUP' ? 'New Pioneer Mall, Shop Pi55, Level 5' : data.deliveryAddress || 'Kampala Delivery'}</p>
        <p><strong>Payment:</strong> ${paymentLabel}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align: left;">Item Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Items Subtotal:</span>
        <span style="font-family: monospace;">UGX ${data.subtotal.toLocaleString()}</span>
      </div>
      <div class="totals-row">
        <span>Fulfillment Fee:</span>
        <span style="font-family: monospace;">${data.dispatchFee > 0 ? `UGX ${data.dispatchFee.toLocaleString()}` : 'FREE (Pickup)'}</span>
      </div>
      <div class="totals-row grand">
        <span>Total Amount:</span>
        <span style="font-family: monospace;">UGX ${data.total.toLocaleString()}</span>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;"><strong>Track Order Status:</strong> Present this receipt or your reference code <strong>${data.orderNumber}</strong> to our concierge via WhatsApp at <strong>+256 704 779919</strong> or at the studio counter.</p>
      <p style="margin: 0; color: #9ca3af;">Marvin Tattoos Atelier · Kampala, Uganda · All studio equipment sealed in sterile barrier packaging.</p>
    </div>
  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 400);
    });
  </script>
</body>
</html>`;
}

/**
 * Opens a print-ready window to print or save the receipt as a PDF.
 */
export function printReceipt(data: OrderReceiptData): void {
  const html = generateReceiptHTML(data);
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
