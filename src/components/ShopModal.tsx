import React, { useState } from 'react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons8 } from './Icons8';
import { createShopOrder, initializePayment } from '../services/apiClient';
import confetti from 'canvas-confetti';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'payment_prompt' | 'confirmed'>('cart');
  const [deliveryMethod, setDeliveryMethod] = useState<'STUDIO_PICKUP' | 'KAMPALA_DISPATCH'>('STUDIO_PICKUP');
  const [paymentMethod, setPaymentMethod] = useState<'MTN_MOMO' | 'AIRTEL_MONEY' | 'CARD' | 'CASH'>('MTN_MOMO');
  const [showCartRecap, setShowCartRecap] = useState(false);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState(false);

  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [paymentInstruction, setPaymentInstruction] = useState<string>('');

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const dispatchFee = deliveryMethod === 'KAMPALA_DISPATCH' ? 10000 : 0;
  const total = subtotal + dispatchFee;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // 1. Create order
      const orderPayload = {
        clientName: shippingData.fullName,
        clientPhone: shippingData.phone,
        clientEmail: shippingData.email,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'KAMPALA_DISPATCH' ? shippingData.address : 'Studio Pickup (Level 5, New Pioneer Mall)',
        deliveryNotes: shippingData.notes || undefined,
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const orderResult = await createShopOrder(orderPayload);
      setCreatedOrder(orderResult);

      // 2. Initialize Payment if MoMo or Card
      if (paymentMethod === 'MTN_MOMO' || paymentMethod === 'AIRTEL_MONEY' || paymentMethod === 'CARD') {
        const paymentRes = await initializePayment({
          orderNumber: orderResult.orderNumber,
          paymentMethod,
          phoneNumber: shippingData.phone,
        });

        setPaymentInstruction(paymentRes.instruction || 'Please authorize the payment prompt on your phone with your secret PIN.');
        setCheckoutStep('payment_prompt');
      } else {
        setCheckoutStep('confirmed');
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#991b1b', '#d4af37', '#e5e2e1'],
        });
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'Failed to place order. Please check your details or reach out via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompletePaymentConfirmation = () => {
    setCheckoutStep('confirmed');
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#991b1b', '#d4af37', '#e5e2e1'],
    });
  };

  const handleCopyOrderNumber = () => {
    if (createdOrder?.orderNumber) {
      navigator.clipboard.writeText(createdOrder.orderNumber);
      setCopiedOrderNumber(true);
      setTimeout(() => setCopiedOrderNumber(false), 2500);
    }
  };

  const handleResetAndClose = () => {
    onClearCart();
    setCheckoutStep('cart');
    setCreatedOrder(null);
    setErrorMessage('');
    setShowCartRecap(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Sliding Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-lg bg-noir-900 border-l border-noir-700/80 flex flex-col justify-between shadow-2xl"
            >
              {/* Header with Step Tracker */}
              <div className="p-5 sm:p-6 border-b border-noir-700/80 bg-noir-850/90 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-crimson/20 border border-crimson/40 text-crimson-light flex items-center justify-center">
                      <Icons8 name="shopping-bag" size={18} />
                    </div>
                    <div>
                      <h3 className="font-title-editorial text-base sm:text-lg uppercase text-bone tracking-wide">
                        Atelier Checkout &amp; Bag
                      </h3>
                      <p className="font-label-data text-[11px] text-bone-dim">
                        Kampala Studio · Sterile &amp; Authentic Supplies
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded border border-noir-700 bg-noir-800 text-bone-dim hover:text-bone hover:border-crimson/50 transition-colors flex items-center justify-center"
                    aria-label="Close cart"
                  >
                    <Icons8 name="times" size={16} />
                  </button>
                </div>

                {/* Visual Step Indicator */}
                <div className="mt-4 pt-3 border-t border-noir-750 flex items-center justify-between text-[10px] font-label-caps uppercase tracking-wider">
                  <div className={`flex items-center gap-1.5 ${checkoutStep === 'cart' ? 'text-crimson-light font-bold' : 'text-bone-muted'}`}>
                    <span className={`w-4 h-4 rounded-full text-center leading-4 text-[9px] ${checkoutStep === 'cart' ? 'bg-crimson text-white' : 'bg-noir-800 border border-noir-700'}`}>1</span>
                    <span>Bag</span>
                  </div>
                  <div className="h-[1px] w-6 bg-noir-750" />
                  <div className={`flex items-center gap-1.5 ${checkoutStep === 'checkout' ? 'text-crimson-light font-bold' : 'text-bone-muted'}`}>
                    <span className={`w-4 h-4 rounded-full text-center leading-4 text-[9px] ${checkoutStep === 'checkout' ? 'bg-crimson text-white' : 'bg-noir-800 border border-noir-700'}`}>2</span>
                    <span>Details</span>
                  </div>
                  <div className="h-[1px] w-6 bg-noir-750" />
                  <div className={`flex items-center gap-1.5 ${checkoutStep === 'payment_prompt' ? 'text-crimson-light font-bold' : checkoutStep === 'confirmed' ? 'text-emerald-400 font-bold' : 'text-bone-muted'}`}>
                    <span className={`w-4 h-4 rounded-full text-center leading-4 text-[9px] ${checkoutStep === 'payment_prompt' ? 'bg-amber-500 text-black' : checkoutStep === 'confirmed' ? 'bg-emerald-500 text-black' : 'bg-noir-800 border border-noir-700'}`}>3</span>
                    <span>{checkoutStep === 'confirmed' ? 'Confirmed' : 'Payment'}</span>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* Step 1: Cart Items */}
                {checkoutStep === 'cart' && (
                  <>
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-noir-800 border border-noir-700 flex items-center justify-center text-bone-dim">
                          <Icons8 name="shopping-bag" size={28} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-title-editorial text-lg text-bone">
                            Your Bag is Empty
                          </p>
                          <p className="font-body-sm text-xs text-bone-dim max-w-xs leading-relaxed">
                            Browse professional machines, cartridges, sterile piercing jewelry, and hospital-grade aftercare.
                          </p>
                        </div>
                        <button
                          onClick={onClose}
                          className="px-6 py-2.5 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700"
                        >
                          Explore Equipment
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-bone-dim pb-1 border-b border-noir-800">
                          <span className="font-label-caps uppercase text-[10px] tracking-wider">
                            Selected Items ({cart.length})
                          </span>
                          <button
                            onClick={onClearCart}
                            className="text-[11px] text-bone-muted hover:text-red-400 transition-colors underline"
                          >
                            Clear All
                          </button>
                        </div>

                        <div className="space-y-3">
                          {cart.map((item) => (
                            <div
                              key={item.product.id}
                              className="p-3.5 bg-noir-850/80 border border-noir-700/80 rounded flex gap-3.5 items-center hover:border-noir-600 transition-colors"
                            >
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover bg-noir-950 rounded shrink-0 border border-noir-700"
                              />
                              <div className="flex-1 min-w-0 space-y-1">
                                <span className="font-label-caps text-[9px] text-crimson-light uppercase tracking-wider block">
                                  {item.product.category}
                                </span>
                                <h4 className="font-title-editorial text-xs sm:text-sm text-bone uppercase truncate">
                                  {item.product.name}
                                </h4>
                                <div className="font-label-data text-xs text-gold font-bold">
                                  UGX {item.product.price.toLocaleString()}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2.5">
                                <button
                                  onClick={() => onRemoveItem(item.product.id)}
                                  className="text-bone-muted hover:text-red-400 transition-colors p-1"
                                  title="Remove item"
                                >
                                  <Icons8 name="trash-alt" size={14} />
                                </button>
                                <div className="flex items-center border border-noir-700 bg-noir-950 rounded overflow-hidden">
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                                    className="p-1.5 hover:bg-noir-850 text-bone-dim hover:text-bone transition-colors"
                                    aria-label="Decrease quantity"
                                  >
                                    <Icons8 name="minus" size={10} />
                                  </button>
                                  <span className="px-2 font-label-data text-xs text-bone min-w-[20px] text-center font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                                    className="p-1.5 hover:bg-noir-850 text-bone-dim hover:text-bone transition-colors"
                                    aria-label="Increase quantity"
                                  >
                                    <Icons8 name="plus" size={10} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Subtotal Breakdown */}
                        <div className="p-4 bg-noir-950 border border-noir-750 rounded space-y-2.5 font-label-data text-xs">
                          <div className="flex justify-between text-bone-dim">
                            <span>Bag Subtotal</span>
                            <span className="text-bone font-medium">UGX {subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-bone-dim">
                            <span>Estimated Dispatch</span>
                            <span className="text-gold">Calculated next step</span>
                          </div>
                          <div className="pt-2 border-t border-noir-800 flex justify-between text-sm text-bone font-bold">
                            <span>Grand Subtotal</span>
                            <span className="text-crimson-light">UGX {subtotal.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Guarantee note */}
                        <div className="p-3 bg-noir-850/40 border border-noir-800 rounded flex items-center gap-2.5 text-bone-dim text-[11px] font-body-sm">
                          <Icons8 name="shield-alt" size={16} className="text-gold shrink-0" />
                          <span>All items sealed in sterile packaging with genuine manufacturer certification.</span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Step 2: Checkout Form */}
                {checkoutStep === 'checkout' && (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                    {/* Collapsible Order Summary Recap */}
                    <div className="border border-noir-750 bg-noir-850/60 rounded overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowCartRecap(!showCartRecap)}
                        className="w-full p-3 flex items-center justify-between text-xs text-bone hover:bg-noir-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 font-label-caps uppercase tracking-wider text-[11px]">
                          <Icons8 name="shopping-bag" size={14} className="text-crimson-light" />
                          <span>Order Summary ({cart.length} item{cart.length === 1 ? '' : 's'})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-label-data text-gold font-bold">UGX {total.toLocaleString()}</span>
                          <Icons8 name={showCartRecap ? "angle-up" : "angle-down"} size={12} className="text-bone-muted" />
                        </div>
                      </button>

                      {showCartRecap && (
                        <div className="p-3 pt-0 border-t border-noir-800 space-y-2 max-h-48 overflow-y-auto">
                          {cart.map((item) => (
                            <div key={item.product.id} className="flex justify-between items-center text-xs py-1 border-b border-noir-800/50 last:border-none">
                              <span className="text-bone-dim truncate pr-2">
                                {item.quantity}x {item.product.name}
                              </span>
                              <span className="text-bone font-label-data shrink-0">
                                UGX {(item.product.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                          <div className="pt-2 flex justify-between items-center text-xs text-bone font-label-caps">
                            <button
                              type="button"
                              onClick={() => setCheckoutStep('cart')}
                              className="text-crimson-light underline uppercase text-[10px]"
                            >
                              Edit Items
                            </button>
                            <span className="text-[10px] text-bone-muted">
                              {deliveryMethod === 'KAMPALA_DISPATCH' ? '+UGX 10,000 Dispatch' : 'Free Studio Pickup'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {errorMessage && (
                      <div className="p-3 bg-red-950/70 border border-red-800 text-red-300 text-xs font-body-sm rounded flex items-start gap-2">
                        <Icons8 name="exclamation-circle" size={16} className="shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Contact Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-label-caps uppercase text-bone tracking-wider">
                        <span className="w-1.5 h-1.5 bg-crimson rounded-full" />
                        <span>1. Customer &amp; Contact Details</span>
                      </div>

                      <div>
                        <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                          Full Name *
                        </label>
                        <input
                          required
                          type="text"
                          autoComplete="name"
                          value={shippingData.fullName}
                          onChange={(e) =>
                            setShippingData({ ...shippingData, fullName: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 rounded text-bone font-body-sm text-sm focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/40 transition-colors"
                          placeholder="e.g. Ronald Kigozi"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                            Phone (MoMo / Airtel) *
                          </label>
                          <input
                            required
                            type="tel"
                            autoComplete="tel"
                            value={shippingData.phone}
                            onChange={(e) =>
                              setShippingData({ ...shippingData, phone: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 rounded text-bone font-body-sm text-sm focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/40 transition-colors"
                            placeholder="+256 700 000000"
                          />
                        </div>
                        <div>
                          <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                            Email Address *
                          </label>
                          <input
                            required
                            type="email"
                            autoComplete="email"
                            value={shippingData.email}
                            onChange={(e) =>
                              setShippingData({ ...shippingData, email: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 rounded text-bone font-body-sm text-sm focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/40 transition-colors"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delivery Option */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-label-caps uppercase text-bone tracking-wider">
                        <span className="w-1.5 h-1.5 bg-crimson rounded-full" />
                        <span>2. Fulfillment Method</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('STUDIO_PICKUP')}
                          className={`p-3.5 text-left border rounded transition-all flex flex-col justify-between ${
                            deliveryMethod === 'STUDIO_PICKUP'
                              ? 'bg-crimson/15 border-crimson text-bone shadow-md shadow-crimson/10'
                              : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone hover:border-noir-600'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-label-caps text-xs uppercase font-bold text-bone">
                              Studio Pickup
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800 font-label-data uppercase">
                              FREE
                            </span>
                          </div>
                          <span className="text-[11px] text-bone-muted leading-tight">
                            Pioneer Mall Level 5 · Ready in 1-2 hours
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('KAMPALA_DISPATCH')}
                          className={`p-3.5 text-left border rounded transition-all flex flex-col justify-between ${
                            deliveryMethod === 'KAMPALA_DISPATCH'
                              ? 'bg-crimson/15 border-crimson text-bone shadow-md shadow-crimson/10'
                              : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone hover:border-noir-600'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-label-caps text-xs uppercase font-bold text-bone">
                              Kampala Dispatch
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/40 font-label-data uppercase">
                              +10,000 UGX
                            </span>
                          </div>
                          <span className="text-[11px] text-bone-muted leading-tight">
                            Express Boda / Courier across Kampala
                          </span>
                        </button>
                      </div>

                      {deliveryMethod === 'KAMPALA_DISPATCH' && (
                        <div className="space-y-2 pt-1">
                          <div>
                            <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                              Delivery Address &amp; Landmark *
                            </label>
                            <input
                              required
                              type="text"
                              autoComplete="street-address"
                              value={shippingData.address}
                              onChange={(e) =>
                                setShippingData({ ...shippingData, address: e.target.value })
                              }
                              className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 rounded text-bone font-body-sm text-sm focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/40"
                              placeholder="e.g. Acacia Mall / Plot 14 Bukoto St / Kololo"
                            />
                          </div>
                          <div>
                            <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                              Delivery Notes / Instructions (Optional)
                            </label>
                            <input
                              type="text"
                              value={shippingData.notes}
                              onChange={(e) =>
                                setShippingData({ ...shippingData, notes: e.target.value })
                              }
                              className="w-full px-3.5 py-2 bg-noir-850 border border-noir-700 rounded text-bone font-body-sm text-xs focus:outline-none focus:border-crimson"
                              placeholder="e.g. Call upon arrival at gate"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-label-caps uppercase text-bone tracking-wider">
                        <span className="w-1.5 h-1.5 bg-crimson rounded-full" />
                        <span>3. Payment Method</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        {/* MTN MoMo */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('MTN_MOMO')}
                          className={`p-3 text-left border rounded transition-all flex flex-col gap-1 ${
                            paymentMethod === 'MTN_MOMO'
                              ? 'bg-amber-950/30 border-amber-500/80 text-amber-200 ring-1 ring-amber-500/50'
                              : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone hover:border-noir-600'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-label-caps text-xs uppercase font-bold">MTN MoMo</span>
                            <div className="w-2.5 h-2.5 rounded-full border border-amber-400/80 flex items-center justify-center">
                              {paymentMethod === 'MTN_MOMO' && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
                            </div>
                          </div>
                          <span className="text-[10px] text-bone-muted">Mobile Money</span>
                        </button>

                        {/* Airtel Money */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('AIRTEL_MONEY')}
                          className={`p-3 text-left border rounded transition-all flex flex-col gap-1 ${
                            paymentMethod === 'AIRTEL_MONEY'
                              ? 'bg-red-950/30 border-red-500/80 text-red-200 ring-1 ring-red-500/50'
                              : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone hover:border-noir-600'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-label-caps text-xs uppercase font-bold">Airtel Money</span>
                            <div className="w-2.5 h-2.5 rounded-full border border-red-400/80 flex items-center justify-center">
                              {paymentMethod === 'AIRTEL_MONEY' && <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />}
                            </div>
                          </div>
                          <span className="text-[10px] text-bone-muted">Airtel Money</span>
                        </button>

                        {/* Card */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('CARD')}
                          className={`p-3 text-left border rounded transition-all flex flex-col gap-1 ${
                            paymentMethod === 'CARD'
                              ? 'bg-crimson/20 border-crimson text-bone ring-1 ring-crimson/50'
                              : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone hover:border-noir-600'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-label-caps text-xs uppercase font-bold">Visa / Master</span>
                            <div className="w-2.5 h-2.5 rounded-full border border-crimson/80 flex items-center justify-center">
                              {paymentMethod === 'CARD' && <div className="w-1.5 h-1.5 bg-crimson rounded-full" />}
                            </div>
                          </div>
                          <span className="text-[10px] text-bone-muted">Debit / Credit Card</span>
                        </button>

                        {/* Cash */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('CASH')}
                          className={`p-3 text-left border rounded transition-all flex flex-col gap-1 ${
                            paymentMethod === 'CASH'
                              ? 'bg-crimson/20 border-crimson text-bone ring-1 ring-crimson/50'
                              : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone hover:border-noir-600'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-label-caps text-xs uppercase font-bold">Cash on Pickup</span>
                            <div className="w-2.5 h-2.5 rounded-full border border-crimson/80 flex items-center justify-center">
                              {paymentMethod === 'CASH' && <div className="w-1.5 h-1.5 bg-crimson rounded-full" />}
                            </div>
                          </div>
                          <span className="text-[10px] text-bone-muted">Studio Counter</span>
                        </button>
                      </div>
                    </div>

                    {/* Order Summary Total Box */}
                    <div className="p-4 bg-noir-950 border border-noir-750 rounded space-y-2">
                      <div className="flex justify-between text-xs font-label-data text-bone-dim">
                        <span>Items Subtotal:</span>
                        <span>UGX {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs font-label-data text-bone-dim">
                        <span>Fulfillment ({deliveryMethod === 'STUDIO_PICKUP' ? 'Pickup' : 'Dispatch'}):</span>
                        <span className={deliveryMethod === 'STUDIO_PICKUP' ? 'text-emerald-400' : 'text-gold'}>
                          {deliveryMethod === 'STUDIO_PICKUP' ? 'FREE' : `+UGX ${dispatchFee.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-noir-800 flex justify-between items-center">
                        <span className="font-label-caps text-xs uppercase text-bone font-bold">Total Amount Due:</span>
                        <span className="text-crimson-light text-base font-bold font-label-data">
                          UGX {total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-bone font-label-caps text-xs uppercase tracking-[0.18em] transition-all btn-gothic-glow border border-crimson/30 rounded flex items-center justify-center gap-2 shadow-lg shadow-crimson/20"
                    >
                      {isSubmitting ? (
                        <>
                          <Icons8 name="spinner" size={16} className="animate-spin" />
                          <span>Processing Order...</span>
                        </>
                      ) : (
                        <span>Complete Order &amp; Pay (UGX {total.toLocaleString()})</span>
                      )}
                    </button>
                  </form>
                )}

                {/* Step 3: Payment Prompt / USSD Instruction */}
                {checkoutStep === 'payment_prompt' && (
                  <div className="text-center py-6 space-y-5">
                    <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/60 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                      <Icons8 name="mobile-alt" size={30} />
                    </div>

                    <div className="space-y-2">
                      <span className="font-label-caps text-[10px] text-gold uppercase tracking-widest block">
                        Mobile Payment Authorization
                      </span>
                      <h4 className="font-headline-md text-xl text-bone uppercase">
                        Check Your Phone Screen
                      </h4>
                      <p className="font-body-sm text-xs text-bone-dim max-w-sm mx-auto leading-relaxed">
                        {paymentInstruction}
                      </p>
                    </div>

                    {/* Step by step prompt instructions */}
                    <div className="p-4 bg-noir-850 border border-noir-700/80 rounded text-left text-xs space-y-2.5">
                      <div className="font-label-caps text-[10px] uppercase text-gold tracking-wider pb-1 border-b border-noir-800">
                        Payment Steps
                      </div>
                      <div className="flex items-start gap-2.5 text-bone-dim text-xs">
                        <span className="w-4 h-4 rounded-full bg-noir-800 text-bone font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span>Unlock your mobile device to view the prompt from {paymentMethod === 'MTN_MOMO' ? 'MTN MoMo' : paymentMethod === 'AIRTEL_MONEY' ? 'Airtel Money' : 'Payment Gateway'}.</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-bone-dim text-xs">
                        <span className="w-4 h-4 rounded-full bg-noir-800 text-bone font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span>Enter your mobile money PIN to authorize <strong className="text-bone">UGX {total.toLocaleString()}</strong>.</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-bone-dim text-xs">
                        <span className="w-4 h-4 rounded-full bg-noir-800 text-bone font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span>Click the confirmation button below once you have approved the PIN prompt.</span>
                      </div>
                    </div>

                    <div className="p-4 bg-noir-950 border border-noir-750 rounded text-left font-label-data text-xs space-y-2">
                      <div className="flex justify-between text-bone-dim">
                        <span>Order Reference:</span>
                        <span className="text-bone font-bold">{createdOrder?.orderNumber}</span>
                      </div>
                      <div className="flex justify-between text-bone-dim">
                        <span>Customer Phone:</span>
                        <span className="text-bone">{shippingData.phone}</span>
                      </div>
                      <div className="flex justify-between text-bone-dim">
                        <span>Total Payable:</span>
                        <span className="text-crimson-light font-bold">UGX {total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 pt-2">
                      <button
                        onClick={handleCompletePaymentConfirmation}
                        className="w-full py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-widest transition-colors btn-gothic-glow rounded"
                      >
                        I Have Approved The PIN Prompt
                      </button>
                      {createdOrder?.directWhatsAppUrl && (
                        <a
                          href={createdOrder.directWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-noir-800 hover:bg-noir-750 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700 rounded flex items-center justify-center gap-2"
                        >
                          <Icons8 name="whatsapp" size={16} className="text-emerald-400" />
                          <span>Send Order Slip via WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Final Confirmation */}
                {checkoutStep === 'confirmed' && (
                  <div className="text-center py-6 space-y-5">
                    <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/60 text-emerald-400 flex items-center justify-center mx-auto">
                      <Icons8 name="check-circle" size={32} />
                    </div>

                    <div className="space-y-1">
                      <span className="font-label-caps text-[10px] text-emerald-400 uppercase tracking-widest block font-bold">
                        Order Confirmed &amp; Logged
                      </span>
                      <h4 className="font-headline-md text-xl text-bone uppercase">
                        Order #{createdOrder?.orderNumber || 'CONFIRMED'}
                      </h4>
                      <p className="font-body-sm text-xs text-bone-dim max-w-xs mx-auto leading-relaxed">
                        A detailed receipt and tracking slip have been prepared for {shippingData.email || 'your email'}.
                      </p>
                    </div>

                    {/* Copy Reference */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyOrderNumber}
                        className="px-3 py-1.5 rounded bg-noir-850 border border-noir-700 text-bone text-xs font-label-data hover:border-gold transition-colors flex items-center gap-1.5"
                      >
                        <Icons8 name={copiedOrderNumber ? "check" : "copy"} size={13} className={copiedOrderNumber ? "text-emerald-400" : "text-gold"} />
                        <span>{copiedOrderNumber ? "Copied Reference!" : "Copy Order Ref"}</span>
                      </button>
                    </div>

                    <div className="p-4 bg-noir-850 border border-noir-700 rounded text-left font-label-data text-xs space-y-2">
                      <div className="flex justify-between text-bone-dim">
                        <span>Recipient:</span>
                        <span className="text-bone">{shippingData.fullName || 'Valued Client'}</span>
                      </div>
                      <div className="flex justify-between text-bone-dim">
                        <span>Total Paid / Due:</span>
                        <span className="text-crimson-light font-bold">UGX {total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-bone-dim">
                        <span>Fulfillment:</span>
                        <span className="text-gold">
                          {deliveryMethod === 'STUDIO_PICKUP' ? 'Studio Pickup (Level 5 Pioneer Mall)' : `Kampala Dispatch: ${shippingData.address || 'Address on file'}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-bone-dim">
                        <span>Payment Method:</span>
                        <span className="text-bone uppercase text-[11px]">{paymentMethod.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      {createdOrder?.directWhatsAppUrl && (
                        <a
                          href={createdOrder.directWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-label-caps text-xs uppercase tracking-widest transition-colors rounded flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
                        >
                          <Icons8 name="whatsapp" size={16} />
                          <span>Message Studio on WhatsApp</span>
                        </a>
                      )}
                      <button
                        onClick={handleResetAndClose}
                        className="w-full py-2.5 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-widest transition-colors border border-noir-700 rounded"
                      >
                        Continue Browsing
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer CTA for Cart Step */}
              {checkoutStep === 'cart' && cart.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-noir-700 bg-noir-850 space-y-3">
                  <button
                    onClick={() => setCheckoutStep('checkout')}
                    className="w-full py-4 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] transition-all btn-gothic-glow flex items-center justify-center gap-2 border border-crimson/30 rounded shadow-lg shadow-crimson/20"
                  >
                    <span>Proceed to Checkout</span>
                    <Icons8 name="arrow-right" size={14} />
                  </button>
                  <p className="text-center font-label-data text-[10px] text-bone-dim uppercase">
                    Sterile packaging &amp; hospital-grade sealed goods
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
