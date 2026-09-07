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
  fetchSiteSettings,
  fetchPortfolioPieces,
  fetchProducts,
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

  // Dashboard Tabs: 'bookings' | 'orders' | 'settings' | 'portfolio' | 'products'
  const [activeTab, setActiveTab] = useState<'bookings' | 'orders' | 'settings' | 'portfolio' | 'products'>('bookings');

  // Bookings CRM State
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
  const [settingsSaveMessage, setSettingsSaveMessage] = useState<string>('');
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

  // Actions
  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      await adminUpdateBooking(id, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this booking?')) return;
    try {
      await adminDeleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
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
    } catch (err) {
      alert('Failed to update order');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await adminDeleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSaveMessage('');

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
      setSettingsSaveMessage('Settings saved successfully!');
      setTimeout(() => setSettingsSaveMessage(''), 4000);
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
      alert('Artwork piece published to portfolio gallery!');
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
    } catch (err) {
      alert('Failed to delete piece');
    }
  };

  // WhatsApp helper
  const openWhatsAppToClient = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // ================= RENDER LOGIN FORM ================= //
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="w-full min-h-screen pt-28 pb-16 bg-noir-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-noir-900 border border-noir-700/80 p-8 gothic-card shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-crimson/20 border border-crimson/40 text-crimson-light flex items-center justify-center mx-auto mb-2">
              <Icons8 name="lock" size={24} />
            </div>
            <span className="font-label-caps text-[11px] text-crimson-light uppercase tracking-[0.25em] font-bold">
              MARVIN TATTOOS ATELIER
            </span>
            <h2 className="font-headline-lg text-2xl text-bone uppercase font-bold">
              Studio Admin Portal
            </h2>
            <p className="font-body-sm text-xs text-bone-dim">
              Restricted dashboard for Marvin &amp; atelier managers.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs font-body-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                Admin Email
              </label>
              <input
                required
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                placeholder="admin@marvintattoos.com"
              />
            </div>

            <div>
              <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                Master Password
              </label>
              <input
                required
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-noir-850 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-widest transition-all btn-gothic-glow border border-crimson/40 flex items-center justify-center gap-2"
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
            <span className="text-[10px] text-bone-dim/60">Marvin Studio v2.0</span>
          </div>
        </div>
      </div>
    );
  }

  // ================= RENDER AUTHENTICATED DASHBOARD ================= //
  return (
    <div className="w-full min-h-screen pt-20 bg-noir-950 text-bone">
      {/* Top Admin Navigation Bar */}
      <header className="w-full bg-noir-900 border-b border-noir-700/80 px-4 md:px-8 py-4 sticky top-20 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h1 className="font-title-editorial text-lg text-bone uppercase font-bold tracking-wider">
                Marvin Atelier CMS
              </h1>
              <span className="font-label-caps text-[10px] text-bone-dim uppercase">
                Logged in as {adminUser?.name || 'Marvin'} ({adminUser?.email})
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center overflow-x-auto no-scrollbar gap-1.5 bg-noir-950 p-1 border border-noir-700/80">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-1.5 font-label-caps text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'bookings'
                  ? 'bg-crimson text-bone font-bold shadow'
                  : 'text-bone-dim hover:text-bone'
              }`}
            >
              Bookings CRM
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 font-label-caps text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'orders'
                  ? 'bg-crimson text-bone font-bold shadow'
                  : 'text-bone-dim hover:text-bone'
              }`}
            >
              Shop Orders
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
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 bg-noir-850 hover:bg-noir-800 border border-noir-700 text-bone-dim hover:text-bone font-label-caps text-[11px] uppercase transition-colors"
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900 border border-red-800 text-red-300 font-label-caps text-[11px] uppercase transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* ================= TAB 1: BOOKINGS CRM ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="font-headline-lg text-2xl uppercase font-bold text-bone">
                  Client Consultations &amp; Bookings
                </h2>
                <p className="font-body-sm text-xs text-bone-dim">
                  Manage intake inquiries, launch direct WhatsApp updates, and track confirmation status.
                </p>
              </div>

              {/* Status Filters & Search */}
              <div className="flex flex-wrap items-center gap-2">
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
                  Filter
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
                <p className="font-body-sm text-xs text-bone-dim">
                  Inquiries submitted via the online booking form will appear here in real time.
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
                          Submitted: {new Date(b.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1 font-body-sm text-xs">
                        <div>
                          <span className="text-bone-dim block font-label-caps text-[10px] uppercase">
                            Client
                          </span>
                          <span className="text-bone font-bold text-sm">{b.clientName}</span>
                          <div className="text-bone-dim text-[11px]">{b.clientPhone}</div>
                          <div className="text-bone-dim text-[11px]">{b.clientEmail}</div>
                        </div>

                        <div>
                          <span className="text-bone-dim block font-label-caps text-[10px] uppercase">
                            Service &amp; Placement
                          </span>
                          <span className="text-bone font-bold capitalize">
                            {b.serviceType.replace('_', ' ')}
                          </span>
                          <div className="text-gold">{b.placement} ({b.size})</div>
                        </div>

                        <div>
                          <span className="text-bone-dim block font-label-caps text-[10px] uppercase">
                            Preferred Slot
                          </span>
                          <span className="text-bone">
                            {new Date(b.preferredDate).toLocaleDateString()}
                          </span>
                          <div className="text-bone-dim capitalize">{b.timeSlot} session</div>
                        </div>
                      </div>

                      {/* Description & Notes */}
                      <div className="p-3 bg-noir-850 border border-noir-700/60 space-y-1 text-xs">
                        <div className="font-label-caps text-[10px] text-gold uppercase font-bold">
                          Project Description:
                        </div>
                        <p className="text-bone leading-relaxed">{b.description}</p>
                        {b.notes && (
                          <div className="pt-2 border-t border-noir-700/40 text-bone-dim">
                            <span className="text-crimson-light font-bold">Client Note: </span>
                            {b.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions & WhatsApp Launcher */}
                    <div className="flex flex-col justify-between items-end gap-3 min-w-[200px] shrink-0 border-t lg:border-t-0 lg:border-l border-noir-700/60 pt-4 lg:pt-0 lg:pl-6">
                      <div className="w-full space-y-2">
                        <span className="font-label-caps text-[10px] text-bone-dim uppercase block">
                          Change Status
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
                              `Hello ${b.clientName}! This is Marvin from Marvin Tattoos Atelier regarding your booking request ${b.referenceCode} for ${b.serviceType}. We are pleased to connect with you!`
                            )
                          }
                          className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-label-caps text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Icons8 name="whatsapp" size={14} />
                          <span>WhatsApp Client</span>
                        </button>

                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="w-full py-1.5 bg-noir-850 hover:bg-red-950/60 hover:text-red-300 text-bone-dim font-label-caps text-[10px] uppercase transition-colors border border-noir-700"
                        >
                          Delete Record
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
                  Shop Orders &amp; Delivery
                </h2>
                <p className="font-body-sm text-xs text-bone-dim">
                  Aftercare, needles, and titanium jewelry order management with Uganda payment status.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadOrders()}
                  placeholder="Search order number, client..."
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
                  No orders placed yet
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
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1 font-body-sm text-xs">
                        <div>
                          <span className="text-bone-dim block font-label-caps text-[10px] uppercase">
                            Client Info
                          </span>
                          <span className="text-bone font-bold">{o.clientName}</span>
                          <div className="text-bone-dim">{o.clientPhone}</div>
                        </div>

                        <div>
                          <span className="text-bone-dim block font-label-caps text-[10px] uppercase">
                            Fulfillment &amp; Payment
                          </span>
                          <span className="text-gold">{o.deliveryMethod.replace('_', ' ')}</span>
                          <div className="text-bone-dim">via {o.paymentMethod}</div>
                          {o.deliveryAddress && (
                            <div className="text-bone-dim text-[11px] truncate">{o.deliveryAddress}</div>
                          )}
                        </div>

                        <div>
                          <span className="text-bone-dim block font-label-caps text-[10px] uppercase">
                            Total Due
                          </span>
                          <span className="text-crimson-light font-bold text-sm">
                            UGX {o.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-3 bg-noir-850 border border-noir-700/60 space-y-1 text-xs">
                        <span className="font-label-caps text-[10px] text-bone-dim uppercase block font-bold">
                          Purchased Items:
                        </span>
                        {(o.items || []).map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-bone-dim">
                            <span>
                              {item.quantity}x {item.product?.name || 'Item'}
                            </span>
                            <span>UGX {(item.unitPrice * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-between items-end gap-3 min-w-[200px] shrink-0 border-t lg:border-t-0 lg:border-l border-noir-700/60 pt-4 lg:pt-0 lg:pl-6">
                      <div className="w-full space-y-2">
                        <span className="font-label-caps text-[10px] text-bone-dim uppercase block">
                          Update Order State
                        </span>
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="w-full px-3 py-1.5 bg-noir-850 border border-noir-700 text-bone font-label-caps text-xs uppercase focus:outline-none focus:border-crimson"
                        >
                          <option value="PENDING_PAYMENT">Pending Payment</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                          <option value="DISPATCHED">Dispatched</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>

                      <div className="w-full flex flex-col gap-2">
                        <button
                          onClick={() =>
                            openWhatsAppToClient(
                              o.clientPhone,
                              `Hello ${o.clientName}! This is Marvin Tattoos Atelier updating you on Order #${o.orderNumber}. Your items are being prepared.`
                            )
                          }
                          className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-label-caps text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Icons8 name="whatsapp" size={14} />
                          <span>WhatsApp Client</span>
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
                Hero Banner, Brand &amp; Social Media
              </h2>
              <p className="font-body-sm text-xs text-bone-dim">
                Instant live updates to the homepage hero image, studio contacts, and social links.
              </p>
            </div>

            {settingsSaveMessage && (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-label-caps uppercase font-bold">
                {settingsSaveMessage}
              </div>
            )}

            {/* Hero Image Section */}
            <div className="p-6 bg-noir-900 border border-noir-700/80 gothic-card space-y-4">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                1. Hero Banner Image &amp; Visual Opacity
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 h-48 bg-noir-950 border border-noir-700 overflow-hidden relative">
                  <img
                    src={heroImagePreview || settings.heroBannerUrl}
                    alt="Hero Banner Preview"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-noir-950 pointer-events-none"
                    style={{ opacity: settings.heroOpacity }}
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-noir-950/90 text-[10px] font-label-caps text-bone uppercase border border-noir-700">
                    Live Hero Preview
                  </span>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block font-label-caps text-xs uppercase text-bone mb-1">
                      Upload New Banner Photo (Sharp WebP Optimized)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroFileSelect}
                      className="w-full text-xs text-bone-dim file:mr-3 file:py-2 file:px-4 file:border-0 file:bg-crimson file:text-bone file:font-label-caps file:text-xs file:uppercase file:cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-label-caps text-xs uppercase text-bone mb-1">
                      <span>Dark Overlay Opacity</span>
                      <span className="text-gold">{Math.round(settings.heroOpacity * 100)}%</span>
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
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Copywriting */}
            <div className="p-6 bg-noir-900 border border-noir-700/80 gothic-card space-y-4">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                2. Hero Editorial Statements
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1">
                    Hero Headline Statement
                  </label>
                  <input
                    type="text"
                    value={settings.heroStatement}
                    onChange={(e) => setSettings({ ...settings, heroStatement: e.target.value })}
                    className="w-full px-3 py-2.5 bg-noir-850 border border-noir-700 text-bone text-sm focus:outline-none focus:border-crimson"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1">
                    Hero Subtext Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.heroSubtext}
                    onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })}
                    className="w-full px-3 py-2.5 bg-noir-850 border border-noir-700 text-bone text-sm focus:outline-none focus:border-crimson"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Studio Address */}
            <div className="p-6 bg-noir-900 border border-noir-700/80 gothic-card space-y-4">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                3. Studio Phone &amp; Physical Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1">
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
                  <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1">
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
                  <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1">
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
                  <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1">
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

            {/* Social Media Links */}
            <div className="p-6 bg-noir-900 border border-noir-700/80 gothic-card space-y-4">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                4. Social Media Links &amp; Toggles
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
              {savingSettings ? 'Saving Settings...' : 'Save & Publish Studio Changes'}
            </button>
          </form>
        )}

        {/* ================= TAB 4: PORTFOLIO CMS ================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-headline-lg text-2xl uppercase font-bold text-bone">
                Artwork Portfolio CMS
              </h2>
              <p className="font-body-sm text-xs text-bone-dim">
                Upload new tattoos and piercings with Sharp WebP image compression.
              </p>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleCreatePortfolioPiece} className="p-6 bg-noir-900 border border-noir-700/80 gothic-card space-y-4 max-w-3xl">
              <h3 className="font-title-editorial text-base uppercase text-bone font-bold">
                Add New Masterpiece
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
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
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
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
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
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
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
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
                  <label className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={newPieceDescription}
                    onChange={(e) => setNewPieceDescription(e.target.value)}
                    placeholder="Artistic description and anatomy alignment..."
                    className="w-full px-3 py-2 bg-noir-850 border border-noir-700 text-bone text-xs focus:outline-none focus:border-crimson"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-caps text-[10px] uppercase text-bone mb-1">
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
                className="py-3 px-6 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-widest transition-all btn-gothic-glow border border-crimson/40"
              >
                {creatingPiece ? 'Publishing...' : 'Upload & Publish Artwork'}
              </button>
            </form>

            {/* Gallery List */}
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
      </div>
    </div>
  );
};
