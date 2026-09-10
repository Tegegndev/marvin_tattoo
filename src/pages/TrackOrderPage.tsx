import React, { useState, useEffect } from 'react';
import { PageView, CartItem } from '../types';
import { Icons8 } from '../components/Icons8';
import { trackOrder } from '../services/apiClient';
import { printReceipt, OrderReceiptData } from '../utils/receiptGenerator';
import { motion } from 'framer-motion';

interface TrackOrderPageProps {
  initialOrderNumber?: string;
  onNavigate: (page: PageView) => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({
  initialOrderNumber = '',
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialOrderNumber);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const executeTrack = async (orderNum: string) => {
    if (!orderNum.trim()) {
      setError('Please enter a valid order reference number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await trackOrder(orderNum.trim());
      setOrder(data);
    } catch (err: any) {
      console.error('Track order error:', err);
      setOrder(null);
      setError(err.message || 'No order matching this reference was found in our atelier ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      setSearchQuery(initialOrderNumber);
      executeTrack(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTrack(searchQuery);
  };

  const getStatusBadge = (orderStatus: string) => {
    switch (orderStatus) {
      case 'DELIVERED':
      case 'COMPLETED':
        return {
          label: 'Completed & Delivered',
          color: 'bg-emerald-950/80 text-emerald-400 border-emerald-700',
          step: 4,
        };
      case 'DISPATCHED':
      case 'READY_FOR_PICKUP':
        return {
          label: order?.deliveryMethod === 'STUDIO_PICKUP' ? 'Ready for Studio Pickup' : 'Dispatched via Courier',
          color: 'bg-gold/20 text-gold border-gold/50',
          step: 3,
        };
      case 'PROCESSING':
      case 'PREPARING':
        return {
          label: 'Studio Packing & Sterilization',
          color: 'bg-blue-950/80 text-blue-400 border-blue-700',
          step: 2,
        };
      case 'CANCELLED':
        return {
          label: 'Order Cancelled',
          color: 'bg-red-950/80 text-red-400 border-red-700',
          step: 0,
        };
      case 'PENDING_PAYMENT':
      default:
        return {
          label: 'Order Logged · Pending Confirmation',
          color: 'bg-amber-950/80 text-amber-400 border-amber-700',
          step: 1,
        };
    }
  };

  const statusInfo = order ? getStatusBadge(order.orderStatus) : null;

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto min-h-[80vh]">
      {/* Top Breadcrumb */}
      <button
        onClick={() => onNavigate('equipment')}
        className="inline-flex items-center gap-2 text-xs font-label-caps uppercase text-bone-muted hover:text-crimson-light transition-colors mb-4 cursor-pointer"
      >
        <Icons8 name="arrow-left" size={13} />
        <span>Return to Studio Shop</span>
      </button>

      {/* Header */}
      <div className="mb-8 space-y-2">
        <h1 className="font-title-editorial text-2xl sm:text-3xl lg:text-4xl text-bone uppercase tracking-tight">
          Track Order Status
        </h1>
        <p className="font-body-sm text-sm text-bone-dim max-w-2xl leading-relaxed">
          Enter your official order reference (e.g. <span className="text-gold font-mono">ORD-2026-XXXX</span>) to view live dispatch, fulfillment stage, and order details.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3 bg-noir-900 border border-noir-800 p-2 sm:p-2.5 rounded-xl shadow-xl">
          <div className="relative flex-1 flex items-center">
            <Icons8 name="search" size={18} className="absolute left-3.5 text-bone-muted" />
            <input
              type="text"
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Order # (e.g. ORD-2026-4821)"
              className="w-full pl-10 pr-4 py-3 bg-noir-850 border border-noir-750 rounded-lg text-bone font-mono text-sm focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/40 transition-colors placeholder:font-sans placeholder:text-bone-muted/50 uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-bone font-label-caps text-xs uppercase tracking-[0.2em] transition-all btn-gothic-glow border border-crimson/40 rounded-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {loading ? (
              <>
                <Icons8 name="spinner" size={15} className="animate-spin" />
                <span>Checking Ledger...</span>
              </>
            ) : (
              <>
                <span>Track Order</span>
                <Icons8 name="arrow-right" size={14} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-red-950/60 border border-red-800 text-red-200 text-sm font-body-sm rounded-xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <Icons8 name="exclamation-circle" size={20} className="shrink-0 text-red-400 mt-0.5" />
            <div>
              <p className="font-bold">Order Lookup Notice</p>
              <p className="text-xs text-red-300/90 mt-0.5">{error}</p>
            </div>
          </div>
          <a
            href="https://wa.me/256704779919?text=Hello%20Marvin%20Tattoos%20Atelier,%20I%20need%20help%20tracking%20my%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-noir-900 border border-red-700/60 hover:bg-red-900/40 text-bone font-label-caps text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shrink-0 transition-colors"
          >
            <Icons8 name="whatsapp" size={14} className="text-emerald-400" />
            <span>Ask Concierge</span>
          </a>
        </motion.div>
      )}

      {/* Order Result Card */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          {/* Status & Tracker Box */}
          <div className="bg-noir-900 border border-noir-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-noir-800 pb-6">
              <div>
                <span className="font-label-caps text-[10px] uppercase text-bone-muted tracking-widest block mb-1">
                  Official Order Reference
                </span>
                <h2 className="font-title-editorial text-xl sm:text-2xl text-bone uppercase">
                  {order.orderNumber}
                </h2>
                <p className="font-label-data text-xs text-bone-dim mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { dateStyle: 'medium' })} at{' '}
                  {new Date(order.createdAt).toLocaleTimeString('en-GB', { timeStyle: 'short' })}
                </p>
              </div>

              {statusInfo && (
                <div className={`px-4 py-2 rounded-lg border font-label-caps text-xs uppercase tracking-wider font-bold ${statusInfo.color} shrink-0`}>
                  {statusInfo.label}
                </div>
              )}
            </div>

            {/* Stepper Timeline */}
            <div className="py-2">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { stepNum: 1, title: 'Order Logged', desc: 'Recorded in atelier ledger' },
                  { stepNum: 2, title: 'Payment & Verification', desc: 'Payment approved & checked' },
                  { stepNum: 3, title: 'Sterilization & Packing', desc: 'Sealed in sterile pack' },
                  { stepNum: 4, title: order.deliveryMethod === 'STUDIO_PICKUP' ? 'Ready for Pickup' : 'Dispatched / Delivered', desc: order.deliveryMethod === 'STUDIO_PICKUP' ? 'Level 5 Pioneer Mall' : 'En route via courier' },
                ].map((s) => {
                  const isCurrent = statusInfo && statusInfo.step === s.stepNum;
                  const isPassed = statusInfo && statusInfo.step > s.stepNum;

                  return (
                    <div
                      key={s.stepNum}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-crimson/15 border-crimson text-bone ring-1 ring-crimson/40'
                          : isPassed
                          ? 'bg-noir-850 border-noir-750 text-emerald-400'
                          : 'bg-noir-950 border-noir-800/80 text-bone-muted opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`w-5 h-5 rounded-full text-center text-[10px] leading-5 font-bold font-mono ${
                          isPassed ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : isCurrent ? 'bg-crimson text-white' : 'bg-noir-800 text-bone-dim'
                        }`}>
                          {isPassed ? '✓' : s.stepNum}
                        </span>
                        <span className="font-label-caps text-xs uppercase font-bold text-bone">
                          {s.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-bone-dim pl-7">
                        {s.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Client & Fulfillment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-noir-850 border border-noir-750 rounded-xl space-y-1.5 text-xs font-label-data">
                <span className="font-label-caps text-[10px] uppercase text-gold tracking-wider block pb-1 border-b border-noir-800">
                  Customer &amp; Contact
                </span>
                <p className="text-bone font-medium text-sm pt-1">{order.clientName}</p>
                <p className="text-bone-dim">{order.clientPhone}</p>
                <p className="text-bone-dim">{order.clientEmail}</p>
              </div>

              <div className="p-4 bg-noir-850 border border-noir-750 rounded-xl space-y-1.5 text-xs font-label-data">
                <span className="font-label-caps text-[10px] uppercase text-gold tracking-wider block pb-1 border-b border-noir-800">
                  Fulfillment &amp; Location
                </span>
                <p className="text-bone font-medium text-sm pt-1">
                  {order.deliveryMethod === 'STUDIO_PICKUP' ? 'Studio Counter Pickup' : 'Kampala Courier Dispatch'}
                </p>
                <p className="text-bone-dim">
                  {order.deliveryMethod === 'STUDIO_PICKUP'
                    ? 'Level 5, New Pioneer Mall, Kampala'
                    : order.deliveryAddress || 'Address on record'}
                </p>
                <p className="text-emerald-400 uppercase text-[11px] pt-0.5">
                  Payment: {order.paymentMethod?.replace('_', ' ') || 'N/A'} ({order.paymentStatus || 'LOGGED'})
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-noir-800 rounded-xl overflow-hidden bg-noir-850/60">
              <div className="p-3.5 bg-noir-800 border-b border-noir-750 font-label-caps text-xs uppercase text-bone flex items-center justify-between">
                <span>Ordered Equipment &amp; Supplies</span>
                <span>{order.items?.length || 0} items</span>
              </div>
              <div className="divide-y divide-noir-800">
                {(order.items || []).map((item: any) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between gap-4 text-xs font-label-data">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.product?.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover bg-noir-950 rounded border border-noir-700 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-bone font-medium truncate">{item.product?.name || 'Studio Item'}</p>
                        <p className="text-bone-muted text-[11px]">{item.quantity} x UGX {(item.unitPrice || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-gold font-bold shrink-0">
                      UGX {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-noir-950 border-t border-noir-750 flex justify-between items-center text-sm font-label-data">
                <span className="font-label-caps uppercase text-bone font-bold">Total Order Value:</span>
                <span className="text-crimson-light font-bold text-base">
                  UGX {(order.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions: Download PDF Receipt & WhatsApp Concierge */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const receiptData: OrderReceiptData = {
                    orderNumber: order.orderNumber,
                    clientName: order.clientName,
                    clientPhone: order.clientPhone,
                    clientEmail: order.clientEmail,
                    deliveryMethod: order.deliveryMethod,
                    deliveryAddress: order.deliveryAddress,
                    deliveryNotes: order.deliveryNotes,
                    paymentMethod: order.paymentMethod,
                    items: (order.items || []).map((i: any) => ({
                      product: {
                        id: i.productId,
                        name: i.product?.name || 'Studio Item',
                        category: i.product?.category || 'Supplies',
                        price: i.unitPrice || 0,
                        description: '',
                        image: i.product?.imageUrl || '',
                      },
                      quantity: i.quantity || 1,
                    })),
                    subtotal: order.totalAmount,
                    dispatchFee: order.deliveryMethod === 'KAMPALA_DISPATCH' ? 10000 : 0,
                    total: order.totalAmount,
                    createdAt: order.createdAt,
                  };
                  printReceipt(receiptData);
                }}
                className="flex-1 py-3.5 bg-gold hover:bg-gold-light text-noir-950 font-label-caps text-xs uppercase tracking-wider font-bold transition-all rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Icons8 name="print" size={16} />
                <span>Download / Print PDF Receipt</span>
              </button>

              <a
                href={`https://wa.me/256704779919?text=Hello%20Marvin%20Tattoos%20Atelier,%20I%20am%20inquiring%20about%20Order%20${encodeURIComponent(order.orderNumber)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-label-caps text-xs uppercase tracking-widest transition-colors rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                <Icons8 name="whatsapp" size={18} />
                <span>Message Concierge on WhatsApp</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
