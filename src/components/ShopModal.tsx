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

        setPaymentInstruction(paymentRes.instruction || 'Please complete the transaction on your mobile device.');
        setCheckoutStep('payment_prompt');
      } else {
        setCheckoutStep('confirmed');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#991b1b', '#d4af37', '#e5e2e1'],
        });
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'Failed to place order. Please try again or order via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompletePaymentConfirmation = () => {
    setCheckoutStep('confirmed');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#991b1b', '#d4af37', '#e5e2e1'],
    });
  };

  const handleResetAndClose = () => {
    onClearCart();
    setCheckoutStep('cart');
    setCreatedOrder(null);
    setErrorMessage('');
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Sliding Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-lg bg-noir-900 border-l border-noir-700 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-noir-700 flex items-center justify-between bg-noir-850">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-crimson/30 text-crimson-light border border-crimson/30">
                    <Icons8 name="shopping-bag" size={20} />
                  </div>
                  <div>
                    <h3 className="font-title-editorial text-title-editorial uppercase text-bone">
                      Atelier Shop &amp; Bag
                    </h3>
                    <span className="font-label-data text-xs text-bone-dim">
                      {cart.length} item{cart.length === 1 ? '' : 's'} · Kampala, Uganda
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-bone-dim hover:text-bone transition-colors"
                  aria-label="Close cart"
                >
                  <Icons8 name="times" size={18} />
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {checkoutStep === 'cart' && (
                  <>
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                        <Icons8 name="shopping-bag" size={56} className="text-bone-dim/40" />
                        <div className="space-y-1">
                          <p className="font-title-editorial text-lg text-bone">
                            Your Bag is Empty
                          </p>
                          <p className="font-body-sm text-sm text-bone-dim max-w-xs">
                            Browse machines, needles, titanium jewelry, and sterile aftercare balms.
                          </p>
                        </div>
                        <button
                          onClick={onClose}
                          className="px-6 py-2.5 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700"
                        >
                          Browse Shop
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.product.id}
                            className="p-4 bg-noir-850 border border-noir-700 flex gap-4 items-center"
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover bg-noir-950 shrink-0 border border-noir-700"
                            />
                            <div className="flex-1 min-w-0 space-y-1">
                              <span className="font-label-caps text-[9px] text-crimson-light uppercase block">
                                {item.product.category}
                              </span>
                              <h4 className="font-title-editorial text-sm text-bone uppercase truncate">
                                {item.product.name}
                              </h4>
                              <div className="font-label-data text-xs text-gold font-bold">
                                UGX {item.product.price.toLocaleString()}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <button
                                onClick={() => onRemoveItem(item.product.id)}
                                className="text-bone-dim hover:text-red-400 transition-colors p-1"
                                title="Remove item"
                              >
                                <Icons8 name="trash-alt" size={14} />
                              </button>
                              <div className="flex items-center border border-noir-700 bg-noir-950">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, -1)}
                                  className="p-1 hover:bg-noir-850 text-bone-dim hover:text-bone"
                                >
                                  <Icons8 name="minus" size={12} />
                                </button>
                                <span className="px-2 font-label-data text-xs text-bone">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, 1)}
                                  className="p-1 hover:bg-noir-850 text-bone-dim hover:text-bone"
                                >
                                  <Icons8 name="plus" size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Order Subtotal Breakdown */}
                        <div className="p-4 bg-noir-950 border border-noir-700 space-y-2 font-label-data text-xs">
                          <div className="flex justify-between text-bone-dim">
                            <span>Subtotal</span>
                            <span>UGX {subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-bone-dim">
                            <span>Pickup / Dispatch</span>
                            <span className="text-gold">Select at Checkout</span>
                          </div>
                          <div className="pt-2 border-t border-noir-700 flex justify-between text-sm text-bone font-bold">
                            <span>Estimated Total</span>
                            <span className="text-crimson-light">UGX {subtotal.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {checkoutStep === 'checkout' && (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-noir-700">
                      <h4 className="font-title-editorial text-sm uppercase text-bone">
                        Checkout &amp; Payment
                      </h4>
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('cart')}
                        className="text-xs text-crimson-light font-label-caps uppercase underline"
                      >
                        Edit Bag
                      </button>
                    </div>

                    {errorMessage && (
                      <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs font-body-sm">
                        {errorMessage}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                          Full Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={shippingData.fullName}
                          onChange={(e) =>
                            setShippingData({ ...shippingData, fullName: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                          placeholder="e.g. Ronald Kigozi"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                            Phone / WhatsApp (For MoMo) *
                          </label>
                          <input
                            required
                            type="tel"
                            value={shippingData.phone}
                            onChange={(e) =>
                              setShippingData({ ...shippingData, phone: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
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
                            value={shippingData.email}
                            onChange={(e) =>
                              setShippingData({ ...shippingData, email: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      {/* Delivery Option */}
                      <div>
                        <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                          Fulfillment Method
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod('STUDIO_PICKUP')}
                            className={`p-3 text-left border font-label-caps text-xs uppercase transition-colors ${
                              deliveryMethod === 'STUDIO_PICKUP'
                                ? 'bg-crimson/20 border-crimson text-bone'
                                : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone'
                            }`}
                          >
                            <span className="block font-bold">Studio Pickup</span>
                            <span className="text-[10px] lowercase text-bone-muted">Pioneer Mall Level 5 · Free</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod('KAMPALA_DISPATCH')}
                            className={`p-3 text-left border font-label-caps text-xs uppercase transition-colors ${
                              deliveryMethod === 'KAMPALA_DISPATCH'
                                ? 'bg-crimson/20 border-crimson text-bone'
                                : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone'
                            }`}
                          >
                            <span className="block font-bold">Kampala Dispatch</span>
                            <span className="text-[10px] text-gold">+UGX 10,000 Boda/Cab</span>
                          </button>
                        </div>
                      </div>

                      {deliveryMethod === 'KAMPALA_DISPATCH' && (
                        <div>
                          <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                            Delivery Address / Landmark in Kampala *
                          </label>
                          <input
                            required
                            type="text"
                            value={shippingData.address}
                            onChange={(e) =>
                              setShippingData({ ...shippingData, address: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                            placeholder="e.g. Acacia Mall, Kololo / Bukoto Plaza"
                          />
                        </div>
                      )}

                      {/* Payment Method */}
                      <div>
                        <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                          Payment Option
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('MTN_MOMO')}
                            className={`p-2.5 text-left border font-label-caps text-xs uppercase transition-colors flex items-center justify-between ${
                              paymentMethod === 'MTN_MOMO'
                                ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                                : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone'
                            }`}
                          >
                            <span>MTN MoMo</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300">Push</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('AIRTEL_MONEY')}
                            className={`p-2.5 text-left border font-label-caps text-xs uppercase transition-colors flex items-center justify-between ${
                              paymentMethod === 'AIRTEL_MONEY'
                                ? 'bg-red-950/40 border-red-500 text-red-300'
                                : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone'
                            }`}
                          >
                            <span>Airtel Money</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-300">Push</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('CARD')}
                            className={`p-2.5 text-left border font-label-caps text-xs uppercase transition-colors flex items-center justify-between ${
                              paymentMethod === 'CARD'
                                ? 'bg-crimson/20 border-crimson text-bone'
                                : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone'
                            }`}
                          >
                            <span>Visa / Master</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-noir-800 text-bone-muted">Card</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('CASH')}
                            className={`p-2.5 text-left border font-label-caps text-xs uppercase transition-colors flex items-center justify-between ${
                              paymentMethod === 'CASH'
                                ? 'bg-crimson/20 border-crimson text-bone'
                                : 'bg-noir-850 border-noir-700 text-bone-dim hover:text-bone'
                            }`}
                          >
                            <span>Cash on Pickup</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-noir-800 text-bone-muted">Studio</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-noir-850 border border-noir-700 space-y-1">
                      <div className="flex justify-between items-center text-xs font-label-data text-bone">
                        <span>Total Due:</span>
                        <span className="text-crimson-light text-base font-bold">
                          UGX {total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-bone font-label-caps text-xs uppercase tracking-widest transition-all btn-gothic-glow border border-crimson/30 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Icons8 name="spinner" size={16} className="animate-spin" />
                          <span>Processing Order...</span>
                        </>
                      ) : (
                        <span>Place Order (UGX {total.toLocaleString()})</span>
                      )}
                    </button>
                  </form>
                )}

                {/* Step: Payment Prompt / USSD Instruction */}
                {checkoutStep === 'payment_prompt' && (
                  <div className="text-center py-8 space-y-5">
                    <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                      <Icons8 name="mobile-alt" size={32} />
                    </div>

                    <div className="space-y-2">
                      <span className="font-label-caps text-[10px] text-gold uppercase tracking-widest block">
                        Payment Prompt Initiated
                      </span>
                      <h4 className="font-headline-md text-xl text-bone uppercase">
                        Authorize on Your Mobile
                      </h4>
                      <p className="font-body-sm text-xs text-bone-dim max-w-sm mx-auto leading-relaxed">
                        {paymentInstruction}
                      </p>
                    </div>

                    <div className="p-4 bg-noir-850 border border-noir-700 text-left font-label-data text-xs space-y-2">
                      <div className="flex justify-between text-bone-dim">
                        <span>Order Reference:</span>
                        <span className="text-bone font-bold">{createdOrder?.orderNumber}</span>
                      </div>
                      <div className="flex justify-between text-bone-dim">
                        <span>Phone / Account:</span>
                        <span className="text-bone">{shippingData.phone}</span>
                      </div>
                      <div className="flex justify-between text-bone-dim">
                        <span>Amount:</span>
                        <span className="text-crimson-light font-bold">UGX {total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <button
                        onClick={handleCompletePaymentConfirmation}
                        className="w-full py-3 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-widest transition-colors btn-gothic-glow"
                      >
                        I Have Approved The PIN Prompt
                      </button>
                      {createdOrder?.directWhatsAppUrl && (
                        <a
                          href={createdOrder.directWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-noir-800 hover:bg-noir-750 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700 flex items-center justify-center gap-2"
                        >
                          <Icons8 name="whatsapp" size={16} className="text-emerald-400" />
                          <span>Send Order Slip via WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Step: Final Confirmation */}
                {checkoutStep === 'confirmed' && (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-crimson/30 border border-crimson text-crimson-light flex items-center justify-center mx-auto">
                      <Icons8 name="check-circle" size={32} />
                    </div>
                    <div className="space-y-1">
                      <span className="font-label-caps text-[10px] text-gold uppercase tracking-widest block">
                        Order Received
                      </span>
                      <h4 className="font-headline-md text-xl text-bone uppercase">
                        Order #{createdOrder?.orderNumber || 'CONFIRMED'}
                      </h4>
                      <p className="font-body-sm text-xs text-bone-dim max-w-xs mx-auto leading-relaxed">
                        A receipt and tracking slip have been prepared for {shippingData.email || 'your email'}.
                      </p>
                    </div>

                    <div className="p-4 bg-noir-850 border border-noir-700 text-left font-label-data text-xs space-y-1.5">
                      <div className="flex justify-between text-bone-dim">
                        <span>Client:</span>
                        <span className="text-bone">{shippingData.fullName || 'Customer'}</span>
                      </div>
                      <div className="flex justify-between text-bone-dim">
                        <span>Total:</span>
                        <span className="text-crimson-light font-bold">UGX {total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-bone-dim">
                        <span>Fulfillment:</span>
                        <span className="text-gold">
                          {deliveryMethod === 'STUDIO_PICKUP' ? 'Studio Pickup (Pioneer Mall L5)' : 'Kampala Dispatch'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      {createdOrder?.directWhatsAppUrl && (
                        <a
                          href={createdOrder.directWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-label-caps text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                        >
                          <Icons8 name="whatsapp" size={16} />
                          <span>Message Studio on WhatsApp</span>
                        </a>
                      )}
                      <button
                        onClick={handleResetAndClose}
                        className="w-full py-2.5 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase tracking-widest transition-colors border border-noir-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              {checkoutStep === 'cart' && cart.length > 0 && (
                <div className="p-6 border-t border-noir-700 bg-noir-850 space-y-3">
                  <button
                    onClick={() => setCheckoutStep('checkout')}
                    className="w-full py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] transition-all btn-gothic-glow flex items-center justify-center gap-2 border border-crimson/30"
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
