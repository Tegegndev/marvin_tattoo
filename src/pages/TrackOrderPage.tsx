import React, { useState, useEffect } from 'react';
import { PageView, CartItem } from '../types';
import { Icons8 } from '../components/Icons8';
import { trackOrder, initializePayment, verifyPayment } from '../services/apiClient';
import { printReceipt, OrderReceiptData } from '../utils/receiptGenerator';
import { formatPaymentError, UserFriendlyError } from '../utils/paymentErrors';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Re-payment states
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [payMethod, setPayMethod] = useState<'MTN_MOMO' | 'AIRTEL_MONEY' | 'CARD'>('MTN_MOMO');
  const [payPhone, setPayPhone] = useState<string>('');
  const [isInitiatingPay, setIsInitiatingPay] = useState<boolean>(false);
  const [payModalStep, setPayModalStep] = useState<'choose' | 'waiting' | 'success'>('choose');
  const [activeTxRef, setActiveTxRef] = useState<string>('');
  const [cardAuthUrl, setCardAuthUrl] = useState<string | null>(null);
  const [instruction, setInstruction] = useState<string>('');
  const [formattedPayError, setFormattedPayError] = useState<UserFriendlyError | null>(null);
  const [formattedVerifyError, setFormattedVerifyError] = useState<UserFriendlyError | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

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

  // Background polling for payment confirmation when modal is in waiting step
  useEffect(() => {
    if (!showPayModal || payModalStep !== 'waiting' || !activeTxRef) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const result = await verifyPayment(activeTxRef);
        if (!isMounted) return;

        if (result?.status === 'SUCCESS') {
          setPayModalStep('success');
          if (order?.orderNumber) {
            executeTrack(order.orderNumber);
          }
        } else if (result?.status === 'FAILED') {
          const formatted = formatPaymentError(
            result.reason || 'Payment authorization failed or was declined on handset.',
            payMethod
          );
          setFormattedVerifyError(formatted);
        }
      } catch (err) {
        console.warn('TrackOrder payment polling check:', err);
      }
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [showPayModal, payModalStep, activeTxRef, payMethod, order]);

  const openPayModal = () => {
    if (!order) return;
    const initialMethod: 'MTN_MOMO' | 'AIRTEL_MONEY' | 'CARD' =
      order.paymentMethod === 'AIRTEL_MONEY' ? 'AIRTEL_MONEY' : order.paymentMethod === 'CARD' ? 'CARD' : 'MTN_MOMO';
    setPayMethod(initialMethod);
    setPayPhone(order.clientPhone || '');
    setFormattedPayError(null);
    setFormattedVerifyError(null);
    setActiveTxRef('');
    setCardAuthUrl(null);
    setPayModalStep('choose');
    setShowPayModal(true);
  };

  const closePayModal = () => {
    setShowPayModal(false);
    setActiveTxRef('');
    setFormattedPayError(null);
    setFormattedVerifyError(null);
  };

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setIsInitiatingPay(true);
    setFormattedPayError(null);
    try {
      const res = await initializePayment({
        orderNumber: order.orderNumber,
        paymentMethod: payMethod,
        phoneNumber: payPhone,
      });

      const ref = res.merchantTxRef || res.uuid || res.transactionId || '';
      setActiveTxRef(ref);
      setCardAuthUrl(res.authUrl || null);
      setInstruction(
        res.instruction ||
          (payMethod === 'CARD'
            ? 'Please proceed to the secure 3D-Secure card payment gateway.'
            : `A payment prompt has been dispatched to ${payPhone}. Please authorize on your handset by entering your secret PIN.`)
      );
      setPayModalStep('waiting');
    } catch (err: any) {
      const formatted = formatPaymentError(err, payMethod);
      setFormattedPayError(formatted);
    } finally {
      setIsInitiatingPay(false);
    }
  };

  const handleManualVerify = async () => {
    if (!activeTxRef) return;
    setIsVerifying(true);
    setFormattedVerifyError(null);
    try {
      const res = await verifyPayment(activeTxRef);
      if (res?.status === 'SUCCESS') {
        setPayModalStep('success');
        if (order?.orderNumber) {
          executeTrack(order.orderNumber);
        }
      } else if (res?.status === 'FAILED') {
        const formatted = formatPaymentError(res.reason || 'Payment was declined or cancelled.', payMethod);
        setFormattedVerifyError(formatted);
      } else {
        setFormattedVerifyError({
          title: payMethod === 'CARD' ? 'Awaiting Card Confirmation' : 'Awaiting Mobile Money PIN',
          description:
            payMethod === 'CARD'
              ? 'Your card payment has not been confirmed yet. Please complete approval in the gateway portal, then click Check again.'
              : 'Payment authorization has not been detected yet. Please check your phone screen, enter your secret PIN, and click Check again.',
          suggestion: 'Push prompts may take 10–20 seconds depending on telco network load.',
        });
      }
    } catch (err: any) {
      const formatted = formatPaymentError(err, payMethod);
      setFormattedVerifyError(formatted);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTrack(searchQuery);
  };

  const getStatusBadge = (orderStatus: string, paymentStatus?: string) => {
    if (orderStatus === 'CANCELLED') {
      return {
        label: 'Order Cancelled',
        color: 'bg-red-950/80 text-red-400 border-red-700',
        step: 0,
      };
    }
    if (paymentStatus === 'FAILED') {
      return {
        label: 'Payment Failed · Action Required',
        color: 'bg-red-950/80 text-red-400 border-red-700',
        step: 1,
      };
    }
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
      case 'PENDING_PAYMENT':
      default:
        return {
          label: 'Order Logged · Pending Payment',
          color: 'bg-amber-950/80 text-amber-400 border-amber-700',
          step: 1,
        };
    }
  };

  const statusInfo = order ? getStatusBadge(order.orderStatus, order.paymentStatus) : null;
  const isPaymentPending =
    order &&
    order.orderStatus !== 'CANCELLED' &&
    order.paymentStatus !== 'SUCCESS' &&
    order.paymentStatus !== 'PAID';

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
          {/* Prominent Payment Pending / Action Required Banner */}
          {isPaymentPending && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-5 sm:p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xl backdrop-blur-md ${
                order.paymentStatus === 'FAILED'
                  ? 'bg-gradient-to-r from-red-950/60 via-noir-900 to-red-950/30 border-red-800 text-red-100 ring-1 ring-red-700/50'
                  : 'bg-gradient-to-r from-amber-950/50 via-noir-900 to-amber-950/20 border-amber-600/60 text-amber-100 ring-1 ring-amber-500/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    order.paymentStatus === 'FAILED'
                      ? 'bg-red-900/60 border-red-700 text-red-300'
                      : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  }`}
                >
                  <Icons8 name={order.paymentStatus === 'FAILED' ? 'exclamation-circle' : 'credit-card'} size={22} />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-title-editorial text-lg sm:text-xl text-bone uppercase tracking-wide">
                      {order.paymentStatus === 'FAILED'
                        ? 'Payment Authorization Failed'
                        : 'Payment Awaiting Settlement'}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-label-data uppercase border font-semibold ${
                        order.paymentStatus === 'FAILED'
                          ? 'bg-red-950 text-red-300 border-red-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {order.paymentStatus || 'AWAITING_PAYMENT'}
                    </span>
                  </div>
                  <p className="font-body-sm text-xs sm:text-sm text-bone-dim max-w-2xl leading-relaxed">
                    {order.paymentMethod === 'CASH'
                      ? 'This order is recorded as cash upon pickup at our Kampala studio. Prefer to settle securely online now with MTN MoMo, Airtel Money, or Card to guarantee priority packing?'
                      : order.paymentStatus === 'FAILED'
                      ? 'The previous payment attempt was declined or timed out. Your order is logged in our ledger; click Pay Now to authorize via Mobile Money or Card.'
                      : 'Your order is recorded in our atelier ledger, but payment authorization has not completed yet. Authorize now to fast-track sterilization and packing.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openPayModal}
                className="w-full md:w-auto px-6 py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.18em] transition-all btn-gothic-glow border border-crimson/50 rounded-xl flex items-center justify-center gap-2.5 shrink-0 shadow-xl shadow-crimson/30 cursor-pointer"
              >
                <Icons8 name="money-bill-wave" size={16} />
                <span>Pay Now · UGX {(order.totalAmount || 0).toLocaleString()}</span>
                <Icons8 name="arrow-right" size={14} />
              </button>
            </motion.div>
          )}
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
                  { stepNum: 4, title: order.deliveryMethod === 'STUDIO_PICKUP' ? 'Ready for Pickup' : 'Dispatched / Delivered', desc: order.deliveryMethod === 'STUDIO_PICKUP' ? 'New Pioneer Mall, Shop Pi55, Level 5' : 'En route via courier' },
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
                    ? 'New Pioneer Mall, Shop No. Pi55, Level 5, Burton Street, Kampala'
                    : order.deliveryAddress || 'Address on record'}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <p
                    className={`uppercase text-[11px] font-bold ${
                      order.paymentStatus === 'SUCCESS' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    Payment: {order.paymentMethod?.replace('_', ' ') || 'N/A'} ({order.paymentStatus || 'LOGGED'})
                  </p>
                  {isPaymentPending && (
                    <button
                      type="button"
                      onClick={openPayModal}
                      className="text-[11px] font-label-caps uppercase text-crimson-light hover:text-crimson underline cursor-pointer font-bold flex items-center gap-1"
                    >
                      <span>Pay Now</span>
                      <Icons8 name="arrow-right" size={10} />
                    </button>
                  )}
                </div>
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

      {/* Pay Now Re-Initiation Modal */}
      <AnimatePresence>
        {showPayModal && order && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-noir-900 border border-noir-750 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-noir-800 flex items-center justify-between bg-noir-850">
                <div>
                  <span className="font-label-caps text-[10px] uppercase text-gold tracking-widest block">
                    Direct Atelier Checkout
                  </span>
                  <h3 className="font-title-editorial text-lg sm:text-xl text-bone uppercase">
                    Pay For Order #{order.orderNumber}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closePayModal}
                  className="w-8 h-8 rounded-lg bg-noir-800 hover:bg-noir-750 text-bone-dim hover:text-bone border border-noir-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Icons8 name="times" size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {payModalStep === 'choose' && (
                  <form onSubmit={handleInitiatePayment} className="space-y-5">
                    {/* Amount Due Card */}
                    <div className="p-4 rounded-xl bg-noir-850 border border-noir-750 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-bone-muted font-label-caps uppercase">Total Amount Due</span>
                        <p className="text-lg sm:text-xl font-bold font-label-data text-crimson-light">
                          UGX {(order.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-[11px] px-2.5 py-1 rounded bg-noir-800 text-bone-dim border border-noir-700 font-label-data uppercase">
                        Instant Authorization
                      </span>
                    </div>

                    {/* Method Selector */}
                    <div className="space-y-2.5">
                      <label className="block font-label-caps text-xs uppercase text-bone-dim">
                        Select Payment Method
                      </label>
                      <div className="grid grid-cols-1 gap-2.5">
                        {/* MTN */}
                        <button
                          type="button"
                          onClick={() => setPayMethod('MTN_MOMO')}
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            payMethod === 'MTN_MOMO'
                              ? 'bg-amber-950/30 border-amber-500 text-amber-100 ring-1 ring-amber-500/50'
                              : 'bg-noir-850 border-noir-750 text-bone-dim hover:text-bone'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                            <div>
                              <p className="font-label-caps text-xs uppercase font-bold text-bone">MTN Mobile Money</p>
                              <p className="text-[11px] text-bone-dim">Direct USSD PIN prompt on handset</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${payMethod === 'MTN_MOMO' ? 'border-amber-400 bg-amber-400' : 'border-noir-600'}`}>
                            {payMethod === 'MTN_MOMO' && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                          </div>
                        </button>

                        {/* Airtel */}
                        <button
                          type="button"
                          onClick={() => setPayMethod('AIRTEL_MONEY')}
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            payMethod === 'AIRTEL_MONEY'
                              ? 'bg-red-950/30 border-red-500 text-red-100 ring-1 ring-red-500/50'
                              : 'bg-noir-850 border-noir-750 text-bone-dim hover:text-bone'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                            <div>
                              <p className="font-label-caps text-xs uppercase font-bold text-bone">Airtel Money</p>
                              <p className="text-[11px] text-bone-dim">Push authorization prompt on handset</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${payMethod === 'AIRTEL_MONEY' ? 'border-red-400 bg-red-400' : 'border-noir-600'}`}>
                            {payMethod === 'AIRTEL_MONEY' && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                          </div>
                        </button>

                        {/* Card */}
                        <button
                          type="button"
                          onClick={() => setPayMethod('CARD')}
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            payMethod === 'CARD'
                              ? 'bg-crimson/20 border-crimson text-bone ring-1 ring-crimson/50'
                              : 'bg-noir-850 border-noir-750 text-bone-dim hover:text-bone'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icons8 name="credit-card" size={18} className="text-crimson-light shrink-0" />
                            <div>
                              <p className="font-label-caps text-xs uppercase font-bold text-bone">Visa / Mastercard</p>
                              <p className="text-[11px] text-bone-dim">3D-Secure card verification</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${payMethod === 'CARD' ? 'border-crimson bg-crimson' : 'border-noir-600'}`}>
                            {payMethod === 'CARD' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Phone input */}
                    <div>
                      <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1.5">
                        {payMethod === 'CARD' ? 'Billing Contact Number *' : 'Mobile Money Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={payPhone}
                        onChange={(e) => setPayPhone(e.target.value)}
                        placeholder="e.g. +256 770 000 000"
                        className="w-full px-4 py-3 bg-noir-850 border border-noir-750 rounded-lg text-bone font-body-sm text-sm focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/40 placeholder:text-bone-muted/50"
                      />
                      <p className="text-[11px] text-bone-muted mt-1 font-body-sm">
                        {payMethod === 'CARD'
                          ? 'Used for transaction receipt notification and OTP verification.'
                          : 'Must be an active SIM registered for mobile money to receive the PIN request.'}
                      </p>
                    </div>

                    {/* Senior Error Display */}
                    {formattedPayError && (
                      <div className="p-4 bg-red-950/50 border border-red-800/80 rounded-xl text-left space-y-2.5">
                        <div className="flex items-start gap-2.5">
                          <Icons8 name="exclamation-circle" size={18} className="text-red-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-label-caps text-xs uppercase font-bold text-red-200">
                              {formattedPayError.title}
                            </p>
                            <p className="text-xs text-red-300/90 font-body-sm leading-relaxed">
                              {formattedPayError.description}
                            </p>
                          </div>
                        </div>
                        {formattedPayError.suggestion && (
                          <div className="p-2.5 bg-noir-850 rounded-lg border border-noir-750 text-[11px] text-gold flex items-start gap-2">
                            <Icons8 name="info" size={13} className="shrink-0 mt-0.5" />
                            <span>{formattedPayError.suggestion}</span>
                          </div>
                        )}
                        {formattedPayError.suggestMoMo && payMethod === 'CARD' && (
                          <div className="pt-1 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setPayMethod('MTN_MOMO');
                                setFormattedPayError(null);
                              }}
                              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-label-caps uppercase rounded cursor-pointer"
                            >
                              Switch to MTN MoMo
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPayMethod('AIRTEL_MONEY');
                                setFormattedPayError(null);
                              }}
                              className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-label-caps uppercase rounded cursor-pointer"
                            >
                              Switch to Airtel Money
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isInitiatingPay}
                      className="w-full py-3.5 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-bone font-label-caps text-xs uppercase tracking-[0.15em] transition-all btn-gothic-glow border border-crimson/50 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-crimson/25 cursor-pointer"
                    >
                      {isInitiatingPay ? (
                        <>
                          <Icons8 name="spinner" size={16} className="animate-spin" />
                          <span>Initiating Payment...</span>
                        </>
                      ) : (
                        <>
                          <span>Authorize Payment (UGX {(order.totalAmount || 0).toLocaleString()})</span>
                          <Icons8 name="arrow-right" size={14} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {payModalStep === 'waiting' && (
                  <div className="space-y-6 text-center">
                    {/* Pulsing Icon */}
                    <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-crimson/20 animate-ping" />
                      <div className="relative w-16 h-16 rounded-full bg-noir-850 border border-crimson/40 flex items-center justify-center text-crimson-light shadow-xl">
                        {payMethod === 'CARD' ? (
                          <Icons8 name="credit-card" size={28} />
                        ) : (
                          <Icons8 name="mobile" size={28} />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-title-editorial text-xl text-bone uppercase">
                        {payMethod === 'CARD' ? 'Complete Card Checkout' : 'Check Your Phone Screen'}
                      </h4>
                      <p className="font-body-sm text-xs sm:text-sm text-bone-dim leading-relaxed max-w-md mx-auto">
                        {instruction}
                      </p>
                    </div>

                    {/* Card gateway redirect link */}
                    {payMethod === 'CARD' && cardAuthUrl && (
                      <div className="p-4 bg-noir-850 border border-noir-750 rounded-xl text-left space-y-3">
                        <div className="flex items-center justify-between border-b border-noir-800 pb-2">
                          <span className="font-label-caps text-xs uppercase text-bone font-bold">Official Card Portal</span>
                          <span className="text-[11px] text-emerald-400 font-label-data flex items-center gap-1">
                            <Icons8 name="shield-alt" size={12} />
                            <span>Encrypted SSL</span>
                          </span>
                        </div>
                        <p className="text-xs text-bone-dim">
                          Click below to open the official gateway authorization window in a new tab:
                        </p>
                        <a
                          href={cardAuthUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                        >
                          <span>Open 3D Secure Portal</span>
                          <Icons8 name="arrow-right" size={14} />
                        </a>
                      </div>
                    )}

                    {/* Formatted Verification Error */}
                    {formattedVerifyError && (
                      <div className="p-4 bg-red-950/50 border border-red-800/80 rounded-xl text-left space-y-2.5">
                        <div className="flex items-start gap-2.5">
                          <Icons8 name="exclamation-circle" size={18} className="text-red-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-label-caps text-xs uppercase font-bold text-red-200">
                              {formattedVerifyError.title}
                            </p>
                            <p className="text-xs text-red-300/90 font-body-sm leading-relaxed">
                              {formattedVerifyError.description}
                            </p>
                          </div>
                        </div>
                        {formattedVerifyError.suggestion && (
                          <div className="p-2.5 bg-noir-850 rounded-lg border border-noir-750 text-[11px] text-gold flex items-start gap-2">
                            <Icons8 name="info" size={13} className="shrink-0 mt-0.5" />
                            <span>{formattedVerifyError.suggestion}</span>
                          </div>
                        )}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setPayModalStep('choose');
                              setFormattedVerifyError(null);
                            }}
                            className="px-3 py-1.5 bg-noir-800 hover:bg-noir-750 text-bone text-xs font-label-caps uppercase rounded border border-noir-700 cursor-pointer"
                          >
                            Try Different Method
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Status Pill & Manual Verify */}
                    <div className="space-y-3 pt-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-noir-850 border border-noir-750 text-xs text-bone-dim font-label-data">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span>Awaiting network settlement...</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          onClick={handleManualVerify}
                          disabled={isVerifying}
                          className="flex-1 py-3 bg-noir-800 hover:bg-noir-750 text-bone font-label-caps text-xs uppercase tracking-wider rounded-xl border border-noir-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isVerifying ? (
                            <>
                              <Icons8 name="spinner" size={14} className="animate-spin" />
                              <span>Checking Status...</span>
                            </>
                          ) : (
                            <>
                              <Icons8 name="check-circle" size={14} />
                              <span>I Have Paid · Check Status</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPayModalStep('choose');
                            setFormattedVerifyError(null);
                          }}
                          className="px-4 py-3 bg-transparent hover:bg-noir-800 text-bone-muted hover:text-bone font-label-caps text-xs uppercase rounded-xl border border-transparent hover:border-noir-750 transition-colors cursor-pointer"
                        >
                          Change Method
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {payModalStep === 'success' && (
                  <div className="space-y-6 text-center py-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-600 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/40">
                      <Icons8 name="check-circle" size={40} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-title-editorial text-2xl text-bone uppercase">
                        Payment Confirmed!
                      </h4>
                      <p className="font-body-sm text-sm text-bone-dim max-w-sm mx-auto leading-relaxed">
                        Your payment of <span className="text-gold font-bold">UGX {(order.totalAmount || 0).toLocaleString()}</span> has been verified. Order <span className="text-bone font-mono">#{order.orderNumber}</span> is now moving to studio packing & sterilization.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closePayModal}
                      className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-label-caps text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-lg shadow-emerald-950/40"
                    >
                      View Updated Order
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
