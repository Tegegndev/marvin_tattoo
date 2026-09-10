import React from 'react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons8 } from './Icons8';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Sliding Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-noir-900 border-l border-noir-700/80 flex flex-col justify-between shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-noir-750 bg-noir-850/90 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-crimson/20 border border-crimson/40 text-crimson-light flex items-center justify-center">
                      <Icons8 name="shopping-bag" size={18} />
                    </div>
                    <div>
                      <h3 className="font-title-editorial text-base sm:text-lg uppercase text-bone tracking-wide">
                        Atelier Bag
                      </h3>
                      <p className="font-label-data text-[11px] text-bone-dim">
                        {cart.length} item{cart.length === 1 ? '' : 's'} staged
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg border border-noir-700 bg-noir-800 text-bone-dim hover:text-bone hover:border-crimson/50 transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Close cart"
                  >
                    <Icons8 name="times" size={15} />
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-noir-800 border border-noir-700 flex items-center justify-center text-bone-dim">
                      <Icons8 name="shopping-bag" size={26} className="text-bone-muted" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-title-editorial text-base text-bone uppercase">
                        Your Bag is Empty
                      </p>
                      <p className="font-body-sm text-xs text-bone-dim max-w-xs leading-relaxed">
                        Browse studio cartridges, certified equipment, and aftercare supplies.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-noir-800 hover:bg-noir-750 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700 rounded-lg cursor-pointer"
                    >
                      Browse Equipment
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-xs text-bone-dim pb-2 border-b border-noir-800">
                      <span className="font-label-caps uppercase text-[10px] tracking-wider">
                        Bag Items ({cart.length})
                      </span>
                      <button
                        onClick={onClearCart}
                        className="text-[11px] text-bone-muted hover:text-red-400 transition-colors underline cursor-pointer"
                      >
                        Clear Bag
                      </button>
                    </div>

                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="p-3 bg-noir-850 border border-noir-750 rounded-lg flex gap-3 items-center hover:border-noir-600 transition-colors"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-14 h-14 object-cover bg-noir-950 rounded border border-noir-700 shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-0.5">
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
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-bone-muted hover:text-red-400 transition-colors p-1 cursor-pointer"
                              title="Remove item"
                            >
                              <Icons8 name="trash-alt" size={13} />
                            </button>
                            <div className="flex items-center border border-noir-700 bg-noir-950 rounded overflow-hidden">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, -1)}
                                className="p-1 hover:bg-noir-850 text-bone-dim hover:text-bone transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Icons8 name="minus" size={9} />
                              </button>
                              <span className="px-1.5 font-label-data text-xs text-bone min-w-[18px] text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, 1)}
                                className="p-1 hover:bg-noir-850 text-bone-dim hover:text-bone transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Icons8 name="plus" size={9} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Subtotal Preview */}
                    <div className="p-4 bg-noir-950 border border-noir-750 rounded-lg space-y-2 font-label-data text-xs">
                      <div className="flex justify-between text-bone-dim">
                        <span>Bag Subtotal</span>
                        <span className="text-bone font-medium">UGX {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-bone-dim">
                        <span>Fulfillment (Pickup / Courier)</span>
                        <span className="text-gold">Calculated at Checkout</span>
                      </div>
                      <div className="pt-2 border-t border-noir-800 flex justify-between text-sm text-bone font-bold">
                        <span>Total Due</span>
                        <span className="text-crimson-light">UGX {subtotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer CTA */}
              {cart.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-noir-750 bg-noir-850 space-y-2.5">
                  <button
                    onClick={() => {
                      onClose();
                      onProceedToCheckout();
                    }}
                    className="w-full py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] transition-all btn-gothic-glow flex items-center justify-center gap-2 border border-crimson/30 rounded-lg shadow-lg shadow-crimson/20 cursor-pointer"
                  >
                    <span>Proceed to Full Checkout</span>
                    <Icons8 name="arrow-right" size={14} />
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2 text-center text-bone-muted hover:text-bone text-xs font-label-caps uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
