import React, { useState } from 'react';
import { PageView, ProductItem } from '../types';
import { PRODUCTS_DATA } from '../data/atelierData';
import { motion } from 'framer-motion';
import { ShoppingBag, ShieldCheck, Check, Sparkles, Filter, ArrowRight } from 'lucide-react';

interface EquipmentPageProps {
  onAddToCart: (product: ProductItem) => void;
  onOpenCart: () => void;
  onNavigate: (page: PageView) => void;
}

export const EquipmentPage: React.FC<EquipmentPageProps> = ({
  onAddToCart,
  onOpenCart,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'All Supplies' },
    { id: 'Hard Goods', label: 'Hard Goods & Rotary Machines' },
    { id: 'Aftercare Codex', label: 'Aftercare & Botanical Salves' },
    { id: 'Needle Cartridges', label: 'Safety Membrane Needles' },
    { id: 'Titanium Jewelry', label: 'ASTM F-136 Titanium Jewelry' }
  ];

  const filteredProducts = selectedCategory === 'all'
    ? PRODUCTS_DATA
    : PRODUCTS_DATA.filter((p) => p.category === selectedCategory);

  const handleAdd = (prod: ProductItem) => {
    onAddToCart(prod);
    setAddedItemIds((prev) => [...prev, prod.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== prod.id));
    }, 1500);
  };

  return (
    <div className="w-full pt-20 bg-surface-container-lowest min-h-screen">
      {/* Hero Header */}
      <section className="w-full bg-surface-container-low py-12 md:py-16 px-4 md:px-8 lg:px-12 border-b border-surface-container-highest/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-caps text-xs uppercase text-secondary tracking-[0.25em]">
              SANCTUM APOTHECARY &amp; HARD GOODS
            </span>
          </div>
          <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface uppercase font-bold">
            Studio Engineered Supplies &amp; Healing Salves
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Every instrument, needle cartridge, and organic salve is developed in-house to satisfy clinical sterilization thresholds and maximal pigment retention.
          </p>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 font-label-caps text-xs uppercase tracking-wider transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-primary-container text-on-surface border-primary shadow-md'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-highest'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-16 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod, idx) => {
              const isAdded = addedItemIds.includes(prod.id);
              return (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="group bg-surface-container p-5 shadow-xl flex flex-col justify-between gothic-card border border-surface-container-highest/70 hover:border-primary/30"
                >
                  <div>
                    <div className="w-full h-48 mb-4 overflow-hidden bg-surface-container-lowest relative border border-surface-container-highest/40">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover interactive-img-zoom"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-surface-container-lowest/80 text-[10px] font-label-caps uppercase text-primary border border-primary/30">
                        {prod.category}
                      </span>
                    </div>

                    <h3 className="font-title-editorial text-base text-on-surface uppercase mb-1 group-hover:text-primary transition-colors font-bold truncate">
                      {prod.name}
                    </h3>
                    <p className="font-body-sm text-xs text-outline mb-4 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    {/* Specs Tags */}
                    <div className="space-y-1 mb-4 pt-2 border-t border-surface-container-highest/60">
                      {prod.specs.map((s, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] font-label-data text-on-surface-variant">
                          <span className="w-1 h-1 rounded-full bg-secondary" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-surface-container-highest/60 flex items-center justify-between">
                    <span className="font-label-data text-base text-on-surface font-bold">
                      ${prod.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAdd(prod)}
                      className={`px-4 py-2 font-label-caps text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 border ${
                        isAdded
                          ? 'bg-emerald-800 text-white border-emerald-600'
                          : 'bg-surface-container-high hover:bg-primary-container text-on-surface border-surface-container-highest'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Acquire</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Floating Cart Notice Banner */}
          <div className="p-6 bg-surface-container border border-secondary/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-secondary shrink-0" />
              <div>
                <h4 className="font-title-editorial text-sm uppercase text-on-surface">
                  Tamper-Evident Medical Bio-Barrier Packaging
                </h4>
                <p className="font-body-sm text-xs text-outline">
                  All equipment and supplies ship sealed directly from the Marvin sterilization suite.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenCart}
              className="px-6 py-2.5 bg-secondary hover:bg-secondary-fixed text-on-secondary font-label-caps text-xs uppercase tracking-wider font-bold shrink-0"
            >
              View Active Bag
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
