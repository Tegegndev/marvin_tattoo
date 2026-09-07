import React, { useState, useEffect } from 'react';
import { PageView, ProductItem } from '../types';
import { PRODUCTS_DATA } from '../data/atelierData';
import { fetchProducts } from '../services/apiClient';
import { motion } from 'framer-motion';
import { Icons8 } from '../components/Icons8';

interface EquipmentPageProps {
  onAddToCart: (product: ProductItem) => void;
  onOpenCart: () => void;
  onNavigate: (page: PageView) => void;
}

export const EquipmentPage: React.FC<EquipmentPageProps> = ({
  onAddToCart,
  onOpenCart,
}) => {
  const [productList, setProductList] = useState<ProductItem[]>(PRODUCTS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts().then(setProductList).catch(() => {});
  }, []);

  const categories = [
    { id: 'all', label: 'All Supplies' },
    { id: 'Hard Goods', label: 'Machines' },
    { id: 'Aftercare', label: 'Aftercare' },
    { id: 'Needles', label: 'Needles' },
    { id: 'Titanium Jewelry', label: 'Titanium Jewelry' }
  ];

  const filteredProducts = selectedCategory === 'all'
    ? productList
    : productList.filter((p) => p.category === selectedCategory);

  const handleAdd = (prod: ProductItem) => {
    onAddToCart(prod);
    setAddedItemIds((prev) => [...prev, prod.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== prod.id));
    }, 1500);
  };

  return (
    <div className="w-full pt-20 bg-noir-950 min-h-screen">
      {/* Hero Header */}
      <section className="w-full bg-noir-900 py-12 md:py-16 px-4 md:px-8 lg:px-12 border-b border-noir-700/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em]">
              SHOP
            </span>
          </div>
          <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-bone uppercase font-bold">
            Equipment, Needles &amp; Aftercare
          </h1>
          <p className="font-body-md text-sm text-bone-muted max-w-2xl leading-relaxed">
            The same sterilized supplies and aftercare we use in the studio, available to take home or restock your own kit.
          </p>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 font-label-caps text-xs uppercase tracking-wider transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-crimson text-bone border-crimson shadow-md'
                    : 'bg-noir-850 text-bone-muted hover:text-bone border-noir-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-16 bg-noir-950">
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
                  className="group bg-noir-850 p-5 shadow-xl flex flex-col justify-between gothic-card border border-noir-700/70 hover:border-crimson/30"
                >
                  <div>
                    <div className="w-full h-48 mb-4 overflow-hidden bg-noir-950 relative border border-noir-700/40">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover interactive-img-zoom"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-noir-950/80 text-[10px] font-label-caps uppercase text-crimson-light border border-crimson/30">
                        {prod.category}
                      </span>
                    </div>

                    <h3 className="font-title-editorial text-base text-bone uppercase mb-1 group-hover:text-crimson-light transition-colors font-bold truncate">
                      {prod.name}
                    </h3>
                    <p className="font-body-sm text-xs text-bone-dim mb-4 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    {/* Specs Tags */}
                    <div className="space-y-1 mb-4 pt-2 border-t border-noir-700/60">
                      {prod.specs.map((s, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] font-label-data text-bone-muted">
                          <span className="w-1 h-1 rounded-full bg-gold" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-noir-700/60 flex items-center justify-between">
                    <span className="font-label-data text-base text-bone font-bold">
                      {prod.price > 1000 ? `UGX ${prod.price.toLocaleString()}` : `$${prod.price.toFixed(2)}`}
                    </span>
                    <button
                      onClick={() => handleAdd(prod)}
                      className={`px-4 py-2 font-label-caps text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 border ${
                        isAdded
                          ? 'bg-emerald-800 text-white border-emerald-600'
                          : 'bg-noir-800 hover:bg-crimson text-bone border-noir-700'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Icons8 name="check" size={14} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Icons8 name="shopping-bag" size={14} />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Floating Cart Notice Banner */}
          <div className="p-6 bg-noir-850 border border-gold/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Icons8 name="shield-alt" size={32} className="text-gold shrink-0" />
              <div>
                <h4 className="font-title-editorial text-sm uppercase text-bone">
                  Sterilized and Sealed
                </h4>
                <p className="font-body-sm text-xs text-bone-dim">
                  Every item is autoclave-sealed in our sterilization suite before shipping.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenCart}
              className="px-6 py-2.5 bg-gold hover:bg-gold-light text-noir-950 font-label-caps text-xs uppercase tracking-wider font-bold shrink-0"
            >
              View Bag
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
