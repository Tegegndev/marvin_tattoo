import React, { useState } from 'react';
import { CartItem, PageView } from '../types';
import { Icons8 } from '../components/Icons8';
import { createShopOrder, initializePayment } from '../services/apiClient';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckoutPageProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigate: (page: PageView) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'checkout' | 'payment_prompt' | 'confirmed'>('checkout');
  const [deliveryMethod, setDeliveryMethod] = useState<'STUDIO_PICKUP' | 'KAMPALA_DISPATCH'>('STUDIO_PICKUP');
  const [paymentMethod, setPaymentMethod] = useState<'MTN_MOMO' | 'AIRTEL_MONEY' | 'CARD' | 'CASH'>('MTN_MOMO');
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

        setPaymentInstruction(
          paymentRes.instruction || 'Please authorize the payment prompt on your phone by entering your secret PIN.'
        );
        setCheckoutStep('payment_prompt');
      } else {
        setCheckoutStep('confirmed');
        confetti({
          particleCount: 100,
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
      particleCount: 100,
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

  const handleFinishAndReturn = () => {
    onClearCart();
    setCheckoutStep('checkout');
    setCreatedOrder(null);
    setErrorMessage('');
    onNavigate('equipment');
  };

  // If cart is completely empty and no order is active
  if (cart.length === 0 && checkoutStep !== 'confirmed') {
    return (
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-noir-900 border border-noir-750 flex items-center justify-center text-bone-dim mb-6">
          <Icons8 name="shopping-bag" size={36} className="text-crimson-light" />
        </div>
        <h1 className="font-title-editorial text-2xl sm:text-3xl text-bone uppercase tracking-wide mb-3">
          Your Bag is Empty
        </h1>
        <p className="font-body-sm text-sm text-bone-dim max-w-md mb-8 leading-relaxed">
          You have no items staged for checkout. Browse our studio equipment, aftercare supplies, and certified hardware.
        </p>
        <button
          onClick={() => onNavigate('equipment')}
          className="px-8 py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] transition-all btn-gothic-glow border border-crimson/40 rounded flex items-center gap-2"
        >
          <span>Explore Equipment Shop</span>
          <Icons8 name="arrow-right" size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Top Header & Navigation */}
      <div className="mb-8 border-b border-noir-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('equipment')}
            className="inline-flex items-center gap-2 text-xs font-label-caps uppercase text-bone-muted hover:text-crimson-light transition-colors mb-3 cursor-pointer"
          >
            <Icons8 name="arrow-left" size={13} />
            <span>Return to Studio Shop</span>
          </button>
          <h1 className="font-title-editorial text-2xl sm:text-3xl lg:text-4xl text-bone uppercase tracking-tight">
            Checkout &amp; Fulfillment
          </h1>
          <p className="font-label-data text-xs text-bone-dim mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Kampala Atelier Studio · Level 5, New Pioneer Mall</span>
          </p>
        </div>

        {/* Step Progress Pill */}
        <div className="flex items-center gap-3 bg-noir-900 border border-noir-800 px-4 py-2 rounded-full text-xs font-label-caps uppercase">
          <div className={`flex items-center gap-1.5 ${checkoutStep === 'checkout' ? 'text-crimson-light font-bold' : 'text-emerald-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${checkoutStep === 'checkout' ? 'bg-crimson text-white' : 'bg-emerald-950 border border-emerald-500/50 text-emerald-400'}`}>
              {checkoutStep === 'checkout' ? '1' : '✓'}
            </span>
            <span>Details</span>
          </div>
          <span className="text-noir-700">/</span>
          <div className={`flex items-center gap-1.5 ${checkoutStep === 'payment_prompt' ? 'text-amber-400 font-bold' : checkoutStep === 'confirmed' ? 'text-emerald-400' : 'text-bone-muted'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${checkoutStep === 'payment_prompt' ? 'bg-amber-500 text-black' : checkoutStep === 'confirmed' ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400' : 'bg-noir-800 text-bone-muted'}`}>
              {checkoutStep === 'confirmed' ? '✓' : '2'}
            </span>
            <span>Payment</span>
          </div>
          <span className="text-noir-700">/</span>
          <div className={`flex items-center gap-1.5 ${checkoutStep === 'confirmed' ? 'text-emerald-400 font-bold' : 'text-bone-muted'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${checkoutStep === 'confirmed' ? 'bg-emerald-500 text-black' : 'bg-noir-800 text-bone-muted'}`}>
              3
            </span>
            <span>Receipt</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Stage & Sticky Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column (8 cols): Checkout Form / MoMo Prompt / Confirmation */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {checkoutStep === 'checkout' && (
              <motion.form
                key="step-checkout"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleCheckoutSubmit}
                className="space-y-8"
              >
                {errorMessage && (
                  <div className="p-4 bg-red-950/70 border border-red-800 text-red-300 text-sm font-body-sm rounded-lg flex items-start gap-3">
                    <Icons8 name="exclamation-circle" size={18} className="shrink-0 mt-0.5 text-red-400" />
                    <div>
                      <p className="font-bold">Checkout Notice</p>
                      <p className="text-xs text-red-300/90 mt-0.5">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Section 1: Customer Info */}
                <div className="bg-noir-900 border border-noir-800 rounded-xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-noir-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-crimson/20 border border-crimson/40 text-crimson-light flex items-center justify-center font-label-data font-bold text-xs">
                        01
                      </div>
                      <h2 className="font-title-editorial text-lg sm:text-xl text-bone uppercase tracking-wide">
                        Contact Information
                      </h2>
                    </div>
                    <span className="font-label-caps text-[10px] text-bone-muted uppercase">Required</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1.5">
                        Full Legal / Preferred Name *
                      </label>
                      <input
                        required
                        type="text"
                        autoComplete="name"
                        value={shippingData.fullName}
                        onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                        className="w-full px-4 py-3 bg-noir-850 border border-noir-750 rounded-lg text-bone font-body-sm text-sm focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/40 transition-colors placeholder:text-bone-muted/50"
                        placeholder="e.g. Ronald Kigozi"
                      />
                    </div>

                    <div>
                      <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1.5">
                        Phone Number (MoMo / Airtel) *
                      </label>
                      <input
                        required
                        type="tel"
                        autoComplete="tel"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-noir-850 border border-noir-750 rounded-lg text-bone font-body-sm text-sm focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/40 transition-colors placeholder:text-bone-muted/50"
                        placeholder="+256 700 000000"
                      />
                    </div>

                    <div>
                      <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1.5">
                        Email Address (For Receipt) *
                      </label>
                      <input
                        required
                        type="email"
                        autoComplete="email"
                        value={shippingData.email}
                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-noir-850 border border-noir-750 rounded-lg text-bone font-body-sm text-sm focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/40 transition-colors placeholder:text-bone-muted/50"
                        placeholder="client@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Fulfillment & Delivery */}
                <div className="bg-noir-900 border border-noir-800 rounded-xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-noir-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-crimson/20 border border-crimson/40 text-crimson-light flex items-center justify-center font-label-data font-bold text-xs">
                        02
                      </div>
                      <h2 className="font-title-editorial text-lg sm:text-xl text-bone uppercase tracking-wide">
                        Fulfillment Method
                      </h2>
                    </div>
                    <span className="font-label-caps text-[10px] text-bone-muted uppercase">Kampala</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => setDeliveryMethod('STUDIO_PICKUP')}
                      className={`cursor-pointer p-5 rounded-xl border transition-all flex flex-col justify-between ${
                        deliveryMethod === 'STUDIO_PICKUP'
                          ? 'bg-crimson/15 border-crimson text-bone shadow-lg shadow-crimson/10 ring-1 ring-crimson/40'
                          : 'bg-noir-850 border-noir-750 text-bone-dim hover:text-bone hover:border-noir-600'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-label-caps text-sm uppercase font-bold text-bone flex items-center gap-2">
                            <Icons8 name="store" size={16} className={deliveryMethod === 'STUDIO_PICKUP' ? 'text-crimson-light' : 'text-bone-muted'} />
                            Studio Pickup
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-label-data uppercase font-bold">
                            FREE
                          </span>
                        </div>
                        <p className="text-xs text-bone-dim leading-relaxed">
                          Pick up directly at Marvin Tattoos Atelier, Level 5, New Pioneer Mall. Ready within 1–2 hours.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-noir-800 text-[11px] text-bone-muted flex items-center gap-1.5">
                        <Icons8 name="clock" size={13} />
                        <span>Mon – Sat: 09:00 – 19:00</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setDeliveryMethod('KAMPALA_DISPATCH')}
                      className={`cursor-pointer p-5 rounded-xl border transition-all flex flex-col justify-between ${
                        deliveryMethod === 'KAMPALA_DISPATCH'
                          ? 'bg-crimson/15 border-crimson text-bone shadow-lg shadow-crimson/10 ring-1 ring-crimson/40'
                          : 'bg-noir-850 border-noir-750 text-bone-dim hover:text-bone hover:border-noir-600'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-label-caps text-sm uppercase font-bold text-bone flex items-center gap-2">
                            <Icons8 name="shipping-fast" size={16} className={deliveryMethod === 'KAMPALA_DISPATCH' ? 'text-crimson-light' : 'text-bone-muted'} />
                            Kampala Dispatch
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/40 font-label-data uppercase font-bold">
                            +10,000 UGX
                          </span>
                        </div>
                        <p className="text-xs text-bone-dim leading-relaxed">
                          Express courier delivery directly to your door or office anywhere within Kampala metropolitan.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-noir-800 text-[11px] text-bone-muted flex items-center gap-1.5">
                        <Icons8 name="motorcycle" size={13} />
                        <span>Dispatched via verified courier</span>
                      </div>
                    </div>
                  </div>

                  {deliveryMethod === 'KAMPALA_DISPATCH' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-2"
                    >
                      <div>
                        <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1.5">
                          Delivery Address &amp; Key Landmark *
                        </label>
                        <input
                          required
                          type="text"
                          autoComplete="street-address"
                          value={shippingData.address}
                          onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                          className="w-full px-4 py-3 bg-noir-850 border border-noir-750 rounded-lg text-bone font-body-sm text-sm focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/40 placeholder:text-bone-muted/50"
                          placeholder="e.g. Plot 14 Bukoto St, near Acacia Mall, Kololo"
                        />
                      </div>
                      <div>
                        <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1.5">
                          Delivery Notes / Gate Instructions (Optional)
                        </label>
                        <input
                          type="text"
                          value={shippingData.notes}
                          onChange={(e) => setShippingData({ ...shippingData, notes: e.target.value })}
                          className="w-full px-4 py-2.5 bg-noir-850 border border-noir-750 rounded-lg text-bone font-body-sm text-xs focus:outline-none focus:border-crimson placeholder:text-bone-muted/50"
                          placeholder="e.g. Call upon arrival at security desk"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Section 3: Payment Method */}
                <div className="bg-noir-900 border border-noir-800 rounded-xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-noir-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-crimson/20 border border-crimson/40 text-crimson-light flex items-center justify-center font-label-data font-bold text-xs">
                        03
                      </div>
                      <h2 className="font-title-editorial text-lg sm:text-xl text-bone uppercase tracking-wide">
                        Payment Selection
                      </h2>
                    </div>
                    <span className="font-label-caps text-[10px] text-bone-muted uppercase">Secure &amp; Instant</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* MTN MoMo */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('MTN_MOMO')}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                        paymentMethod === 'MTN_MOMO'
                          ? 'bg-amber-950/30 border-amber-500 text-amber-100 ring-1 ring-amber-500/50'
                          : 'bg-noir-850 border-noir-750 text-bone-dim hover:text-bone hover:border-noir-600'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-label-caps text-xs uppercase font-bold text-bone flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span>MTN Mobile Money</span>
                        </div>
                        <p className="text-[11px] text-bone-dim">
                          Instant USSD PIN prompt directly on your MTN line
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'MTN_MOMO' ? 'border-amber-400 bg-amber-400' : 'border-noir-600'}`}>
                        {paymentMethod === 'MTN_MOMO' && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                      </div>
                    </button>

                    {/* Airtel Money */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('AIRTEL_MONEY')}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                        paymentMethod === 'AIRTEL_MONEY'
                          ? 'bg-red-950/30 border-red-500 text-red-100 ring-1 ring-red-500/50'
                          : 'bg-noir-850 border-noir-750 text-bone-dim hover:text-bone hover:border-noir-600'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-label-caps text-xs uppercase font-bold text-bone flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          <span>Airtel Money</span>
                        </div>
                        <p className="text-[11px] text-bone-dim">
                          Instant USSD push prompt on your Airtel device
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'AIRTEL_MONEY' ? 'border-red-400 bg-red-400' : 'border-noir-600'}`}>
                        {paymentMethod === 'AIRTEL_MONEY' && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                      </div>
                    </button>

                    {/* Visa / Master */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                        paymentMethod === 'CARD'
                          ? 'bg-crimson/20 border-crimson text-bone ring-1 ring-crimson/50'
                          : 'bg-noir-850 border-noir-750 text-bone-dim hover:text-bone hover:border-noir-600'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-label-caps text-xs uppercase font-bold text-bone flex items-center gap-2">
                          <Icons8 name="credit-card" size={15} className="text-crimson-light" />
                          <span>Visa / Mastercard</span>
                        </div>
                        <p className="text-[11px] text-bone-dim">
                          International &amp; local cards with 3D Secure verification
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'CARD' ? 'border-crimson bg-crimson' : 'border-noir-600'}`}>
                        {paymentMethod === 'CARD' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>

                    {/* Cash on Pickup */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASH')}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                        paymentMethod === 'CASH'
                          ? 'bg-crimson/20 border-crimson text-bone ring-1 ring-crimson/50'
                          : 'bg-noir-850 border-noir-750 text-bone-dim hover:text-bone hover:border-noir-600'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-label-caps text-xs uppercase font-bold text-bone flex items-center gap-2">
                          <Icons8 name="money-bill-wave" size={15} className="text-crimson-light" />
                          <span>Cash on Pickup</span>
                        </div>
                        <p className="text-[11px] text-bone-dim">
                          Pay in cash or POS terminal directly at our reception
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'CASH' ? 'border-crimson bg-crimson' : 'border-noir-600'}`}>
                        {paymentMethod === 'CASH' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-bone font-label-caps text-sm uppercase tracking-[0.2em] transition-all btn-gothic-glow border border-crimson/40 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-crimson/20 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Icons8 name="spinner" size={18} className="animate-spin" />
                      <span>Transmitting Atelier Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Order &amp; Authorize (UGX {total.toLocaleString()})</span>
                      <Icons8 name="arrow-right" size={16} />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* Step 2: Payment Prompt / USSD Instruction */}
            {checkoutStep === 'payment_prompt' && (
              <motion.div
                key="step-prompt"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-noir-900 border border-noir-800 rounded-xl p-8 sm:p-10 text-center space-y-8"
              >
                <div className="w-20 h-20 rounded-full bg-amber-500/15 border border-amber-500/50 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                  <Icons8 name="mobile-alt" size={40} />
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="font-label-caps text-xs text-gold uppercase tracking-widest block font-bold">
                    Mobile Payment Authorization
                  </span>
                  <h2 className="font-title-editorial text-2xl sm:text-3xl text-bone uppercase">
                    Check Your Phone Screen
                  </h2>
                  <p className="font-body-sm text-sm text-bone-dim leading-relaxed">
                    {paymentInstruction}
                  </p>
                </div>

                {/* Step Instructions */}
                <div className="p-6 bg-noir-850 border border-noir-750 rounded-xl text-left space-y-4 max-w-xl mx-auto">
                  <div className="font-label-caps text-xs uppercase text-gold tracking-wider pb-2 border-b border-noir-800">
                    Payment Instructions
                  </div>
                  <div className="flex items-start gap-3 text-sm text-bone-dim">
                    <span className="w-5 h-5 rounded-full bg-noir-800 text-bone font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Unlock your mobile device to view the prompt from {paymentMethod === 'MTN_MOMO' ? 'MTN MoMo' : paymentMethod === 'AIRTEL_MONEY' ? 'Airtel Money' : 'Payment Gateway'}.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-bone-dim">
                    <span className="w-5 h-5 rounded-full bg-noir-800 text-bone font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Enter your mobile money PIN to authorize <strong className="text-bone">UGX {total.toLocaleString()}</strong>.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-bone-dim">
                    <span className="w-5 h-5 rounded-full bg-noir-800 text-bone font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Click the confirmation button below once you have approved the prompt.</span>
                  </div>
                </div>

                {/* Reference Details */}
                <div className="p-5 bg-noir-950 border border-noir-800 rounded-xl max-w-xl mx-auto text-left font-label-data text-xs space-y-2.5">
                  <div className="flex justify-between text-bone-dim">
                    <span>Order Reference:</span>
                    <span className="text-bone font-bold">{createdOrder?.orderNumber}</span>
                  </div>
                  <div className="flex justify-between text-bone-dim">
                    <span>Target Phone:</span>
                    <span className="text-bone">{shippingData.phone}</span>
                  </div>
                  <div className="flex justify-between text-bone-dim">
                    <span>Amount Payable:</span>
                    <span className="text-crimson-light font-bold">UGX {total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCompletePaymentConfirmation}
                    className="flex-1 py-4 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-widest transition-colors btn-gothic-glow rounded-xl cursor-pointer"
                  >
                    I Have Approved The PIN Prompt
                  </button>
                  {createdOrder?.directWhatsAppUrl && (
                    <a
                      href={createdOrder.directWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-4 bg-noir-800 hover:bg-noir-750 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Icons8 name="whatsapp" size={16} className="text-emerald-400" />
                      <span>Send WhatsApp Slip</span>
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Order Confirmation */}
            {checkoutStep === 'confirmed' && (
              <motion.div
                key="step-confirmed"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-noir-900 border border-noir-800 rounded-xl p-8 sm:p-12 text-center space-y-8"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <Icons8 name="check-circle" size={42} />
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="font-label-caps text-xs text-emerald-400 uppercase tracking-widest block font-bold">
                    Order Confirmed &amp; Logged
                  </span>
                  <h2 className="font-title-editorial text-2xl sm:text-3xl text-bone uppercase">
                    Order #{createdOrder?.orderNumber || 'CONFIRMED'}
                  </h2>
                  <p className="font-body-sm text-sm text-bone-dim leading-relaxed">
                    Thank you for your order! A receipt and tracking slip have been prepared for {shippingData.email || 'your email'}.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyOrderNumber}
                    className="px-4 py-2 rounded-lg bg-noir-850 border border-noir-700 text-bone text-xs font-label-data hover:border-gold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Icons8 name={copiedOrderNumber ? "check" : "copy"} size={14} className={copiedOrderNumber ? "text-emerald-400" : "text-gold"} />
                    <span>{copiedOrderNumber ? "Copied Reference!" : "Copy Order Ref"}</span>
                  </button>
                </div>

                <div className="p-6 bg-noir-850 border border-noir-750 rounded-xl max-w-xl mx-auto text-left font-label-data text-xs space-y-3">
                  <div className="flex justify-between text-bone-dim">
                    <span>Recipient:</span>
                    <span className="text-bone font-medium">{shippingData.fullName || 'Valued Client'}</span>
                  </div>
                  <div className="flex justify-between text-bone-dim">
                    <span>Total Amount:</span>
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
                    <span className="text-bone uppercase">{paymentMethod.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 pt-2">
                  {createdOrder?.directWhatsAppUrl && (
                    <a
                      href={createdOrder.directWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-label-caps text-xs uppercase tracking-widest transition-colors rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
                    >
                      <Icons8 name="whatsapp" size={18} />
                      <span>Message Concierge on WhatsApp</span>
                    </a>
                  )}
                  <button
                    onClick={handleFinishAndReturn}
                    className="flex-1 py-4 bg-noir-800 hover:bg-noir-750 text-bone font-label-caps text-xs uppercase tracking-widest transition-colors border border-noir-700 rounded-xl cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column (4-5 cols): Sticky Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-noir-900 border border-noir-800 rounded-xl p-6 space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-noir-800 pb-4">
              <h3 className="font-title-editorial text-base uppercase text-bone tracking-wide flex items-center gap-2">
                <Icons8 name="shopping-bag" size={16} className="text-crimson-light" />
                <span>Order Summary</span>
              </h3>
              <span className="font-label-caps text-xs text-bone-muted">
                {cart.length} item{cart.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Item List */}
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 bg-noir-850 border border-noir-750 rounded-lg flex items-center gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover bg-noir-950 rounded border border-noir-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <span className="font-label-caps text-[9px] text-crimson-light uppercase block truncate">
                      {item.product.category}
                    </span>
                    <h4 className="font-title-editorial text-xs text-bone uppercase truncate">
                      {item.product.name}
                    </h4>
                    <div className="font-label-data text-xs text-gold font-bold">
                      UGX {item.product.price.toLocaleString()}
                    </div>
                  </div>

                  {checkoutStep === 'checkout' && (
                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-bone-muted hover:text-red-400 transition-colors p-0.5 cursor-pointer"
                        title="Remove item"
                      >
                        <Icons8 name="times" size={12} />
                      </button>
                      <div className="flex items-center border border-noir-700 bg-noir-950 rounded">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="px-1.5 py-0.5 text-bone-dim hover:text-bone text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-1 font-label-data text-xs text-bone">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="px-1.5 py-0.5 text-bone-dim hover:text-bone text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-noir-800 pt-4 space-y-2.5 font-label-data text-xs">
              <div className="flex justify-between text-bone-dim">
                <span>Items Subtotal</span>
                <span className="text-bone font-medium">UGX {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-bone-dim">
                <span>Fulfillment ({deliveryMethod === 'STUDIO_PICKUP' ? 'Studio Pickup' : 'Kampala Courier'})</span>
                <span className={deliveryMethod === 'STUDIO_PICKUP' ? 'text-emerald-400 font-bold' : 'text-gold'}>
                  {deliveryMethod === 'STUDIO_PICKUP' ? 'FREE' : `+UGX ${dispatchFee.toLocaleString()}`}
                </span>
              </div>
              <div className="pt-3 border-t border-noir-800 flex justify-between items-center text-sm">
                <span className="font-label-caps uppercase text-bone font-bold">Grand Total</span>
                <span className="text-crimson-light font-bold text-base">
                  UGX {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 border-t border-noir-800 space-y-2 text-[11px] text-bone-muted font-body-sm">
              <div className="flex items-center gap-2">
                <Icons8 name="shield-alt" size={14} className="text-gold shrink-0" />
                <span>Genuine manufacturer hardware &amp; studio certification</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons8 name="box" size={14} className="text-emerald-400 shrink-0" />
                <span>Discreet, secure packaging &amp; dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons8 name="headset" size={14} className="text-crimson-light shrink-0" />
                <span>Direct WhatsApp concierge support (+256 704 779919)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
