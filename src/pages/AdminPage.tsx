import React, { useState, useEffect } from 'react';
import { PageView, SiteSettingData } from '../types';
import {
  Inbox,
  ShoppingBag,
  Image as ImageIcon,
  Package,
  Star,
  Settings,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  LogOut,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  MessageCircle,
  Phone,
  RefreshCw,
  Sliders,
  Eye,
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  Calendar,
  Layers,
  Sparkles,
  MapPin,
  Mail,
  DollarSign,
  User,
  ShieldCheck,
  FileText,
  Truck,
  CreditCard,
  Building,
} from 'lucide-react';
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
      showToast('Logged in as Atelier Administrator');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid administrator credentials');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
    setAdminUser(null);
    showToast('Signed out of admin portal');
  };

  // 1. Bookings Handlers
  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const statusParam = bookingFilterStatus === 'ALL' ? undefined : bookingFilterStatus;
      const data = await adminGetBookings(statusParam, bookingSearch || undefined);
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      const updated = await adminUpdateBooking(id, { status });
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      if (inspectBooking && inspectBooking.id === id) {
        setInspectBooking(updated);
      }
      showToast(`Inquiry marked as ${status.replace('_', ' ')}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking intake record?')) return;
    try {
      await adminDeleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (inspectBooking?.id === id) setInspectBooking(null);
      showToast('Booking deleted');
    } catch (err: any) {
      alert(err.message || 'Failed to delete booking');
    }
  };

  // 2. Orders Handlers
  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const statusParam = orderFilterStatus === 'ALL' ? undefined : orderFilterStatus;
      const data = await adminGetOrders(statusParam, orderSearch || undefined);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateOrderStatus = async (id: string, orderStatus: string) => {
    try {
      const updated = await adminUpdateOrder(id, { orderStatus });
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      if (inspectOrder && inspectOrder.id === id) {
        setInspectOrder(updated);
      }
      showToast(`Order status updated to ${orderStatus.replace('_', ' ')}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order record?')) return;
    try {
      await adminDeleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (inspectOrder?.id === id) setInspectOrder(null);
      showToast('Order record removed');
    } catch (err: any) {
      alert(err.message || 'Failed to delete order');
    }
  };

  // 3. Settings Handlers
  const loadSettings = async () => {
    try {
      const data = await fetchSiteSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      let currentHeroUrl = settings.heroBannerUrl;

      if (heroImageFile) {
        const uploadedUrl = await adminUploadHeroImage(heroImageFile);
        currentHeroUrl = uploadedUrl;
      }

      const payload: SiteSettingData = {
        ...settings,
        heroBannerUrl: currentHeroUrl,
      };

      const updated = await adminUpdateSettings(payload);
      setSettings(updated);
      setHeroImageFile(null);
      showToast('Studio settings saved & published');
    } catch (err: any) {
      alert(err.message || 'Failed to update site settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // 4. Portfolio Handlers
  const loadPortfolio = async () => {
    setLoadingPortfolio(true);
    try {
      const data = await fetchPortfolioPieces();
      setPortfolioPieces(data);
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const handleCreatePortfolioPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPieceImageFile) {
      alert('Please select an artwork photo to upload.');
      return;
    }
    setCreatingPiece(true);
    try {
      const formData = new FormData();
      formData.append('title', newPieceTitle);
      formData.append('category', newPieceCategory);
      formData.append('zone', newPieceZone);
      formData.append('description', newPieceDescription);
      formData.append('duration', newPieceDuration);
      formData.append('pigment', newPiecePigment);
      formData.append('featured', String(newPieceFeatured));
      formData.append('image', newPieceImageFile);

      const created = await adminCreatePortfolioPiece(formData);
      setPortfolioPieces((prev) => [created, ...prev]);
      setShowAddArtworkModal(false);
      setNewPieceTitle('');
      setNewPieceDescription('');
      setNewPieceImageFile(null);
      showToast('Artwork published to gallery');
    } catch (err: any) {
      alert(err.message || 'Failed to upload artwork');
    } finally {
      setCreatingPiece(false);
    }
  };

  const handleDeletePortfolioPiece = async (id: string) => {
    if (!confirm('Are you sure you want to remove this piece from the portfolio?')) return;
    try {
      await adminDeletePortfolioPiece(id);
      setPortfolioPieces((prev) => prev.filter((p) => p.id !== id));
      showToast('Artwork removed from catalog');
    } catch (err: any) {
      alert(err.message || 'Failed to delete piece');
    }
  };

  // 5. Products Handlers
  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await fetchProducts();
      setProductsList(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoadingProducts(false);
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
      formData.append('description', newProdDesc);
      formData.append('stockQuantity', String(newProdStock));
      formData.append('specs', newProdSpecs);
      formData.append('inStock', 'true');
      if (newProdImageFile) {
        formData.append('image', newProdImageFile);
      }

      const created = await adminCreateProduct(formData);
      setProductsList((prev) => [created, ...prev]);
      setShowAddProductModal(false);
      setNewProdName('');
      setNewProdDesc('');
      setNewProdImageFile(null);
      showToast('New product added to inventory');
    } catch (err: any) {
      alert(err.message || 'Failed to add product');
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from the inventory?')) return;
    try {
      await adminDeleteProduct(id);
      setProductsList((prev) => prev.filter((p) => p.id !== id));
      showToast('Product removed');
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // 6. Testimonials Handlers
  const loadTestimonials = async () => {
    setLoadingTestimonials(true);
    try {
      const data = await fetchTestimonials();
      setTestimonialsList(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingReview(true);
    try {
      const created = await adminCreateTestimonial({
        name: newReviewName,
        role: newReviewRole,
        stars: newReviewStars,
        quote: newReviewQuote,
        date: 'Recent Client',
      });
      setTestimonialsList((prev) => [created, ...prev]);
      setShowAddReviewModal(false);
      setNewReviewName('');
      setNewReviewQuote('');
      showToast('Client review published');
    } catch (err: any) {
      alert(err.message || 'Failed to publish review');
    } finally {
      setCreatingReview(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to remove this client review?')) return;
    try {
      await adminDeleteTestimonial(id);
      setTestimonialsList((prev) => prev.filter((t) => t.id !== id));
      showToast('Review removed');
    } catch (err: any) {
      alert(err.message || 'Failed to delete testimonial');
    }
  };

  const openWhatsApp = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Counts
  const pendingBookingsCount = bookings.filter((b) => b.status === 'PENDING_REVIEW').length;
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'PENDING_PAYMENT' || o.orderStatus === 'PROCESSING'
  ).length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'SUCCESS')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // ================= MODERN REFINED LOGIN SCREEN ================= //
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="w-full min-h-screen bg-[#12141c] flex items-center justify-center px-4 font-sans text-zinc-100 selection:bg-red-600 selection:text-white">
        <div className="w-full max-w-sm p-8 bg-[#1a1d28] border border-zinc-700/70 rounded-xl shadow-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-700/60">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center font-mono font-bold text-red-400 text-sm">
              M
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-white">
                Marvin Atelier Admin
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Kampala, Uganda · Studio CRM
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-lg text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Admin Email
              </label>
              <input
                required
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-zinc-600"
                placeholder="admin@marvintattoos.com"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Master Password
              </label>
              <input
                required
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-zinc-600"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-md shadow-red-950/40 flex items-center justify-center gap-2"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-zinc-200 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Site</span>
            </button>
            <span className="text-zinc-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Secure CRM
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ================= MODERN REFINED DASHBOARD ================= //
  return (
    <div className="min-h-screen bg-[#13151c] text-zinc-200 font-sans flex flex-col md:flex-row selection:bg-red-600 selection:text-white antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 bg-[#1e2230] border border-red-500/40 text-zinc-100 rounded-lg shadow-2xl flex items-center gap-2.5 text-xs font-mono animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR RAIL */}
      <aside className="w-full md:w-64 bg-[#181a24] border-r border-zinc-700/60 flex flex-col shrink-0">
        {/* Workspace Brand Header */}
        <div className="p-4 border-b border-zinc-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/15 border border-red-600/40 flex items-center justify-center font-mono font-bold text-red-400 text-xs">
              M
            </div>
            <div>
              <div className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
                <span>Marvin Atelier</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] font-mono text-zinc-400 block">
                Pioneer Mall L5 · Kampala
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="text-zinc-400 hover:text-white p-1.5 rounded-md hover:bg-[#232738] transition-colors"
            title="Open Live Website"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-6 overflow-y-auto font-mono text-xs">
          {/* Section: Operational */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Operations
            </div>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'bookings'
                  ? 'bg-red-600/15 text-red-400 border border-red-600/30 font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-[#202434]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-zinc-400" />
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'orders'
                  ? 'bg-red-600/15 text-red-400 border border-red-600/30 font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-[#202434]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-zinc-400" />
                <span>Shop Orders</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          </div>

          {/* Section: Content & Catalog */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Catalog &amp; Media
            </div>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-red-600/15 text-red-400 border border-red-600/30 font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-[#202434]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                <span>Portfolio</span>
              </div>
              <span className="text-[11px] text-zinc-400">{portfolioPieces.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'inventory'
                  ? 'bg-red-600/15 text-red-400 border border-red-600/30 font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-[#202434]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-zinc-400" />
                <span>Inventory</span>
              </div>
              <span className="text-[11px] text-zinc-400">{productsList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'reviews'
                  ? 'bg-red-600/15 text-red-400 border border-red-600/30 font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-[#202434]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-zinc-400" />
                <span>Reviews</span>
              </div>
              <span className="text-[11px] text-zinc-400">{testimonialsList.length}</span>
            </button>
          </div>

          {/* Section: Configuration */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              System
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                activeTab === 'settings'
                  ? 'bg-red-600/15 text-red-400 border border-red-600/30 font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-[#202434]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-zinc-400" />
                <span>Hero &amp; Settings</span>
              </div>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-3.5 border-t border-zinc-700/60 bg-[#151720] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-zinc-700/70 border border-zinc-600/50 flex items-center justify-center text-xs font-bold text-zinc-200">
              M
            </div>
            <div className="truncate">
              <span className="text-white text-xs block truncate font-semibold">Marvin</span>
              <span className="text-[11px] text-zinc-400 block truncate">admin@marvintattoos.com</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-zinc-400 hover:text-red-400 rounded hover:bg-zinc-800 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#13151c]">
        {/* Top Minimal Header */}
        <header className="h-14 px-6 border-b border-zinc-700/60 bg-[#181a24] flex items-center justify-between shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Marvin Atelier</span>
            <span>/</span>
            <span className="text-white font-semibold capitalize">{activeTab}</span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Pending Intake:</span>
              <span className="text-red-400 font-bold">{pendingBookingsCount}</span>
            </div>
            <div className="w-px h-3 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Active Orders:</span>
              <span className="text-amber-400 font-bold">{pendingOrdersCount}</span>
            </div>
            <div className="w-px h-3 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">MoMo Revenue:</span>
              <span className="text-emerald-400 font-bold">UGX {totalRevenue.toLocaleString()}</span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={loadDashboardData}
              className="p-1.5 bg-[#1e2230] hover:bg-[#272c3d] border border-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {activeTab === 'portfolio' && (
              <button
                onClick={() => setShowAddArtworkModal(true)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Piece</span>
              </button>
            )}
            {activeTab === 'inventory' && (
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            )}
            {activeTab === 'reviews' && (
              <button
                onClick={() => setShowAddReviewModal(true)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Review</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 bg-[#1e2230] hover:bg-[#272c3d] border border-zinc-700 text-zinc-300 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
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
                <div className="flex items-center gap-1 bg-[#181a24] p-1 rounded-lg border border-zinc-700/70 font-mono text-xs">
                  {['ALL', 'PENDING_REVIEW', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setBookingFilterStatus(st);
                        setTimeout(loadBookings, 50);
                      }}
                      className={`px-3 py-1 rounded-md transition-colors text-[11px] ${
                        bookingFilterStatus === st
                          ? 'bg-red-600/20 text-red-400 border border-red-600/40 font-semibold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st === 'ALL' ? 'All' : st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadBookings()}
                      placeholder="Search client, phone, ref..."
                      className="w-full pl-8 pr-3 py-1.5 bg-[#181a24] border border-zinc-700/70 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500 placeholder:text-zinc-500"
                    />
                  </div>
                  <button
                    onClick={loadBookings}
                    className="px-3 py-1.5 bg-[#202434] hover:bg-[#282d42] border border-zinc-700 rounded-lg text-xs font-mono text-zinc-200 transition-colors"
                  >
                    Filter
                  </button>
                </div>
              </div>

              {/* High Density Table */}
              <div className="bg-[#181a24] border border-zinc-700/70 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-700/60 bg-[#151720] text-zinc-400 text-[11px] uppercase tracking-wider">
                      <th className="p-3 pl-4">Ref Code</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Discipline &amp; Placement</th>
                      <th className="p-3">Preferred Slot</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700/50">
                    {loadingBookings ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-400">
                          Loading consultations...
                        </td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-400">
                          No inquiries found.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((b) => (
                        <tr
                          key={b.id}
                          onClick={() => setInspectBooking(b)}
                          className="hover:bg-[#202434] cursor-pointer transition-colors group"
                        >
                          <td className="p-3 pl-4">
                            <span className="font-semibold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/40 text-[11px]">
                              {b.referenceCode}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-white group-hover:text-red-300 transition-colors">
                              {b.clientName}
                            </div>
                            <div className="text-[11px] text-zinc-400">{b.clientPhone}</div>
                          </td>
                          <td className="p-3">
                            <span className="text-zinc-200 capitalize block font-semibold">
                              {b.serviceType.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              {b.placement} ({b.size})
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="text-zinc-200">
                              {new Date(b.preferredDate).toLocaleDateString()}
                            </div>
                            <div className="text-[11px] text-zinc-400 capitalize">{b.timeSlot}</div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold ${
                                b.status === 'CONFIRMED'
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/70'
                                  : b.status === 'COMPLETED'
                                  ? 'bg-blue-950/60 text-blue-300 border border-blue-800/70'
                                  : b.status === 'CANCELLED'
                                  ? 'bg-red-950/60 text-red-300 border border-red-800/70'
                                  : 'bg-amber-950/60 text-amber-300 border border-amber-800/70'
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
                                className="px-2.5 py-1 bg-emerald-950/50 hover:bg-emerald-900/80 border border-emerald-800/70 text-emerald-300 rounded text-[11px] transition-colors flex items-center gap-1"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </button>
                              <button
                                onClick={() => setInspectBooking(b)}
                                className="px-2.5 py-1 bg-[#222636] hover:bg-[#2b3046] border border-zinc-700 text-zinc-300 rounded text-[11px] transition-colors flex items-center gap-1"
                              >
                                <span>Details</span>
                                <ArrowRight className="w-3 h-3" />
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
                <div className="flex items-center gap-1 bg-[#181a24] p-1 rounded-lg border border-zinc-700/70 font-mono text-xs">
                  {['ALL', 'PENDING_PAYMENT', 'PROCESSING', 'READY_FOR_PICKUP', 'DISPATCHED', 'COMPLETED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setOrderFilterStatus(st);
                        setTimeout(loadOrders, 50);
                      }}
                      className={`px-3 py-1 rounded-md transition-colors text-[11px] ${
                        orderFilterStatus === st
                          ? 'bg-red-600/20 text-red-400 border border-red-600/40 font-semibold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st === 'ALL' ? 'All' : st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadOrders()}
                      placeholder="Search order #, client..."
                      className="w-full pl-8 pr-3 py-1.5 bg-[#181a24] border border-zinc-700/70 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500 placeholder:text-zinc-500"
                    />
                  </div>
                  <button
                    onClick={loadOrders}
                    className="px-3 py-1.5 bg-[#202434] hover:bg-[#282d42] border border-zinc-700 rounded-lg text-xs font-mono text-zinc-200 transition-colors"
                  >
                    Filter
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#181a24] border border-zinc-700/70 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-700/60 bg-[#151720] text-zinc-400 text-[11px] uppercase tracking-wider">
                      <th className="p-3 pl-4">Order #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Fulfillment</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700/50">
                    {loadingOrders ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-zinc-400">
                          Loading shop orders...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-zinc-400">
                          No orders placed yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr
                          key={o.id}
                          onClick={() => setInspectOrder(o)}
                          className="hover:bg-[#202434] cursor-pointer transition-colors group"
                        >
                          <td className="p-3 pl-4 font-semibold text-white">
                            {o.orderNumber}
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-zinc-200">{o.clientName}</div>
                            <div className="text-[11px] text-zinc-400">{o.clientPhone}</div>
                          </td>
                          <td className="p-3">
                            <span className="text-zinc-200 font-semibold block">
                              {o.deliveryMethod === 'STUDIO_PICKUP' ? 'Studio Pickup' : 'Dispatch'}
                            </span>
                            {o.deliveryAddress && (
                              <span className="text-[10px] text-zinc-400 block truncate max-w-xs">
                                {o.deliveryAddress}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                o.paymentStatus === 'SUCCESS'
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/70'
                                  : 'bg-amber-950/60 text-amber-300 border border-amber-800/70'
                              }`}
                            >
                              {o.paymentMethod} ({o.paymentStatus})
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-red-400">
                            UGX {o.totalAmount?.toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span className="text-zinc-300 text-[11px]">
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
                                className="px-2.5 py-1 bg-emerald-950/50 hover:bg-emerald-900/80 border border-emerald-800/70 text-emerald-300 rounded text-[11px] flex items-center gap-1"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </button>
                              <button
                                onClick={() => setInspectOrder(o)}
                                className="px-2.5 py-1 bg-[#222636] hover:bg-[#2b3046] border border-zinc-700 text-zinc-300 rounded text-[11px] flex items-center gap-1"
                              >
                                <span>View</span>
                                <ArrowRight className="w-3 h-3" />
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
                <div className="font-mono text-xs text-zinc-400">
                  Total Artworks: <span className="text-white font-bold">{portfolioPieces.length}</span>
                </div>
                <button
                  onClick={() => setShowAddArtworkModal(true)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Masterpiece</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {portfolioPieces.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#181a24] border border-zinc-700/70 rounded-xl overflow-hidden flex flex-col justify-between group shadow-md"
                  >
                    <div className="h-44 bg-[#141620] relative overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#181a24]/90 border border-zinc-700 text-[10px] font-mono text-red-400 rounded">
                        {p.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 font-mono text-xs">
                      <h4 className="font-semibold text-white truncate">{p.title}</h4>
                      <div className="text-[11px] text-zinc-400 flex justify-between">
                        <span>{p.zone}</span>
                        <span className="text-zinc-500">{p.duration || 'Session'}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>

                      <div className="pt-2.5 border-t border-zinc-700/60 flex justify-between items-center">
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {p.pigment || 'Triple Black'}
                        </span>
                        <button
                          onClick={() => handleDeletePortfolioPiece(p.id)}
                          className="text-[11px] text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
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
                <div className="font-mono text-xs text-zinc-400">
                  Shop Catalog: <span className="text-white font-bold">{productsList.length}</span> items
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {productsList.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-[#181a24] border border-zinc-700/70 rounded-xl overflow-hidden flex flex-col justify-between shadow-md"
                  >
                    <div className="h-36 bg-[#141620] relative overflow-hidden">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#181a24]/90 border border-zinc-700 text-[10px] font-mono text-red-400 rounded">
                        {prod.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 font-mono text-xs">
                      <h4 className="font-semibold text-white truncate">{prod.name}</h4>
                      <div className="text-sm font-bold text-red-400">
                        UGX {prod.price.toLocaleString()}
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2">
                        {prod.description}
                      </p>

                      <div className="pt-2.5 border-t border-zinc-700/60 flex justify-between items-center">
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>In Stock</span>
                        </span>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-[11px] text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
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
                <div className="font-mono text-xs text-zinc-400">
                  Published Reviews: <span className="text-white font-bold">{testimonialsList.length}</span>
                </div>
                <button
                  onClick={() => setShowAddReviewModal(true)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Review</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonialsList.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 bg-[#181a24] border border-zinc-700/70 rounded-xl space-y-3 font-mono text-xs flex flex-col justify-between shadow-md"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">{t.name}</span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: t.stars || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-red-400 block mb-2">{t.role}</span>
                      <p className="text-[11px] text-zinc-300 italic leading-relaxed">
                        "{t.quote}"
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-zinc-700/60 flex justify-end">
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
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
              <div className="p-5 bg-[#181a24] border border-zinc-700/70 rounded-xl space-y-4 shadow-md">
                <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-700/60 pb-2 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-red-400" />
                  <span>1. Hero Banner Visual &amp; Darkness Opacity</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 h-48 bg-[#141620] border border-zinc-700 rounded-lg overflow-hidden relative">
                    <img
                      src={heroImagePreview || settings.heroBannerUrl}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 bg-black pointer-events-none transition-opacity"
                      style={{ opacity: settings.heroOpacity }}
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#181a24]/90 border border-zinc-700 text-[10px] text-zinc-200 rounded font-semibold">
                      Live Hero Preview
                    </span>
                  </div>

                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1.5">
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
                        className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-red-600 file:text-white file:text-xs file:rounded-md file:cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-zinc-400 mb-1">
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
              <div className="p-5 bg-[#181a24] border border-zinc-700/70 rounded-xl space-y-4 shadow-md">
                <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-700/60 pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-400" />
                  <span>2. Hero Editorial Statements</span>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Headline Statement</label>
                  <input
                    type="text"
                    value={settings.heroStatement}
                    onChange={(e) => setSettings({ ...settings, heroStatement: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Subtext Description</label>
                  <textarea
                    rows={2}
                    value={settings.heroSubtext}
                    onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Studio Info */}
              <div className="p-5 bg-[#181a24] border border-zinc-700/70 rounded-xl space-y-4 shadow-md">
                <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-700/60 pb-2 flex items-center gap-2">
                  <Building className="w-4 h-4 text-red-400" />
                  <span>3. Studio Contacts &amp; Coordinates</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Studio Desk Phone</label>
                    <input
                      type="text"
                      value={settings.primaryPhone}
                      onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">WhatsApp Direct Line</label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1">Physical Address</label>
                    <input
                      type="text"
                      value={settings.physicalAddress}
                      onChange={(e) => setSettings({ ...settings, physicalAddress: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1">Google Maps URL</label>
                    <input
                      type="text"
                      value={settings.googleMapsUrl}
                      onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="p-5 bg-[#181a24] border border-zinc-700/70 rounded-xl space-y-3 shadow-md">
                <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-700/60 pb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-400" />
                  <span>4. Social Channels &amp; Links</span>
                </div>

                {settings.socialLinks.map((soc, idx) => (
                  <div key={soc.id || idx} className="flex items-center gap-3 p-2.5 bg-[#141620] rounded-lg border border-zinc-700">
                    <div className="flex items-center gap-2 w-32 shrink-0">
                      <input
                        type="checkbox"
                        checked={soc.active}
                        onChange={(e) => {
                          const updated = [...settings.socialLinks];
                          updated[idx] = { ...soc, active: e.target.checked };
                          setSettings({ ...settings, socialLinks: updated });
                        }}
                        className="accent-red-600 cursor-pointer rounded"
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
                      className="flex-1 px-3 py-1.5 bg-[#181a24] border border-zinc-700 rounded-md text-white text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="py-2.5 px-6 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono uppercase font-semibold transition-all shadow-lg shadow-red-950/40 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{savingSettings ? 'Deploying...' : 'Save & Deploy Changes'}</span>
              </button>
            </form>
          )}
        </div>
      </main>

      {/* INSPECTION SLIDE-OVER DRAWER FOR BOOKING */}
      {inspectBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#181a24] border-l border-zinc-700 h-full p-6 flex flex-col justify-between overflow-y-auto font-mono text-xs shadow-2xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-700/60 pb-3">
                <span className="text-red-400 font-bold bg-red-950/50 px-2.5 py-0.5 rounded border border-red-800/50 text-xs">
                  {inspectBooking.referenceCode}
                </span>
                <button
                  onClick={() => setInspectBooking(null)}
                  className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">{inspectBooking.clientName}</h3>
                <div className="text-zinc-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{inspectBooking.clientPhone}</span>
                </div>
                <div className="text-zinc-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{inspectBooking.clientEmail}</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#141620] rounded-lg border border-zinc-700 space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Discipline:</span>
                  <span className="text-white font-semibold capitalize">
                    {inspectBooking.serviceType.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Placement:</span>
                  <span className="text-red-400 font-semibold">{inspectBooking.placement}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Preferred Date:</span>
                  <span className="text-white">
                    {new Date(inspectBooking.preferredDate).toLocaleDateString()} ({inspectBooking.timeSlot})
                  </span>
                </div>
              </div>

              {/* Project Brief */}
              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">
                  Project Brief:
                </span>
                <p className="p-3 bg-[#141620] rounded-lg border border-zinc-700 text-zinc-200 leading-relaxed">
                  {inspectBooking.description}
                </p>
              </div>

              {/* Reference Image */}
              {inspectBooking.referenceImage && (
                <div className="space-y-1">
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">
                    Reference Photo:
                  </span>
                  <div className="max-h-60 overflow-hidden rounded-lg border border-zinc-700 bg-[#12141c]">
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
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">
                  Status Workflow:
                </span>
                <select
                  value={inspectBooking.status}
                  onChange={(e) => handleUpdateBookingStatus(inspectBooking.id, e.target.value)}
                  className="w-full px-3 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                >
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-700/60 space-y-2">
              <button
                onClick={() =>
                  openWhatsApp(
                    inspectBooking.clientPhone,
                    `Hello ${inspectBooking.clientName}! This is Marvin from Marvin Tattoos Atelier regarding inquiry [${inspectBooking.referenceCode}]. We look forward to seeing you at New Pioneer Mall Level 5.`
                  )
                }
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono uppercase font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </button>
              <button
                onClick={() => handleDeleteBooking(inspectBooking.id)}
                className="w-full py-2 bg-[#141620] hover:bg-red-950/40 hover:text-red-400 text-zinc-400 border border-zinc-700/70 rounded-lg text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECTION SLIDE-OVER DRAWER FOR ORDER */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#181a24] border-l border-zinc-700 h-full p-6 flex flex-col justify-between overflow-y-auto font-mono text-xs shadow-2xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-700/60 pb-3">
                <span className="text-white font-bold">{inspectOrder.orderNumber}</span>
                <button
                  onClick={() => setInspectOrder(null)}
                  className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">{inspectOrder.clientName}</h3>
                <div className="text-zinc-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{inspectOrder.clientPhone}</span>
                </div>
                <div className="text-zinc-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{inspectOrder.clientEmail}</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#141620] rounded-lg border border-zinc-700 space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Fulfillment:</span>
                  <span className="text-white font-semibold">
                    {inspectOrder.deliveryMethod === 'STUDIO_PICKUP' ? 'Studio Pickup (L5)' : 'Kampala Dispatch'}
                  </span>
                </div>
                {inspectOrder.deliveryAddress && (
                  <div className="text-[11px] text-zinc-400 pt-1.5 border-t border-zinc-700/60">
                    <span>Address: </span>
                    <span className="text-white">{inspectOrder.deliveryAddress}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Payment:</span>
                  <span className="text-red-400 font-semibold">{inspectOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Total Amount:</span>
                  <span className="text-red-400 font-bold text-sm">
                    UGX {inspectOrder.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">
                  Items Breakdown:
                </span>
                <div className="p-3 bg-[#141620] rounded-lg border border-zinc-700 space-y-1.5">
                  {(inspectOrder.items || []).map((it: any, i: number) => (
                    <div key={i} className="flex justify-between text-zinc-200">
                      <span>{it.quantity}x {it.product?.name || 'Item'}</span>
                      <span className="text-zinc-300 font-semibold">UGX {(it.unitPrice * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status */}
              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">
                  Order Status:
                </span>
                <select
                  value={inspectOrder.orderStatus}
                  onChange={(e) => handleUpdateOrderStatus(inspectOrder.id, e.target.value)}
                  className="w-full px-3 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
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

            <div className="pt-4 border-t border-zinc-700/60 space-y-2">
              <button
                onClick={() =>
                  openWhatsApp(
                    inspectOrder.clientPhone,
                    `Hello ${inspectOrder.clientName}! This is Marvin Tattoos Atelier regarding Order #${inspectOrder.orderNumber}. Your items are prepared.`
                  )
                }
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono uppercase font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Customer</span>
              </button>
              <button
                onClick={() => handleDeleteOrder(inspectOrder.id)}
                className="w-full py-2 bg-[#141620] hover:bg-red-950/40 hover:text-red-400 text-zinc-400 border border-zinc-700/70 rounded-lg text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD ARTWORK */}
      {showAddArtworkModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePortfolioPiece}
            className="w-full max-w-lg bg-[#181a24] border border-zinc-700 rounded-xl p-6 space-y-4 font-mono text-xs shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-zinc-700/60 pb-3">
              <h3 className="font-semibold text-white">Upload New Artwork</h3>
              <button
                type="button"
                onClick={() => setShowAddArtworkModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Title *</label>
                <input
                  required
                  type="text"
                  value={newPieceTitle}
                  onChange={(e) => setNewPieceTitle(e.target.value)}
                  placeholder="e.g. Baroque Skull Sleeve"
                  className="w-full px-3 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Category *</label>
                <select
                  value={newPieceCategory}
                  onChange={(e) => setNewPieceCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="dark-realism">Dark Realism</option>
                  <option value="neo-traditional">Neo-Traditional</option>
                  <option value="micro-detail">Micro &amp; Fine-Line</option>
                  <option value="piercing">Piercing</option>
                  <option value="coverup">Cover-Up</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Zone / Placement *</label>
                <input
                  required
                  type="text"
                  value={newPieceZone}
                  onChange={(e) => setNewPieceZone(e.target.value)}
                  placeholder="Forearm, Chest..."
                  className="w-full px-3 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={newPieceDescription}
                  onChange={(e) => setNewPieceDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Artwork Photo *</label>
                <input
                  required
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setNewPieceImageFile(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-red-600 file:text-white file:text-xs file:rounded-md file:cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-700/60 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddArtworkModal(false)}
                className="px-3.5 py-1.5 bg-[#141620] text-zinc-300 rounded-lg text-xs hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingPiece}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold uppercase"
              >
                {creatingPiece ? 'Publishing...' : 'Publish Artwork'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProduct}
            className="w-full max-w-lg bg-[#181a24] border border-zinc-700 rounded-xl p-6 space-y-4 font-mono text-xs shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-zinc-700/60 pb-3">
              <h3 className="font-semibold text-white">Add Shop Item</h3>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Product Name *</label>
                <input
                  required
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Clinical Tattoo Aftercare Balm"
                  className="w-full px-3 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Category *</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="Aftercare">Aftercare</option>
                  <option value="Hard Goods">Hard Goods</option>
                  <option value="Needles">Needles</option>
                  <option value="Titanium Jewelry">Titanium Jewelry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Price (UGX) *</label>
                <input
                  required
                  type="number"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(parseFloat(e.target.value))}
                  placeholder="95000"
                  className="w-full px-3 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Product Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setNewProdImageFile(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-red-600 file:text-white file:text-xs file:rounded-md file:cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-700/60 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="px-3.5 py-1.5 bg-[#141620] text-zinc-300 rounded-lg text-xs hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingProduct}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold uppercase"
              >
                {creatingProduct ? 'Saving...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD REVIEW */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTestimonial}
            className="w-full max-w-lg bg-[#181a24] border border-zinc-700 rounded-xl p-6 space-y-4 font-mono text-xs shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-zinc-700/60 pb-3">
              <h3 className="font-semibold text-white">Add Client Review</h3>
              <button
                type="button"
                onClick={() => setShowAddReviewModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Client Name *</label>
                <input
                  required
                  type="text"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  placeholder="e.g. Dennis Mukasa"
                  className="w-full px-3 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Discipline / Role *</label>
                <input
                  required
                  type="text"
                  value={newReviewRole}
                  onChange={(e) => setNewReviewRole(e.target.value)}
                  placeholder="e.g. Dark Realism Sleeve"
                  className="w-full px-3 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Review Quote *</label>
                <textarea
                  required
                  rows={3}
                  value={newReviewQuote}
                  onChange={(e) => setNewReviewQuote(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141620] border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-700/60 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddReviewModal(false)}
                className="px-3.5 py-1.5 bg-[#141620] text-zinc-300 rounded-lg text-xs hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingReview}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold uppercase"
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
