import React, { useState, useEffect, useMemo } from 'react';
import { PageView, SiteSettingData, ClientUserData, ServiceItem, ArtistProfile } from '../types';
import { Icons8 } from '../components/Icons8';
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
  Edit,
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
  Users,
  Crown,
  UserCheck,
  Shield,
  ShieldCheck,
  FileText,
  Truck,
  CreditCard,
  Building,
  Tag,
  PenTool,
  Lock,
  Key,
} from 'lucide-react';
import {
  adminLogin,
  adminLogout,
  adminGetMe,
  adminChangePassword,
  adminGetBookings,
  adminUpdateBooking,
  adminDeleteBooking,
  adminGetOrders,
  adminUpdateOrder,
  adminDeleteOrder,
  adminGetUsers,
  adminGetUserById,
  adminUpdateUser,
  adminDeleteUser,
  adminSyncLegacyUsers,
  adminGetServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
  adminGetMembers,
  adminCreateMember,
  adminUpdateMember,
  adminDeleteMember,
  adminUpdateSettings,
  adminUploadHeroImage,
  adminCreatePortfolioPiece,
  adminUpdatePortfolioPiece,
  adminDeletePortfolioPiece,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminRenameProductCategory,
  adminDeleteProductCategory,
  adminCreateTestimonial,
  adminUpdateTestimonial,
  adminDeleteTestimonial,
  fetchSiteSettings,
  fetchPortfolioPieces,
  fetchProducts,
  fetchTestimonials,
  fetchServices,
  DEFAULT_SITE_SETTINGS,
} from '../services/apiClient';
import { useSettings } from '../context/SettingsContext';

interface AdminPageProps {
  onNavigate: (page: PageView) => void;
}

type TabType = 'bookings' | 'users' | 'services' | 'team' | 'shop' | 'portfolio' | 'reviews' | 'settings';
type ShopSubTab = 'products' | 'categories' | 'orders';


