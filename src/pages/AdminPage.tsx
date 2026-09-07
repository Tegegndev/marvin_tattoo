import React, { useState, useEffect } from 'react';
import { PageView, SiteSettingData } from '../types';
import { Icons8 } from '../components/Icons8';
import {
  adminLogin,
  adminLogout,
  adminGetMe,
  adminGetBookings,
  adminUpdateBooking,
  adminDeleteBooking,
  adminGetOrders,
  adminUpdateOrder,
  adminDeleteOrder,
  adminUpdateSettings,
  adminUploadHeroImage,
  adminCreatePortfolioPiece,
  adminDeletePortfolioPiece,
  adminCreateProduct,
  adminDeleteProduct,
  adminCreateTestimonial,
  adminDeleteTestimonial,
  fetchSiteSettings,
  fetchPortfolioPieces,
  fetchProducts,
  fetchTestimonials,
  DEFAULT_SITE_SETTINGS,
} from '../services/apiClient';

interface AdminPageProps {
  onNavigate: (page: PageView) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState<string>('admin@marvintattoos.com');
  const [loginPassword, setLoginPassword] = useState<string>('MarvinStudio2026!');
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>('');

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<
    'bookings' | 'orders' | 'settings' | 'portfolio' | 'inventory' | 'testimonials'
  >('bookings');

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Bookings CRM State
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('ALL');
  const [bookingSearch, setBookingSearch] = useState<string>('');
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<any | null>(null);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<any | null>(null);

  // Settings State
  const [settings, setSettings] = useState<SiteSettingData>(DEFAULT_SITE_SETTINGS);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');

