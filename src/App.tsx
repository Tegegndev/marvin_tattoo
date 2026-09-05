import React, { useState, useEffect } from 'react';
import { PageView, PortfolioPiece, ProductItem, CartItem } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ArtworkModal } from './components/ArtworkModal';
import { ShopModal } from './components/ShopModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { SecurityVerifyModal } from './components/SecurityVerifyModal';
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AboutPage } from './pages/AboutPage';
import { BookingPage } from './pages/BookingPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { LocationPage } from './pages/LocationPage';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedArtwork, setSelectedArtwork] = useState<PortfolioPiece | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);
  const [bookingPreselectedPiece, setBookingPreselectedPiece] = useState<PortfolioPiece | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Cart operations
  const handleAddToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleBookSimilar = (piece: PortfolioPiece) => {
    setBookingPreselectedPiece(piece);
    setCurrentPage('booking');
    setSelectedArtwork(null);
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col selection:bg-primary-container selection:text-on-surface">
      {/* Editorial Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenVerify={() => setIsVerifyOpen(true)}
      />

      {/* Main Routed Content Area with Page Transitions */}
      <main className="flex-1 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentPage === 'home' && (
              <HomePage
                onNavigate={setCurrentPage}
                onSelectPiece={setSelectedArtwork}
                onAddToCart={handleAddToCart}
                onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
                onOpenVerify={() => setIsVerifyOpen(true)}
              />
            )}

            {currentPage === 'portfolio' && (
              <PortfolioPage
                onNavigate={setCurrentPage}
                onSelectPiece={setSelectedArtwork}
                onBookSimilar={handleBookSimilar}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage
                onNavigate={setCurrentPage}
                onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              />
            )}

            {currentPage === 'booking' && (
              <BookingPage
                initialPiece={bookingPreselectedPiece}
                onNavigate={setCurrentPage}
                onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              />
            )}

            {currentPage === 'equipment' && (
              <EquipmentPage
                onAddToCart={handleAddToCart}
                onOpenCart={() => setIsCartOpen(true)}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === 'location' && (
              <LocationPage
                onNavigate={setCurrentPage}
                onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
                onOpenVerify={() => setIsVerifyOpen(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentPage} onOpenVerify={() => setIsVerifyOpen(true)} />

      {/* Floating Bottom-Right WhatsApp Desk Monolith (Matching Stitch Design) */}
      <aside aria-label="WhatsApp Concierge" className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsWhatsAppOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-surface-container text-on-surface shadow-2xl transition-all duration-300 hover:bg-surface-container-high btn-gothic-glow border border-secondary/40 rounded-none group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0 animate-ping" />
          <MessageCircle className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
          <span className="font-label-caps text-xs uppercase tracking-widest hidden sm:inline font-bold">
            WhatsApp Desk
          </span>
        </button>
      </aside>

      {/* Modals */}
      <ArtworkModal
        piece={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onBookSimilar={handleBookSimilar}
      />

      <ShopModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      <SecurityVerifyModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
      />
    </div>
  );
}

export default App;