export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { settings: globalSettings, saveSettings: saveGlobalSettings, refreshSettings } = useSettings();
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>('');

  // Admin Password Change State
  const [currPassword, setCurrPassword] = useState<string>('');
  const [newPasswordVal, setNewPasswordVal] = useState<string>('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState<string>('');
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Active Tab & Sub-Tabs
  const [activeTab, setActiveTab] = useState<TabType>('bookings');
  const [shopSubTab, setShopSubTab] = useState<ShopSubTab>('products');

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Drawer / Inspection Modals
  const [inspectBooking, setInspectBooking] = useState<any | null>(null);
  const [inspectOrder, setInspectOrder] = useState<any | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  // Bookings State
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('ALL');
  const [bookingSearch, setBookingSearch] = useState<string>('');
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);

  // Users / Clients CRM State
  const [usersList, setUsersList] = useState<ClientUserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>('');
  const [inspectUser, setInspectUser] = useState<ClientUserData | null>(null);
  const [editingUserNotes, setEditingUserNotes] = useState<string>('');
  const [savingUser, setSavingUser] = useState<boolean>(false);
  const [syncingLegacy, setSyncingLegacy] = useState<boolean>(false);

  // Services Catalog State
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(false);
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('ALL');
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceDisciplineNumber, setServiceDisciplineNumber] = useState<string>('01');
  const [serviceTitle, setServiceTitle] = useState<string>('');
  const [serviceSubtitle, setServiceSubtitle] = useState<string>('');
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [serviceCategory, setServiceCategory] = useState<string>('TATTOO');
  const [serviceIconName, setServiceIconName] = useState<string>('skull');
  const [serviceSpecs, setServiceSpecs] = useState<{ label: string; value: string }[]>([
    { label: '', value: '' },
  ]);
  const [serviceSortOrder, setServiceSortOrder] = useState<number>(0);
  const [serviceImageFile, setServiceImageFile] = useState<File | null>(null);
  const [serviceImagePreview, setServiceImagePreview] = useState<string>('');
  const [savingService, setSavingService] = useState<boolean>(false);

  // Team & Artists State
  const [teamMembers, setTeamMembers] = useState<ArtistProfile[]>([]);
  const [loadingTeam, setLoadingTeam] = useState<boolean>(false);
  const [teamSearch, setTeamSearch] = useState<string>('');
  const [showMemberModal, setShowMemberModal] = useState<boolean>(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState<string>('');
  const [memberSlug, setMemberSlug] = useState<string>('');
  const [memberTitle, setMemberTitle] = useState<string>('');
  const [memberRole, setMemberRole] = useState<string>('');
  const [memberExperience, setMemberExperience] = useState<string>('5+ Years');
  const [memberSpecialty, setMemberSpecialty] = useState<string>('');
  const [memberSlotsRemaining, setMemberSlotsRemaining] = useState<number>(4);
  const [memberBio, setMemberBio] = useState<string>('');
  const [memberBadgesInput, setMemberBadgesInput] = useState<string>('RESIDENT ARTIST');
  const [memberInstagram, setMemberInstagram] = useState<string>('');
  const [memberActive, setMemberActive] = useState<boolean>(true);
  const [memberSortOrder, setMemberSortOrder] = useState<number>(0);
  const [memberAvatarFile, setMemberAvatarFile] = useState<File | null>(null);
  const [memberAvatarPreview, setMemberAvatarPreview] = useState<string>('');
  const [savingMember, setSavingMember] = useState<boolean>(false);

  // Orders State

  const [orders, setOrders] = useState<any[]>([]);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

  // Settings State
  const [settings, setSettings] = useState<SiteSettingData>(globalSettings || DEFAULT_SITE_SETTINGS);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');

  useEffect(() => {
    if (globalSettings && globalSettings.studioName) {
      setSettings(globalSettings);
    }
  }, [globalSettings]);

  // Portfolio State
  const [portfolioPieces, setPortfolioPieces] = useState<any[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState<boolean>(false);
  const [portfolioCategoryFilter, setPortfolioCategoryFilter] = useState<string>('ALL');
  const [portfolioSearch, setPortfolioSearch] = useState<string>('');
  const [showArtworkModal, setShowArtworkModal] = useState<boolean>(false);
  const [editingArtworkId, setEditingArtworkId] = useState<string | null>(null);
  const [pieceTitle, setPieceTitle] = useState('');
  const [pieceServiceId, setPieceServiceId] = useState<string>('realism-portraits');
  const [pieceCategory, setPieceCategory] = useState('dark-realism');
  const [pieceCategoryLabel, setPieceCategoryLabel] = useState('');
  const [pieceArtist, setPieceArtist] = useState<string>('Marvin');
  const [pieceHealingState, setPieceHealingState] = useState<string>('Healed Masterpiece');
  const [pieceCycle, setPieceCycle] = useState<'healed' | 'fresh'>('healed');
  const [pieceZone, setPieceZone] = useState('Forearm');
  const [pieceFlashId, setPieceFlashId] = useState('');
  const [pieceDescription, setPieceDescription] = useState('');
  const [pieceDuration, setPieceDuration] = useState('4 Hours (1 Session)');
  const [piecePigment, setPiecePigment] = useState('Dynamic Triple Black & Greywash');
  const [pieceFeatured, setPieceFeatured] = useState(false);
  const [pieceImageFile, setPieceImageFile] = useState<File | null>(null);
  const [pieceImagePreview, setPieceImagePreview] = useState<string>('');
  const [savingArtwork, setSavingArtwork] = useState(false);

  // Products / Inventory State
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState<string>('ALL');
  const [inventorySearch, setInventorySearch] = useState<string>('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Aftercare');
  const [prodPrice, setProdPrice] = useState<number>(95000);
  const [prodDesc, setProdDesc] = useState('');
  const [prodStock, setProdStock] = useState<number>(20);
  const [prodInStock, setProdInStock] = useState<boolean>(true);
  const [prodSpecs, setProdSpecs] = useState('Organic, 100ml');
  const [prodImageFile, setProdImageFile] = useState<File | null>(null);
  const [prodImagePreview, setProdImagePreview] = useState<string>('');
  const [savingProduct, setSavingProduct] = useState(false);

  // Category Manager State
  const [showCategoryManagerModal, setShowCategoryManagerModal] = useState<boolean>(false);
  const [newCategoryNameInput, setNewCategoryNameInput] = useState<string>('');
  const [editingCategoryName, setEditingCategoryName] = useState<string | null>(null);
  const [renamedCategoryValue, setRenamedCategoryValue] = useState<string>('');
  const [deletingCategoryName, setDeletingCategoryName] = useState<string | null>(null);
  const [deleteReassignCategory, setDeleteReassignCategory] = useState<string>('Aftercare');
  const [categoryActionLoading, setCategoryActionLoading] = useState<boolean>(false);

  // Testimonials / Reviews State
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewName, setReviewName] = useState('');
  const [reviewRole, setReviewRole] = useState('Dark Realism Sleeve');
  const [reviewStars, setReviewStars] = useState<number>(5);
  const [reviewQuote, setReviewQuote] = useState('');
  const [savingReview, setSavingReview] = useState(false);

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
        await loadDashboardData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadDashboardData = async () => {
    await Promise.allSettled([
      loadBookings(),
      loadOrders(),
      loadUsers(),
      loadServices(),
      loadTeamMembers(),
      loadSettings(),
      loadPortfolio(),
      loadProducts(),
      loadTestimonials(),
    ]);
  };

  // Re-fetch active tab data when tab or filters change
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'bookings') loadBookings();
      else if (activeTab === 'users') loadUsers();
      else if (activeTab === 'services') loadServices();
      else if (activeTab === 'team') loadTeamMembers();
      else if (activeTab === 'shop') {
        loadProducts();
        loadOrders();
      }
      else if (activeTab === 'portfolio') loadPortfolio();
      else if (activeTab === 'reviews') loadTestimonials();
      else if (activeTab === 'settings') loadSettings();
    }
  }, [activeTab, isAuthenticated]);


  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [bookingFilterStatus]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [orderFilterStatus]);


  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const data = await adminLogin(loginEmail, loginPassword);
      setIsAuthenticated(true);
      setAdminUser(data.user || { name: 'Master Marvin', email: loginEmail });
      await loadDashboardData();
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

  // 1.5. Users / Clients CRM Handlers
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await adminGetUsers(userSearch || undefined);
      setUsersList(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSyncLegacyClients = async () => {
    setSyncingLegacy(true);
    try {
      const res = await adminSyncLegacyUsers();
      showToast(res.message || 'Synced client database successfully');
      await Promise.allSettled([loadUsers(), loadBookings(), loadOrders()]);
    } catch (err: any) {
      showToast(`Sync failed: ${err.message || 'Error'}`);
    } finally {
      setSyncingLegacy(false);
    }
  };

  const openInspectUser = (u: ClientUserData) => {
    setInspectUser(u);
    setEditingUserNotes(u.notes || '');
  };

  const handleSaveUserDetails = async () => {
    if (!inspectUser) return;
    setSavingUser(true);
    try {
      const updated = await adminUpdateUser(inspectUser.id, {
        notes: editingUserNotes,
      });
      showToast(`Client "${updated.name}" notes saved`);
      setInspectUser({
        ...inspectUser,
        notes: editingUserNotes,
      });
      await loadUsers();
    } catch (err: any) {
      showToast(`Failed to update client: ${err.message || 'Error'}`);
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteClient = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove client record "${userName}"?`)) return;
    try {
      await adminDeleteUser(userId);
      showToast(`Client "${userName}" removed`);
      if (inspectUser?.id === userId) setInspectUser(null);
      await loadUsers();
    } catch (err: any) {
      showToast(`Failed to delete client: ${err.message || 'Error'}`);
    }
  };

  // 1.8. Services Catalog Handlers
  const loadServices = async () => {
    setLoadingServices(true);
    try {
      const data = await adminGetServices();
      setServicesList(data);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const openAddServiceModal = () => {
    setEditingServiceId(null);
    const nextNum = String(servicesList.length + 1).padStart(2, '0');
    setServiceDisciplineNumber(nextNum);
    setServiceTitle('');
    setServiceSubtitle('');
    setServiceDescription('');
    setServiceCategory('TATTOO');
    setServiceIconName('skull');
    setServiceSpecs([
      { label: 'Technique', value: 'High-Detail Black & Grey' },
      { label: 'Session Type', value: 'Half & Full Day Sessions' },
    ]);
    setServiceSortOrder(servicesList.length + 1);
    setServiceImageFile(null);
    setServiceImagePreview('');
    setShowServiceModal(true);
  };

  const openEditServiceModal = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setServiceDisciplineNumber(service.disciplineNumber || '01');
    setServiceTitle(service.title || '');
    setServiceSubtitle(service.subtitle || '');
    setServiceDescription(service.description || '');
    setServiceCategory(service.category || 'TATTOO');
    setServiceIconName(service.iconName || 'skull');
    setServiceSpecs(
      Array.isArray(service.specs) && service.specs.length > 0
        ? service.specs
        : [{ label: '', value: '' }]
    );
    setServiceSortOrder(service.sortOrder ?? 0);
    setServiceImageFile(null);
    setServiceImagePreview(service.imageUrl || service.image || '');
    setShowServiceModal(true);
  };

  const handleAddSpecRow = () => {
    setServiceSpecs([...serviceSpecs, { label: '', value: '' }]);
  };

  const handleRemoveSpecRow = (index: number) => {
    setServiceSpecs(serviceSpecs.filter((_, i) => i !== index));
  };

  const handleUpdateSpecRow = (index: number, field: 'label' | 'value', text: string) => {
    const next = [...serviceSpecs];
    next[index][field] = text;
    setServiceSpecs(next);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle.trim() || !serviceDisciplineNumber.trim() || !serviceDescription.trim()) {
      alert('Please provide discipline number, title, and description.');
      return;
    }
    setSavingService(true);
    try {
      const validSpecs = serviceSpecs.filter((s) => s.label.trim() && s.value.trim());
      const formData = new FormData();
      formData.append('disciplineNumber', serviceDisciplineNumber);
      formData.append('title', serviceTitle);
      formData.append('subtitle', serviceSubtitle);
      formData.append('description', serviceDescription);
      formData.append('category', serviceCategory);
      formData.append('iconName', serviceIconName);
      formData.append('specs', JSON.stringify(validSpecs));
      formData.append('sortOrder', String(serviceSortOrder));
      if (serviceImageFile) {
        formData.append('image', serviceImageFile);
      } else if (serviceImagePreview && !serviceImagePreview.startsWith('data:')) {
        formData.append('imageUrl', serviceImagePreview);
      }

      if (editingServiceId) {
        await adminUpdateService(editingServiceId, formData);
        showToast(`Service "${serviceTitle}" updated successfully`);
      } else {
        await adminCreateService(formData);
        showToast(`New service discipline "${serviceTitle}" created`);
      }

      await loadServices();
      setShowServiceModal(false);
      setEditingServiceId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to save service discipline');
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete service discipline "${title}"?`)) return;
    try {
      await adminDeleteService(id);
      await loadServices();
      showToast(`Service "${title}" deleted`);
    } catch (err: any) {
      alert(err.message || 'Failed to delete service');
    }
  };

  // 1.9. Team & Artists Handlers
  const loadTeamMembers = async () => {
    setLoadingTeam(true);
    try {
      const data = await adminGetMembers(teamSearch || undefined);
      setTeamMembers(data);
    } catch (err: any) {
      console.error('Failed to load team members:', err);
    } finally {
      setLoadingTeam(false);
    }
  };

  const openAddMemberModal = () => {
    setEditingMemberId(null);
    setMemberName('');
    setMemberSlug('');
    setMemberTitle('Resident Tattoo Artist');
    setMemberRole('Master Tattoo Artist & Custom Ink Specialist');
    setMemberExperience('5+ Years');
    setMemberSpecialty('Custom Fine-Line & Realism');
    setMemberSlotsRemaining(4);
    setMemberBio('');
    setMemberBadgesInput('RESIDENT ARTIST, STERILE CERTIFIED');
    setMemberInstagram('https://instagram.com/marvin_tattoos');
    setMemberActive(true);
    setMemberSortOrder(teamMembers.length + 1);
    setMemberAvatarFile(null);
    setMemberAvatarPreview('');
    setShowMemberModal(true);
  };

  const openEditMemberModal = (member: ArtistProfile) => {
    setEditingMemberId(member.id);
    setMemberName(member.name || '');
    setMemberSlug(member.slug || '');
    setMemberTitle(member.title || '');
    setMemberRole(member.role || '');
    setMemberExperience(member.experience || '');
    setMemberSpecialty(member.specialty || '');
    setMemberSlotsRemaining(member.slotsRemaining ?? 4);
    setMemberBio(member.bio || '');
    setMemberBadgesInput(Array.isArray(member.badges) ? member.badges.join(', ') : '');
    setMemberInstagram(member.instagram || '');
    setMemberActive(member.active !== false);
    setMemberSortOrder(member.sortOrder ?? 0);
    setMemberAvatarFile(null);
    setMemberAvatarPreview(member.avatar || '');
    setShowMemberModal(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberTitle.trim() || !memberBio.trim()) {
      alert('Please provide Name, Title, and Bio/Description.');
      return;
    }
    setSavingMember(true);
    try {
      const badgeList = memberBadgesInput
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append('name', memberName.trim());
      if (memberSlug.trim()) formData.append('slug', memberSlug.trim());
      formData.append('title', memberTitle.trim());
      formData.append('role', memberRole.trim() || memberTitle.trim());
      formData.append('experience', memberExperience.trim());
      formData.append('specialty', memberSpecialty.trim());
      formData.append('slotsRemaining', String(memberSlotsRemaining));
      formData.append('bio', memberBio.trim());
      formData.append('badges', JSON.stringify(badgeList));
      if (memberInstagram.trim()) formData.append('instagram', memberInstagram.trim());
      formData.append('active', String(memberActive));
      formData.append('sortOrder', String(memberSortOrder));

      if (memberAvatarFile) {
        formData.append('avatar', memberAvatarFile);
      } else if (memberAvatarPreview && !memberAvatarPreview.startsWith('data:')) {
        formData.append('avatar', memberAvatarPreview);
      }

      if (editingMemberId) {
        await adminUpdateMember(editingMemberId, formData);
        showToast(`Team member "${memberName}" updated successfully`);
      } else {
        await adminCreateMember(formData);
        showToast(`Team member "${memberName}" added successfully`);
      }

      await loadTeamMembers();
      setShowMemberModal(false);
      setEditingMemberId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to save team member');
    } finally {
      setSavingMember(false);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove team member "${name}"?`)) return;
    try {
      await adminDeleteMember(id);
      await loadTeamMembers();
      showToast(`Team member "${name}" removed`);
    } catch (err: any) {
      alert(err.message || 'Failed to delete team member');
    }
  };

  const handleToggleMemberActive = async (member: ArtistProfile) => {
    try {
      const formData = new FormData();
      formData.append('active', String(!member.active));
      await adminUpdateMember(member.id, formData);
      await loadTeamMembers();
      showToast(`Status updated for "${member.name}"`);
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
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
      await refreshSettings();
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
        studioName: settings.studioName?.trim() || 'Marvin Tattoo Studio',
        heroBannerUrl: currentHeroUrl,
      };

      const updated = await saveGlobalSettings(payload);
      setSettings(updated);
      setHeroImageFile(null);
      showToast('Studio settings saved & published everywhere');
    } catch (err: any) {
      alert(err.message || 'Failed to update site settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currPassword) {
      setPasswordStatus({ type: 'error', message: 'Current password is required.' });
      return;
    }
    if (!newPasswordVal || newPasswordVal.length < 6) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPasswordVal !== confirmPasswordVal) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await adminChangePassword(currPassword, newPasswordVal);
      setPasswordStatus({ type: 'success', message: res.message || 'Password updated successfully!' });
      setCurrPassword('');
      setNewPasswordVal('');
      setConfirmPasswordVal('');
      showToast('Master password updated successfully');
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: err.message || 'Failed to update password' });
    } finally {
      setPasswordLoading(false);
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

  const openAddArtworkModal = () => {
    setEditingArtworkId(null);
    setPieceTitle('');
    const firstService = servicesList.length > 0 ? servicesList[0] : null;
    setPieceServiceId(firstService ? firstService.id : 'realism-portraits');
    setPieceCategory('dark-realism');
    setPieceCategoryLabel(firstService ? firstService.title : 'Memorial Realism');
    setPieceArtist('Marvin');
    setPieceHealingState('Healed Masterpiece');
    setPieceCycle('healed');
    setPieceZone('Forearm');
    setPieceFlashId('');
    setPieceDescription('');
    setPieceDuration('4 Hours (1 Session)');
    setPiecePigment('Dynamic Triple Black & Greywash');
    setPieceFeatured(false);
    setPieceImageFile(null);
    setPieceImagePreview('');
    setShowArtworkModal(true);
  };

  const openEditArtworkModal = (piece: any) => {
    setEditingArtworkId(piece.id);
    setPieceTitle(piece.title || '');
    setPieceServiceId(piece.serviceId || piece.service?.id || (servicesList.length > 0 ? servicesList[0].id : 'realism-portraits'));
    setPieceCategory(piece.category || 'dark-realism');
    setPieceCategoryLabel(piece.categoryLabel || piece.category || '');
    setPieceArtist(piece.artist || 'Marvin');
    setPieceHealingState(piece.healingState || 'Healed Masterpiece');
    setPieceCycle(piece.cycle || 'healed');
    setPieceZone(piece.zone || 'Forearm');
    setPieceFlashId(piece.flashId || '');
    setPieceDescription(piece.description || '');
    setPieceDuration(piece.duration || '4 Hours (1 Session)');
    setPiecePigment(piece.pigment || 'Dynamic Triple Black');
    setPieceFeatured(Boolean(piece.featured));
    setPieceImageFile(null);
    setPieceImagePreview(piece.image || piece.imageUrl || '');
    setShowArtworkModal(true);
  };

  const handleSavePortfolioPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtworkId && !pieceImageFile && !pieceImagePreview) {
      alert('Please select an artwork photo to upload or enter an image URL.');
      return;
    }
    setSavingArtwork(true);
    try {
      const formData = new FormData();
      formData.append('title', pieceTitle);
      formData.append('serviceId', pieceServiceId);
      formData.append('category', pieceCategory);
      formData.append('categoryLabel', pieceCategoryLabel || pieceCategory);
      formData.append('artist', pieceArtist);
      formData.append('healingState', pieceHealingState);
      formData.append('cycle', pieceCycle);
      formData.append('zone', pieceZone);
      formData.append('flashId', pieceFlashId);
      formData.append('description', pieceDescription);
      formData.append('duration', pieceDuration);
      formData.append('pigment', piecePigment);
      formData.append('featured', String(pieceFeatured));
      if (pieceImageFile) {
        formData.append('image', pieceImageFile);
      } else if (pieceImagePreview && pieceImagePreview.startsWith('http')) {
        formData.append('imageUrl', pieceImagePreview);
      }

      if (editingArtworkId) {
        await adminUpdatePortfolioPiece(editingArtworkId, formData);
        showToast('Artwork piece updated successfully');
      } else {
        await adminCreatePortfolioPiece(formData);
        showToast('Artwork published to gallery');
      }

      await loadPortfolio();
      setShowArtworkModal(false);
      setEditingArtworkId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to save artwork');
    } finally {
      setSavingArtwork(false);
    }
  };

  const handleDeletePortfolioPiece = async (id: string) => {
    if (!confirm('Are you sure you want to remove this piece from the portfolio?')) return;
    try {
      await adminDeletePortfolioPiece(id);
      await loadPortfolio();
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

  const openAddProductModal = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('Aftercare');
    setProdPrice(95000);
    setProdDesc('');
    setProdStock(20);
    setProdInStock(true);
    setProdSpecs('Organic, 100ml');
    setProdImageFile(null);
    setProdImagePreview('');
    setShowProductModal(true);
  };

  const openEditProductModal = (product: any) => {
    setEditingProductId(product.id);
    setProdName(product.name || '');
    setProdCategory(product.category || 'Aftercare');
    setProdPrice(Number(product.price) || 0);
    setProdDesc(product.description || '');
    setProdStock(product.stockCount !== undefined ? Number(product.stockCount) : 10);
    setProdInStock(product.inStock !== false);
    const specsStr = Array.isArray(product.specs)
      ? product.specs.join(', ')
      : typeof product.specs === 'string'
      ? product.specs
      : '';
    setProdSpecs(specsStr);
    setProdImageFile(null);
    setProdImagePreview(product.image || product.imageUrl || '');
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const formData = new FormData();
      formData.append('name', prodName);
      formData.append('category', prodCategory);
      formData.append('price', String(prodPrice));
      formData.append('currency', 'UGX');
      formData.append('description', prodDesc);
      formData.append('stockCount', String(prodStock));
      formData.append('inStock', String(prodInStock));
      formData.append('specs', prodSpecs);
      if (prodImageFile) {
        formData.append('image', prodImageFile);
      }

      if (editingProductId) {
        await adminUpdateProduct(editingProductId, formData);
        showToast('Product updated in inventory');
      } else {
        await adminCreateProduct(formData);
        showToast('New product added to inventory');
      }

      await loadProducts();
      setShowProductModal(false);
      setEditingProductId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from the inventory?')) return;
    try {
      await adminDeleteProduct(id);
      await loadProducts();
      showToast('Product removed');
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // Category CRUD Handlers
  const handleAddNewCategoryPreset = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryNameInput.trim();
    if (!trimmed) return;

    // Set as the current category in the Product form and toast
    setProdCategory(trimmed);
    showToast(`Category "${trimmed}" ready to be assigned.`);
    setNewCategoryNameInput('');
  };

  const handleRenameCategory = async (oldCategory: string) => {
    const trimmedNew = renamedCategoryValue.trim();
    if (!trimmedNew || trimmedNew === oldCategory) {
      setEditingCategoryName(null);
      return;
    }
    setCategoryActionLoading(true);
    try {
      const res = await adminRenameProductCategory(oldCategory, trimmedNew);
      await loadProducts();
      showToast(res.message || `Renamed "${oldCategory}" to "${trimmedNew}"`);
      if (inventoryCategoryFilter === oldCategory) {
        setInventoryCategoryFilter(trimmedNew);
      }
      setEditingCategoryName(null);
      setRenamedCategoryValue('');
    } catch (err: any) {
      alert(err.message || 'Failed to rename category');
    } finally {
      setCategoryActionLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryToDelete: string) => {
    setCategoryActionLoading(true);
    try {
      const res = await adminDeleteProductCategory(categoryToDelete, deleteReassignCategory);
      await loadProducts();
      showToast(res.message || `Deleted category "${categoryToDelete}"`);
      if (inventoryCategoryFilter === categoryToDelete) {
        setInventoryCategoryFilter('ALL');
      }
      setDeletingCategoryName(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    } finally {
      setCategoryActionLoading(false);
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

  const openAddReviewModal = () => {
    setEditingReviewId(null);
    setReviewName('');
    setReviewRole('Dark Realism Sleeve');
    setReviewStars(5);
    setReviewQuote('');
    setShowReviewModal(true);
  };

  const openEditReviewModal = (t: any) => {
    setEditingReviewId(t.id);
    setReviewName(t.name || '');
    setReviewRole(t.role || 'Verified Client');
    setReviewStars(typeof t.stars === 'number' ? t.stars : 5);
    setReviewQuote(t.quote || '');
    setShowReviewModal(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewQuote.trim()) {
      alert('Client Name and Review Quote are required.');
      return;
    }
    setSavingReview(true);
    try {
      if (editingReviewId) {
        await adminUpdateTestimonial(editingReviewId, {
          name: reviewName.trim(),
          role: reviewRole.trim(),
          stars: reviewStars,
          quote: reviewQuote.trim(),
        });
        showToast('Client review updated successfully');
      } else {
        await adminCreateTestimonial({
          name: reviewName.trim(),
          role: reviewRole.trim(),
          stars: reviewStars,
          quote: reviewQuote.trim(),
        });
        showToast('Client review published successfully');
      }
      await loadTestimonials();
      setShowReviewModal(false);
      setEditingReviewId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to save review');
    } finally {
      setSavingReview(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to remove this client review?')) return;
    try {
      await adminDeleteTestimonial(id);
      await loadTestimonials();
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

  // Dynamic Categories and Filtered Lists
  const portfolioCategories = useMemo(() => {
    const cats = new Set<string>();
    portfolioPieces.forEach((p) => {
      if (p.serviceId) cats.add(p.serviceId);
      else if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [portfolioPieces]);

  const filteredPortfolioPieces = useMemo(() => {
    return portfolioPieces.filter((p) => {
      const pServ = (p.serviceId || '').toLowerCase();
      const pCat = (p.category || '').toLowerCase();
      const pLabel = (p.categoryLabel || '').toLowerCase();
      const filter = portfolioCategoryFilter.toLowerCase();

      const matchesCategory =
        portfolioCategoryFilter === 'ALL' ||
        pServ === filter ||
        pCat === filter ||
        pLabel.includes(filter);

      const q = portfolioSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        pServ.includes(q) ||
        pCat.includes(q) ||
        pLabel.includes(q) ||
        p.zone?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.flashId?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [portfolioPieces, portfolioCategoryFilter, portfolioSearch]);

  const inventoryCategories = useMemo(() => {
    const cats = new Set<string>();
    productsList.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [productsList]);

  const filteredProductsList = useMemo(() => {
    return productsList.filter((p) => {
      const matchesCategory =
        inventoryCategoryFilter === 'ALL' ||
        p.category?.toLowerCase() === inventoryCategoryFilter.toLowerCase();
      const q = inventorySearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [productsList, inventoryCategoryFilter, inventorySearch]);

  const filteredServicesList = useMemo(() => {
    return servicesList.filter((s) => {
      const matchesCategory =
        serviceCategoryFilter === 'ALL' ||
        s.category?.toUpperCase() === serviceCategoryFilter.toUpperCase();
      const q = serviceSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.title?.toLowerCase().includes(q) ||
        s.subtitle?.toLowerCase().includes(q) ||
        s.disciplineNumber?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [servicesList, serviceCategoryFilter, serviceSearch]);


  // ================= MODERN REFINED LOGIN SCREEN ================= //
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="w-full min-h-screen bg-[#0d0f15] flex items-center justify-center px-4 font-sans text-zinc-100 selection:bg-red-600 selection:text-white">
        <div className="w-full max-w-sm p-8 bg-[#181a24] border border-zinc-700/80 rounded-2xl shadow-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-700/70">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center font-bold text-red-400 text-sm">
              M
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-white">
                Marvin Atelier Admin
              </h2>
              <p className="text-xs text-zinc-400">
                Studio Management · Kampala, Uganda
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3.5 bg-red-950/40 border border-red-800/80 rounded-xl text-red-300 text-xs font-sans flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                Admin Email
              </label>
              <input
                required
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#12141c] border border-zinc-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-zinc-500"
                placeholder="admin@yourdomain.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                Master Password
              </label>
              <input
                required
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#12141c] border border-zinc-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-zinc-500"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-all shadow-lg shadow-red-950/40 flex items-center justify-center gap-2"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 flex items-center justify-between text-xs text-zinc-400">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-zinc-200 transition-colors flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Atelier</span>
            </button>
            <span className="text-zinc-400 flex items-center gap-1.5">
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
    <div className="min-h-screen bg-[#0d0f15] text-zinc-100 font-sans flex flex-col md:flex-row selection:bg-red-600 selection:text-white antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 bg-[#1e2230] border border-red-500/40 text-white rounded-xl shadow-2xl flex items-center gap-3 text-xs font-medium animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR RAIL */}
      <aside className="w-full md:w-64 bg-[#151720] border-r border-zinc-800/80 flex flex-col shrink-0">
        {/* Workspace Brand Header */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/15 border border-red-600/40 flex items-center justify-center font-bold text-red-400 text-xs">
              {(settings.studioName || 'M').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
                <span>{settings.studioName || 'Marvin Tattoo Studio'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] text-zinc-400 block truncate max-w-[130px]">
                {settings.physicalAddress || 'New Pioneer Mall, Shop Pi55, L5 · Kampala'}
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-[#222634] transition-colors"
            title="Open Live Website"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-6 overflow-y-auto text-xs font-sans">
          {/* Section: Operational */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Studio Management
            </div>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'bookings'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 font-semibold shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1f222d]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>Bookings</span>
              </div>
              {pendingBookingsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold font-mono">
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'users'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 font-semibold shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1f222d]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-zinc-400" />
                <span>Clients CRM</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">{usersList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'services'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 font-semibold shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1f222d]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-zinc-400" />
                <span>Services</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">{servicesList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'team'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 font-semibold shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1f222d]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Crown className="w-4 h-4 text-rose-400" />
                <span>Team &amp; Artists</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">{teamMembers.length}</span>
            </button>
          </div>

          {/* Section: Commerce / Shop */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Atelier Commerce</span>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[9px] rounded-md font-bold font-mono">
                  {pendingOrdersCount} new
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setActiveTab('shop');
                setShopSubTab('products');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'shop' && shopSubTab === 'products'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 font-semibold shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1f222d]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-zinc-400" />
                <span>Products Inventory</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">{productsList.length}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('shop');
                setShopSubTab('categories');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'shop' && shopSubTab === 'categories'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 font-semibold shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1f222d]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-zinc-400" />
                <span>Shop Categories</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">{inventoryCategories.length}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('shop');
                setShopSubTab('orders');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'shop' && shopSubTab === 'orders'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 font-semibold shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1f222d]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-zinc-400" />
                <span>Orders</span>
              </div>
              {pendingOrdersCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold font-mono">
                  {pendingOrdersCount}
                </span>
              ) : (
                <span className="text-[11px] font-mono text-zinc-400">{orders.length}</span>
              )}
            </button>
          </div>

          {/* Section: Content & Media */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Content &amp; Media
            </div>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 font-semibold shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1f222d]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                <span>Portfolio Artworks</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">{portfolioPieces.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'reviews'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 font-semibold shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1f222d]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-zinc-400" />
                <span>Client Reviews</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">{testimonialsList.length}</span>
            </button>
          </div>

          {/* Section: Configuration */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Studio Configuration
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'settings'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 font-semibold shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1f222d]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-zinc-400" />
                <span>Site Settings</span>
              </div>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-zinc-800/80 bg-[#12141c] flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-zinc-700/70 border border-zinc-600/50 flex items-center justify-center text-xs font-bold text-white">
              M
            </div>
            <div className="truncate">
              <span className="text-white text-xs block truncate font-semibold">Marvin Studio</span>
              <span className="text-[11px] text-zinc-400 block truncate">admin@marvintattoos.com</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0d0f15]">
        {/* Top Minimal Header */}
        <header className="h-16 px-6 border-b border-zinc-800/80 bg-[#151720]/90 backdrop-blur-md flex items-center justify-between shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-sans text-zinc-400">
            <span>Marvin Atelier</span>
            <span className="text-zinc-600">/</span>
            <span className="text-white font-semibold capitalize">
              {activeTab === 'users' ? 'Clients CRM' : activeTab === 'team' ? 'Team & Artists' : activeTab}
            </span>

            {activeTab === 'shop' && (
              <>
                <span className="text-zinc-600">/</span>
                <span className="text-red-400 font-semibold capitalize">{shopSubTab}</span>
              </>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-sans">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Total Clients:</span>
              <span className="text-white font-bold font-mono">{usersList.length}</span>
            </div>
            <div className="w-px h-3.5 bg-zinc-800" />
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">New Bookings:</span>
              <span className="text-red-400 font-bold font-mono">{pendingBookingsCount}</span>
            </div>
            <div className="w-px h-3.5 bg-zinc-800" />
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Active Orders:</span>
              <span className="text-sky-400 font-bold font-mono">{pendingOrdersCount}</span>
            </div>
            <div className="w-px h-3.5 bg-zinc-800" />
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Total Sales:</span>
              <span className="text-emerald-400 font-bold font-mono">UGX {totalRevenue.toLocaleString()}</span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={loadDashboardData}
              className="p-2 bg-[#1e2230] hover:bg-[#282d3e] border border-zinc-700/80 rounded-xl text-zinc-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {activeTab === 'users' && (
              <button
                onClick={handleSyncLegacyClients}
                disabled={syncingLegacy}
                className="px-3.5 py-2 bg-[#1e2230] hover:bg-[#282d3e] border border-zinc-700/80 text-zinc-200 hover:text-white rounded-xl text-xs font-sans font-medium transition-colors flex items-center gap-2"
                title="Scan all historical bookings and orders to create and link client profiles"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${syncingLegacy ? 'animate-spin' : ''}`} />
                <span>{syncingLegacy ? 'Syncing...' : 'Sync Legacy Clients'}</span>
              </button>
            )}

            {activeTab === 'services' && (
              <button
                onClick={openAddServiceModal}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 shadow-md shadow-red-950/40"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            )}

            {activeTab === 'team' && (
              <button
                onClick={openAddMemberModal}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 shadow-md shadow-red-950/40"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            )}

            {activeTab === 'portfolio' && (
              <button
                onClick={openAddArtworkModal}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 shadow-md shadow-red-950/40"
              >
                <Plus className="w-4 h-4" />
                <span>Add Artwork</span>
              </button>
            )}

            {activeTab === 'shop' && (
              <>
                {shopSubTab === 'products' && (
                  <button
                    onClick={() => setShopSubTab('categories')}
                    className="px-3.5 py-2 bg-[#1e2230] hover:bg-[#282d3e] border border-zinc-700/80 text-zinc-200 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    <Tag className="w-4 h-4 text-sky-400" />
                    <span>Categories</span>
                  </button>
                )}
                <button
                  onClick={openAddProductModal}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </>
            )}
            {activeTab === 'reviews' && (
              <button
                onClick={openAddReviewModal}
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
            <div className="space-y-5">
              {/* Filter & Search Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                {/* Status Pills */}
                <div className="flex flex-wrap items-center gap-1.5 bg-[#161822] p-1.5 rounded-xl border border-zinc-800 text-xs font-sans">
                  {['ALL', 'PENDING_REVIEW', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setBookingFilterStatus(st);
                        setTimeout(loadBookings, 50);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg transition-colors text-xs font-medium ${
                        bookingFilterStatus === st
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-[#202434]'
                      }`}
                    >
                      {st === 'ALL' ? 'All Bookings' : st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-2 w-full sm:w-auto font-sans">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadBookings()}
                      placeholder="Search client, phone, ref..."
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#161822] border border-zinc-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-red-500 placeholder:text-zinc-500 transition-all"
                    />
                  </div>
                  <button
                    onClick={loadBookings}
                    className="px-4 py-2.5 bg-[#202434] hover:bg-[#282e42] border border-zinc-700 text-xs text-zinc-100 rounded-xl transition-colors font-medium"
                  >
                    Filter
                  </button>
                </div>
              </div>

              {/* High Density Table */}
              <div className="bg-[#181a24] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-[#12141c] text-zinc-400 text-xs uppercase tracking-wider font-medium">
                      <th className="p-3.5 pl-5">Booking Ref</th>
                      <th className="p-3.5">Client</th>
                      <th className="p-3.5">Service &amp; Placement</th>
                      <th className="p-3.5">Date &amp; Time</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right pr-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70">
                    {loadingBookings ? (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-zinc-400">
                          Loading bookings...
                        </td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-zinc-400">
                          No bookings found.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((b) => (
                        <tr
                          key={b.id}
                          onClick={() => setInspectBooking(b)}
                          className="hover:bg-[#202434] cursor-pointer transition-colors group"
                        >
                          <td className="p-3.5 pl-5">
                            <span className="font-semibold text-red-400 bg-red-950/40 px-2.5 py-1 rounded-md border border-red-800/40 text-xs font-mono">
                              {b.referenceCode}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-white group-hover:text-red-300 transition-colors text-sm">
                              {b.clientName}
                            </div>
                            <div className="text-xs text-zinc-400 font-mono mt-0.5">{b.clientPhone}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="text-zinc-200 capitalize block font-medium">
                              {b.serviceType.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-zinc-400">
                              {b.placement} ({b.size})
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="text-zinc-200 font-medium">
                              {new Date(b.preferredDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-zinc-400 capitalize">{b.timeSlot}</div>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                b.status === 'CONFIRMED'
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/70'
                                  : b.status === 'COMPLETED'
                                  ? 'bg-blue-950/60 text-blue-300 border border-blue-800/70'
                                  : b.status === 'CANCELLED'
                                  ? 'bg-red-950/60 text-red-300 border border-red-800/70'
                                  : 'bg-sky-950/60 text-sky-300 border border-sky-800/70'
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
                                    : 'bg-sky-400'
                                }`}
                              />
                              <span>{b.status.replace('_', ' ')}</span>
                            </span>
                          </td>
                          <td className="p-3.5 text-right pr-5" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  openWhatsApp(
                                    b.clientPhone,
                                    `Hello ${b.clientName}! This is Marvin from Marvin Tattoo Studio regarding your booking request [${b.referenceCode}]. We are pleased to confirm your session at New Pioneer Mall, Shop No. Pi55, Level 5, Burton Street, Kampala.`
                                  )
                                }
                                className="px-3 py-1.5 bg-emerald-950/50 hover:bg-emerald-900/80 border border-emerald-800/70 text-emerald-300 rounded-lg text-xs transition-colors flex items-center gap-1.5 font-medium"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </button>
                              <button
                                onClick={() => setInspectBooking(b)}
                                className="px-3 py-1.5 bg-[#222636] hover:bg-[#2b3046] border border-zinc-700 text-zinc-200 rounded-lg text-xs transition-colors flex items-center gap-1 font-medium"
                              >
                                <span>Details</span>
                                <ArrowRight className="w-3.5 h-3.5" />
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

          {/* ================= 1.5. CLIENTS / USERS CRM ================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Top CRM Analytics Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-1 shadow-lg">
                  <div className="text-zinc-400 text-xs flex items-center gap-2 font-medium">
                    <Users className="w-4 h-4 text-red-400" />
                    <span>Total Registered Clients</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{usersList.length}</div>
                </div>

                <div className="p-5 bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-1 shadow-lg">
                  <div className="text-zinc-400 text-xs flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>Total Bookings Placed</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    {usersList.reduce((sum, u) => sum + (u.totalBookings || 0), 0)}
                  </div>
                </div>

                <div className="p-5 bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-1 shadow-lg">
                  <div className="text-zinc-400 text-xs flex items-center gap-2 font-medium">
                    <ShoppingBag className="w-4 h-4 text-sky-400" />
                    <span>Total Shop Orders</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    {usersList.reduce((sum, u) => sum + (u.totalOrders || 0), 0)}
                  </div>
                </div>
              </div>

              {/* Filter & Search Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 rounded-xl border bg-[#161822] text-zinc-200 border-zinc-800 font-semibold text-xs">
                    All Registered Clients ({usersList.length})
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                      placeholder="Search name, phone, email..."
                      className="w-full pl-10 pr-8 py-2.5 bg-[#161822] border border-zinc-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-red-500 placeholder:text-zinc-500 transition-all"
                    />
                    {userSearch && (
                      <button
                        onClick={() => {
                          setUserSearch('');
                          setTimeout(loadUsers, 50);
                        }}
                        className="absolute right-3 top-3 text-zinc-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={loadUsers}
                    className="px-4 py-2.5 bg-[#202434] hover:bg-[#282e42] border border-zinc-700 rounded-xl text-xs text-zinc-100 transition-colors font-medium"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Users CRM Table */}
              <div className="bg-[#181a24] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-[#12141c] text-zinc-400 text-xs uppercase tracking-wider font-medium">
                      <th className="p-3.5 pl-5">Client Name</th>
                      <th className="p-3.5">Phone (WhatsApp)</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5 text-center">Bookings</th>
                      <th className="p-3.5 text-center">Shop Orders</th>
                      <th className="p-3.5">Last Active</th>
                      <th className="p-3.5 text-right pr-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-zinc-400">
                          Loading clients database...
                        </td>
                      </tr>
                    ) : usersList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-zinc-400">
                          No client records match your search.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((u) => (
                        <tr
                          key={u.id}
                          onClick={() => openInspectUser(u)}
                          className="hover:bg-[#202434] cursor-pointer transition-colors group"
                        >
                          <td className="p-3.5 pl-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center font-bold text-red-300 text-xs shrink-0">
                                {u.name ? u.name.charAt(0).toUpperCase() : 'C'}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-white group-hover:text-red-300 transition-colors flex items-center gap-1.5 truncate text-sm">
                                  <span>{u.name}</span>
                                </div>
                                {u.notes && (
                                  <div className="text-xs text-zinc-400 truncate max-w-xs mt-0.5">
                                    {u.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="text-zinc-200 font-mono font-medium">{u.phone}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-zinc-400 text-xs truncate max-w-xs block">
                              {u.email || '—'}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-xs font-semibold font-mono ${
                                u.totalBookings > 0
                                  ? 'bg-blue-950/60 text-blue-300 border border-blue-800/70'
                                  : 'text-zinc-500'
                              }`}
                            >
                              {u.totalBookings}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-xs font-semibold font-mono ${
                                u.totalOrders > 0
                                  ? 'bg-sky-950/60 text-sky-300 border border-sky-800/70'
                                  : 'text-zinc-500'
                              }`}
                            >
                              {u.totalOrders}
                            </span>
                          </td>
                          <td className="p-3.5 text-zinc-400 text-xs font-mono">
                            {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3.5 text-right pr-5" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  openWhatsApp(
                                    u.phone,
                                    `Hello ${u.name}! This is Marvin Tattoos Atelier. We are checking in with you regarding your studio experience.`
                                  )
                                }
                                className="p-2 bg-emerald-950/50 hover:bg-emerald-900/80 border border-emerald-800/70 text-emerald-300 rounded-lg transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openInspectUser(u)}
                                className="px-3 py-1.5 bg-[#222636] hover:bg-[#2b3046] border border-zinc-700 text-zinc-200 rounded-lg text-xs transition-colors flex items-center gap-1 font-medium"
                              >
                                <span>Dossier</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClient(u.id, u.name)}
                                className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                                title="Delete Client"
                              >
                                <Trash2 className="w-4 h-4" />
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

          {/* ================= 1.9. SERVICES & DISCIPLINES CMS ================= */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              {/* Studio Services Metrics Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-1 shadow-lg">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                    <span>Total Services</span>
                    <PenTool className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {servicesList.length}
                  </div>
                  <p className="text-xs text-zinc-400">Live studio disciplines</p>
                </div>

                <div className="p-5 bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-1 shadow-lg">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                    <span>Tattoo Disciplines</span>
                    <Icons8 name="skull" size={16} className="text-red-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-red-400">
                    {servicesList.filter((s) => s.category?.toUpperCase() === 'TATTOO').length}
                  </div>
                  <p className="text-xs text-zinc-400">Custom ink &amp; realism</p>
                </div>

                <div className="p-5 bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-1 shadow-lg">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                    <span>PMU &amp; Piercing</span>
                    <Sparkles className="w-4 h-4 text-fuchsia-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-fuchsia-400">
                    {servicesList.filter((s) => ['PMU', 'PIERCING'].includes(s.category?.toUpperCase() || '')).length}
                  </div>
                  <p className="text-xs text-zinc-400">Cosmetic &amp; body mods</p>
                </div>

                <div className="p-5 bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-1 shadow-lg">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                    <span>Removal &amp; Clinical</span>
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">
                    {servicesList.filter((s) => s.category?.toUpperCase() === 'REMOVAL').length}
                  </div>
                  <p className="text-xs text-zinc-400">Laser &amp; skin recovery</p>
                </div>
              </div>

              {/* Filter & Search Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search disciplines, techniques, numbers..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 bg-[#161822] border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-red-500 transition-all"
                  />
                  {serviceSearch && (
                    <button
                      onClick={() => setServiceSearch('')}
                      className="absolute right-3 top-3 text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-xs text-zinc-400 font-medium">
                    Showing <span className="text-white font-bold font-mono">{filteredServicesList.length}</span> of {servicesList.length}
                  </div>
                  <button
                    onClick={openAddServiceModal}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 shadow-md shadow-red-950/40"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Service</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                <button
                  onClick={() => setServiceCategoryFilter('ALL')}
                  className={`px-4 py-2 rounded-xl border transition-all whitespace-nowrap font-medium ${
                    serviceCategoryFilter === 'ALL'
                      ? 'bg-red-600 text-white border-red-500 font-bold shadow-md shadow-red-950/30'
                      : 'bg-[#161822] text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  All Categories ({servicesList.length})
                </button>
                {(['TATTOO', 'PMU', 'PIERCING', 'REMOVAL'] as const).map((cat) => {
                  const count = servicesList.filter((s) => s.category?.toUpperCase() === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setServiceCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-xl border transition-all whitespace-nowrap uppercase font-medium ${
                        serviceCategoryFilter === cat
                          ? 'bg-red-600 text-white border-red-500 font-bold shadow-md shadow-red-950/30'
                          : 'bg-[#161822] text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Services Grid */}
              {loadingServices ? (
                <div className="p-12 text-center bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-3">
                  <RefreshCw className="w-6 h-6 text-red-500 animate-spin mx-auto" />
                  <p className="text-zinc-400 text-xs">Loading studio service disciplines...</p>
                </div>
              ) : filteredServicesList.length === 0 ? (
                <div className="p-12 text-center bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-3">
                  <PenTool className="w-8 h-8 text-zinc-500 mx-auto" />
                  <p className="text-zinc-300 text-sm font-medium">No service disciplines match your search or filter.</p>
                  <button
                    onClick={() => {
                      setServiceCategoryFilter('ALL');
                      setServiceSearch('');
                    }}
                    className="text-red-400 hover:underline text-xs font-semibold"
                  >
                    Clear active filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredServicesList.map((service) => {
                    const categoryColors: Record<string, string> = {
                      TATTOO: 'bg-red-950/80 text-red-300 border-red-800/80',
                      PMU: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-800/80',
                      PIERCING: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
                      REMOVAL: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80',
                    };
                    const badgeClass =
                      categoryColors[service.category?.toUpperCase() || ''] ||
                      'bg-zinc-800 text-zinc-300 border-zinc-700';

                    return (
                      <div
                        key={service.id}
                        className="group bg-[#181a24] border border-zinc-800/80 rounded-2xl overflow-hidden flex flex-col hover:border-zinc-600 transition-all duration-300 shadow-lg hover:shadow-2xl"
                      >
                        {/* Artwork Banner */}
                        <div className="relative aspect-[16/10] bg-[#12141c] overflow-hidden">
                          <img
                            src={service.imageUrl || service.image || '/images/hero.webp'}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#181a24] via-transparent to-black/60" />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 bg-black/85 border border-zinc-700/80 backdrop-blur-md rounded-lg text-xs font-mono font-bold text-red-400 tracking-wider">
                              #{service.disciplineNumber}
                            </span>
                          </div>

                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider uppercase border backdrop-blur-md ${badgeClass}`}
                            >
                              {service.category || 'TATTOO'}
                            </span>
                          </div>

                          {/* Icon Indicator */}
                          <div className="absolute bottom-2.5 left-3 flex items-center gap-2 text-zinc-300">
                            <span className="p-1.5 bg-black/75 backdrop-blur-md border border-zinc-700/80 rounded-lg">
                              <Icons8 name={service.iconName || 'skull'} size={14} className="text-zinc-200" />
                            </span>
                            <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                              {service.iconName || 'skull'}
                            </span>
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-1.5">
                            <h3 className="font-semibold text-white text-base line-clamp-1 group-hover:text-red-400 transition-colors">
                              {service.title}
                            </h3>
                            {service.subtitle && (
                              <p className="text-xs text-zinc-400 line-clamp-1 italic font-medium">
                                {service.subtitle}
                              </p>
                            )}
                            <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed pt-1">
                              {service.description}
                            </p>
                          </div>

                          {/* Specs breakdown */}
                          {Array.isArray(service.specs) && service.specs.length > 0 && (
                            <div className="pt-3 border-t border-zinc-800 space-y-1.5">
                              <span className="text-[11px] uppercase text-zinc-400 font-semibold block">
                                Technical Specs
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {service.specs.slice(0, 3).map((spec, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-[#12141c] border border-zinc-800 rounded-md text-xs text-zinc-300 truncate max-w-[200px]"
                                    title={`${spec.label}: ${spec.value}`}
                                  >
                                    <span className="text-zinc-500">{spec.label}:</span> {spec.value}
                                  </span>
                                ))}
                                {service.specs.length > 3 && (
                                  <span className="px-2 py-0.5 bg-[#12141c] text-xs text-zinc-400 rounded-md">
                                    +{service.specs.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Action Footer */}
                          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                            <span className="text-xs text-zinc-400">
                              Order: <span className="text-white font-mono font-semibold">{service.sortOrder ?? 0}</span>
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditServiceModal(service)}
                                className="px-3 py-1.5 bg-[#222636] hover:bg-[#2c3146] text-zinc-200 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                                title="Edit Discipline"
                              >
                                <Edit className="w-3.5 h-3.5 text-sky-400" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteService(service.id, service.title)}
                                className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                                title="Delete Discipline"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= 1.10. TEAM & WEBSITE MEMBERS CMS ================= */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Team Members Metrics Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-1 shadow-lg">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                    <span>Total Members</span>
                    <Crown className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {teamMembers.length}
                  </div>
                  <p className="text-xs text-zinc-400">Artist &amp; piercer roster</p>
                </div>

                <div className="p-5 bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-1 shadow-lg">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                    <span>Active on Site</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    {teamMembers.filter((m) => m.active !== false).length}
                  </div>
                  <p className="text-xs text-zinc-400">Visible on public about &amp; booking</p>
                </div>

                <div className="p-5 bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-1 shadow-lg">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                    <span>Master Artists</span>
                    <PenTool className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-red-400">
                    {teamMembers.filter((m) => m.title?.toLowerCase().includes('master') || m.title?.toLowerCase().includes('founder')).length}
                  </div>
                  <p className="text-xs text-zinc-400">Founders &amp; senior tattooists</p>
                </div>

                <div className="p-5 bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-1 shadow-lg">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                    <span>Piercing Specialists</span>
                    <Sparkles className="w-4 h-4 text-fuchsia-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-fuchsia-400">
                    {teamMembers.filter((m) => m.title?.toLowerCase().includes('piercing') || m.specialty?.toLowerCase().includes('piercing')).length}
                  </div>
                  <p className="text-xs text-zinc-400">Titanium &amp; jewelry experts</p>
                </div>
              </div>

              {/* Action Bar & Search Filter */}
              <div className="p-4 bg-[#181a24] border border-zinc-800/80 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by artist name, specialty, role..."
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') loadTeamMembers();
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#12141c] border border-zinc-700/80 rounded-xl text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button
                    onClick={loadTeamMembers}
                    disabled={loadingTeam}
                    className="p-2.5 bg-[#1e2230] hover:bg-[#282d3e] border border-zinc-700/80 rounded-xl text-zinc-200 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium"
                    title="Reload Team"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingTeam ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={openAddMemberModal}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 shadow-md shadow-red-950/40"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Team Member</span>
                  </button>
                </div>
              </div>

              {/* Members Grid */}
              {loadingTeam ? (
                <div className="p-12 text-center text-zinc-400 text-xs flex items-center justify-center gap-2 bg-[#181a24] border border-zinc-800/80 rounded-2xl">
                  <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
                  <span>Loading team &amp; artist roster...</span>
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="p-12 text-center bg-[#181a24] border border-zinc-800/80 rounded-2xl space-y-3">
                  <Users className="w-10 h-10 text-zinc-600 mx-auto" />
                  <p className="text-zinc-300 text-sm font-medium">No team members found.</p>
                  <button
                    onClick={openAddMemberModal}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-2 shadow-md shadow-red-950/40"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Team Member</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member) => {
                    const isMarvin =
                      member.id === 'marvin' ||
                      member.slug === 'marvin' ||
                      member.name.toLowerCase().includes('marvin');
                    const badges = Array.isArray(member.badges) ? member.badges : [];

                    return (
                      <div
                        key={member.id}
                        className={`bg-[#181a24] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-lg ${
                          member.active === false
                            ? 'border-zinc-800 opacity-60'
                            : isMarvin
                            ? 'border-red-500/50 shadow-lg shadow-red-950/20'
                            : 'border-zinc-800/80 hover:border-zinc-600'
                        }`}
                      >
                        {/* Member Photo & Top Badges */}
                        <div className="relative h-64 bg-[#12141c] overflow-hidden">
                          <img
                            src={member.avatar || '/images/marvin-founder.png'}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/marvin-founder.png';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#181a24] via-transparent to-black/40" />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[80%]">
                            {isMarvin && (
                              <span className="px-2.5 py-1 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1 shadow">
                                <Crown className="w-3.5 h-3.5" /> Founder
                              </span>
                            )}
                            {badges.slice(0, 2).map((b, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-red-300 border border-red-500/40 text-[10px] uppercase tracking-wider rounded-lg font-semibold"
                              >
                                {b}
                              </span>
                            ))}
                          </div>

                          {/* Status Badge */}
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                member.active !== false
                                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60'
                                  : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                              }`}
                            >
                              {member.active !== false ? 'Active' : 'Hidden'}
                            </span>
                          </div>

                          {/* Bottom info on image */}
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-white font-bold text-lg leading-tight flex items-center justify-between">
                              <span>{member.name}</span>
                              <span className="text-xs font-mono text-red-400 font-semibold">
                                {member.experience}
                              </span>
                            </h3>
                            <p className="text-xs text-zinc-300 truncate font-medium">{member.title}</p>
                          </div>
                        </div>

                        {/* Member Details */}
                        <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                          <div className="space-y-2.5">
                            <div>
                              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold block">Specialty</span>
                              <p className="text-xs text-zinc-200 font-medium">{member.specialty || 'Custom Tattoo & Piercing'}</p>
                            </div>

                            <div>
                              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold block">Bio &amp; Description</span>
                              <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                                {member.bio}
                              </p>
                            </div>

                            {badges.length > 0 && (
                              <div className="pt-2 flex flex-wrap gap-1.5">
                                {badges.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-[#12141c] border border-zinc-800 text-zinc-300 text-[10px] rounded-md"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Card Footer & Action Buttons */}
                          <div className="pt-3.5 border-t border-zinc-800 flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleToggleMemberActive(member)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                                member.active !== false
                                  ? 'bg-[#222636] text-zinc-300 border-zinc-700 hover:bg-[#2c3146]'
                                  : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40 hover:bg-emerald-900/60'
                              }`}
                              title={member.active !== false ? 'Hide from public website' : 'Make visible on public website'}
                            >
                              {member.active !== false ? 'Deactivate' : 'Activate'}
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => openEditMemberModal(member)}
                                className="px-3 py-1.5 bg-[#222636] hover:bg-[#2c3146] text-zinc-200 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                                title="Edit Team Member"
                              >
                                <Edit className="w-3.5 h-3.5 text-sky-400" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteMember(member.id, member.name)}
                                className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                                title="Delete Team Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= 2. SHOP (PRODUCTS / CATEGORIES / ORDERS) ================= */}
          {activeTab === 'shop' && (

            <div className="space-y-6">
              {/* Shop Sub-Navigation Pill Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-1.5 bg-[#181a24] p-1.5 rounded-xl border border-zinc-800 text-xs">
                  <button
                    onClick={() => setShopSubTab('products')}
                    className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 font-medium text-xs ${
                      shopSubTab === 'products'
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Products</span>
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                        shopSubTab === 'products' ? 'bg-red-800/80 text-white' : 'bg-[#12141c] text-zinc-400'
                      }`}
                    >
                      {productsList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setShopSubTab('categories')}
                    className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 font-medium text-xs ${
                      shopSubTab === 'categories'
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Categories</span>
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                        shopSubTab === 'categories' ? 'bg-red-800/80 text-white' : 'bg-[#12141c] text-zinc-400'
                      }`}
                    >
                      {inventoryCategories.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setShopSubTab('orders')}
                    className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 font-medium text-xs ${
                      shopSubTab === 'orders'
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Orders</span>
                    {pendingOrdersCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-mono font-bold">
                        {pendingOrdersCount} new
                      </span>
                    ) : (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                          shopSubTab === 'orders' ? 'bg-red-800/80 text-white' : 'bg-[#12141c] text-zinc-400'
                        }`}
                      >
                        {orders.length}
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {shopSubTab === 'products' && (
                    <>
                      <button
                        onClick={() => setShopSubTab('categories')}
                        className="px-3.5 py-2 bg-[#181a24] hover:bg-[#1f222d] border border-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <Tag className="w-3.5 h-3.5 text-sky-400" />
                        <span>Categories</span>
                      </button>
                      <button
                        onClick={openAddProductModal}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Product</span>
                      </button>
                    </>
                  )}
                  {shopSubTab === 'categories' && (
                    <button
                      onClick={openAddProductModal}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Product</span>
                    </button>
                  )}
                  {shopSubTab === 'orders' && (
                    <button
                      onClick={loadOrders}
                      className="px-3.5 py-2 bg-[#181a24] hover:bg-[#1f222d] border border-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Orders</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ----------------- SUB-TAB: PRODUCTS CATALOG ----------------- */}
              {shopSubTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-80">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search products, categories..."
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        className="w-full pl-8 pr-8 py-2 bg-[#181a24] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-red-500 transition-colors"
                      />
                      {inventorySearch && (
                        <button
                          onClick={() => setInventorySearch('')}
                          className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white text-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-zinc-400 font-sans">
                      Showing <span className="text-white font-semibold font-mono">{filteredProductsList.length}</span> of <span className="font-mono">{productsList.length}</span> products
                    </div>
                  </div>

                  {/* Dynamic Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                    <button
                      onClick={() => setInventoryCategoryFilter('ALL')}
                      className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap text-xs ${
                        inventoryCategoryFilter === 'ALL'
                          ? 'bg-red-600 text-white border-red-500 font-medium shadow-md shadow-red-950/30'
                          : 'bg-[#181a24] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      All Categories ({productsList.length})
                    </button>
                    {inventoryCategories.map((cat) => {
                      const count = productsList.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => setInventoryCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap capitalize text-xs ${
                            inventoryCategoryFilter.toLowerCase() === cat.toLowerCase()
                              ? 'bg-red-600 text-white border-red-500 font-medium shadow-md shadow-red-950/30'
                              : 'bg-[#181a24] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                          }`}
                        >
                          {cat} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {filteredProductsList.length === 0 ? (
                    <div className="p-12 text-center bg-[#181a24] border border-zinc-800 rounded-xl space-y-2">
                      <p className="text-zinc-400 text-sm">No catalog products match your search or filter.</p>
                      <button
                        onClick={() => {
                          setInventoryCategoryFilter('ALL');
                          setInventorySearch('');
                        }}
                        className="text-red-400 hover:text-red-300 text-xs underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {filteredProductsList.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-[#181a24] border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm transition-all group"
                        >
                          <div className="h-40 bg-[#12141c] relative overflow-hidden">
                            <img
                              src={prod.image || prod.imageUrl}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#181a24]/90 backdrop-blur-sm border border-zinc-700 text-[10px] text-red-400 font-medium rounded capitalize">
                              {prod.category}
                            </span>
                          </div>

                          <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                            <div className="space-y-1">
                              <h4 className="font-semibold text-white text-sm truncate" title={prod.name}>
                                {prod.name}
                              </h4>
                              <div className="text-sm font-bold text-red-400 font-mono">
                                UGX {prod.price.toLocaleString()}
                              </div>
                              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                                {prod.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-zinc-800/80 flex justify-between items-center mt-2">
                              {prod.inStock && (prod.stockCount === undefined || prod.stockCount > 0) ? (
                                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span className="font-mono">In Stock ({prod.stockCount ?? 10})</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-red-400 flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Out of Stock</span>
                                </span>
                              )}
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => openEditProductModal(prod)}
                                  className="text-xs text-zinc-300 hover:text-white px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors flex items-center gap-1 font-medium"
                                  title="Edit Product"
                                >
                                  <Edit className="w-3 h-3 text-sky-400" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-950/40 hover:bg-red-900/60 rounded transition-colors flex items-center gap-1"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ----------------- SUB-TAB: CATEGORIES MANAGEMENT ----------------- */}
              {shopSubTab === 'categories' && (
                <div className="space-y-6 max-w-4xl">
                  {/* Create New Category Card */}
                  <form
                    onSubmit={handleAddNewCategoryPreset}
                    className="p-5 bg-[#181a24] border border-zinc-800 rounded-xl space-y-3 text-xs shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-sky-400" />
                      <h4 className="font-semibold text-white text-sm">Add New Product Category</h4>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="text"
                        value={newCategoryNameInput}
                        onChange={(e) => setNewCategoryNameInput(e.target.value)}
                        placeholder="e.g. Rotary Machines, Needles, Furniture, PMU Supplies..."
                        className="flex-1 px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 placeholder-zinc-500"
                      />
                      <button
                        type="submit"
                        disabled={!newCategoryNameInput.trim()}
                        className="px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold uppercase transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Category</span>
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Newly created categories become available immediately for filtering, shop navigation, and product creation.
                    </p>
                  </form>

                  {/* Category List */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-zinc-400 text-xs uppercase tracking-wider px-1 font-medium">
                      <span>Existing Categories ({inventoryCategories.length})</span>
                      <span>Total Products: <span className="font-mono text-zinc-300 font-bold">{productsList.length}</span></span>
                    </div>

                    <div className="space-y-2.5">
                      {inventoryCategories.map((cat) => {
                        const count = productsList.filter(
                          (p) => p.category?.toLowerCase() === cat.toLowerCase()
                        ).length;
                        const isEditing = editingCategoryName === cat;
                        const isDeleting = deletingCategoryName === cat;

                        return (
                          <div
                            key={cat}
                            className="p-4 bg-[#181a24] border border-zinc-800 rounded-xl text-xs transition-colors hover:border-zinc-700 shadow-sm"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                              {isEditing ? (
                                <div className="flex-1 flex gap-2 w-full">
                                  <input
                                    type="text"
                                    value={renamedCategoryValue}
                                    onChange={(e) => setRenamedCategoryValue(e.target.value)}
                                    className="flex-1 px-3 py-1.5 bg-[#12141c] border border-red-500 rounded-lg text-white text-xs focus:outline-none"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleRenameCategory(cat)}
                                    disabled={categoryActionLoading}
                                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Save</span>
                                  </button>
                                  <button
                                    onClick={() => setEditingCategoryName(null)}
                                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <span className="px-3 py-1 bg-red-500/15 border border-red-500/30 text-red-300 font-bold text-xs rounded-lg uppercase tracking-wider">
                                    {cat}
                                  </span>
                                  <span className="text-zinc-400 text-xs">
                                    <span className="text-white font-semibold font-mono">{count}</span> {count === 1 ? 'product' : 'products'} assigned
                                  </span>
                                </div>
                              )}

                              {!isEditing && (
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => {
                                      setEditingCategoryName(cat);
                                      setRenamedCategoryValue(cat);
                                      setDeletingCategoryName(null);
                                    }}
                                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs flex items-center gap-1 transition-colors font-medium"
                                    title="Rename Category"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-sky-400" />
                                    <span>Rename</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeletingCategoryName(cat);
                                      setEditingCategoryName(null);
                                      const other = inventoryCategories.find((c) => c !== cat) || 'Aftercare';
                                      setDeleteReassignCategory(other);
                                    }}
                                    className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 rounded-lg text-xs flex items-center gap-1 transition-colors font-medium"
                                    title="Delete / Merge Category"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* DELETE REASSIGNMENT PANEL */}
                            {isDeleting && (
                              <div className="mt-3 p-3.5 bg-[#12141c] border border-red-900/50 rounded-lg space-y-2.5 text-xs">
                                <p className="text-zinc-300">
                                  Reassign all <span className="text-red-400 font-bold font-mono">{count}</span> items currently in "{cat}" to:
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <select
                                    value={deleteReassignCategory}
                                    onChange={(e) => setDeleteReassignCategory(e.target.value)}
                                    className="flex-1 px-3 py-1.5 bg-[#181a24] border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                                  >
                                    {inventoryCategories
                                      .filter((c) => c !== cat)
                                      .map((c) => (
                                        <option key={c} value={c}>
                                          {c}
                                        </option>
                                      ))}
                                    <option value="Aftercare">Aftercare (Default)</option>
                                    <option value="Hard Goods">Hard Goods</option>
                                    <option value="General Merchandise">General Merchandise</option>
                                  </select>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleDeleteCategory(cat)}
                                      disabled={categoryActionLoading}
                                      className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-colors shadow-sm"
                                    >
                                      {categoryActionLoading ? 'Updating...' : 'Confirm & Delete'}
                                    </button>
                                    <button
                                      onClick={() => setDeletingCategoryName(null)}
                                      className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-TAB: ORDERS TABLE ----------------- */}
              {shopSubTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    {/* Status Filter */}
                    <div className="flex items-center gap-1 bg-[#181a24] p-1.5 rounded-xl border border-zinc-800 text-xs overflow-x-auto max-w-full">
                      {['ALL', 'PENDING_PAYMENT', 'PROCESSING', 'READY_FOR_PICKUP', 'DISPATCHED', 'COMPLETED'].map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            setOrderFilterStatus(st);
                            setTimeout(loadOrders, 50);
                          }}
                          className={`px-3 py-1 rounded-md transition-colors text-xs whitespace-nowrap font-medium ${
                            orderFilterStatus === st
                              ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {st === 'ALL' ? 'All' : st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative w-full sm:w-72">
                        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && loadOrders()}
                          placeholder="Search order #, client..."
                          className="w-full pl-8 pr-3 py-1.5 bg-[#181a24] border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 placeholder:text-zinc-500"
                        />
                      </div>
                      <button
                        onClick={loadOrders}
                        className="px-3.5 py-1.5 bg-[#1f222d] hover:bg-[#252836] border border-zinc-800 rounded-lg text-xs text-zinc-200 transition-colors font-medium"
                      >
                        Filter
                      </button>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-[#181a24] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-[#151720] text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
                          <th className="p-3.5 pl-4">Order #</th>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Fulfillment</th>
                          <th className="p-3.5">Payment</th>
                          <th className="p-3.5">Amount</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right pr-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
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
                              className="hover:bg-[#1f222d] cursor-pointer transition-colors group"
                            >
                              <td className="p-3.5 pl-4 font-semibold text-white font-mono">
                                {o.orderNumber}
                              </td>
                              <td className="p-3.5">
                                <div className="font-semibold text-zinc-200">{o.clientName}</div>
                                <div className="text-[11px] text-zinc-400 font-mono">{o.clientPhone}</div>
                              </td>
                              <td className="p-3.5">
                                <span className="text-zinc-200 font-medium block">
                                  {o.deliveryMethod === 'STUDIO_PICKUP' ? 'Studio Pickup' : 'Dispatch'}
                                </span>
                                {o.deliveryAddress && (
                                  <span className="text-[11px] text-zinc-400 block truncate max-w-xs">
                                    {o.deliveryAddress}
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                    o.paymentStatus === 'SUCCESS'
                                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                      : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                                  }`}
                                >
                                  {o.paymentMethod} ({o.paymentStatus})
                                </span>
                              </td>
                              <td className="p-3.5 font-bold text-red-400 font-mono">
                                UGX {o.totalAmount?.toLocaleString()}
                              </td>
                              <td className="p-3.5">
                                <span className="text-zinc-300 text-xs capitalize">
                                  {o.orderStatus.toLowerCase().replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td className="p-3.5 text-right pr-4" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() =>
                                      openWhatsApp(
                                        o.clientPhone,
                                        `Hello ${o.clientName}! This is Marvin Tattoos Atelier regarding Order #${o.orderNumber}. Your items are prepared.`
                                      )
                                    }
                                    className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs flex items-center gap-1 font-medium transition-colors"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </button>
                                  <button
                                    onClick={() => setInspectOrder(o)}
                                    className="px-2.5 py-1 bg-[#1f222d] hover:bg-zinc-700 border border-zinc-800 text-zinc-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
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
            </div>
          )}

          {/* ================= 3. PORTFOLIO CMS ================= */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              {/* Studio Metrics Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#181a24] border border-zinc-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-xs text-zinc-400 uppercase tracking-wider block font-medium">Total Artworks</span>
                    <span className="text-2xl font-bold text-white tracking-tight font-mono">{portfolioPieces.length}</span>
                    <span className="text-[11px] text-zinc-500 block mt-0.5">Active in Studio Catalog</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#12141c] border border-zinc-700/80 flex items-center justify-center text-zinc-300">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#181a24] border border-rose-500/30 p-4 rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-xs text-rose-400/90 uppercase tracking-wider block font-medium">Featured Spotlights</span>
                    <span className="text-2xl font-bold text-rose-300 tracking-tight font-mono">
                      {portfolioPieces.filter((p) => p.featured).length}
                    </span>
                    <span className="text-[11px] text-zinc-500 block mt-0.5">Showcased on Atelier Hero</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>

                <div className="bg-[#181a24] border border-red-500/30 p-4 rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-xs text-red-400/90 uppercase tracking-wider block font-medium">Studio Disciplines</span>
                    <span className="text-2xl font-bold text-red-300 tracking-tight font-mono">{servicesList.length}</span>
                    <span className="text-[11px] text-zinc-500 block mt-0.5">Unified Relational Categories</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Action Toolbar & Search */}
              <div className="bg-[#181a24] border border-zinc-800 p-4 rounded-xl space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-80">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search title, discipline, zone, flash #..."
                      value={portfolioSearch}
                      onChange={(e) => setPortfolioSearch(e.target.value)}
                      className="w-full pl-8 pr-8 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-red-500 transition-colors"
                    />
                    {portfolioSearch && (
                      <button
                        onClick={() => setPortfolioSearch('')}
                        className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                    <button
                      onClick={loadPortfolio}
                      disabled={loadingPortfolio}
                      className="px-3.5 py-2 bg-[#1f222d] hover:bg-zinc-700 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                      title="Reload Portfolio Catalog"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingPortfolio ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>

                    <button
                      onClick={openAddArtworkModal}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md shadow-red-950/40 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Artwork</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic Service Discipline Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar border-t border-zinc-800 pt-3">
                  <button
                    onClick={() => setPortfolioCategoryFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap text-xs font-medium ${
                      portfolioCategoryFilter === 'ALL'
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40'
                        : 'bg-[#12141c] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    All Disciplines ({portfolioPieces.length})
                  </button>
                  {servicesList.map((srv) => {
                    const count = portfolioPieces.filter(
                      (p) =>
                        p.serviceId?.toLowerCase() === srv.id.toLowerCase() ||
                        p.category?.toLowerCase() === srv.id.toLowerCase() ||
                        p.categoryLabel?.toLowerCase().includes(srv.title.toLowerCase())
                    ).length;

                    const isSelected = portfolioCategoryFilter.toLowerCase() === srv.id.toLowerCase();

                    return (
                      <button
                        key={srv.id}
                        onClick={() => setPortfolioCategoryFilter(srv.id)}
                        className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap text-xs flex items-center gap-1.5 font-medium ${
                          isSelected
                            ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40'
                            : 'bg-[#12141c] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        <span className="opacity-70 font-mono">{srv.disciplineNumber}.</span>
                        <span>{srv.title}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-zinc-300 font-mono">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Artworks Grid Display */}
              {filteredPortfolioPieces.length === 0 ? (
                <div className="p-16 text-center bg-[#181a24] border border-zinc-800 rounded-xl space-y-3">
                  <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto" />
                  <p className="text-zinc-300 font-medium text-sm">No artworks match your search or discipline filter.</p>
                  <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                    Try clearing your search query or selecting "All Disciplines".
                  </p>
                  <button
                    onClick={() => {
                      setPortfolioCategoryFilter('ALL');
                      setPortfolioSearch('');
                    }}
                    className="mt-2 px-4 py-1.5 bg-[#1f222d] hover:bg-zinc-700 border border-zinc-800 text-red-400 text-xs rounded-lg transition-colors font-medium"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredPortfolioPieces.map((p) => {
                    const linkedService = servicesList.find((s) => s.id === p.serviceId) || p.service;

                    return (
                      <div
                        key={p.id}
                        className="bg-[#181a24] border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden flex flex-col justify-between group shadow-sm transition-all duration-300"
                      >
                        {/* Artwork Image Box */}
                        <div className="h-52 bg-[#12141c] relative overflow-hidden cursor-pointer" onClick={() => openEditArtworkModal(p)}>
                          <img
                            src={p.image || p.imageUrl}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#181a24] via-transparent to-transparent opacity-80" />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[85%]">
                            <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md border border-red-500/40 text-[10px] font-mono text-red-300 rounded font-semibold">
                              {linkedService?.title || p.categoryLabel || p.category}
                            </span>
                            {p.featured && (
                              <span className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] font-sans rounded flex items-center gap-0.5 shadow-md">
                                <Star className="w-2.5 h-2.5 fill-current" /> Featured
                              </span>
                            )}
                          </div>

                          {p.flashId && (
                            <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/85 backdrop-blur-md text-[10px] font-mono text-sky-300 rounded border border-sky-500/30">
                              {p.flashId}
                            </span>
                          )}

                          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-black/80 backdrop-blur-md text-[10px] font-mono text-zinc-300 rounded">
                            {p.healingState || 'Healed Artwork'}
                          </div>
                        </div>

                        {/* Spec Information */}
                        <div className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h4
                              className="font-bold text-white text-sm truncate group-hover:text-red-400 transition-colors cursor-pointer"
                              title={p.title}
                              onClick={() => openEditArtworkModal(p)}
                            >
                              {p.title}
                            </h4>

                            <div className="text-[11px] text-zinc-400 flex justify-between items-center pt-1 border-t border-zinc-800">
                              <span className="text-zinc-300 truncate">{p.zone || 'Body Canvas'}</span>
                              <span className="text-zinc-500 shrink-0 text-[10px] font-mono">{p.duration || 'Session'}</span>
                            </div>

                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                              {p.description}
                            </p>
                          </div>

                          {/* Footer Action Strip */}
                          <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
                            <span className="text-[11px] text-zinc-400 font-mono truncate max-w-[120px]" title={p.pigment}>
                              {p.pigment || 'Dynamic Black'}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => openEditArtworkModal(p)}
                                className="text-xs text-zinc-200 hover:text-white px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-1 font-medium"
                                title="Edit Artwork Specs"
                              >
                                <Edit className="w-3 h-3 text-sky-400" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeletePortfolioPiece(p.id)}
                                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-950/40 hover:bg-red-900/60 rounded-lg transition-colors flex items-center gap-1"
                                title="Delete Piece"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= 5. REVIEWS CMS ================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-xs text-zinc-400">
                  Published Reviews: <span className="text-white font-bold font-mono">{testimonialsList.length}</span>
                </div>
                <button
                  onClick={openAddReviewModal}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Review</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonialsList.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 bg-[#181a24] border border-zinc-800 rounded-xl space-y-3 text-xs flex flex-col justify-between shadow-sm group hover:border-zinc-700 transition-colors"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white truncate max-w-[150px] text-sm">{t.name}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < (typeof t.stars === 'number' ? t.stars : 5)
                                  ? 'text-rose-400 fill-rose-400'
                                  : 'text-zinc-600'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-[11px] text-rose-400 font-bold font-mono">
                            {t.stars || 5}★
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-red-400 block mb-2 font-medium">{t.role}</span>
                      <p className="text-xs text-zinc-300 italic leading-relaxed">
                        "{t.quote}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400">
                        {t.isGoogleVerified !== false ? 'Verified Google' : 'Direct Feedback'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditReviewModal(t)}
                          className="text-xs text-zinc-300 hover:text-white px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors flex items-center gap-1 font-medium"
                        >
                          <Edit className="w-3 h-3 text-sky-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-950/40 hover:bg-red-900/60 rounded transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 6. HERO & SETTINGS STUDIO ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl text-xs">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* 1. Studio Identity & Brand Name */}
                <div className="p-5 bg-[#181a24] border border-zinc-800 rounded-xl space-y-4 shadow-sm">
                  <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-2.5 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-red-400" />
                    <span>1. Studio Identity &amp; Branding</span>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                      Studio Brand Name (Applied everywhere across website, navbar, footer &amp; tabs)
                    </label>
                    <input
                      type="text"
                      value={settings.studioName || ''}
                      onChange={(e) => setSettings({ ...settings, studioName: e.target.value })}
                      placeholder="e.g. Marvin Tattoo Studio"
                      className="w-full px-3.5 py-2.5 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-red-500"
                      required
                    />
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Changing this updates the brand name in real time across the live site, header, footer, page titles, and appointment notifications.
                    </p>
                  </div>
                </div>

                {/* 2. Announcement & Flash Bar */}
                <div className="p-5 bg-[#181a24] border border-zinc-800 rounded-xl space-y-4 shadow-sm">
                  <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-2.5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-400" />
                    <span>2. Studio Announcement &amp; Flash Notice Bar</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="announcementActive"
                        checked={Boolean(settings.announcementActive)}
                        onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                        className="accent-red-600 cursor-pointer rounded w-4 h-4"
                      />
                      <label htmlFor="announcementActive" className="text-xs text-zinc-200 font-medium cursor-pointer">
                        Enable Top Announcement Banner across the website
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-medium mb-1.5">Announcement Message</label>
                      <input
                        type="text"
                        value={settings.announcementText || ''}
                        onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                        placeholder="e.g. 🔥 Saturday Walk-In Flash Day: 10:45 AM | No Booking Required!"
                        className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Hero Visual Block */}
                <div className="p-5 bg-[#181a24] border border-zinc-800 rounded-xl space-y-4 shadow-sm">
                  <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-2.5 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-red-400" />
                    <span>3. Hero Banner Visual &amp; Darkness Opacity</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-5 h-48 bg-[#12141c] border border-zinc-800 rounded-lg overflow-hidden relative">
                      <img
                        src={heroImagePreview || settings.heroBannerUrl}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 bg-black pointer-events-none transition-opacity"
                        style={{ opacity: settings.heroOpacity }}
                      />
                      <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-[#181a24]/90 backdrop-blur-sm border border-zinc-700 text-[10px] text-zinc-200 rounded font-medium">
                        Live Hero Preview
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-4">
                      <div>
                        <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                          Upload New Banner Photo (Sharp WebP / JPEG)
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
                          className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-red-600 file:text-white file:text-xs file:font-medium file:rounded-lg file:cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-zinc-300 mb-1 font-medium">
                          <span>Overlay Darkness Opacity</span>
                          <span className="text-red-400 font-bold font-mono">{Math.round(settings.heroOpacity * 100)}%</span>
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

                {/* 4. Hero Editorial Statements */}
                <div className="p-5 bg-[#181a24] border border-zinc-800 rounded-xl space-y-4 shadow-sm">
                  <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-2.5 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-400" />
                    <span>4. Hero Editorial Statements</span>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-medium mb-1.5">Headline Statement</label>
                    <input
                      type="text"
                      value={settings.heroStatement || ''}
                      onChange={(e) => setSettings({ ...settings, heroStatement: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-medium mb-1.5">Subtext Description</label>
                    <textarea
                      rows={2}
                      value={settings.heroSubtext || ''}
                      onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 leading-relaxed"
                    />
                  </div>
                </div>

                {/* 5. Studio Contacts & Coordinates */}
                <div className="p-5 bg-[#181a24] border border-zinc-800 rounded-xl space-y-4 shadow-sm">
                  <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-2.5 flex items-center gap-2">
                    <Building className="w-4 h-4 text-red-400" />
                    <span>5. Studio Contacts &amp; Coordinates</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-300 font-medium mb-1.5">Studio Desk Phone</label>
                      <input
                        type="text"
                        value={settings.primaryPhone || ''}
                        onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                        className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-medium mb-1.5">WhatsApp Direct Line</label>
                      <input
                        type="text"
                        value={settings.whatsappNumber || ''}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-medium mb-1.5">Studio Contact Email</label>
                      <input
                        type="email"
                        value={settings.contactEmail || ''}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        placeholder="info@marvintattoos.com"
                        className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-medium mb-1.5">Physical Address</label>
                      <input
                        type="text"
                        value={settings.physicalAddress || ''}
                        onChange={(e) => setSettings({ ...settings, physicalAddress: e.target.value })}
                        className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs text-zinc-300 font-medium mb-1.5">Google Maps URL</label>
                      <input
                        type="text"
                        value={settings.googleMapsUrl || ''}
                        onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                        className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Social Channels */}
                <div className="p-5 bg-[#181a24] border border-zinc-800 rounded-xl space-y-3 shadow-sm">
                  <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-2.5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-400" />
                    <span>6. Social Channels &amp; Links</span>
                  </div>

                  {(settings.socialLinks || []).map((soc, idx) => (
                    <div key={soc.id || idx} className="flex items-center gap-3 p-3 bg-[#12141c] rounded-lg border border-zinc-800">
                      <div className="flex items-center gap-2 w-36 shrink-0">
                        <input
                          type="checkbox"
                          checked={soc.active}
                          onChange={(e) => {
                            const updated = [...(settings.socialLinks || [])];
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
                          const updated = [...(settings.socialLinks || [])];
                          updated[idx] = { ...soc, url: e.target.value };
                          setSettings({ ...settings, socialLinks: updated });
                        }}
                        className="flex-1 px-3 py-1.5 bg-[#181a24] border border-zinc-700/80 rounded-md text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="py-2.5 px-6 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-md shadow-red-950/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{savingSettings ? 'Deploying...' : 'Save & Deploy Changes'}</span>
                </button>
              </form>

            {/* Section 5: Admin Security & Password Change */}
            <div className="p-5 bg-[#181a24] border border-zinc-800 rounded-xl space-y-4 shadow-sm max-w-4xl">
              <div className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-400" />
                  <span>5. Admin Security &amp; Master Password</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Account: {adminUser?.email || 'admin@marvintattoos.com'}
                </span>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
                {passwordStatus && (
                  <div
                    className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                      passwordStatus.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}
                  >
                    {passwordStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                    )}
                    <span>{passwordStatus.message}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                    Current Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    type="password"
                    value={currPassword}
                    onChange={(e) => setCurrPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full px-3.5 py-2.5 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                      New Password <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="password"
                      value={newPasswordVal}
                      onChange={(e) => setNewPasswordVal(e.target.value)}
                      placeholder="At least 6 characters"
                      minLength={6}
                      className="w-full px-3.5 py-2.5 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                      Confirm New Password <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="password"
                      value={confirmPasswordVal}
                      onChange={(e) => setConfirmPasswordVal(e.target.value)}
                      placeholder="Repeat new password"
                      minLength={6}
                      className="w-full px-3.5 py-2.5 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="py-2.5 px-5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border border-zinc-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Key className="w-3.5 h-3.5 text-red-400" />
                    <span>{passwordLoading ? 'Updating Password...' : 'Change Master Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* INSPECTION SLIDE-OVER DRAWER FOR BOOKING */}
      {inspectBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#181a24] border-l border-zinc-800 h-full p-6 flex flex-col justify-between overflow-y-auto text-xs shadow-2xl">
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3.5">
                <span className="text-red-400 font-bold bg-red-500/15 px-2.5 py-1 rounded-lg border border-red-500/30 text-xs font-mono">
                  {inspectBooking.referenceCode}
                </span>
                <button
                  onClick={() => setInspectBooking(null)}
                  className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-white">{inspectBooking.clientName}</h3>
                <div className="text-zinc-400 flex items-center gap-2 font-mono text-xs">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{inspectBooking.clientPhone}</span>
                </div>
                <div className="text-zinc-400 flex items-center gap-2 text-xs">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{inspectBooking.clientEmail}</span>
                </div>
              </div>

              <div className="p-4 bg-[#12141c] rounded-xl border border-zinc-800 space-y-2.5">
                <div className="flex justify-between text-zinc-400">
                  <span>Service:</span>
                  <span className="text-white font-medium capitalize">
                    {inspectBooking.serviceType.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Placement:</span>
                  <span className="text-red-400 font-medium">{inspectBooking.placement}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Date &amp; Time:</span>
                  <span className="text-white font-mono">
                    {new Date(inspectBooking.preferredDate).toLocaleDateString()} ({inspectBooking.timeSlot})
                  </span>
                </div>
              </div>

              {/* Client Idea / Notes */}
              <div className="space-y-1.5">
                <span className="text-xs text-zinc-300 uppercase tracking-wider block font-semibold">
                  Client Idea / Notes
                </span>
                <p className="p-3.5 bg-[#12141c] rounded-xl border border-zinc-800 text-zinc-200 leading-relaxed text-xs">
                  {inspectBooking.description}
                </p>
              </div>

              {/* Reference Image */}
              {inspectBooking.referenceImage && (
                <div className="space-y-1.5">
                  <span className="text-xs text-zinc-300 uppercase tracking-wider block font-semibold">
                    Reference Photo
                  </span>
                  <div className="max-h-60 overflow-hidden rounded-xl border border-zinc-800 bg-[#12141c]">
                    <img
                      src={inspectBooking.referenceImage}
                      alt="Reference"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Status Selector */}
              <div className="space-y-1.5">
                <span className="text-xs text-zinc-300 uppercase tracking-wider block font-semibold">
                  Booking Status
                </span>
                <select
                  value={inspectBooking.status}
                  onChange={(e) => handleUpdateBookingStatus(inspectBooking.id, e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <button
                onClick={() =>
                  openWhatsApp(
                    inspectBooking.clientPhone,
                    `Hello ${inspectBooking.clientName}! This is Marvin from Marvin Tattoo Studio regarding your booking [${inspectBooking.referenceCode}]. We look forward to seeing you at New Pioneer Mall, Shop No. Pi55, Level 5, Burton Street, Kampala.`
                  )
                }
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </button>
              <button
                onClick={() => handleDeleteBooking(inspectBooking.id)}
                className="w-full py-2 bg-[#12141c] hover:bg-red-950/40 hover:text-red-400 text-zinc-400 border border-zinc-800 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#181a24] border-l border-zinc-800 h-full p-6 flex flex-col justify-between overflow-y-auto text-xs shadow-2xl">
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3.5">
                <span className="text-white font-bold font-mono text-sm">{inspectOrder.orderNumber}</span>
                <button
                  onClick={() => setInspectOrder(null)}
                  className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-white">{inspectOrder.clientName}</h3>
                <div className="text-zinc-400 flex items-center gap-2 font-mono text-xs">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{inspectOrder.clientPhone}</span>
                </div>
                <div className="text-zinc-400 flex items-center gap-2 text-xs">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{inspectOrder.clientEmail}</span>
                </div>
              </div>

              <div className="p-4 bg-[#12141c] rounded-xl border border-zinc-800 space-y-2.5">
                <div className="flex justify-between text-zinc-400">
                  <span>Fulfillment:</span>
                  <span className="text-white font-medium">
                    {inspectOrder.deliveryMethod === 'STUDIO_PICKUP' ? 'Studio Pickup (L5)' : 'Kampala Dispatch'}
                  </span>
                </div>
                {inspectOrder.deliveryAddress && (
                  <div className="text-xs text-zinc-400 pt-1.5 border-t border-zinc-800">
                    <span>Address: </span>
                    <span className="text-white">{inspectOrder.deliveryAddress}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Payment:</span>
                  <span className="text-red-400 font-medium">{inspectOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Total Amount:</span>
                  <span className="text-red-400 font-bold text-sm font-mono">
                    UGX {inspectOrder.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1.5">
                <span className="text-xs text-zinc-300 uppercase tracking-wider block font-semibold">
                  Items Breakdown
                </span>
                <div className="p-3.5 bg-[#12141c] rounded-xl border border-zinc-800 space-y-2">
                  {(inspectOrder.items || []).map((it: any, i: number) => (
                    <div key={i} className="flex justify-between text-zinc-200">
                      <span>{it.quantity}x {it.product?.name || 'Item'}</span>
                      <span className="text-zinc-300 font-semibold font-mono">UGX {(it.unitPrice * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status */}
              <div className="space-y-1.5">
                <span className="text-xs text-zinc-300 uppercase tracking-wider block font-semibold">
                  Order Status
                </span>
                <select
                  value={inspectOrder.orderStatus}
                  onChange={(e) => handleUpdateOrderStatus(inspectOrder.id, e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
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

            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <button
                onClick={() =>
                  openWhatsApp(
                    inspectOrder.clientPhone,
                    `Hello ${inspectOrder.clientName}! This is Marvin Tattoos Atelier regarding Order #${inspectOrder.orderNumber}. Your items are prepared.`
                  )
                }
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Customer</span>
              </button>
              <button
                onClick={() => handleDeleteOrder(inspectOrder.id)}
                className="w-full py-2 bg-[#12141c] hover:bg-red-950/40 hover:text-red-400 text-zinc-400 border border-zinc-800 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ARTWORK (PRO STUDIO WORKSTATION) */}
      {showArtworkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <form
            onSubmit={handleSavePortfolioPiece}
            className="w-full max-w-4xl bg-[#181a24] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] text-xs"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-[#151720]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm tracking-wide">
                    {editingArtworkId ? 'Edit Artwork Specifications' : 'Publish New Artwork Piece'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {editingArtworkId ? `Catalog ID: ${editingArtworkId}` : 'Add a new piece to the atelier portfolio and connected service pages'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowArtworkModal(false);
                  setEditingArtworkId(null);
                }}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: 2-Column Workstation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto flex-1">
              {/* LEFT COLUMN: Visual Asset Studio (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-zinc-300 uppercase tracking-wider block font-semibold flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-red-400" />
                    <span>Visual Asset &amp; Live Preview</span>
                  </span>
                  <p className="text-[11px] text-zinc-400">
                    High-definition artwork photo with real-time portfolio card rendering.
                  </p>
                </div>

                {/* Live Card Preview Box */}
                <div className="bg-[#12141c] border border-zinc-800 rounded-xl overflow-hidden relative shadow-inner">
                  {pieceImagePreview || pieceImageFile ? (
                    <div className="relative h-64 bg-black">
                      <img
                        src={
                          pieceImageFile
                            ? URL.createObjectURL(pieceImageFile)
                            : pieceImagePreview
                        }
                        alt="Artwork Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent to-transparent opacity-80" />

                      {/* Live Overlay Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[85%]">
                        <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md border border-red-500/40 text-[10px] font-mono text-red-300 rounded font-semibold">
                          {servicesList.find((s) => s.id === pieceServiceId)?.title || pieceCategoryLabel || pieceCategory}
                        </span>
                        {pieceFeatured && (
                          <span className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] rounded flex items-center gap-0.5 shadow-md">
                            <Star className="w-2.5 h-2.5 fill-current" /> Featured
                          </span>
                        )}
                      </div>

                      {pieceFlashId && (
                        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/85 backdrop-blur-md text-[10px] font-mono text-sky-300 rounded border border-sky-500/30">
                          {pieceFlashId}
                        </span>
                      )}

                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-black/80 backdrop-blur-md text-[10px] font-mono text-zinc-300 rounded">
                        {pieceHealingState || 'Healed Masterpiece'}
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-700/80 hover:border-red-500 rounded-xl cursor-pointer p-4 text-center transition-colors bg-[#12141c]">
                      <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                      <span className="text-xs font-semibold text-zinc-300">Click to Upload Photo</span>
                      <span className="text-[11px] text-zinc-500 mt-1 font-mono">PNG, JPG, WEBP up to 25MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setPieceImageFile(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Upload File Selector Strip */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="flex-1 px-3 py-2 bg-[#12141c] hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-red-400" />
                      <span>{pieceImageFile ? 'Change Selected File' : 'Browse Local Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setPieceImageFile(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Direct URL Input fallback */}
                  <div className="space-y-1">
                    <label className="block text-[11px] text-zinc-400 font-medium">Or Paste Direct Image URL</label>
                    <input
                      type="text"
                      value={pieceImagePreview}
                      onChange={(e) => {
                        setPieceImagePreview(e.target.value);
                        setPieceImageFile(null);
                      }}
                      placeholder="https://images.unsplash.com/... or /images/portfolio/..."
                      className="w-full px-3 py-1.5 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Master Craft Parameters (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* 1. Artwork Identity */}
                <div className="p-4 bg-[#12141c] border border-zinc-800 rounded-xl space-y-3">
                  <span className="text-xs text-zinc-300 uppercase tracking-wider block font-semibold">
                    1. Artwork Identity &amp; Title
                  </span>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1 font-medium">Title / Subject Name *</label>
                    <input
                      required
                      type="text"
                      value={pieceTitle}
                      onChange={(e) => setPieceTitle(e.target.value)}
                      placeholder="e.g. Matriarch Memorial Portrait"
                      className="w-full px-3 py-2 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1 font-medium">Artistic Narrative &amp; Craft Notes *</label>
                    <textarea
                      required
                      rows={2}
                      value={pieceDescription}
                      onChange={(e) => setPieceDescription(e.target.value)}
                      placeholder="Detailed notes on shading, technique, needle gauge, and aesthetic concept..."
                      className="w-full px-3 py-2 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs leading-relaxed focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* 2. Connected Studio Service Discipline */}
                <div className="p-4 bg-[#12141c] border border-red-500/20 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-red-400 uppercase tracking-wider block font-semibold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>2. Linked Studio Discipline</span>
                    </span>
                    <span className="text-[11px] text-zinc-400">Auto-routes to service page</span>
                  </div>

                  <select
                    value={pieceServiceId}
                    onChange={(e) => {
                      const selId = e.target.value;
                      setPieceServiceId(selId);
                      const matchedSrv = servicesList.find((s) => s.id === selId);
                      if (matchedSrv) {
                        setPieceCategoryLabel(matchedSrv.title);
                        if (selId.includes('realism')) setPieceCategory('dark-realism');
                        else if (selId.includes('fine-line')) setPieceCategory('micro-detail');
                        else if (selId.includes('lettering')) setPieceCategory('neo-traditional');
                        else if (selId.includes('tribal')) setPieceCategory('dark-realism');
                        else if (selId.includes('cover')) setPieceCategory('coverup');
                        else if (selId.includes('pmu')) setPieceCategory('micro-detail');
                        else if (selId.includes('piercing')) setPieceCategory('piercing');
                        else if (selId.includes('laser')) setPieceCategory('coverup');
                      }
                    }}
                    className="w-full px-3 py-2 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-red-500"
                  >
                    {servicesList.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        Discipline #{srv.disciplineNumber} — {srv.title} ({srv.category})
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-1.5 flex-wrap pt-1">
                    {servicesList.map((srv) => (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => {
                          setPieceServiceId(srv.id);
                          setPieceCategoryLabel(srv.title);
                          if (srv.id.includes('realism')) setPieceCategory('dark-realism');
                          else if (srv.id.includes('fine-line')) setPieceCategory('micro-detail');
                          else if (srv.id.includes('lettering')) setPieceCategory('neo-traditional');
                          else if (srv.id.includes('tribal')) setPieceCategory('dark-realism');
                          else if (srv.id.includes('cover')) setPieceCategory('coverup');
                          else if (srv.id.includes('pmu')) setPieceCategory('micro-detail');
                          else if (srv.id.includes('piercing')) setPieceCategory('piercing');
                          else if (srv.id.includes('laser')) setPieceCategory('coverup');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors ${
                          pieceServiceId === srv.id
                            ? 'bg-red-500/15 border-red-500/40 text-red-300 font-semibold shadow-sm'
                            : 'bg-[#181a24] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        <span className="font-mono">{srv.disciplineNumber}.</span> {srv.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Master Technical Specs (2-column Grid) */}
                <div className="p-4 bg-[#12141c] border border-zinc-800 rounded-xl space-y-3">
                  <span className="text-xs text-zinc-300 uppercase tracking-wider block font-semibold">
                    3. Anatomical &amp; Pigment Specifications
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1 font-medium">Body Placement / Zone *</label>
                      <input
                        required
                        type="text"
                        value={pieceZone}
                        onChange={(e) => setPieceZone(e.target.value)}
                        placeholder="e.g. Forearm, Collarbone..."
                        className="w-full px-3 py-1.5 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1 font-medium">Flash ID / Catalog #</label>
                      <input
                        type="text"
                        value={pieceFlashId}
                        onChange={(e) => setPieceFlashId(e.target.value)}
                        placeholder="e.g. #MOM-701"
                        className="w-full px-3 py-1.5 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1 font-medium">Duration / Session</label>
                      <input
                        type="text"
                        value={pieceDuration}
                        onChange={(e) => setPieceDuration(e.target.value)}
                        placeholder="e.g. 6 Hours Single Session"
                        className="w-full px-3 py-1.5 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1 font-medium">Pigment Formula</label>
                      <input
                        type="text"
                        value={piecePigment}
                        onChange={(e) => setPiecePigment(e.target.value)}
                        placeholder="e.g. Dynamic Carbon Deep &amp; Greywash"
                        className="w-full px-3 py-1.5 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1 font-medium">Lead Artist</label>
                      <input
                        type="text"
                        value={pieceArtist}
                        onChange={(e) => setPieceArtist(e.target.value)}
                        placeholder="e.g. Marvin"
                        className="w-full px-3 py-1.5 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1 font-medium">Healing Lifecycle Stage</label>
                      <input
                        type="text"
                        value={pieceHealingState}
                        onChange={(e) => setPieceHealingState(e.target.value)}
                        placeholder="e.g. Healed Masterpiece, Fresh Ink"
                        className="w-full px-3 py-1.5 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Showcase Publishing Toggle */}
                <div className="p-3.5 bg-[#12141c] border border-zinc-800 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label htmlFor="pieceFeatured" className="text-xs text-white font-semibold cursor-pointer flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-rose-400 fill-current" />
                      <span>Featured Atelier Masterpiece</span>
                    </label>
                    <p className="text-[11px] text-zinc-400">
                      Display prominently in the homepage spotlight carousel.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="pieceFeatured"
                    checked={pieceFeatured}
                    onChange={(e) => setPieceFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-[#181a24] border-zinc-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-zinc-800 bg-[#151720] flex justify-between items-center">
              <span className="text-[11px] text-zinc-400 hidden sm:inline">
                All changes sync immediately to studio portfolio and service pages.
              </span>
              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setShowArtworkModal(false);
                    setEditingArtworkId(null);
                  }}
                  className="px-4 py-2 bg-[#181a24] text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingArtwork}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md shadow-red-950/40 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{savingArtwork ? 'Saving & Publishing...' : editingArtworkId ? 'Update Artwork Specs' : 'Publish Artwork'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD / EDIT SERVICE DISCIPLINE */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveService}
            className="w-full max-w-2xl bg-[#181a24] border border-zinc-800 rounded-2xl p-6 space-y-4 text-xs shadow-2xl my-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                  <PenTool className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">
                  {editingServiceId ? `Edit Discipline #${serviceDisciplineNumber}` : 'Add New Service Discipline'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowServiceModal(false);
                  setEditingServiceId(null);
                }}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {/* Row 1: Discipline Number, Category & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Discipline Number *</label>
                  <input
                    required
                    type="text"
                    value={serviceDisciplineNumber}
                    onChange={(e) => setServiceDisciplineNumber(e.target.value)}
                    placeholder="01"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Category *</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="TATTOO">TATTOO</option>
                    <option value="PMU">PMU</option>
                    <option value="PIERCING">PIERCING</option>
                    <option value="REMOVAL">REMOVAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    min="0"
                    value={serviceSortOrder}
                    onChange={(e) => setServiceSortOrder(parseInt(e.target.value, 10) || 0)}
                    placeholder="1"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Row 2: Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Service Title *</label>
                  <input
                    required
                    type="text"
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    placeholder="e.g. Dark Realism & Blackwork"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={serviceSubtitle}
                    onChange={(e) => setServiceSubtitle(e.target.value)}
                    placeholder="e.g. Monochromatic Depth & Shadow Mastery"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Row 3: Icon Selector */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs text-zinc-300 font-medium">Discipline Icon *</label>
                  <span className="text-[11px] text-zinc-400 font-mono">Current: {serviceIconName}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'skull', label: 'Skull' },
                    { id: 'edit_note', label: 'Needle / Pen' },
                    { id: 'layers', label: 'Layers' },
                    { id: 'colorize', label: 'Color / Syringe' },
                    { id: 'pen-fancy', label: 'Fancy Pen' },
                    { id: 'syringe', label: 'Syringe' },
                    { id: 'shield-alt', label: 'Shield' },
                  ].map((ic) => (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => setServiceIconName(ic.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-all flex items-center gap-1.5 ${
                        serviceIconName === ic.id
                          ? 'bg-red-500/15 border-red-500/40 text-red-300 font-medium shadow-sm'
                          : 'bg-[#12141c] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <Icons8 name={ic.id} size={14} />
                      <span>{ic.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="Describe the discipline technique, methodology, healed finish, and studio standards..."
                  className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 leading-relaxed"
                />
              </div>

              {/* Row 5: Dynamic Technical Specs Builder */}
              <div className="space-y-2.5 p-4 bg-[#12141c] border border-zinc-800 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-xs font-semibold text-zinc-200">
                      Technical Specs & Metadata
                    </label>
                    <p className="text-[11px] text-zinc-400">
                      Key-value breakdown displayed in service details
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="px-3 py-1.5 bg-[#181a24] hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-red-400" />
                    <span>Add Spec</span>
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  {serviceSpecs.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => handleUpdateSpecRow(index, 'label', e.target.value)}
                        placeholder="Label (e.g. Technique)"
                        className="w-1/3 px-3 py-1.5 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleUpdateSpecRow(index, 'value', e.target.value)}
                        placeholder="Value (e.g. Black & Grey Opaque Graywash)"
                        className="flex-1 px-3 py-1.5 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(index)}
                        disabled={serviceSpecs.length <= 1}
                        className="p-1.5 text-zinc-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
                        title="Remove spec"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 6: Image upload & preview */}
              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                  {editingServiceId ? 'Service Artwork Photo (Optional replacement)' : 'Service Artwork Photo'}
                </label>
                {serviceImagePreview && (
                  <div className="mb-2 flex items-center gap-3 p-2.5 bg-[#12141c] border border-zinc-800 rounded-lg">
                    <img
                      src={serviceImagePreview}
                      alt="Service Preview"
                      className="w-16 h-12 object-cover rounded-lg border border-zinc-700"
                    />
                    <div className="text-xs text-zinc-400">
                      <p className="text-zinc-200 font-semibold">Current Image</p>
                      <p className="text-zinc-500 text-[11px]">Upload a new file below to replace it, or leave as is.</p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setServiceImageFile(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-red-600 file:text-white file:text-xs file:font-medium file:rounded-lg file:cursor-pointer"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowServiceModal(false);
                  setEditingServiceId(null);
                }}
                className="px-4 py-2 bg-[#12141c] text-zinc-300 rounded-lg text-xs hover:bg-zinc-800 transition-colors border border-zinc-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingService}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{savingService ? 'Saving...' : editingServiceId ? 'Update Discipline' : 'Save Discipline'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD / EDIT TEAM MEMBER */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveMember}
            className="w-full max-w-2xl bg-[#181a24] border border-zinc-800 rounded-2xl p-6 space-y-4 text-xs shadow-2xl my-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Crown className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">
                  {editingMemberId ? `Edit Team Member: ${memberName}` : 'Add New Team Member / Artist'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowMemberModal(false);
                  setEditingMemberId(null);
                }}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {/* Row 1: Name, Slug & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Artist / Member Name *</label>
                  <input
                    required
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="e.g. Marvin"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">URL Slug</label>
                  <input
                    type="text"
                    value={memberSlug}
                    onChange={(e) => setMemberSlug(e.target.value)}
                    placeholder="e.g. marvin"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    min="0"
                    value={memberSortOrder}
                    onChange={(e) => setMemberSortOrder(parseInt(e.target.value, 10) || 0)}
                    placeholder="1"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Row 2: Title & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Title / Headline *</label>
                  <input
                    required
                    type="text"
                    value={memberTitle}
                    onChange={(e) => setMemberTitle(e.target.value)}
                    placeholder="e.g. Founder & Master Tattoo Artist"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Role Subtext</label>
                  <input
                    type="text"
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    placeholder="e.g. Master Tattoo Artist & Piercing Specialist since 2014"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Row 3: Specialty, Experience & Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Specialty *</label>
                  <input
                    required
                    type="text"
                    value={memberSpecialty}
                    onChange={(e) => setMemberSpecialty(e.target.value)}
                    placeholder="e.g. Dark Realism, Portraits & Script"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Experience (Years) *</label>
                  <input
                    required
                    type="text"
                    value={memberExperience}
                    onChange={(e) => setMemberExperience(e.target.value)}
                    placeholder="e.g. 14+ Years"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Available Slots</label>
                  <input
                    type="number"
                    min="0"
                    value={memberSlotsRemaining}
                    onChange={(e) => setMemberSlotsRemaining(parseInt(e.target.value, 10) || 0)}
                    placeholder="4"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Row 4: Bio / Description */}
              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">Bio / Profile Description *</label>
                <textarea
                  required
                  rows={4}
                  value={memberBio}
                  onChange={(e) => setMemberBio(e.target.value)}
                  placeholder="Detailed artist biography, artistic journey, techniques, hygiene philosophy..."
                  className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 leading-relaxed"
                />
              </div>

              {/* Row 5: Badges & Instagram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Badges / Honors (Comma-separated)</label>
                  <input
                    type="text"
                    value={memberBadgesInput}
                    onChange={(e) => setMemberBadgesInput(e.target.value)}
                    placeholder="FOUNDER, MASTER ARTIST, STERILE CERTIFIED"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-medium mb-1.5">Instagram Profile URL</label>
                  <input
                    type="text"
                    value={memberInstagram}
                    onChange={(e) => setMemberInstagram(e.target.value)}
                    placeholder="https://instagram.com/marvin_tattoos"
                    className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2.5 p-3 bg-[#12141c] border border-zinc-800 rounded-lg">
                <input
                  type="checkbox"
                  id="memberActiveToggle"
                  checked={memberActive}
                  onChange={(e) => setMemberActive(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-zinc-800 border-zinc-600 cursor-pointer"
                />
                <label htmlFor="memberActiveToggle" className="text-xs text-zinc-300 font-medium cursor-pointer">
                  Active &amp; Visible on Public Atelier Website (About Page &amp; Booking Form)
                </label>
              </div>

              {/* Member Photo / Avatar */}
              <div className="p-3.5 bg-[#12141c] border border-zinc-800 rounded-lg space-y-2">
                <label className="block text-xs font-semibold text-zinc-200">
                  Profile Photo / Avatar
                </label>
                {memberAvatarPreview && (
                  <div className="flex items-center gap-3 p-2.5 bg-[#181a24] rounded-lg border border-zinc-700/80">
                    <img
                      src={memberAvatarPreview}
                      alt="Avatar Preview"
                      className="w-16 h-16 object-cover rounded-full border border-zinc-600"
                    />
                    <div className="text-xs text-zinc-400">
                      <p className="text-zinc-200 font-semibold">Current Avatar</p>
                      <p className="text-zinc-500 text-[11px]">Upload a new photo below to replace it, or keep current.</p>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setMemberAvatarFile(e.target.files[0])}
                    className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-red-600 file:text-white file:text-xs file:font-medium file:rounded-lg file:cursor-pointer"
                  />
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-1">Or Direct Photo Image URL</span>
                    <input
                      type="text"
                      value={memberAvatarPreview}
                      onChange={(e) => setMemberAvatarPreview(e.target.value)}
                      placeholder="/images/marvin-founder.png or https://..."
                      className="w-full px-3.5 py-1.5 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowMemberModal(false);
                  setEditingMemberId(null);
                }}
                className="px-4 py-2 bg-[#12141c] text-zinc-300 rounded-lg text-xs hover:bg-zinc-800 transition-colors border border-zinc-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingMember}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{savingMember ? 'Saving...' : editingMemberId ? 'Update Member' : 'Save Member'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveProduct}
            className="w-full max-w-lg bg-[#181a24] border border-zinc-800 rounded-2xl p-6 space-y-4 text-xs shadow-2xl my-8"
          >
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProductId(null);
                }}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 max-h-[70vh] overflow-y-auto pr-1">
              <div className="col-span-2">
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">Product Name *</label>
                <input
                  required
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Clinical Tattoo Aftercare Balm"
                  className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 font-medium"
                />
              </div>

              <div className="col-span-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs text-zinc-300 font-medium">Category *</label>
                  <span className="text-[11px] text-zinc-400">Pick preset or type custom</span>
                </div>
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {[
                    'Aftercare',
                    'Hard Goods',
                    'Needles',
                    'Titanium Jewelry',
                    'Inks & Pigments',
                    'Sanitation',
                    'Apparel',
                    'PMU Supplies',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setProdCategory(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors ${
                        prodCategory === preset
                          ? 'bg-red-500/15 border-red-500/40 text-red-300 font-semibold shadow-sm'
                          : 'bg-[#12141c] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  required
                  type="text"
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  placeholder="e.g. Aftercare, Needles, Titanium Jewelry, Apparel, Inks..."
                  className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">Price (UGX) *</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="500"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(parseFloat(e.target.value) || 0)}
                  placeholder="95000"
                  className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">Stock Count (Units)</label>
                <input
                  type="number"
                  min="0"
                  value={prodStock}
                  onChange={(e) => setProdStock(parseInt(e.target.value, 10) || 0)}
                  placeholder="20"
                  className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-[#12141c] border border-zinc-800 rounded-lg mt-5">
                <input
                  type="checkbox"
                  id="prodInStock"
                  checked={prodInStock}
                  onChange={(e) => setProdInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-[#181a24] border-zinc-600 cursor-pointer"
                />
                <label htmlFor="prodInStock" className="text-xs text-zinc-300 font-medium cursor-pointer">
                  In Stock (Available in Shop)
                </label>
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">Key Features (comma-separated)</label>
                <input
                  type="text"
                  value={prodSpecs}
                  onChange={(e) => setProdSpecs(e.target.value)}
                  placeholder="e.g. 100ml Glass Bottle, Organic Calendula, Zero Petroleum"
                  className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Product details and description..."
                  className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 leading-relaxed"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">
                  {editingProductId ? 'Product Photo (Optional replacement)' : 'Product Photo'}
                </label>
                {prodImagePreview && (
                  <div className="mb-2 flex items-center gap-3 p-2.5 bg-[#12141c] border border-zinc-800 rounded-lg">
                    <img
                      src={prodImagePreview}
                      alt="Product Preview"
                      className="w-14 h-14 object-cover rounded-lg border border-zinc-700"
                    />
                    <div className="text-xs text-zinc-400">
                      <p className="text-zinc-200 font-semibold">Current Image</p>
                      <p className="text-zinc-500 text-[11px]">Upload a new file below only if you want to replace it.</p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setProdImageFile(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-red-600 file:text-white file:text-xs file:font-medium file:rounded-lg file:cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProductId(null);
                }}
                className="px-4 py-2 bg-[#12141c] text-zinc-300 rounded-lg text-xs hover:bg-zinc-800 transition-colors border border-zinc-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProduct}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{savingProduct ? 'Saving...' : editingProductId ? 'Update Product' : 'Add Product'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD / EDIT REVIEW */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveReview}
            className="w-full max-w-lg bg-[#181a24] border border-zinc-800 rounded-2xl p-6 space-y-4 text-xs shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3.5">
              <h3 className="font-bold text-white text-sm">
                {editingReviewId ? 'Edit Review' : 'Add Review'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  setEditingReviewId(null);
                }}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">Client Name *</label>
                <input
                  required
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Dennis Mukasa"
                  className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">Service / Tattoo Style *</label>
                <input
                  required
                  type="text"
                  value={reviewRole}
                  onChange={(e) => setReviewRole(e.target.value)}
                  placeholder="e.g. Dark Realism Sleeve"
                  className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              {/* STAR LEVEL SELECTOR */}
              <div className="p-3.5 bg-[#12141c] rounded-xl border border-zinc-800 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs text-zinc-300 font-medium">
                    Rating (Stars):
                  </label>
                  <span className="text-xs font-bold text-rose-400 font-mono">
                    {reviewStars} / 5 Stars {reviewStars === 5 ? '★ (Top Rated)' : '★'}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((starNum) => (
                    <button
                      key={starNum}
                      type="button"
                      onClick={() => setReviewStars(starNum)}
                      className={`flex-1 py-2 px-1 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                        reviewStars >= starNum
                          ? 'bg-rose-500/15 border-rose-500/50 text-rose-300'
                          : 'bg-[#181a24] border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          reviewStars >= starNum ? 'text-rose-400 fill-rose-400' : 'text-zinc-600'
                        }`}
                      />
                      <span className="text-[11px] font-bold font-mono">{starNum}★</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1.5">Client Review *</label>
                <textarea
                  required
                  rows={3}
                  value={reviewQuote}
                  onChange={(e) => setReviewQuote(e.target.value)}
                  placeholder="Write client statement or review..."
                  className="w-full px-3.5 py-2 bg-[#12141c] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  setEditingReviewId(null);
                }}
                className="px-4 py-2 bg-[#12141c] text-zinc-300 rounded-lg text-xs hover:bg-zinc-800 transition-colors border border-zinc-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingReview}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{savingReview ? 'Saving...' : editingReviewId ? 'Update Review' : 'Save Review'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: SHOP CATEGORIES MANAGER */}
      {showCategoryManagerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#181a24] border border-zinc-800 rounded-2xl p-6 space-y-5 text-xs shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Tag className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">
                  Shop Categories Manager
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCategoryManagerModal(false);
                  setEditingCategoryName(null);
                  setDeletingCategoryName(null);
                }}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CREATE NEW CATEGORY */}
            <form onSubmit={handleAddNewCategoryPreset} className="p-4 bg-[#12141c] border border-zinc-800 rounded-xl space-y-2.5">
              <label className="block text-xs font-semibold text-zinc-200">
                + Add New Category
              </label>
              <div className="flex gap-2.5">
                <input
                  type="text"
                  value={newCategoryNameInput}
                  onChange={(e) => setNewCategoryNameInput(e.target.value)}
                  placeholder="e.g. Rotary Machines, Tattoo Furniture, Sterile Gauze..."
                  className="flex-1 px-3.5 py-2 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={!newCategoryNameInput.trim()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold uppercase transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Category</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">
                New categories will appear in the shop and product forms.
              </p>
            </form>

            {/* CATEGORIES LIST */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-zinc-400 text-xs uppercase tracking-wider font-medium">
                <span>Current Categories ({inventoryCategories.length})</span>
                <span>Actions</span>
              </div>

              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {inventoryCategories.map((cat) => {
                  const count = productsList.filter(
                    (p) => p.category?.toLowerCase() === cat.toLowerCase()
                  ).length;
                  const isEditing = editingCategoryName === cat;
                  const isDeleting = deletingCategoryName === cat;

                  return (
                    <div
                      key={cat}
                      className="p-4 bg-[#12141c] border border-zinc-800 rounded-xl space-y-3 transition-colors hover:border-zinc-700"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
                        {isEditing ? (
                          <div className="flex-1 flex gap-2 w-full">
                            <input
                              type="text"
                              value={renamedCategoryValue}
                              onChange={(e) => setRenamedCategoryValue(e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-[#181a24] border border-red-500 rounded-lg text-white text-xs focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleRenameCategory(cat)}
                              disabled={categoryActionLoading}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setEditingCategoryName(null)}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-red-500/15 border border-red-500/30 text-red-300 font-bold text-xs rounded-lg uppercase">
                              {cat}
                            </span>
                            <span className="text-zinc-400 text-xs">
                              <span className="text-white font-semibold font-mono">{count}</span> {count === 1 ? 'product' : 'products'} assigned
                            </span>
                          </div>
                        )}

                        {!isEditing && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setEditingCategoryName(cat);
                                setRenamedCategoryValue(cat);
                                setDeletingCategoryName(null);
                              }}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs flex items-center gap-1 transition-colors font-medium"
                              title="Rename Category"
                            >
                              <Edit className="w-3.5 h-3.5 text-sky-400" />
                              <span>Rename</span>
                            </button>
                            <button
                              onClick={() => {
                                setDeletingCategoryName(cat);
                                setEditingCategoryName(null);
                                const other = inventoryCategories.find((c) => c !== cat) || 'Aftercare';
                                setDeleteReassignCategory(other);
                              }}
                              className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 rounded-lg text-xs flex items-center gap-1 transition-colors font-medium"
                              title="Delete / Merge Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* DELETE REASSIGNMENT PANEL */}
                      {isDeleting && (
                        <div className="p-3.5 bg-[#181a24] border border-red-900/50 rounded-lg space-y-2.5 text-xs">
                          <p className="text-zinc-300">
                            Reassign all <span className="text-red-400 font-bold font-mono">{count}</span> items currently in "{cat}" to:
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <select
                              value={deleteReassignCategory}
                              onChange={(e) => setDeleteReassignCategory(e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-[#12141c] border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500"
                            >
                              {inventoryCategories
                                .filter((c) => c !== cat)
                                .map((c) => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                ))}
                              <option value="Aftercare">Aftercare (Default)</option>
                              <option value="Hard Goods">Hard Goods</option>
                              <option value="General Merchandise">General Merchandise</option>
                            </select>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteCategory(cat)}
                                disabled={categoryActionLoading}
                                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-colors shadow-sm"
                              >
                                {categoryActionLoading ? 'Updating...' : 'Confirm & Delete'}
                              </button>
                              <button
                                onClick={() => setDeletingCategoryName(null)}
                                className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowCategoryManagerModal(false);
                  setEditingCategoryName(null);
                  setDeletingCategoryName(null);
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CLIENT DOSSIER / PROFILE DRAWER */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#181a24] border border-zinc-800 rounded-2xl p-6 space-y-5 text-xs shadow-2xl my-8">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center font-bold text-red-300 text-base">
                  {inspectUser.name ? inspectUser.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{inspectUser.name}</h3>
                  <span className="text-xs text-zinc-400">
                    Client since {new Date(inspectUser.createdAt).toLocaleDateString()} · ID: <span className="font-mono">{inspectUser.id.substring(0, 8)}...</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectUser(null)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#12141c] border border-zinc-800 rounded-xl space-y-1">
                <span className="text-[11px] text-zinc-400 uppercase font-medium">Phone &amp; WhatsApp</span>
                <div className="text-white font-semibold text-xs flex items-center justify-between font-mono">
                  <span>{inspectUser.phone}</span>
                  <button
                    onClick={() =>
                      openWhatsApp(
                        inspectUser.phone,
                        `Hello ${inspectUser.name}! This is Marvin Tattoos Atelier.`
                      )
                    }
                    className="p-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-500/15 rounded-lg border border-emerald-500/30 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-[#12141c] border border-zinc-800 rounded-xl space-y-1">
                <span className="text-[11px] text-zinc-400 uppercase font-medium">Email</span>
                <div className="text-zinc-200 text-xs truncate" title={inspectUser.email || 'None'}>
                  {inspectUser.email || 'No email provided'}
                </div>
              </div>

              <div className="p-3.5 bg-[#12141c] border border-zinc-800 rounded-xl space-y-1">
                <span className="text-[11px] text-zinc-400 uppercase font-medium">Studio Activity</span>
                <div className="text-white font-semibold text-xs font-mono">
                  {inspectUser.totalBookings || 0} Bookings · {inspectUser.totalOrders || 0} Orders
                </div>
              </div>
            </div>

            {/* Studio Notes */}
            <div className="p-4 bg-[#12141c] border border-zinc-800 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  <span>Studio Client Notes</span>
                </label>
              </div>

              <textarea
                rows={3}
                value={editingUserNotes}
                onChange={(e) => setEditingUserNotes(e.target.value)}
                placeholder="Add special client notes, tattoo preferences, allergy warnings, custom placement notes..."
                className="w-full px-3.5 py-2 bg-[#181a24] border border-zinc-700/80 rounded-lg text-white text-xs focus:outline-none focus:border-red-500 leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveUserDetails}
                  disabled={savingUser}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{savingUser ? 'Saving...' : 'Save Client Notes'}</span>
                </button>
              </div>
            </div>

            {/* Associated Bookings */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-zinc-400 text-xs uppercase tracking-wider font-medium">
                <span>Booking History ({inspectUser.bookings?.length || inspectUser.totalBookings || 0})</span>
              </div>
              {inspectUser.bookings && inspectUser.bookings.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {inspectUser.bookings.map((b: any) => (
                    <div
                      key={b.id}
                      className="p-3 bg-[#12141c] border border-zinc-800 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">
                          <span className="font-mono text-red-400">{b.referenceCode}</span> · <span className="capitalize">{b.serviceType.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {b.placement} · {new Date(b.preferredDate).toLocaleDateString()} ({b.timeSlot})
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {b.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">No bookings recorded yet.</p>
              )}
            </div>

            {/* Associated Orders */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-zinc-400 text-xs uppercase tracking-wider font-medium">
                <span>Shop Order History ({inspectUser.orders?.length || inspectUser.totalOrders || 0})</span>
              </div>
              {inspectUser.orders && inspectUser.orders.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {inspectUser.orders.map((o: any) => (
                    <div
                      key={o.id}
                      className="p-3 bg-[#12141c] border border-zinc-800 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">
                          <span className="font-mono">{o.orderNumber}</span> · <span className="text-red-400 font-mono">UGX {(o.totalAmount || 0).toLocaleString()}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          <span className="font-mono">{new Date(o.createdAt).toLocaleDateString()}</span> · {o.deliveryMethod === 'STUDIO_PICKUP' ? 'Studio Pickup' : 'Dispatch'}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          o.paymentStatus === 'SUCCESS'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {o.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">No shop orders placed yet.</p>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleDeleteClient(inspectUser.id, inspectUser.name)}
                className="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs transition-colors flex items-center gap-1.5 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Client</span>
              </button>
              <button
                type="button"
                onClick={() => setInspectUser(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs transition-colors font-medium"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
