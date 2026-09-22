import React, { useState, useEffect, Suspense, lazy } from 'react';
import { PageView, PortfolioPiece, ProductItem, CartItem, ServiceItem } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ArtworkModal } from './components/ArtworkModal';
import { ShopModal } from './components/ShopModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { SecurityVerifyModal } from './components/SecurityVerifyModal';
import { HomePage } from './pages/HomePage';
import { SERVICES_DATA } from './data/atelierData';
import { fetchServices } from './services/apiClient';
import { Preloader } from './components/Preloader';
import { motion, AnimatePresence } from 'framer-motion';

// Route-Based Code Splitting (Dynamic Imports)
const ServicesPage = lazy(() => import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage').then((m) => ({ default: m.ServiceDetailPage })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage').then((m) => ({ default: m.PortfolioPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const BookingPage = lazy(() => import('./pages/BookingPage').then((m) => ({ default: m.BookingPage })));
const EquipmentPage = lazy(() => import('./pages/EquipmentPage').then((m) => ({ default: m.EquipmentPage })));
const LocationPage = lazy(() => import('./pages/LocationPage').then((m) => ({ default: m.LocationPage })));
const AftercarePage = lazy(() => import('./pages/AftercarePage').then((m) => ({ default: m.AftercarePage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })));

import { useSettings } from './context/SettingsContext';

function parseRouteFromLocation(): PageView {
  if (typeof window === 'undefined') return 'home';
  if (window.location.hash === '#admin') return 'admin';
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  switch (path) {
    case 'services':
      return 'services';
    case 'service-detail':
      return 'service-detail';
    case 'portfolio':
      return 'portfolio';
    case 'about':
      return 'about';
    case 'booking':
      return 'booking';
    case 'equipment':
    case 'shop':
      return 'equipment';
    case 'location':
      return 'location';
    case 'aftercare':
      return 'aftercare';
    case 'checkout':
      return 'checkout';
    case 'track-order':
      return 'track-order';
    case 'admin':
      return 'admin';
    default:
      return 'home';
  }
}

function getPathForPageView(page: PageView): string {
  switch (page) {
    case 'home':
      return '/';
    case 'services':
      return '/services';
    case 'service-detail':
      return '/services';
    case 'portfolio':
      return '/portfolio';
    case 'about':
      return '/about';
    case 'booking':
      return '/booking';
    case 'equipment':
      return '/equipment';
    case 'location':
      return '/location';
    case 'aftercare':
      return '/aftercare';
    case 'checkout':
      return '/checkout';
    case 'track-order':
      return '/track-order';
    case 'admin':
      return '/#admin';
    default:
      return '/';
  }
}

const PAGE_SEO_CONFIG: Record<PageView, { title: string; description: string }> = {
  home: {
    title: "Marvin Tattoo Studio | Custom Tattoos & Realism in Kampala, Uganda",
    description: "Kampala's premier custom tattoo studio located at New Pioneer Mall. Specializing in dark realism, fine-line micro-detail, solid blackwork, and custom cover-ups.",
  },
  services: {
    title: "Custom Tattoo Services & Disciplines | Marvin Tattoo Studio Kampala",
    description: "Explore our signature tattooing services: dark realism portraits, single-needle fine-line, custom script, and laser tattoo removal in Kampala, Uganda.",
  },
  'service-detail': {
    title: "Tattoo Service Details & Pricing | Marvin Tattoo Studio Kampala",
    description: "In-depth overview, sterilization protocols, pricing tiers, and client FAQs for custom tattooing sessions at Marvin Tattoo Studio.",
  },
  portfolio: {
    title: "Tattoo Portfolio & Artwork Archive | Marvin Tattoo Studio Kampala",
    description: "Browse healed and fresh custom tattoos: dark realism sleeves, black-and-grey portraits, fine-line calligraphy, and cover-up transformations.",
  },
  about: {
    title: "About Marvin & Studio Hygiene Standards | Marvin Tattoo Studio",
    description: "Founded in 2014 by Marvin. Over 14 years of professional tattooing excellence with hospital-grade autoclave sterilization in Kampala, Uganda.",
  },
  booking: {
    title: "Book a Tattoo Consultation | Marvin Tattoo Studio Kampala",
    description: "Reserve your custom tattoo appointment or consultation online. Private suites and sterile single-use needle setups at New Pioneer Mall.",
  },
  equipment: {
    title: "Studio Shop & Tattoo Aftercare Products | Marvin Tattoo Studio",
    description: "Medical-grade tattoo aftercare balms, soothing washes, and studio merchandise prepared for clean healing.",
  },
  location: {
    title: "Studio Location & Directions | Level 5 Pioneer Mall Kampala",
    description: "Visit Marvin Tattoo Studio at New Pioneer Mall, Shop No. Pi55, Level 5, Burton Street, Kampala. Map directions, parking, and studio contact.",
  },
  aftercare: {
    title: "Tattoo Aftercare Guide & Healing Protocol | Marvin Tattoo Studio",
    description: "Comprehensive step-by-step healing guide for fresh tattoos: washing, moisturizing, scabbing timeline, and touch-up policies.",
  },
  checkout: {
    title: "Secure Checkout | Marvin Tattoo Studio Kampala",
    description: "Complete your order with secure mobile money or studio pickup at Marvin Tattoo Studio.",
  },
  'track-order': {
    title: "Track Your Studio Order | Marvin Tattoo Studio Kampala",
    description: "Check the real-time preparation and dispatch status of your Marvin Tattoo Studio merchandise order.",
  },
  admin: {
    title: "Admin Studio Portal | Marvin Tattoo Studio",
    description: "Administrative console for managing bookings, orders, and studio settings.",
  },
  socials: {
    title: "Official Social Links | Marvin Tattoo Studio",
    description: "Connect with Marvin Tattoo Studio on Instagram, TikTok, WhatsApp, and Facebook.",
  },
};

const PageLoaderFallback = () => {
  const { settings } = useSettings();
  return (
    <div className="w-full min-h-[65vh] flex flex-col items-center justify-center pt-28 pb-20 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-noir-800 border-t-crimson animate-spin" />
        <div
          className="absolute w-6 h-6 rounded-full border border-gold/40 border-b-transparent animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        />
      </div>
      <span className="font-label-caps text-[10px] uppercase text-bone-muted tracking-[0.25em] mt-4 animate-pulse">
        Loading {settings.studioName || 'Studio'}...
      </span>
    </div>
  );
};

export function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<PageView>(() => parseRouteFromLocation());
  const [selectedArtwork, setSelectedArtwork] = useState<PortfolioPiece | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);
  const [bookingPreselectedPiece, setBookingPreselectedPiece] = useState<PortfolioPiece | null>(null);
  const [bookingPreselectedService, setBookingPreselectedService] = useState<ServiceItem | null>(null);
  const [bookingPreselectedTier, setBookingPreselectedTier] = useState<string | null>(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');

  // Handle browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRouteFromLocation();
      setCurrentPage(route);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL history and dynamic SEO metadata on page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const seo = PAGE_SEO_CONFIG[currentPage] || PAGE_SEO_CONFIG.home;
    document.title = seo.title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.description);

    // Update OpenGraph title and description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.description);

    // Update canonical link
    const targetPath = getPathForPageView(currentPage);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://marvintattoos.com${targetPath === '/#admin' ? '/' : targetPath}`);
    }

    // Sync browser address bar
    if (typeof window !== 'undefined') {
      if (currentPage === 'admin') {
        if (window.location.hash !== '#admin') {
          window.location.hash = '#admin';
        }
      } else {
        const currentLoc = window.location.pathname;
        if (currentLoc !== targetPath && !(currentPage === 'home' && (currentLoc === '/' || currentLoc === ''))) {
          window.history.pushState({ page: currentPage }, seo.title, targetPath);
        } else if (window.location.hash === '#admin') {
          window.history.pushState({ page: currentPage }, seo.title, targetPath);
        }
      }
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
    setBookingPreselectedService(null);
    setBookingPreselectedTier(null);
    setCurrentPage('booking');
    setSelectedArtwork(null);
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setCurrentPage('service-detail');
  };

  const handleBookService = async (serviceId: string, tierName?: string) => {
    let matchedService: ServiceItem | undefined = SERVICES_DATA.find((item) => item.id === serviceId);
    try {
      const liveServices = await fetchServices();
      const liveMatch = liveServices.find((item) => item.id === serviceId);
      if (liveMatch) matchedService = liveMatch;
    } catch {}

    setBookingPreselectedService(matchedService || null);
    setBookingPreselectedTier(tierName || null);
    setBookingPreselectedPiece(null);
    setCurrentPage('booking');
  };

  return (
    <div className="min-h-screen bg-noir-950 text-bone flex flex-col selection:bg-crimson selection:text-bone">
      {/* Studio Preloader with Gothic M & Crimson Dot */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* Editorial Navbar - Public customer views only */}
      {currentPage !== 'admin' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          onOpenVerify={() => setIsVerifyOpen(true)}
        />
      )}

      {/* Main Routed Content Area with Page Transitions */}
      <main className={`flex-1 w-full ${currentPage === 'admin' ? 'min-h-screen' : 'overflow-hidden'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Suspense fallback={<PageLoaderFallback />}>
              {currentPage === 'home' && (
                <HomePage
                  cart={cart}
                  onNavigate={setCurrentPage}
                  onSelectPiece={setSelectedArtwork}
                  onSelectService={handleSelectService}
                  onBookService={handleBookService}
                  onAddToCart={handleAddToCart}
                  onOpenCart={() => setIsCartOpen(true)}
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
                  initialService={bookingPreselectedService}
                  initialTier={bookingPreselectedTier}
                  onNavigate={setCurrentPage}
                  onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
                />
              )}

              {currentPage === 'equipment' && (
                <EquipmentPage
                  cart={cart}
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

              {currentPage === 'track-order' && (
                <TrackOrderPage
                  initialOrderNumber={trackingOrderNumber}
                  onNavigate={setCurrentPage}
                />
              )}

              {currentPage === 'admin' && (
                <AdminPage onNavigate={setCurrentPage} />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {currentPage !== 'admin' && (
        <Footer
          onNavigate={setCurrentPage}
          onOpenVerify={() => setIsVerifyOpen(true)}
          onTrackOrder={(orderNum) => {
            setTrackingOrderNumber(orderNum);
            setCurrentPage('track-order');
          }}
        />
      )}

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
