import React, { useState, useEffect } from 'react';
import { PageView, PortfolioPiece, ProductItem, CartItem } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ArtworkModal } from './components/ArtworkModal';
import { ShopModal } from './components/ShopModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { SecurityVerifyModal } from './components/SecurityVerifyModal';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AboutPage } from './pages/AboutPage';
import { BookingPage } from './pages/BookingPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { LocationPage } from './pages/LocationPage';
import { AftercarePage } from './pages/AftercarePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPage } from './pages/AdminPage';
import { SERVICES_DATA } from './data/atelierData';
import { Preloader } from './components/Preloader';
import { motion, AnimatePresence } from 'framer-motion';

export function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<PageView>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'home';
  });
  const [selectedArtwork, setSelectedArtwork] = useState<PortfolioPiece | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);
  const [bookingPreselectedPiece, setBookingPreselectedPiece] = useState<PortfolioPiece | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentPage === 'admin') {
      window.location.hash = '#admin';
    } else if (window.location.hash === '#admin') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
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

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setCurrentPage('service-detail');
  };

  const handleBookService = (serviceId: string) => {
    const s = SERVICES_DATA.find((item) => item.id === serviceId);
    if (s) {
      setBookingPreselectedPiece({
        id: s.id,
        title: s.title,
        category: 'dark-realism',
        categoryLabel: `${s.title} (${s.subtitle})`,
        artist: 'Marvin',
        healingState: 'Consultation & Mapping',
        cycle: 'fresh',
        zone: s.specs.find((sp) => sp.label.toLowerCase().includes('placement') || sp.label.toLowerCase().includes('coverage'))?.value || 'Custom Placement',
        flashId: `DISC-${s.disciplineNumber}`,
        image: s.image,
        description: s.description,
      });
    }
    setCurrentPage('booking');
  };

  return (
    <div className="min-h-screen bg-noir-950 text-bone flex flex-col selection:bg-crimson selection:text-bone">
      {/* Studio Preloader with Gothic M & Crimson Dot */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

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
                onSelectService={handleSelectService}
                onBookService={handleBookService}
                onAddToCart={handleAddToCart}
                onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
                onOpenVerify={() => setIsVerifyOpen(true)}
              />
            )}

            {currentPage === 'services' && (
              <ServicesPage
                onNavigate={setCurrentPage}
                onSelectService={handleSelectService}
                onBookService={handleBookService}
              />
            )}

            {currentPage === 'service-detail' && (
              <ServiceDetailPage
                serviceId={selectedServiceId}
                onNavigate={setCurrentPage}
                onSelectService={handleSelectService}
                onBookService={handleBookService}
                onSelectPiece={setSelectedArtwork}
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

            {currentPage === 'aftercare' && (
              <AftercarePage
                onNavigate={setCurrentPage}
                onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              />
            )}

            {currentPage === 'checkout' && (
              <CheckoutPage
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === 'admin' && (
              <AdminPage onNavigate={setCurrentPage} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentPage} onOpenVerify={() => setIsVerifyOpen(true)} />

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
        onProceedToCheckout={() => setCurrentPage('checkout')}
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
