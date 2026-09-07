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

type TabType = 'bookings' | 'orders' | 'portfolio' | 'inventory' | 'reviews' | 'settings';

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState<string>('admin@marvintattoos.com');
  const [loginPassword, setLoginPassword] = useState<string>('MarvinStudio2026!');
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('bookings');

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Drawer / Inspection Modals
  const [inspectBooking, setInspectBooking] = useState<any | null>(null);
  const [inspectOrder, setInspectOrder] = useState<any | null>(null);
  const [showAddArtworkModal, setShowAddArtworkModal] = useState<boolean>(false);
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState<boolean>(false);

  // Bookings State
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('ALL');
  const [bookingSearch, setBookingSearch] = useState<string>('');
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

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

  // Products State
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
      showToast('Authenticated as Marvin Studio Admin');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid email or master password');
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

  // Data Fetchers
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

  // CRUD Actions
  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      await adminUpdateBooking(id, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      if (inspectBooking?.id === id) {
        setInspectBooking((prev: any) => ({ ...prev, status: newStatus }));
      }
      showToast(`Booking marked as ${newStatus.replace('_', ' ')}`);
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Permanently delete this booking inquiry?')) return;
    try {
      await adminDeleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (inspectBooking?.id === id) setInspectBooking(null);
      showToast('Booking record deleted');
    } catch {
      alert('Failed to delete booking');
    }
  };

  const handleUpdateOrderStatus = async (id: string, orderStatus: string, paymentStatus?: string) => {
    try {
      const payload: any = { orderStatus };
      if (paymentStatus) payload.paymentStatus = paymentStatus;
      await adminUpdateOrder(id, payload);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, orderStatus, ...(paymentStatus && { paymentStatus }) } : o
        )
      );
      if (inspectOrder?.id === id) {
        setInspectOrder((prev: any) => ({
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
    if (!confirm('Permanently delete this order record?')) return;
    try {
      await adminDeleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (inspectOrder?.id === id) setInspectOrder(null);
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
      showToast('Settings & hero banner deployed live');
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
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
      setShowAddArtworkModal(false);
      loadPortfolio();
      showToast('Artwork published to gallery');
    } catch (err: any) {
      alert(err.message || 'Failed to upload artwork');
    } finally {
      setCreatingPiece(false);
    }
  };

  const handleDeletePortfolioPiece = async (id: string) => {
    if (!confirm('Remove this artwork from the portfolio?')) return;
    try {
      await adminDeletePortfolioPiece(id);
      setPortfolioPieces((prev) => prev.filter((p) => p.id !== id));
      showToast('Artwork deleted');
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
      setShowAddProductModal(false);
      loadProducts();
      showToast('Item added to inventory');
    } catch (err: any) {
      alert(err.message || 'Failed to add product');
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Remove this item from the shop?')) return;
    try {
      await adminDeleteProduct(id);
      setProductsList((prev) => prev.filter((p) => p.id !== id));
      showToast('Product removed');
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
      setShowAddReviewModal(false);
      loadTestimonials();
      showToast('Review published');
    } catch (err: any) {
      alert(err.message || 'Failed to add review');
    } finally {
      setCreatingReview(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete this client testimonial?')) return;
    try {
      await adminDeleteTestimonial(id);
      setTestimonialsList((prev) => prev.filter((t) => t.id !== id));
      showToast('Testimonial removed');
    } catch {
      alert('Failed to delete review');
    }
  };

  const openWhatsApp = (phone: string, message: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Counts
  const pendingBookingsCount = bookings.filter((b) => b.status === 'PENDING_REVIEW').length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'PENDING_PAYMENT' || o.orderStatus === 'PROCESSING').length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'SUCCESS')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // ================= MINIMAL RED LOGIN SCREEN ================= //
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="w-full min-h-screen bg-[#07080b] flex items-center justify-center px-4 font-sans text-slate-100 selection:bg-red-600 selection:text-white">
        <div className="w-full max-w-sm p-8 bg-[#0c0d12] border border-[#1a1d26] rounded-lg shadow-2xl space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-[#1a1d26]">
            <div className="w-8 h-8 rounded-md bg-red-600/15 border border-red-600/40 flex items-center justify-center font-mono font-bold text-red-400 text-sm">
              M
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-white">
                Marvin Atelier Admin
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Kampala, Uganda · CMS v2.4
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-red-300 text-xs font-mono">
              {authError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Email
              </label>
              <input
                required
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs font-mono focus:outline-none focus:border-red-500 transition-colors"
                placeholder="admin@marvintattoos.com"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Master Password
              </label>
              <input
                required
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs font-mono focus:outline-none focus:border-red-500 transition-colors"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-lg shadow-red-950/40 flex items-center justify-center gap-2"
            >
              <span>Sign In to Dashboard</span>
              <span>→</span>
            </button>
          </form>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-slate-300 transition-colors"
            >
              ← Back to Site
            </button>
            <span>Auth v2.4</span>
          </div>
        </div>
      </div>
    );
  }

  // ================= MINIMAL RED SAAS DASHBOARD ================= //
  return (
    <div className="min-h-screen bg-[#07080b] text-slate-200 font-sans flex flex-col md:flex-row selection:bg-red-600 selection:text-white antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 bg-[#12141c] border border-red-500/40 text-slate-100 rounded-md shadow-2xl flex items-center gap-2.5 text-xs font-mono animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR RAIL */}
      <aside className="w-full md:w-64 bg-[#0c0d12] border-r border-[#1a1d26] flex flex-col shrink-0">
        {/* Workspace Brand Header */}
        <div className="p-4 border-b border-[#1a1d26] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-red-600/15 border border-red-600/40 flex items-center justify-center font-mono font-bold text-red-400 text-xs">
              M
            </div>
            <div>
              <div className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
                <span>Marvin Atelier</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 block">
                Pioneer Mall L5 · Kampala
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="text-[11px] font-mono text-slate-400 hover:text-white p-1 rounded hover:bg-[#161822] transition-colors"
            title="Open Live Website"
          >
            ↗
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-6 overflow-y-auto font-mono text-xs">
          {/* Section: Operational */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Operations
            </div>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-all ${
                activeTab === 'bookings'
                  ? 'bg-red-600/15 text-red-400 border border-red-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#13151f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500">📋</span>
                <span>Inquiries</span>
              </div>
              {pendingBookingsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold">
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-all ${
                activeTab === 'orders'
                  ? 'bg-red-600/15 text-red-400 border border-red-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#13151f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500">📦</span>
                <span>Shop Orders</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px]">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          </div>

          {/* Section: Content & Catalog */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Catalog &amp; Media
            </div>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-red-600/15 text-red-400 border border-red-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#13151f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500">🎨</span>
                <span>Portfolio</span>
              </div>
              <span className="text-[10px] text-slate-500">{portfolioPieces.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-all ${
                activeTab === 'inventory'
                  ? 'bg-red-600/15 text-red-400 border border-red-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#13151f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500">🏷️</span>
                <span>Inventory</span>
              </div>
              <span className="text-[10px] text-slate-500">{productsList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-all ${
                activeTab === 'reviews'
                  ? 'bg-red-600/15 text-red-400 border border-red-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#13151f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500">⭐</span>
                <span>Reviews</span>
              </div>
              <span className="text-[10px] text-slate-500">{testimonialsList.length}</span>
            </button>
          </div>

          {/* Section: Configuration */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              System
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-all ${
                activeTab === 'settings'
                  ? 'bg-red-600/15 text-red-400 border border-red-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#13151f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500">⚙️</span>
                <span>Hero &amp; Settings</span>
              </div>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-[#1a1d26] bg-[#090a0f] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded-full bg-[#1a1d26] border border-[#2a2e3d] flex items-center justify-center text-[10px] font-bold text-slate-300">
              M
            </div>
            <div className="truncate">
              <span className="text-white text-[11px] block truncate font-semibold">Marvin</span>
              <span className="text-[9px] text-slate-500 block truncate">admin@marvintattoos.com</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            ⎋
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#07080b]">
        {/* Top Minimal Header */}
        <header className="h-14 px-6 border-b border-[#1a1d26] bg-[#0a0b10] flex items-center justify-between shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Marvin Atelier</span>
            <span>/</span>
            <span className="text-white font-semibold capitalize">{activeTab}</span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Pending Intake:</span>
              <span className="text-red-400 font-bold">{pendingBookingsCount}</span>
            </div>
            <div className="w-px h-3 bg-[#1a1d26]" />
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Active Orders:</span>
              <span className="text-amber-400 font-bold">{pendingOrdersCount}</span>
            </div>
            <div className="w-px h-3 bg-[#1a1d26]" />
            <div className="flex items-center gap-2">
              <span className="text-slate-500">MoMo Revenue:</span>
              <span className="text-emerald-400 font-bold">UGX {totalRevenue.toLocaleString()}</span>
            </div>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-2">
            {activeTab === 'portfolio' && (
              <button
                onClick={() => setShowAddArtworkModal(true)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>+ Upload Piece</span>
              </button>
            )}
            {activeTab === 'inventory' && (
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>+ Add Item</span>
              </button>
            )}
            {activeTab === 'reviews' && (
              <button
                onClick={() => setShowAddReviewModal(true)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>+ Add Review</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 bg-[#12141c] hover:bg-[#1a1d26] border border-[#222736] text-slate-300 rounded text-xs font-mono transition-colors"
            >
              Live Site
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* ================= 1. BOOKINGS CRM TABLE ================= */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {/* Filter & Search Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                {/* Status Pills */}
                <div className="flex items-center gap-1 bg-[#0c0d12] p-1 rounded-md border border-[#1a1d26] font-mono text-xs">
                  {['ALL', 'PENDING_REVIEW', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setBookingFilterStatus(st);
                        setTimeout(loadBookings, 50);
                      }}
                      className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
                        bookingFilterStatus === st
                          ? 'bg-red-600/20 text-red-400 border border-red-600/40 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st === 'ALL' ? 'All' : st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadBookings()}
                    placeholder="Search client, phone, ref..."
                    className="w-full sm:w-64 px-3 py-1.5 bg-[#0c0d12] border border-[#1a1d26] rounded text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                  <button
                    onClick={loadBookings}
                    className="px-3 py-1.5 bg-[#141722] hover:bg-[#1c2030] border border-[#222736] rounded text-xs font-mono text-slate-200"
                  >
                    Filter
                  </button>
                </div>
              </div>

              {/* High Density Table */}
              <div className="bg-[#0c0d12] border border-[#1a1d26] rounded-lg overflow-hidden">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#1a1d26] bg-[#090a0f] text-slate-500 text-[10px] uppercase tracking-wider">
                      <th className="p-3 pl-4">Ref Code</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Discipline &amp; Placement</th>
                      <th className="p-3">Preferred Slot</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1d26]">
                    {loadingBookings ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          Loading consultations...
                        </td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          No inquiries found.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((b) => (
                        <tr
                          key={b.id}
                          onClick={() => setInspectBooking(b)}
                          className="hover:bg-[#11131a] cursor-pointer transition-colors group"
                        >
                          <td className="p-3 pl-4">
                            <span className="font-semibold text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-800/40 text-[11px]">
                              {b.referenceCode}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-white group-hover:text-red-300 transition-colors">
                              {b.clientName}
                            </div>
                            <div className="text-[11px] text-slate-500">{b.clientPhone}</div>
                          </td>
                          <td className="p-3">
                            <span className="text-slate-300 capitalize block font-semibold">
                              {b.serviceType.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {b.placement} ({b.size})
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="text-slate-300">
                              {new Date(b.preferredDate).toLocaleDateString()}
                            </div>
                            <div className="text-[11px] text-slate-500 capitalize">{b.timeSlot}</div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold ${
                                b.status === 'CONFIRMED'
                                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60'
                                  : b.status === 'COMPLETED'
                                  ? 'bg-blue-950/50 text-blue-300 border border-blue-800/60'
                                  : b.status === 'CANCELLED'
                                  ? 'bg-red-950/50 text-red-300 border border-red-800/60'
                                  : 'bg-amber-950/50 text-amber-300 border border-amber-800/60'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  b.status === 'CONFIRMED'
                                    ? 'bg-emerald-400'
                                    : b.status === 'COMPLETED'
                                    ? 'bg-blue-400'
                                    : b.status === 'CANCELLED'
                                    ? 'bg-red-400'
                                    : 'bg-amber-400'
                                }`}
                              />
                              <span>{b.status.replace('_', ' ')}</span>
                            </span>
                          </td>
                          <td className="p-3 text-right pr-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  openWhatsApp(
                                    b.clientPhone,
                                    `Hello ${b.clientName}! This is Marvin from Marvin Tattoos Atelier regarding your booking request [${b.referenceCode}]. We are pleased to confirm your session at New Pioneer Mall, Level 5.`
                                  )
                                }
                                className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 rounded text-[11px] transition-colors"
                              >
                                WhatsApp
                              </button>
                              <button
                                onClick={() => setInspectBooking(b)}
                                className="px-2.5 py-1 bg-[#161822] hover:bg-[#202332] border border-[#262a3c] text-slate-300 rounded text-[11px] transition-colors"
                              >
                                Details →
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 2. SHOP ORDERS TABLE ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                {/* Status Filter */}
                <div className="flex items-center gap-1 bg-[#0c0d12] p-1 rounded-md border border-[#1a1d26] font-mono text-xs">
                  {['ALL', 'PENDING_PAYMENT', 'PROCESSING', 'READY_FOR_PICKUP', 'DISPATCHED', 'COMPLETED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setOrderFilterStatus(st);
                        setTimeout(loadOrders, 50);
                      }}
                      className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
                        orderFilterStatus === st
                          ? 'bg-red-600/20 text-red-400 border border-red-600/40 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st === 'ALL' ? 'All' : st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadOrders()}
                    placeholder="Search order #, client..."
                    className="w-full sm:w-64 px-3 py-1.5 bg-[#0c0d12] border border-[#1a1d26] rounded text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                  <button
                    onClick={loadOrders}
                    className="px-3 py-1.5 bg-[#141722] hover:bg-[#1c2030] border border-[#222736] rounded text-xs font-mono text-slate-200"
                  >
                    Filter
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#0c0d12] border border-[#1a1d26] rounded-lg overflow-hidden">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#1a1d26] bg-[#090a0f] text-slate-500 text-[10px] uppercase tracking-wider">
                      <th className="p-3 pl-4">Order #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Fulfillment</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1d26]">
                    {loadingOrders ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          Loading shop orders...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          No orders placed yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr
                          key={o.id}
                          onClick={() => setInspectOrder(o)}
                          className="hover:bg-[#11131a] cursor-pointer transition-colors group"
                        >
                          <td className="p-3 pl-4 font-semibold text-white">
                            {o.orderNumber}
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-200">{o.clientName}</div>
                            <div className="text-[11px] text-slate-500">{o.clientPhone}</div>
                          </td>
                          <td className="p-3">
                            <span className="text-slate-300">
                              {o.deliveryMethod === 'STUDIO_PICKUP' ? 'Studio Pickup' : 'Dispatch'}
                            </span>
                            {o.deliveryAddress && (
                              <span className="text-[10px] text-slate-500 block truncate max-w-xs">
                                {o.deliveryAddress}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                o.paymentStatus === 'SUCCESS'
                                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                                  : 'bg-amber-950/40 text-amber-300 border border-amber-800/60'
                              }`}
                            >
                              {o.paymentMethod} ({o.paymentStatus})
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-red-400">
                            UGX {o.totalAmount?.toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span className="text-slate-300 text-[11px]">
                              {o.orderStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3 text-right pr-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  openWhatsApp(
                                    o.clientPhone,
                                    `Hello ${o.clientName}! This is Marvin Tattoos Atelier regarding Order #${o.orderNumber}. Your items are prepared.`
                                  )
                                }
                                className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 rounded text-[11px]"
                              >
                                WhatsApp
                              </button>
                              <button
                                onClick={() => setInspectOrder(o)}
                                className="px-2.5 py-1 bg-[#161822] hover:bg-[#202332] border border-[#262a3c] text-slate-300 rounded text-[11px]"
                              >
                                View →
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 3. PORTFOLIO CMS ================= */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="font-mono text-xs text-slate-400">
                  Total Artworks: <span className="text-white font-bold">{portfolioPieces.length}</span>
                </div>
                <button
                  onClick={() => setShowAddArtworkModal(true)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono uppercase font-semibold transition-colors"
                >
                  + Add Masterpiece
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {portfolioPieces.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#0c0d12] border border-[#1a1d26] rounded-lg overflow-hidden flex flex-col justify-between group"
                  >
                    <div className="h-44 bg-[#07080b] relative overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#0c0d12]/90 border border-[#222736] text-[10px] font-mono text-red-400 rounded">
                        {p.category}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-2 font-mono text-xs">
                      <h4 className="font-semibold text-white truncate">{p.title}</h4>
                      <div className="text-[11px] text-slate-400 flex justify-between">
                        <span>{p.zone}</span>
                        <span className="text-slate-500">{p.duration || 'Session'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>

                      <div className="pt-2 border-t border-[#1a1d26] flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-mono">
                          {p.pigment || 'Triple Black'}
                        </span>
                        <button
                          onClick={() => handleDeletePortfolioPiece(p.id)}
                          className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. INVENTORY CMS ================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="font-mono text-xs text-slate-400">
                  Shop Catalog: <span className="text-white font-bold">{productsList.length}</span> items
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono uppercase font-semibold transition-colors"
                >
                  + Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {productsList.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-[#0c0d12] border border-[#1a1d26] rounded-lg overflow-hidden flex flex-col justify-between"
                  >
                    <div className="h-36 bg-[#07080b] relative overflow-hidden">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#0c0d12]/90 border border-[#222736] text-[10px] font-mono text-red-400 rounded">
                        {prod.category}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-2 font-mono text-xs">
                      <h4 className="font-semibold text-white truncate">{prod.name}</h4>
                      <div className="text-sm font-bold text-red-400">
                        UGX {prod.price.toLocaleString()}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {prod.description}
                      </p>

                      <div className="pt-2 border-t border-[#1a1d26] flex justify-between items-center">
                        <span className="text-[10px] text-emerald-400">In Stock</span>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 5. REVIEWS CMS ================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="font-mono text-xs text-slate-400">
                  Published Reviews: <span className="text-white font-bold">{testimonialsList.length}</span>
                </div>
                <button
                  onClick={() => setShowAddReviewModal(true)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono uppercase font-semibold transition-colors"
                >
                  + Add Review
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonialsList.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 bg-[#0c0d12] border border-[#1a1d26] rounded-lg space-y-3 font-mono text-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">{t.name}</span>
                        <span className="text-amber-400">{'★'.repeat(t.stars)}</span>
                      </div>
                      <span className="text-[10px] text-red-400 block mb-2">{t.role}</span>
                      <p className="text-[11px] text-slate-400 italic leading-relaxed">
                        "{t.quote}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#1a1d26] flex justify-end">
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="text-[10px] text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 6. HERO & SETTINGS STUDIO ================= */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl font-mono text-xs">
              {/* Hero Visual Block */}
              <div className="p-5 bg-[#0c0d12] border border-[#1a1d26] rounded-lg space-y-4">
                <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-[#1a1d26] pb-2">
                  1. Hero Banner Visual &amp; Darkness Opacity
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 h-44 bg-[#07080b] border border-[#222736] rounded overflow-hidden relative">
                    <img
                      src={heroImagePreview || settings.heroBannerUrl}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 bg-[#07080b] pointer-events-none"
                      style={{ opacity: settings.heroOpacity }}
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#0c0d12]/90 border border-[#222736] text-[9px] text-slate-300 rounded font-semibold">
                      Live Hero Preview
                    </span>
                  </div>

                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1.5">
                        Upload New Banner Photo (Sharp WebP)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const f = e.target.files[0];
                            setHeroImageFile(f);
                            setHeroImagePreview(URL.createObjectURL(f));
                          }
                        }}
                        className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-red-600 file:text-white file:text-xs file:rounded file:cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Overlay Darkness Opacity</span>
                        <span className="text-red-400 font-bold">{Math.round(settings.heroOpacity * 100)}%</span>
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
                        className="w-full accent-red-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Statements */}
              <div className="p-5 bg-[#0c0d12] border border-[#1a1d26] rounded-lg space-y-4">
                <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-[#1a1d26] pb-2">
                  2. Hero Editorial Statements
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Headline Statement</label>
                  <input
                    type="text"
                    value={settings.heroStatement}
                    onChange={(e) => setSettings({ ...settings, heroStatement: e.target.value })}
                    className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Subtext Description</label>
                  <textarea
                    rows={2}
                    value={settings.heroSubtext}
                    onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })}
                    className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Studio Info */}
              <div className="p-5 bg-[#0c0d12] border border-[#1a1d26] rounded-lg space-y-4">
                <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-[#1a1d26] pb-2">
                  3. Studio Contacts &amp; Coordinates
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Studio Desk Phone</label>
                    <input
                      type="text"
                      value={settings.primaryPhone}
                      onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs font-mono focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">WhatsApp Direct Line</label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs font-mono focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Physical Address</label>
                    <input
                      type="text"
                      value={settings.physicalAddress}
                      onChange={(e) => setSettings({ ...settings, physicalAddress: e.target.value })}
                      className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs font-mono focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Google Maps URL</label>
                    <input
                      type="text"
                      value={settings.googleMapsUrl}
                      onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs font-mono focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="p-5 bg-[#0c0d12] border border-[#1a1d26] rounded-lg space-y-3">
                <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-[#1a1d26] pb-2">
                  4. Social Channels &amp; Links
                </div>

                {settings.socialLinks.map((soc, idx) => (
                  <div key={soc.id || idx} className="flex items-center gap-3 p-2 bg-[#12141c] rounded border border-[#222736]">
                    <div className="flex items-center gap-2 w-28 shrink-0">
                      <input
                        type="checkbox"
                        checked={soc.active}
                        onChange={(e) => {
                          const updated = [...settings.socialLinks];
                          updated[idx] = { ...soc, active: e.target.checked };
                          setSettings({ ...settings, socialLinks: updated });
                        }}
                        className="accent-red-600 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-white truncate">{soc.label}</span>
                    </div>
                    <input
                      type="url"
                      value={soc.url}
                      onChange={(e) => {
                        const updated = [...settings.socialLinks];
                        updated[idx] = { ...soc, url: e.target.value };
                        setSettings({ ...settings, socialLinks: updated });
                      }}
                      className="flex-1 px-3 py-1 bg-[#090a0f] border border-[#222736] rounded text-white text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="py-2.5 px-6 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono uppercase font-semibold transition-all shadow-lg shadow-red-950/40"
              >
                {savingSettings ? 'Deploying...' : 'Save & Deploy Changes'}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* INSPECTION SLIDE-OVER DRAWER FOR BOOKING */}
      {inspectBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#0c0d12] border-l border-[#1a1d26] h-full p-6 flex flex-col justify-between overflow-y-auto font-mono text-xs">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#1a1d26] pb-3">
                <span className="text-red-400 font-bold bg-red-950/40 px-2 py-0.5 rounded border border-red-800/40">
                  {inspectBooking.referenceCode}
                </span>
                <button
                  onClick={() => setInspectBooking(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">{inspectBooking.clientName}</h3>
                <div className="text-slate-400">{inspectBooking.clientPhone}</div>
                <div className="text-slate-400">{inspectBooking.clientEmail}</div>
              </div>

              <div className="p-3 bg-[#12141c] rounded border border-[#222736] space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Discipline:</span>
                  <span className="text-white font-semibold capitalize">
                    {inspectBooking.serviceType.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Placement:</span>
                  <span className="text-red-400 font-semibold">{inspectBooking.placement}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Preferred Date:</span>
                  <span className="text-white">
                    {new Date(inspectBooking.preferredDate).toLocaleDateString()} ({inspectBooking.timeSlot})
                  </span>
                </div>
              </div>

              {/* Project Brief */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Project Brief:
                </span>
                <p className="p-3 bg-[#12141c] rounded border border-[#222736] text-slate-300 leading-relaxed">
                  {inspectBooking.description}
                </p>
              </div>

              {/* Reference Image */}
              {inspectBooking.referenceImage && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                    Reference Photo:
                  </span>
                  <div className="max-h-60 overflow-hidden rounded border border-[#222736] bg-[#07080b]">
                    <img
                      src={inspectBooking.referenceImage}
                      alt="Reference"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Workflow Status Selector */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Status Workflow:
                </span>
                <select
                  value={inspectBooking.status}
                  onChange={(e) => handleUpdateBookingStatus(inspectBooking.id, e.target.value)}
                  className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs font-mono focus:outline-none focus:border-red-500"
                >
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1a1d26] space-y-2">
              <button
                onClick={() =>
                  openWhatsApp(
                    inspectBooking.clientPhone,
                    `Hello ${inspectBooking.clientName}! This is Marvin from Marvin Tattoos Atelier regarding inquiry [${inspectBooking.referenceCode}]. We look forward to seeing you at New Pioneer Mall Level 5.`
                  )
                }
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-mono uppercase font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Message on WhatsApp</span>
              </button>
              <button
                onClick={() => handleDeleteBooking(inspectBooking.id)}
                className="w-full py-2 bg-[#161822] hover:bg-red-950/40 hover:text-red-400 text-slate-400 rounded text-xs font-mono transition-colors"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECTION SLIDE-OVER DRAWER FOR ORDER */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#0c0d12] border-l border-[#1a1d26] h-full p-6 flex flex-col justify-between overflow-y-auto font-mono text-xs">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#1a1d26] pb-3">
                <span className="text-white font-bold">{inspectOrder.orderNumber}</span>
                <button onClick={() => setInspectOrder(null)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">{inspectOrder.clientName}</h3>
                <div className="text-slate-400">{inspectOrder.clientPhone}</div>
                <div className="text-slate-400">{inspectOrder.clientEmail}</div>
              </div>

              <div className="p-3 bg-[#12141c] rounded border border-[#222736] space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Fulfillment:</span>
                  <span className="text-white font-semibold">
                    {inspectOrder.deliveryMethod === 'STUDIO_PICKUP' ? 'Studio Pickup (L5)' : 'Kampala Dispatch'}
                  </span>
                </div>
                {inspectOrder.deliveryAddress && (
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-[#222736]">
                    <span>Address: </span>
                    <span className="text-white">{inspectOrder.deliveryAddress}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Payment:</span>
                  <span className="text-red-400 font-semibold">{inspectOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Amount:</span>
                  <span className="text-red-400 font-bold text-sm">
                    UGX {inspectOrder.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Items Breakdown:
                </span>
                <div className="p-3 bg-[#12141c] rounded border border-[#222736] space-y-1.5">
                  {(inspectOrder.items || []).map((it: any, i: number) => (
                    <div key={i} className="flex justify-between text-slate-300">
                      <span>{it.quantity}x {it.product?.name || 'Item'}</span>
                      <span>UGX {(it.unitPrice * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Order Status:
                </span>
                <select
                  value={inspectOrder.orderStatus}
                  onChange={(e) => handleUpdateOrderStatus(inspectOrder.id, e.target.value)}
                  className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs font-mono focus:outline-none focus:border-red-500"
                >
                  <option value="PENDING_PAYMENT">Pending Payment</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                  <option value="DISPATCHED">Dispatched with Rider</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1a1d26] space-y-2">
              <button
                onClick={() =>
                  openWhatsApp(
                    inspectOrder.clientPhone,
                    `Hello ${inspectOrder.clientName}! This is Marvin Tattoos Atelier regarding Order #${inspectOrder.orderNumber}. Your items are prepared.`
                  )
                }
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-mono uppercase font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>WhatsApp Customer</span>
              </button>
              <button
                onClick={() => handleDeleteOrder(inspectOrder.id)}
                className="w-full py-2 bg-[#161822] hover:bg-red-950/40 hover:text-red-400 text-slate-400 rounded text-xs font-mono transition-colors"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD ARTWORK */}
      {showAddArtworkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePortfolioPiece}
            className="w-full max-w-lg bg-[#0c0d12] border border-[#1a1d26] rounded-lg p-6 space-y-4 font-mono text-xs shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-[#1a1d26] pb-3">
              <h3 className="font-semibold text-white">Upload New Artwork</h3>
              <button type="button" onClick={() => setShowAddArtworkModal(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">Title *</label>
                <input
                  required
                  type="text"
                  value={newPieceTitle}
                  onChange={(e) => setNewPieceTitle(e.target.value)}
                  placeholder="e.g. Baroque Skull Sleeve"
                  className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Category *</label>
                <select
                  value={newPieceCategory}
                  onChange={(e) => setNewPieceCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="dark-realism">Dark Realism</option>
                  <option value="neo-traditional">Neo-Traditional</option>
                  <option value="micro-detail">Micro &amp; Fine-Line</option>
                  <option value="piercing">Piercing</option>
                  <option value="coverup">Cover-Up</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Zone / Placement *</label>
                <input
                  required
                  type="text"
                  value={newPieceZone}
                  onChange={(e) => setNewPieceZone(e.target.value)}
                  placeholder="Forearm, Chest..."
                  className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={newPieceDescription}
                  onChange={(e) => setNewPieceDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">Artwork Photo *</label>
                <input
                  required
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setNewPieceImageFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-red-600 file:text-white file:text-xs file:rounded file:cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#1a1d26] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddArtworkModal(false)}
                className="px-3 py-1.5 bg-[#12141c] text-slate-400 rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingPiece}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold uppercase"
              >
                {creatingPiece ? 'Publishing...' : 'Publish Artwork'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProduct}
            className="w-full max-w-lg bg-[#0c0d12] border border-[#1a1d26] rounded-lg p-6 space-y-4 font-mono text-xs shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-[#1a1d26] pb-3">
              <h3 className="font-semibold text-white">Add Shop Item</h3>
              <button type="button" onClick={() => setShowAddProductModal(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">Product Name *</label>
                <input
                  required
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Clinical Tattoo Aftercare Balm"
                  className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Category *</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="Aftercare">Aftercare</option>
                  <option value="Hard Goods">Hard Goods</option>
                  <option value="Needles">Needles</option>
                  <option value="Titanium Jewelry">Titanium Jewelry</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Price (UGX) *</label>
                <input
                  required
                  type="number"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(parseFloat(e.target.value))}
                  placeholder="95000"
                  className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">Product Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setNewProdImageFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-red-600 file:text-white file:text-xs file:rounded file:cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#1a1d26] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="px-3 py-1.5 bg-[#12141c] text-slate-400 rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingProduct}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold uppercase"
              >
                {creatingProduct ? 'Saving...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD REVIEW */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTestimonial}
            className="w-full max-w-lg bg-[#0c0d12] border border-[#1a1d26] rounded-lg p-6 space-y-4 font-mono text-xs shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-[#1a1d26] pb-3">
              <h3 className="font-semibold text-white">Add Client Review</h3>
              <button type="button" onClick={() => setShowAddReviewModal(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Client Name *</label>
                <input
                  required
                  type="text"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  placeholder="e.g. Dennis Mukasa"
                  className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Discipline / Role *</label>
                <input
                  required
                  type="text"
                  value={newReviewRole}
                  onChange={(e) => setNewReviewRole(e.target.value)}
                  placeholder="e.g. Dark Realism Sleeve"
                  className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Review Quote *</label>
                <textarea
                  required
                  rows={3}
                  value={newReviewQuote}
                  onChange={(e) => setNewReviewQuote(e.target.value)}
                  className="w-full px-3 py-2 bg-[#12141c] border border-[#222736] rounded text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#1a1d26] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddReviewModal(false)}
                className="px-3 py-1.5 bg-[#12141c] text-slate-400 rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingReview}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold uppercase"
              >
                {creatingReview ? 'Publishing...' : 'Publish Review'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
