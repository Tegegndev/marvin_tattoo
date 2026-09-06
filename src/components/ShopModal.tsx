import React, { useState } from 'react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    country: 'United States'
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('confirmed');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8a0b14', '#d4af37', '#e5e2e1']
    });
  };

  const handleResetAndClose = () => {
    onClearCart();
    setCheckoutStep('cart');
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
              className="w-screen max-w-md bg-noir-900 border-l border-noir-700 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-noir-700 flex items-center justify-between bg-noir-850">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-crimson/30 text-crimson-light border border-crimson/30">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-title-editorial text-title-editorial uppercase text-bone">
                      Your Bag
                    </h3>
                    <span className="font-label-data text-xs text-bone-dim">
                      {cart.length} item{cart.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-bone-dim hover:text-bone transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {checkoutStep === 'cart' && (
                  <>
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                        <ShoppingBag className="w-16 h-16 text-bone-dim/60 stroke-1" />
                        <div className="space-y-1">
                          <p className="font-title-editorial text-lg text-bone">
                            Your Bag is Empty
                          </p>
                          <p className="font-body-sm text-sm text-bone-dim max-w-xs">
                            Browse machines, needles, jewelry, and aftercare supplies.
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
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <button
                                onClick={() => onRemoveItem(item.product.id)}
                                className="text-bone-dim hover:text-red-400 transition-colors p-1"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <div className="flex items-center border border-noir-700 bg-noir-950">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, -1)}
                                  className="p-1 hover:bg-noir-850 text-bone-dim hover:text-bone"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 font-label-data text-xs text-bone">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, 1)}
                                  className="p-1 hover:bg-noir-850 text-bone-dim hover:text-bone"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Order Subtotal Breakdown */}
                        <div className="p-4 bg-noir-950 border border-noir-700 space-y-2 font-label-data text-xs">
                          <div className="flex justify-between text-bone-dim">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-bone-dim">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                          </div>
                          {shipping > 0 && (
                            <div className="text-[10px] text-gold">
                              Free shipping on orders over $150.00
                            </div>
                          )}
                          <div className="pt-2 border-t border-noir-700 flex justify-between text-sm text-bone font-bold">
                            <span>Total</span>
                            <span className="text-crimson-light">${total.toFixed(2)}</span>
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
                        Shipping Details
                      </h4>
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('cart')}
                        className="text-xs text-crimson-light font-label-caps uppercase underline"
                      >
                        Edit Bag
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                          Full Name
                        </label>
                        <input
                          required
                          type="text"
                          value={shippingData.fullName}
                          onChange={(e) =>
                            setShippingData({ ...shippingData, fullName: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                          placeholder="e.g. Jane Doe"
                        />
                      </div>

                      <div>
                        <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                          Email
                        </label>
                        <input
                          required
                          type="email"
                          value={shippingData.email}
                          onChange={(e) =>
                            setShippingData({ ...shippingData, email: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                          placeholder="you@email.com"
                        />
                      </div>

                      <div>
                        <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                          Address
                        </label>
                        <input
                          required
                          type="text"
                          value={shippingData.address}
                          onChange={(e) =>
                            setShippingData({ ...shippingData, address: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                          placeholder="Street address & unit"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                            City
                          </label>
                          <input
                            required
                            type="text"
                            value={shippingData.city}
                            onChange={(e) =>
                              setShippingData({ ...shippingData, city: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                            placeholder="New York"
                          />
                        </div>
                        <div>
                          <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                            Country
                          </label>
                          <select
                            value={shippingData.country}
                            onChange={(e) =>
                              setShippingData({ ...shippingData, country: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Germany">Germany</option>
                            <option value="International">International</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-noir-850 border border-noir-700 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gold font-label-caps uppercase">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Sealed Sterile Packaging</span>
                      </div>
                      <p className="text-[11px] text-bone-dim">
                        All orders ship in sealed, tamper-evident packaging.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-widest transition-all btn-gothic-glow border border-crimson/30"
                    >
                      Place Order (${total.toFixed(2)})
                    </button>
                  </form>
                )}

                {checkoutStep === 'confirmed' && (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-crimson/30 border border-crimson text-crimson-light flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-label-caps text-[10px] text-gold uppercase tracking-widest block">
                        Order Confirmed
                      </span>
                      <h4 className="font-headline-md text-xl text-bone uppercase">
                        Thanks for your order
                      </h4>
                      <p className="font-body-sm text-xs text-bone-dim max-w-xs mx-auto leading-relaxed">
                        A receipt and tracking number have been sent to {shippingData.email || 'your email'}.
                      </p>
                    </div>

                    <div className="p-4 bg-noir-850 border border-noir-700 text-left font-label-data text-xs space-y-1.5">
                      <div className="flex justify-between text-bone-dim">
                        <span>Ship to:</span>
                        <span className="text-bone">{shippingData.fullName || 'Customer'}</span>
                      </div>
                      <div className="flex justify-between text-bone-dim">
                        <span>Total Paid:</span>
                        <span className="text-crimson-light font-bold">${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-bone-dim">
                        <span>Delivery:</span>
                        <span className="text-gold">Standard Shipping</span>
                      </div>
                    </div>

                    <button
                      onClick={handleResetAndClose}
                      className="px-6 py-2.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-widest transition-colors"
                    >
                      Close
                    </button>
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
                    <span>Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center font-label-data text-[10px] text-bone-dim uppercase">
                    Ships in sealed, sterile packaging
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