  // Portfolio State
  const [portfolioPieces, setPortfolioPieces] = useState<any[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState<boolean>(false);
  const [newPieceTitle, setNewPieceTitle] = useState('');
  const [newPieceCategory, setNewPieceCategory] = useState('dark-realism');
  const [newPieceZone, setNewPieceZone] = useState('Forearm');
  const [newPieceDescription, setNewPieceDescription] = useState('');
  const [newPieceDuration, setNewPieceDuration] = useState('4 Hours');
  const [newPiecePigment, setNewPiecePigment] = useState('Dynamic Triple Black');
  const [newPieceFeatured, setNewPieceFeatured] = useState(false);
  const [newPieceImageFile, setNewPieceImageFile] = useState<File | null>(null);
  const [creatingPiece, setCreatingPiece] = useState(false);

  // Inventory / Products State
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Aftercare');
  const [newProdPrice, setNewProdPrice] = useState<number>(95000);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdStock, setNewProdStock] = useState<number>(20);
  const [newProdSpecs, setNewProdSpecs] = useState('Organic, 100ml');
  const [newProdImageFile, setNewProdImageFile] = useState<File | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);

  // Testimonials State
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('Dark Realism Sleeve');
  const [newReviewStars, setNewReviewStars] = useState(5);
  const [newReviewQuote, setNewReviewQuote] = useState('');
  const [creatingReview, setCreatingReview] = useState(false);

  // Check auth session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setAuthLoading(true);
    try {
      const user = await adminGetMe();
      if (user) {
        setIsAuthenticated(true);
        setAdminUser(user);
        loadDashboardData();
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadDashboardData = async () => {
    loadBookings();
    loadOrders();
    loadSettings();
    loadPortfolio();
    loadProducts();
    loadTestimonials();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const data = await adminLogin(loginEmail, loginPassword);
      setIsAuthenticated(true);
      setAdminUser(data.admin);
      loadDashboardData();
      showToast('Welcome back, Marvin! Studio CMS authenticated.');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid email or password');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch {}
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  // Data Loaders
  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const data = await adminGetBookings(bookingFilterStatus, bookingSearch);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await adminGetOrders(orderFilterStatus, undefined, orderSearch);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await fetchSiteSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPortfolio = async () => {
    setLoadingPortfolio(true);
    try {
      const data = await fetchPortfolioPieces();
      setPortfolioPieces(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await fetchProducts();
      setProductsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadTestimonials = async () => {
    setLoadingTestimonials(true);
    try {
      const data = await fetchTestimonials();
      setTestimonialsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  // Actions
  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      await adminUpdateBooking(id, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      if (selectedBookingForModal?.id === id) {
        setSelectedBookingForModal((prev: any) => ({ ...prev, status: newStatus }));
      }
      showToast(`Booking updated to ${newStatus.replace('_', ' ')}`);
    } catch {
      alert('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this booking?')) return;
    try {
      await adminDeleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selectedBookingForModal?.id === id) setSelectedBookingForModal(null);
      showToast('Booking record deleted');
    } catch {
      alert('Failed to delete booking');
    }
  };

  const handleUpdateOrderStatus = async (id: string, orderStatus: string, paymentStatus?: string) => {
    try {
      const updatePayload: any = { orderStatus };
      if (paymentStatus) updatePayload.paymentStatus = paymentStatus;
      await adminUpdateOrder(id, updatePayload);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, orderStatus, ...(paymentStatus && { paymentStatus }) } : o
        )
      );
      if (selectedOrderForModal?.id === id) {
        setSelectedOrderForModal((prev: any) => ({
          ...prev,
          orderStatus,
          ...(paymentStatus && { paymentStatus }),
        }));
      }
      showToast(`Order status updated to ${orderStatus.replace('_', ' ')}`);
    } catch {
      alert('Failed to update order');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await adminDeleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (selectedOrderForModal?.id === id) setSelectedOrderForModal(null);
      showToast('Order record removed');
    } catch {
      alert('Failed to delete order');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      let updatedBannerUrl = settings.heroBannerUrl;
      if (heroImageFile) {
        updatedBannerUrl = await adminUploadHeroImage(heroImageFile);
      }

      const updated = await adminUpdateSettings({
        ...settings,
        heroBannerUrl: updatedBannerUrl,
      });

      setSettings(updated);
      setHeroImageFile(null);
      setHeroImagePreview('');
      showToast('Studio settings and hero banner saved & published live!');
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleHeroFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHeroImageFile(file);
      setHeroImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePortfolioPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPieceImageFile) {
      alert('Please select an artwork photo to upload');
      return;
    }

    setCreatingPiece(true);
    try {
      const formData = new FormData();
      formData.append('title', newPieceTitle);
      formData.append('category', newPieceCategory);
      formData.append('categoryLabel', newPieceCategory.toUpperCase());
      formData.append('zone', newPieceZone);
      formData.append('description', newPieceDescription);
      formData.append('duration', newPieceDuration);
      formData.append('pigment', newPiecePigment);
      formData.append('featured', String(newPieceFeatured));
      formData.append('image', newPieceImageFile);

      await adminCreatePortfolioPiece(formData);
      setNewPieceTitle('');
      setNewPieceDescription('');
      setNewPieceImageFile(null);
      loadPortfolio();
      showToast('New artwork masterpiece published to portfolio gallery!');
    } catch (err: any) {
      alert(err.message || 'Failed to upload artwork');
    } finally {
      setCreatingPiece(false);
    }
  };

  const handleDeletePortfolioPiece = async (id: string) => {
    if (!confirm('Are you sure you want to delete this piece?')) return;
    try {
      await adminDeletePortfolioPiece(id);
      setPortfolioPieces((prev) => prev.filter((p) => p.id !== id));
      showToast('Artwork piece deleted from portfolio');
    } catch {
      alert('Failed to delete piece');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingProduct(true);
    try {
      const formData = new FormData();
      formData.append('name', newProdName);
      formData.append('category', newProdCategory);
      formData.append('price', String(newProdPrice));
      formData.append('currency', 'UGX');
      formData.append('description', newProdDesc);
      formData.append('stockCount', String(newProdStock));
      formData.append('inStock', 'true');
      formData.append('specs', JSON.stringify(newProdSpecs.split(',').map((s) => s.trim())));
      if (newProdImageFile) formData.append('image', newProdImageFile);

      await adminCreateProduct(formData);
      setNewProdName('');
      setNewProdDesc('');
      setNewProdImageFile(null);
      loadProducts();
      showToast('Product added to studio inventory & shop!');
    } catch (err: any) {
      alert(err.message || 'Failed to add product');
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminDeleteProduct(id);
      setProductsList((prev) => prev.filter((p) => p.id !== id));
      showToast('Product removed from shop catalog');
    } catch {
      alert('Failed to delete product');
    }
  };

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingReview(true);
    try {
      await adminCreateTestimonial({
        name: newReviewName,
        role: newReviewRole,
        stars: newReviewStars,
        quote: newReviewQuote,
        isGoogleVerified: true,
        approved: true,
      });
      setNewReviewName('');
      setNewReviewQuote('');
      loadTestimonials();
      showToast('Client review published to homepage slider!');
    } catch (err: any) {
      alert(err.message || 'Failed to add review');
    } finally {
      setCreatingReview(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to remove this review?')) return;
    try {
      await adminDeleteTestimonial(id);
      setTestimonialsList((prev) => prev.filter((t) => t.id !== id));
      showToast('Testimonial removed');
    } catch {
      alert('Failed to delete review');
    }
  };

  // WhatsApp quick launcher
  const openWhatsAppToClient = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Computed stat metrics
  const pendingBookingsCount = bookings.filter((b) => b.status === 'PENDING_REVIEW').length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'PENDING_PAYMENT' || o.orderStatus === 'PROCESSING').length;
  const totalRevenueUGX = orders
    .filter((o) => o.paymentStatus === 'SUCCESS')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // ================= RENDER LOGIN SCREEN ================= //
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="w-full min-h-screen pt-28 pb-16 bg-noir-950 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-crimson/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-noir-900 border border-noir-700/80 p-8 gothic-card shadow-2xl space-y-6 relative z-10 rounded-sm">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-crimson/20 border border-crimson/50 text-crimson-light flex items-center justify-center mx-auto mb-2 shadow-inner">
              <Icons8 name="lock" size={28} />
            </div>
            <span className="font-label-caps text-[10px] text-crimson-light uppercase tracking-[0.3em] font-bold block">
              MARVIN TATTOOS &amp; PIERCINGS
            </span>
            <h2 className="font-headline-lg text-2xl text-bone uppercase font-bold">
              Atelier CMS Portal
            </h2>
            <p className="font-body-sm text-xs text-bone-dim">
              Master control panel for bookings, shop orders, portfolio, and live site settings.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-red-950/60 border border-red-800 text-red-300 text-xs font-body-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                Admin Email
              </label>
              <input
                required
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                placeholder="admin@marvintattoos.com"
              />
            </div>

            <div>
              <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                Master Password
              </label>
              <input
                required
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-widest transition-all btn-gothic-glow border border-crimson/40 flex items-center justify-center gap-2 font-bold"
            >
              <Icons8 name="shield-alt" size={16} />
              <span>Authenticate &amp; Enter CMS</span>
            </button>
          </form>

          <div className="pt-4 border-t border-noir-700/60 flex items-center justify-between text-xs text-bone-dim font-label-data">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-bone transition-colors underline"
            >
              ← Back to Live Site
            </button>
            <span className="text-[10px] text-bone-dim/60 font-mono">v2.0.26 · Kampala</span>
          </div>
        </div>
      </div>
    );
  }

  // ================= RENDER MAIN DASHBOARD ================= //
  return (
    <div className="w-full min-h-screen pt-20 bg-noir-950 text-bone">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-noir-850 border border-gold/60 text-bone shadow-2xl flex items-center gap-3 animate-fade-in gothic-card max-w-md">
          <div className="w-3 h-3 rounded-full bg-gold shrink-0 animate-pulse" />
          <span className="font-label-caps text-xs uppercase tracking-wider text-bone font-bold">
            {toastMessage}
          </span>
        </div>
      )}

      {/* Top Admin Sticky Navigation Bar */}
      <header className="w-full bg-noir-900 border-b border-noir-700/80 px-4 md:px-8 py-3.5 sticky top-20 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-title-editorial text-lg text-bone uppercase font-bold tracking-wider">
                  Marvin Studio CMS
                </h1>
                <span className="px-1.5 py-0.5 bg-crimson/20 border border-crimson/40 text-crimson-light font-label-caps text-[9px] uppercase font-bold">
                  Live
                </span>
              </div>
              <span className="font-label-caps text-[10px] text-bone-dim uppercase">
                Admin: {adminUser?.name || 'Marvin'} ({adminUser?.email})
              </span>
            </div>
          </div>

          {/* Navigation Tabs with Badges */}
          <div className="flex items-center overflow-x-auto no-scrollbar gap-1 bg-noir-950 p-1 border border-noir-700/80 rounded-sm">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-1.5 font-label-caps text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === 'bookings'
                  ? 'bg-crimson text-bone font-bold shadow'
                  : 'text-bone-dim hover:text-bone'
              }`}
            >
              <span>Bookings CRM</span>
              {pendingBookingsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-noir-950 font-bold text-[9px] rounded-full">
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 font-label-caps text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-crimson text-bone font-bold shadow'
                  : 'text-bone-dim hover:text-bone'
              }`}
            >
              <span>Shop Orders</span>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 bg-gold text-noir-950 font-bold text-[9px] rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 font-label-caps text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'settings'
                  ? 'bg-crimson text-bone font-bold shadow'
                  : 'text-bone-dim hover:text-bone'
              }`}
            >
              Hero &amp; Settings
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-1.5 font-label-caps text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'portfolio'
                  ? 'bg-crimson text-bone font-bold shadow'
                  : 'text-bone-dim hover:text-bone'
              }`}
            >
              Portfolio CMS
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 font-label-caps text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'inventory'
                  ? 'bg-crimson text-bone font-bold shadow'
                  : 'text-bone-dim hover:text-bone'
              }`}
            >
              Inventory
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-3 py-1.5 font-label-caps text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'testimonials'
                  ? 'bg-crimson text-bone font-bold shadow'
                  : 'text-bone-dim hover:text-bone'
              }`}
            >
              Reviews
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 bg-noir-850 hover:bg-noir-800 border border-noir-700 text-bone-dim hover:text-bone font-label-caps text-[11px] uppercase transition-colors"
            >
              Live Site ↗
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900 border border-red-800 text-red-300 font-label-caps text-[11px] uppercase transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Quick Stats Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-noir-900 border border-noir-700/80 gothic-card space-y-1">
            <span className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider block">
              Total Inquiries
            </span>
            <div className="font-headline-lg text-2xl text-bone font-bold">
              {bookings.length}
            </div>
            <span className="font-label-data text-[11px] text-amber-400">
              {pendingBookingsCount} Pending Review
            </span>
          </div>

          <div className="p-4 bg-noir-900 border border-noir-700/80 gothic-card space-y-1">
            <span className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider block">
              Shop Orders
            </span>
            <div className="font-headline-lg text-2xl text-bone font-bold">
              {orders.length}
            </div>
            <span className="font-label-data text-[11px] text-gold">
              {pendingOrdersCount} In Fulfillment
            </span>
          </div>

          <div className="p-4 bg-noir-900 border border-noir-700/80 gothic-card space-y-1">
            <span className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider block">
              Collected Revenue
            </span>
            <div className="font-headline-lg text-2xl text-crimson-light font-bold">
              UGX {totalRevenueUGX.toLocaleString()}
            </div>
            <span className="font-label-data text-[11px] text-emerald-400">
              Verified Payments
            </span>
          </div>

          <div className="p-4 bg-noir-900 border border-noir-700/80 gothic-card space-y-1">
            <span className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider block">
              Portfolio &amp; Shop
            </span>
            <div className="font-headline-lg text-2xl text-bone font-bold">
              {portfolioPieces.length} / {productsList.length}
            </div>
            <span className="font-label-data text-[11px] text-bone-muted">
              Art Pieces / Items
            </span>
          </div>
        </div>

        {/* ================= TAB 1: BOOKINGS CRM ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="font-headline-lg text-2xl uppercase font-bold text-bone">
                  Client Consultations &amp; Booking Intake
                </h2>
                <p className="font-body-sm text-xs text-bone-dim">
                  Review project descriptions, inspect reference photos, update status, and message clients on WhatsApp.
                </p>
              </div>

              {/* Status Filters & Search */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadBookings()}
                  placeholder="Search name, phone, ref..."
                  className="px-3 py-1.5 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                />
                <button
                  onClick={loadBookings}
                  className="px-3 py-1.5 bg-noir-800 hover:bg-noir-700 border border-noir-700 text-bone font-label-caps text-xs uppercase"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'PENDING_REVIEW', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setBookingFilterStatus(st);
                    setTimeout(loadBookings, 50);
                  }}
                  className={`px-3 py-1 font-label-caps text-[11px] uppercase transition-colors border ${
                    bookingFilterStatus === st
                      ? 'bg-crimson text-bone border-crimson font-bold'
                      : 'bg-noir-850 text-bone-dim hover:text-bone border-noir-700'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Bookings List */}
            {loadingBookings ? (
              <div className="py-16 text-center text-bone-dim text-sm">
                Loading bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="py-16 text-center bg-noir-900 border border-noir-700/60 p-8 space-y-2">
                <Icons8 name="calendar-check" size={40} className="text-bone-dim/40 mx-auto" />
                <p className="font-title-editorial text-bone uppercase text-base">
                  No bookings found
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 bg-noir-900 border border-noir-700/80 gothic-card flex flex-col lg:flex-row justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-label-data text-xs font-bold text-crimson-light bg-crimson/10 px-2.5 py-1 border border-crimson/30">
                          {b.referenceCode}
                        </span>
                        <span
                          className={`font-label-caps text-[10px] uppercase px-2 py-0.5 font-bold ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300'
                              : b.status === 'COMPLETED'
                              ? 'bg-blue-950/60 border border-blue-500 text-blue-300'
                              : b.status === 'CANCELLED'
                              ? 'bg-red-950/60 border border-red-500 text-red-300'
                              : 'bg-amber-950/60 border border-amber-500 text-amber-300'
                          }`}
                        >
                          {b.status.replace('_', ' ')}
                        </span>
                        <span className="font-label-data text-[11px] text-bone-dim">
                          Date: {new Date(b.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1 font-body-sm text-xs">
                        <div>
                          <span className="text-bone-dim block font-label-caps text-[10px] uppercase">
                            Client Details
                          </span>
                          <span className="text-bone font-bold text-sm">{b.clientName}</span>
                          <div className="text-bone-dim text-[11px]">{b.clientPhone}</div>
                          <div className="text-bone-dim text-[11px]">{b.clientEmail}</div>
                        </div>

                        <div>
                          <span className="text-bone-dim block font-label-caps text-[10px] uppercase">
                            Discipline &amp; Placement
                          </span>
                          <span className="text-bone font-bold capitalize">
                            {b.serviceType.replace('_', ' ')}
                          </span>
                          <div className="text-gold font-bold">{b.placement} ({b.size})</div>
                        </div>

                        <div>
                          <span className="text-bone-dim block font-label-caps text-[10px] uppercase">
                            Preferred Session Slot
                          </span>
                          <span className="text-bone font-bold">
                            {new Date(b.preferredDate).toLocaleDateString()}
                          </span>
                          <div className="text-bone-dim capitalize">{b.timeSlot} Session</div>
                        </div>
                      </div>

                      {/* Description & Reference Photo */}
                      <div className="p-3 bg-noir-850 border border-noir-700/60 space-y-2 text-xs">
                        <div className="font-label-caps text-[10px] text-gold uppercase font-bold">
                          Client Project Brief:
                        </div>
                        <p className="text-bone leading-relaxed">{b.description}</p>

                        {b.referenceImage && (
                          <div className="pt-2 border-t border-noir-700/40 flex items-center gap-3">
                            <img
                              src={b.referenceImage}
                              alt="Client Reference"
                              className="w-16 h-16 object-cover border border-noir-700 cursor-pointer hover:opacity-90"
                              onClick={() => setSelectedBookingForModal(b)}
                            />
                            <div>
                              <span className="font-label-caps text-[10px] text-crimson-light uppercase block font-bold">
                                Uploaded Photo Attached
                              </span>
                              <button
                                onClick={() => setSelectedBookingForModal(b)}
                                className="text-xs text-gold underline font-label-caps uppercase"
                              >
                                View Full Image
                              </button>
                            </div>
                          </div>
                        )}

                        {b.notes && (
                          <div className="pt-2 border-t border-noir-700/40 text-bone-dim">
                            <span className="text-crimson-light font-bold">Client Allergies/Notes: </span>
                            {b.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions & WhatsApp Templates */}
                    <div className="flex flex-col justify-between items-end gap-3 min-w-[210px] shrink-0 border-t lg:border-t-0 lg:border-l border-noir-700/60 pt-4 lg:pt-0 lg:pl-6">
                      <div className="w-full space-y-1.5">
                        <span className="font-label-caps text-[10px] text-bone-dim uppercase block font-bold">
                          Status Workflow
                        </span>
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                          className="w-full px-3 py-1.5 bg-noir-850 border border-noir-700 text-bone font-label-caps text-xs uppercase focus:outline-none focus:border-crimson"
                        >
                          <option value="PENDING_REVIEW">Pending Review</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>

                      <div className="w-full flex flex-col gap-2">
                        <button
                          onClick={() =>
                            openWhatsAppToClient(
                              b.clientPhone,
                              `Hello ${b.clientName}! This is Marvin from Marvin Tattoos Atelier regarding your booking request [${b.referenceCode}] for ${b.serviceType}. Your consultation has been reviewed and confirmed. We look forward to welcoming you at Level 5, New Pioneer Mall!`
                            )
                          }
                          className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-label-caps text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow"
                        >
                          <Icons8 name="whatsapp" size={14} />
                          <span>WhatsApp Client</span>
                        </button>

                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="w-full py-1.5 bg-noir-850 hover:bg-red-950/60 hover:text-red-300 text-bone-dim font-label-caps text-[10px] uppercase transition-colors border border-noir-700"
                        >
                          Delete Inquiry
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: SHOP ORDERS ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="font-headline-lg text-2xl uppercase font-bold text-bone">
                  Customer Orders &amp; Fulfillment
                </h2>
                <p className="font-body-sm text-xs text-bone-dim">
                  Manage aftercare supplies, needles, and titanium jewelry purchases with Uganda payment rails.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadOrders()}
                  placeholder="Search order #, phone..."
                  className="px-3 py-1.5 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                />
                <button
                  onClick={loadOrders}
                  className="px-3 py-1.5 bg-noir-800 hover:bg-noir-700 border border-noir-700 text-bone font-label-caps text-xs uppercase"
                >
                  Search
                </button>
              </div>
            </div>

            {loadingOrders ? (
              <div className="py-16 text-center text-bone-dim text-sm">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center bg-noir-900 border border-noir-700/60 p-8 space-y-2">
                <Icons8 name="shopping-bag" size={40} className="text-bone-dim/40 mx-auto" />
                <p className="font-title-editorial text-bone uppercase text-base">
                  No orders found
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-5 bg-noir-900 border border-noir-700/80 gothic-card flex flex-col lg:flex-row justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-label-data text-xs font-bold text-bone bg-noir-800 px-2.5 py-1 border border-noir-700">
                          {o.orderNumber}
                        </span>
                        <span
                          className={`font-label-caps text-[10px] uppercase px-2 py-0.5 font-bold ${
                            o.paymentStatus === 'SUCCESS'
                              ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300'
                              : 'bg-amber-950/60 border border-amber-500 text-amber-300'
                          }`}
                        >
                          Payment: {o.paymentStatus}
                        </span>
                        <span className="font-label-caps text-[10px] uppercase px-2 py-0.5 bg-noir-850 border border-noir-700 text-bone-dim">
                          {o.orderStatus.replace('_', ' ')}
                        </span>
                        <span className="font-label-data text-[11px] text-bone-dim">
                          {new Date(o.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1 font-body-sm text-xs">
                        <div>
                          <span className="text-bone-dim block font-label-caps text-[10px] uppercase">
                            Customer
                          </span>
                          <span className="text-bone font-bold text-sm">{o.clientName}</span>
                          <div className="text-bone-dim">{o.clientPhone}</div>
                          <div className="text-bone-dim">{o.clientEmail}</div>
                        </div>

                        <div>
                          <span className="text-bone-dim block font-label-caps text-[10px] uppercase">
                            Fulfillment
                          </span>
                          <span className="text-gold font-bold">
                            {o.deliveryMethod === 'STUDIO_PICKUP' ? 'Studio Pickup (Level 5)' : 'Kampala Dispatch'}
                          </span>
                          <div className="text-bone-dim">Method: {o.paymentMethod}</div>
                          {o.deliveryAddress && (
                            <div className="text-bone-dim text-[11px] truncate">
                              Address: {o.deliveryAddress}
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="text-bone-dim block font-label-caps text-[10px] uppercase">
                            Total Due
                          </span>
                          <span className="text-crimson-light font-bold text-base">
                            UGX {o.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Items Breakdown */}
                      <div className="p-3 bg-noir-850 border border-noir-700/60 space-y-1 text-xs">
                        <span className="font-label-caps text-[10px] text-bone-dim uppercase block font-bold">
                          Line Items:
                        </span>
                        {(o.items || []).map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-bone-dim">
                            <span>
                              {item.quantity}x {item.product?.name || 'Supply Item'}
                            </span>
                            <span>UGX {(item.unitPrice * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-between items-end gap-3 min-w-[210px] shrink-0 border-t lg:border-t-0 lg:border-l border-noir-700/60 pt-4 lg:pt-0 lg:pl-6">
                      <div className="w-full space-y-1.5">
                        <span className="font-label-caps text-[10px] text-bone-dim uppercase block font-bold">
                          Order Progress
                        </span>
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="w-full px-3 py-1.5 bg-noir-850 border border-noir-700 text-bone font-label-caps text-xs uppercase focus:outline-none focus:border-crimson"
                        >
                          <option value="PENDING_PAYMENT">Pending Payment</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                          <option value="DISPATCHED">Dispatched with Rider</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>

                      <div className="w-full flex flex-col gap-2">
                        <button
                          onClick={() =>
                            openWhatsAppToClient(
                              o.clientPhone,
                              `Hello ${o.clientName}! This is Marvin Tattoos Atelier with an update on Order #${o.orderNumber}. Your items are prepared and ready for ${o.deliveryMethod === 'STUDIO_PICKUP' ? 'pickup at Pioneer Mall Level 5' : 'dispatch to your address'}.`
                            )
                          }
                          className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-label-caps text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Icons8 name="whatsapp" size={14} />
                          <span>WhatsApp Update</span>
                        </button>

                        <button
                          onClick={() => handleDeleteOrder(o.id)}
                          className="w-full py-1.5 bg-noir-850 hover:bg-red-950/60 hover:text-red-300 text-bone-dim font-label-caps text-[10px] uppercase transition-colors border border-noir-700"
                        >
                          Delete Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: HERO & SITE SETTINGS ================= */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
            <div>
              <h2 className="font-headline-lg text-2xl uppercase font-bold text-bone">
                Hero Banner, Statements &amp; Studio Info
              </h2>
              <p className="font-body-sm text-xs text-bone-dim">
                Real-time visual editor with Sharp WebP image compression, dark overlay simulator, and social links.
              </p>
            </div>

            {/* Hero Image Studio */}
            <div className="p-6 bg-noir-900 border border-noir-700/80 gothic-card space-y-4">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                1. Hero Banner Visual &amp; Darkness Filter
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 h-52 bg-noir-950 border border-noir-700 overflow-hidden relative shadow-inner">
                  <img
                    src={heroImagePreview || settings.heroBannerUrl}
                    alt="Hero Banner Preview"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-noir-950 pointer-events-none transition-opacity duration-300"
                    style={{ opacity: settings.heroOpacity }}
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-noir-950/90 text-[10px] font-label-caps text-bone uppercase border border-noir-700 font-bold">
                    Live Banner Preview
                  </span>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block font-label-caps text-xs uppercase text-bone mb-1 font-bold">
                      Upload New Banner Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroFileSelect}
                      className="w-full text-xs text-bone-dim file:mr-3 file:py-2 file:px-4 file:border-0 file:bg-crimson file:text-bone file:font-label-caps file:text-xs file:uppercase file:cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-label-caps text-xs uppercase text-bone mb-1 font-bold">
                      <span>Dark Gothic Overlay Opacity</span>
                      <span className="text-gold font-bold">{Math.round(settings.heroOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.85"
                      step="0.05"
                      value={settings.heroOpacity}
                      onChange={(e) =>
                        setSettings({ ...settings, heroOpacity: parseFloat(e.target.value) })
                      }
                      className="w-full accent-crimson cursor-pointer"
                    />
                    <p className="font-body-sm text-[11px] text-bone-dim pt-1">
                      Controls dark contrast behind the main headline text for readability.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Copy */}
            <div className="p-6 bg-noir-900 border border-noir-700/80 gothic-card space-y-4">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                2. Headline Copywriting
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1 font-bold">
                    Hero Headline Statement
                  </label>
                  <input
                    type="text"
                    value={settings.heroStatement}
                    onChange={(e) => setSettings({ ...settings, heroStatement: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 text-bone text-sm focus:outline-none focus:border-crimson"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1 font-bold">
                    Hero Subtext Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.heroSubtext}
                    onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 text-bone text-sm focus:outline-none focus:border-crimson"
                  />
                </div>
              </div>
            </div>

            {/* Contacts & Address */}
            <div className="p-6 bg-noir-900 border border-noir-700/80 gothic-card space-y-4">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                3. Studio Phone &amp; Physical Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1 font-bold">
                    Studio Desk Phone
                  </label>
                  <input
                    type="text"
                    value={settings.primaryPhone}
                    onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-sm focus:outline-none focus:border-crimson"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1 font-bold">
                    WhatsApp Direct Line
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-sm focus:outline-none focus:border-crimson"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1 font-bold">
                    Studio Physical Address
                  </label>
                  <input
                    type="text"
                    value={settings.physicalAddress}
                    onChange={(e) => setSettings({ ...settings, physicalAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-sm focus:outline-none focus:border-crimson"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1 font-bold">
                    Google Maps URL
                  </label>
                  <input
                    type="text"
                    value={settings.googleMapsUrl}
                    onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-sm focus:outline-none focus:border-crimson"
                  />
                </div>
              </div>
            </div>

            {/* Social Links Manager */}
            <div className="p-6 bg-noir-900 border border-noir-700/80 gothic-card space-y-4">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                4. Social Media Links &amp; Live Toggles
              </h3>

              <div className="space-y-3">
                {settings.socialLinks.map((soc, idx) => (
                  <div key={soc.id || idx} className="p-3 bg-noir-850 border border-noir-700 flex items-center gap-3">
                    <div className="flex items-center gap-2 w-32 shrink-0">
                      <input
                        type="checkbox"
                        checked={soc.active}
                        onChange={(e) => {
                          const updated = [...settings.socialLinks];
                          updated[idx] = { ...soc, active: e.target.checked };
                          setSettings({ ...settings, socialLinks: updated });
                        }}
                        className="accent-crimson cursor-pointer"
                      />
                      <span className="font-label-caps text-xs uppercase text-bone font-bold truncate">
                        {soc.label}
                      </span>
                    </div>
                    <input
                      type="url"
                      value={soc.url}
                      onChange={(e) => {
                        const updated = [...settings.socialLinks];
                        updated[idx] = { ...soc, url: e.target.value };
                        setSettings({ ...settings, socialLinks: updated });
                      }}
                      className="flex-1 px-3 py-1.5 bg-noir-950 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="py-3.5 px-8 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-bone font-label-caps text-xs uppercase tracking-widest transition-all btn-gothic-glow border border-crimson/40 font-bold"
            >
              {savingSettings ? 'Publishing Changes...' : 'Save & Publish Studio Changes'}
            </button>
          </form>
        )}

        {/* ================= TAB 4: PORTFOLIO CMS ================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-headline-lg text-2xl uppercase font-bold text-bone">
                Artwork Portfolio &amp; Masterpiece Gallery
              </h2>
              <p className="font-body-sm text-xs text-bone-dim">
                Upload new tattoos and piercings with automated Sharp WebP compression.
              </p>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleCreatePortfolioPiece} className="p-6 bg-noir-900 border border-noir-700/80 gothic-card space-y-4 max-w-3xl">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                Add New Masterpiece
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Artwork Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={newPieceTitle}
                    onChange={(e) => setNewPieceTitle(e.target.value)}
                    placeholder="e.g. Baroque Skull Sleeve"
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Category *
                  </label>
                  <select
                    value={newPieceCategory}
                    onChange={(e) => setNewPieceCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone font-label-caps text-xs uppercase focus:outline-none focus:border-crimson"
                  >
                    <option value="dark-realism">Dark Realism</option>
                    <option value="neo-traditional">Neo-Traditional</option>
                    <option value="micro-detail">Micro &amp; Single-Needle</option>
                    <option value="piercing">Piercing</option>
                    <option value="coverup">Cover-Up</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Placement / Zone *
                  </label>
                  <input
                    required
                    type="text"
                    value={newPieceZone}
                    onChange={(e) => setNewPieceZone(e.target.value)}
                    placeholder="e.g. Forearm, Chest, Ribcage"
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Duration &amp; Pigment
                  </label>
                  <input
                    type="text"
                    value={newPieceDuration}
                    onChange={(e) => setNewPieceDuration(e.target.value)}
                    placeholder="e.g. 5 Hours (1 Session)"
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={newPieceDescription}
                    onChange={(e) => setNewPieceDescription(e.target.value)}
                    placeholder="Artistic description, anatomical placement..."
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-caps text-[10px] uppercase text-bone mb-1 font-bold">
                    Upload Photo (High Res) *
                  </label>
                  <input
                    required
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setNewPieceImageFile(e.target.files[0])}
                    className="w-full text-xs text-bone-dim file:mr-3 file:py-2 file:px-4 file:border-0 file:bg-crimson file:text-bone file:font-label-caps file:text-xs file:uppercase file:cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingPiece}
                className="py-3 px-6 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-widest transition-all btn-gothic-glow border border-crimson/40 font-bold"
              >
                {creatingPiece ? 'Publishing...' : 'Upload & Publish Artwork'}
              </button>
            </form>

            {/* Gallery Grid */}
            <div className="space-y-4">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                Current Portfolio Pieces ({portfolioPieces.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {portfolioPieces.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-noir-900 border border-noir-700/80 flex flex-col justify-between space-y-2 gothic-card"
                  >
                    <div className="h-44 bg-noir-950 overflow-hidden border border-noir-700/40 relative">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-noir-950/80 text-[9px] font-label-caps uppercase text-crimson-light">
                        {p.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-title-editorial text-sm text-bone truncate font-bold">
                        {p.title}
                      </h4>
                      <p className="font-label-data text-[11px] text-bone-dim">{p.zone}</p>
                    </div>
                    <button
                      onClick={() => handleDeletePortfolioPiece(p.id)}
                      className="w-full py-1.5 bg-noir-850 hover:bg-red-950/60 hover:text-red-300 text-bone-dim font-label-caps text-[10px] uppercase transition-colors border border-noir-700"
                    >
                      Delete Piece
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: INVENTORY & SHOP CMS ================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-headline-lg text-2xl uppercase font-bold text-bone">
                Studio Shop &amp; Inventory Management
              </h2>
              <p className="font-body-sm text-xs text-bone-dim">
                Add supplies, manage prices in UGX, and track stock availability.
              </p>
            </div>

            {/* Add Product Form */}
            <form onSubmit={handleCreateProduct} className="p-6 bg-noir-900 border border-noir-700/80 gothic-card space-y-4 max-w-3xl">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                Add Product Item
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Product Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Clinical Tattoo Aftercare Balm"
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Category *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone font-label-caps text-xs uppercase focus:outline-none focus:border-crimson"
                  >
                    <option value="Aftercare">Aftercare</option>
                    <option value="Hard Goods">Machines &amp; Hard Goods</option>
                    <option value="Needles">Needles &amp; Cartridges</option>
                    <option value="Titanium Jewelry">Titanium Jewelry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Price (UGX) *
                  </label>
                  <input
                    required
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(parseFloat(e.target.value))}
                    placeholder="95000"
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Clinical ingredients, sterile specs..."
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-caps text-[10px] uppercase text-bone mb-1 font-bold">
                    Product Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setNewProdImageFile(e.target.files[0])}
                    className="w-full text-xs text-bone-dim file:mr-3 file:py-2 file:px-4 file:border-0 file:bg-crimson file:text-bone file:font-label-caps file:text-xs file:uppercase file:cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingProduct}
                className="py-3 px-6 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-widest transition-all btn-gothic-glow border border-crimson/40 font-bold"
              >
                {creatingProduct ? 'Saving...' : 'Add Item to Shop'}
              </button>
            </form>

            {/* Inventory Grid */}
            <div className="space-y-4">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                Active Shop Items ({productsList.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productsList.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-noir-900 border border-noir-700/80 flex flex-col justify-between space-y-2 gothic-card"
                  >
                    <div className="h-40 bg-noir-950 overflow-hidden border border-noir-700/40 relative">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-noir-950/80 text-[9px] font-label-caps uppercase text-crimson-light">
                        {p.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-title-editorial text-sm text-bone truncate font-bold">
                        {p.name}
                      </h4>
                      <p className="font-label-data text-xs text-gold font-bold">
                        UGX {p.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="w-full py-1.5 bg-noir-850 hover:bg-red-950/60 hover:text-red-300 text-bone-dim font-label-caps text-[10px] uppercase transition-colors border border-noir-700"
                    >
                      Remove Item
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: TESTIMONIALS CMS ================= */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-headline-lg text-2xl uppercase font-bold text-bone">
                Client Testimonials &amp; Reviews
              </h2>
              <p className="font-body-sm text-xs text-bone-dim">
                Add and manage verified client feedback displayed in the homepage review carousel.
              </p>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleCreateTestimonial} className="p-6 bg-noir-900 border border-noir-700/80 gothic-card space-y-4 max-w-3xl">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                Add Verified Client Review
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Client Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="e.g. Dennis Mukasa"
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Tattoo / Piercing Type *
                  </label>
                  <input
                    required
                    type="text"
                    value={newReviewRole}
                    onChange={(e) => setNewReviewRole(e.target.value)}
                    placeholder="e.g. Blackwork Cover-Up"
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Star Rating (1-5)
                  </label>
                  <select
                    value={newReviewStars}
                    onChange={(e) => setNewReviewStars(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone font-label-caps text-xs uppercase focus:outline-none focus:border-crimson"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Great)</option>
                    <option value={3}>3 Stars</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 font-bold">
                    Review Quote *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newReviewQuote}
                    onChange={(e) => setNewReviewQuote(e.target.value)}
                    placeholder="Client's review words..."
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingReview}
                className="py-3 px-6 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-widest transition-all btn-gothic-glow border border-crimson/40 font-bold"
              >
                {creatingReview ? 'Adding...' : 'Publish Testimonial'}
              </button>
            </form>

            {/* Testimonials List */}
            <div className="space-y-4">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                Published Reviews ({testimonialsList.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonialsList.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 bg-noir-900 border border-noir-700/80 flex flex-col justify-between space-y-3 gothic-card"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-label-caps text-xs text-bone font-bold">{t.name}</span>
                        <span className="text-amber-400 font-label-data text-xs">
                          {'★'.repeat(t.stars)}
                        </span>
                      </div>
                      <span className="font-label-caps text-[10px] text-crimson-light uppercase block mb-2">
                        {t.role}
                      </span>
                      <p className="font-body-sm text-xs text-bone-dim italic leading-relaxed">
                        "{t.quote}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="w-full py-1.5 bg-noir-850 hover:bg-red-950/60 hover:text-red-300 text-bone-dim font-label-caps text-[10px] uppercase transition-colors border border-noir-700"
                    >
                      Delete Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Image Inspection Modal */}
      {selectedBookingForModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-noir-900 border border-noir-700 max-w-2xl w-full p-6 space-y-4 gothic-card shadow-2xl">
            <div className="flex justify-between items-center border-b border-noir-700 pb-3">
              <div>
                <span className="font-label-data text-xs text-crimson-light font-bold">
                  {selectedBookingForModal.referenceCode}
                </span>
                <h3 className="font-title-editorial text-base text-bone uppercase font-bold">
                  Client Reference Photo · {selectedBookingForModal.clientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="p-1 text-bone-dim hover:text-bone"
              >
                <Icons8 name="times" size={18} />
              </button>
            </div>

            <div className="max-h-96 overflow-hidden flex items-center justify-center bg-noir-950 border border-noir-700">
              <img
                src={selectedBookingForModal.referenceImage}
                alt="Client reference full size"
                className="max-h-96 w-auto object-contain"
              />
            </div>

            <div className="text-xs text-bone-dim space-y-1">
              <p>
                <span className="font-bold text-bone">Description: </span>
                {selectedBookingForModal.description}
              </p>
              <p>
                <span className="font-bold text-bone">Placement: </span>
                {selectedBookingForModal.placement} ({selectedBookingForModal.size})
              </p>
            </div>

            <button
              onClick={() => setSelectedBookingForModal(null)}
              className="w-full py-2.5 bg-noir-800 hover:bg-noir-700 text-bone font-label-caps text-xs uppercase"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
