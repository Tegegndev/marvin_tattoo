import {
  HERO_IMAGE,
  MARVIN_DIRECT_PHONE,
  PORTFOLIO_DATA,
  SERVICES_DATA,
  TESTIMONIALS_DATA,
  PRODUCTS_DATA,
  ARTISTS_DATA,
  WHATSAPP_NUMBER,
} from "../data/atelierData";
import { ArtistProfile, PortfolioPiece, ProductItem, ServiceItem, SiteSettingData, Testimonial } from "../types";
import { apiUrl, formatImageUrl } from "../config/api";


export const DEFAULT_SITE_SETTINGS: SiteSettingData = {
  id: "studio_config",
  studioName: "Marvin Tattoo Studio",
  heroStatement: "Clean Lines. Heavy Blackwork. Made to Age Well.",
  heroSubtext:
    "Kampala's premier sanctuary for bespoke dark realism, clean fine-line, and custom body art. 14+ years of master craft.",
  heroBannerUrl: HERO_IMAGE,
  heroPortraitUrl: "/images/marvin-founder.png",
  heroOpacity: 0.45,
  announcementActive: false,
  announcementText: null,
  primaryPhone: MARVIN_DIRECT_PHONE,
  whatsappNumber: "+256705748774",
  contactEmail: "info@marvintattoos.com",
  physicalAddress: "New Pioneer Mall, Shop No. Pi55, Level 5, Burton Street, Kampala",
  googleMapsUrl: "https://maps.google.com/?q=New+Pioneer+Mall+Kampala",
  openingHours: [
    { day: "Monday - Saturday", hours: "10:00 AM - 8:00 PM" },
    { day: "Sunday", hours: "By Appointment Only" },
  ],
  logoUrl: "/logo.svg",
  metaTitle: "Marvin Tattoos & Piercing Atelier | Kampala, Uganda",
  metaDescription:
    "Kampala's premier sanctuary for bespoke dark realism, clean fine-line, and custom body art. 14+ years of master craft.",
  ogImageUrl: "",
  socialLinks: [
    {
      id: "soc-1",
      platform: "instagram",
      label: "Instagram (@Marvintattoos256)",
      url: "https://instagram.com/Marvintattoos256",
      icon: "instagram",
      active: true,
    },
    {
      id: "soc-2",
      platform: "tiktok",
      label: "TikTok (@Marvintattoos256)",
      url: "https://tiktok.com/@Marvintattoos256",
      icon: "tiktok",
      active: true,
    },
    {
      id: "soc-3",
      platform: "whatsapp",
      label: "WhatsApp",
      url: "https://wa.me/256705748774",
      icon: "whatsapp",
      active: true,
    },
    {
      id: "soc-4",
      platform: "facebook",
      label: "Facebook",
      url: "https://facebook.com/marvintattoosug",
      icon: "facebook",
      active: true,
    },
    {
      id: "soc-5",
      platform: "maps",
      label: "Google Maps",
      url: "https://maps.google.com/?q=New+Pioneer+Mall+Kampala",
      icon: "map-pin",
      active: true,
    },
  ],
};

// ================= PUBLIC FETCHERS ================= //

export async function fetchSiteSettings(): Promise<SiteSettingData> {
  try {
    const res = await fetch(apiUrl("/api/settings"));
    if (!res.ok) throw new Error("Failed to fetch site settings");
    const json = await res.json();
    const data = json.data || DEFAULT_SITE_SETTINGS;
    return {
      ...data,
      heroBannerUrl: formatImageUrl(data.heroBannerUrl) || DEFAULT_SITE_SETTINGS.heroBannerUrl,
    };
  } catch (err) {
    console.warn("Using default static site settings fallback:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function fetchPortfolioPieces(serviceId?: string): Promise<PortfolioPiece[]> {
  try {
    const path = serviceId && serviceId !== "all" 
      ? `/api/portfolio?serviceId=${encodeURIComponent(serviceId)}` 
      : "/api/portfolio";
    const res = await fetch(apiUrl(path));
    if (!res.ok) throw new Error("Failed to fetch portfolio");
    const json = await res.json();
    if (json.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((p: any) => ({
        id: p.id,
        title: p.title,
        serviceId: p.serviceId || undefined,
        service: p.service || undefined,
        category: p.category,
        categoryLabel: p.categoryLabel || p.category,
        artist: p.artist || "Marvin",
        healingState: p.healingState || "Masterpiece",
        cycle: p.cycle || "healed",
        zone: p.zone || "General",
        morphology: p.morphology || p.zone || "General",
        flashId: p.flashId || "",
        image: formatImageUrl(p.imageUrl || p.image || ""),
        imageUrl: formatImageUrl(p.imageUrl || p.image || ""),
        description: p.description,
        duration: p.duration || "Custom Session",
        pigment: p.pigment || "Dynamic Triple Black",
        featured: Boolean(p.featured),
        sortOrder: p.sortOrder || 0,
      }));
    }
    return PORTFOLIO_DATA;
  } catch (err) {
    console.warn("Using default static portfolio fallback:", err);
    return PORTFOLIO_DATA;
  }
}

export async function fetchServices(): Promise<ServiceItem[]> {
  try {
    const res = await fetch(apiUrl("/api/services"));
    if (!res.ok) throw new Error("Failed to fetch services");
    const json = await res.json();
    if (json.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((s: any) => ({
        id: s.id,
        disciplineNumber: s.disciplineNumber,
        title: s.title,
        subtitle: s.subtitle,
        description: s.description,
        longDescription: s.longDescription || s.description,
        category: s.category || "TATTOO",
        image: formatImageUrl(s.imageUrl || "/images/portfolio/portrait-elder-woman.png"),
        imageUrl: formatImageUrl(s.imageUrl),
        iconName: s.iconName || "skull",
        accentColor: s.accentColor || "primary",
        specs: s.specs || [],
        processSteps: s.processSteps || [],
        pricingTiers: s.pricingTiers || [],
        faqs: s.faqs || [],
        prepGuidelines: s.prepGuidelines || [],
        aftercareGuidelines: s.aftercareGuidelines || [],
        galleryImages: s.galleryImages || [],
        sortOrder: s.sortOrder || 0,
      }));
    }
    return SERVICES_DATA;
  } catch (err) {
    console.warn("Using default static services fallback:", err);
    return SERVICES_DATA;
  }
}

export async function adminGetServices(): Promise<ServiceItem[]> {
  const res = await fetch(apiUrl("/api/services"), {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to fetch services");
  return (json.data || []).map((s: any) => ({
    id: s.id,
    disciplineNumber: s.disciplineNumber,
    title: s.title,
    subtitle: s.subtitle,
    description: s.description,
    longDescription: s.longDescription || s.description,
    category: s.category || "TATTOO",
    image: formatImageUrl(s.imageUrl || "/images/portfolio/portrait-elder-woman.png"),
    imageUrl: formatImageUrl(s.imageUrl),
    iconName: s.iconName || "skull",
    accentColor: s.accentColor || "primary",
    specs: s.specs || [],
    processSteps: s.processSteps || [],
    pricingTiers: s.pricingTiers || [],
    faqs: s.faqs || [],
    prepGuidelines: s.prepGuidelines || [],
    aftercareGuidelines: s.aftercareGuidelines || [],
    galleryImages: s.galleryImages || [],
    sortOrder: s.sortOrder || 0,
  }));
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(apiUrl("/api/reviews"));
    const response = res.ok ? res : await fetch(apiUrl("/api/testimonials"));
    if (!response.ok) throw new Error("Failed to fetch reviews");
    const json = await response.json();
    if (json.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((t: any) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        stars: t.stars,
        quote: t.quote,
        avatar:
          t.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      }));
    }
    return TESTIMONIALS_DATA;
  } catch (err) {
    console.warn("Using default static testimonials fallback:", err);
    return TESTIMONIALS_DATA;
  }
}

export const fetchReviews = fetchTestimonials;

export async function fetchMembers(activeOnly: boolean = true): Promise<ArtistProfile[]> {
  try {
    const res = await fetch(apiUrl(`/api/members${activeOnly ? "?active=true" : ""}`));
    if (!res.ok) throw new Error("Failed to fetch team members");
    const json = await res.json();
    if (json.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((m: any) => ({
        id: m.slug || m.id,
        slug: m.slug,
        name: m.name,
        title: m.title,
        role: m.role || m.title,
        avatar: formatImageUrl(m.avatar || "/images/marvin-founder.png"),
        experience: m.experience || "1+ Years",
        specialty: m.specialty || "Custom Artistry",
        slotsRemaining: m.slotsRemaining ?? 4,
        bio: m.bio,
        badges: Array.isArray(m.badges) ? m.badges : [],
        instagram: m.instagram,
        active: m.active !== false,
        sortOrder: m.sortOrder || 0,
      }));
    }
    return ARTISTS_DATA;
  } catch (err) {
    console.warn("Using default static artists fallback:", err);
    return ARTISTS_DATA;
  }
}

export const fetchArtists = fetchMembers;


export async function fetchProducts(): Promise<ProductItem[]> {
  try {
    const res = await fetch(apiUrl("/api/products"));
    if (!res.ok) throw new Error("Failed to fetch products");
    const json = await res.json();
    if (json.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((p: any) => {
        let specs: string[] = [];
        if (Array.isArray(p.specs)) {
          specs = p.specs;
        } else if (typeof p.specs === "string") {
          try {
            const parsed = JSON.parse(p.specs);
            specs = Array.isArray(parsed) ? parsed : [p.specs];
          } catch {
            specs = p.specs ? [p.specs] : [];
          }
        }
        return {
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          currency: p.currency || "UGX",
          description: p.description,
          image: formatImageUrl(p.imageUrl || p.image || "/images/default-product.png"),
          accentColor: "primary",
          inStock: Boolean(p.inStock !== false && (p.stockCount === undefined || p.stockCount > 0)),
          stockCount: p.stockCount ?? 10,
          specs,
        };
      });
    }
    return PRODUCTS_DATA;
  } catch (err) {
    console.warn("Using default static products fallback:", err);
    return PRODUCTS_DATA;
  }
}

// ================= SHOP & PAYMENT APIS (WITH LOCALSTORAGE) ================= //

const ORDERS_STORAGE_KEY = "marvin_tattoos_orders_db";
const USER_ORDERS_KEY = "marvin_user_orders";
const LAST_ORDER_KEY = "marvin_last_order";

export function getLocalOrders(): any[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getUserOrders(): any[] {
  try {
    const raw = localStorage.getItem(USER_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getLastOrder(): any | null {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalOrder(order: any): void {
  try {
    const list = getLocalOrders();
    const filtered = list.filter((o) => o.orderNumber !== order.orderNumber && o.id !== order.id);
    const updated = [order, ...filtered];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));

    // Also persist to user's order history
    const userList = getUserOrders();
    const userFiltered = userList.filter((o: any) => o.orderNumber !== order.orderNumber && o.id !== order.id);
    localStorage.setItem(USER_ORDERS_KEY, JSON.stringify([order, ...userFiltered]));
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch (err) {
    console.error("Failed to persist order to localStorage:", err);
  }
}

export function getLocalOrderByNumber(orderNumber: string): any | null {
  const clean = orderNumber.trim().toUpperCase();
  const list = getLocalOrders();
  return (
    list.find(
      (o) =>
        (o.orderNumber && o.orderNumber.toUpperCase() === clean) ||
        (o.id && o.id.toUpperCase() === clean)
    ) || null
  );
}

export async function createShopOrder(orderData: {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  deliveryMethod: "STUDIO_PICKUP" | "KAMPALA_DISPATCH";
  deliveryAddress?: string;
  deliveryNotes?: string;
  paymentMethod: "MTN_MOMO" | "AIRTEL_MONEY" | "CARD" | "CASH";
  items: Array<{ productId: string; quantity: number }>;
}): Promise<any> {
  // Try backend first
  try {
    const res = await fetch(apiUrl("/api/orders"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        saveLocalOrder(json.data);
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Backend /api/orders unavailable, persisting order to localStorage:", err);
  }

  // Fallback: create structured local order
  const timestamp = new Date().toISOString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `ORD-${new Date().getFullYear()}-${randomSuffix}`;
  const id = `ord-${Date.now()}-${randomSuffix}`;

  // Find product details
  const populatedItems = orderData.items.map((item) => {
    const prod = PRODUCTS_DATA.find((p) => p.id === item.productId);
    return {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: prod?.price || 0,
      product: prod
        ? {
            id: prod.id,
            name: prod.name,
            category: prod.category,
            price: prod.price,
            imageUrl: prod.image,
          }
        : undefined,
    };
  });

  const subtotal = populatedItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const dispatchFee = orderData.deliveryMethod === "KAMPALA_DISPATCH" ? 10000 : 0;
  const totalAmount = subtotal + dispatchFee;

  const directWhatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Marvin Tattoos Atelier! I just placed Order #${orderNumber} for UGX ${totalAmount.toLocaleString()} (${orderData.paymentMethod.replace(
      "_",
      " "
    )}).\nClient: ${orderData.clientName} (${orderData.clientPhone})\nFulfillment: ${
      orderData.deliveryMethod === "STUDIO_PICKUP" ? "Studio Pickup" : `Dispatch to ${orderData.deliveryAddress}`
    }`
  )}`;

  const localOrder = {
    id,
    orderNumber,
    clientName: orderData.clientName,
    clientPhone: orderData.clientPhone,
    clientEmail: orderData.clientEmail,
    deliveryMethod: orderData.deliveryMethod,
    deliveryAddress: orderData.deliveryAddress,
    deliveryNotes: orderData.deliveryNotes,
    paymentMethod: orderData.paymentMethod,
    paymentStatus: orderData.paymentMethod === "CASH" ? "PENDING" : "AUTHORIZED",
    orderStatus: "PROCESSING",
    items: populatedItems,
    subtotal,
    dispatchFee,
    totalAmount,
    directWhatsAppUrl,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  saveLocalOrder(localOrder);
  return localOrder;
}

export async function trackOrder(orderNumber: string): Promise<any> {
  const cleanNumber = encodeURIComponent(orderNumber.trim().toUpperCase());
  try {
    const res = await fetch(apiUrl(`/api/orders/track/${cleanNumber}`));
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        saveLocalOrder(json.data);
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Backend /api/orders/track unavailable, checking localStorage:", err);
  }

  // Check localStorage
  const localMatch = getLocalOrderByNumber(orderNumber);
  if (localMatch) {
    return localMatch;
  }

  throw new Error("Order not found. Please verify your reference number.");
}

export async function initializePayment(data: {
  orderId?: string;
  orderNumber?: string;
  paymentMethod: "MTN_MOMO" | "AIRTEL_MONEY" | "CARD";
  phoneNumber: string;
}): Promise<{
  transactionId?: string;
  merchantTxRef?: string;
  uuid?: string;
  status?: string;
  instruction?: string;
  authUrl?: string | null;
  isSandbox?: boolean;
  paymentMethod?: string;
}> {
  try {
    const res = await fetch(apiUrl("/api/payments/initialize"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    } else {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || `Payment request failed with status ${res.status}`);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes("Failed to fetch") && !err.message.includes("NetworkError")) {
      throw err;
    }
    console.warn("Backend /api/payments/initialize offline, fallback to simulated prompt:", err);
  }

  const promptText =
    data.paymentMethod === "MTN_MOMO"
      ? `A USSD push notification has been sent to ${data.phoneNumber}. Please enter your MTN MoMo PIN to complete payment.`
      : data.paymentMethod === "AIRTEL_MONEY"
      ? `An Airtel Money prompt has been sent to ${data.phoneNumber}. Please authorize the transaction on your handset.`
      : `Payment gateway initialized for Card checkout. Please complete authorization.`;

  // Update order in local storage if present
  if (data.orderNumber) {
    const order = getLocalOrderByNumber(data.orderNumber);
    if (order) {
      order.paymentStatus = "AUTHORIZED";
      saveLocalOrder(order);
    }
  }

  return {
    merchantTxRef: `TX-LOCAL-${Date.now()}`,
    status: "PENDING",
    instruction: promptText,
    isSandbox: true,
  };
}

export async function verifyPayment(txRef: string): Promise<{
  status: "SUCCESS" | "PROCESSING" | "FAILED" | "PENDING";
  paidAt?: string;
  orderNumber?: string;
  providerTxId?: string;
  isMock?: boolean;
}> {
  try {
    const res = await fetch(apiUrl(`/api/payments/verify/${txRef}`));
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Backend /api/payments/verify fallback:", err);
  }
  return {
    status: "SUCCESS",
    paidAt: new Date().toISOString(),
    isMock: true,
  };
}

// ================= AUTH TOKEN HELPERS ================= //

const TOKEN_KEY = "marvin_atelier_jwt_token";

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.error("Failed to store token in localStorage:", err);
  }
}

export function clearAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.error("Failed to clear token from localStorage:", err);
  }
}

function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extraHeaders };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ================= ADMIN AUTH & CMS APIS ================= //

export async function adminLogin(email: string, password: string): Promise<any> {
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Login failed");
  }
  if (json.token) {
    setAuthToken(json.token);
  }
  return {
    user: json.user,
    token: json.token,
  };
}

export async function adminLogout(): Promise<void> {
  clearAuthToken();
  try {
    await fetch(apiUrl("/api/auth/logout"), {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
    });
  } catch (err) {
    console.warn("Logout error:", err);
  }
}

export async function adminGetMe(): Promise<any> {
  const res = await fetch(apiUrl("/api/auth/me"), {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Unauthorized");
  const json = await res.json();
  if (!json.success || !json.user) throw new Error("Unauthorized");
  return json.user;
}

export async function adminChangePassword(currentPassword: string, newPassword: string): Promise<any> {
  const res = await fetch(apiUrl("/api/auth/change-password"), {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update password");
  }
  return json;
}


export async function adminGetBookings(status?: string, search?: string): Promise<any[]> {
  const params = new URLSearchParams();
  if (status && status !== "ALL") params.append("status", status);
  if (search) params.append("search", search);
  const res = await fetch(apiUrl(`/api/bookings?${params.toString()}`), {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  return json.data || [];
}

export async function adminUpdateBooking(id: string, data: any): Promise<any> {
  const res = await fetch(apiUrl(`/api/bookings/${id}`), {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update booking");
  }
  return json.data;
}

export async function adminDeleteBooking(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/bookings/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to delete booking");
  }
}

export async function adminGetOrders(orderStatus?: string, paymentStatus?: string, search?: string): Promise<any[]> {
  const params = new URLSearchParams();
  if (orderStatus && orderStatus !== "ALL") params.append("orderStatus", orderStatus);
  if (paymentStatus && paymentStatus !== "ALL") params.append("paymentStatus", paymentStatus);
  if (search) params.append("search", search);
  const res = await fetch(apiUrl(`/api/orders?${params.toString()}`), {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  return json.data || [];
}

export async function adminUpdateOrder(id: string, data: any): Promise<any> {
  const res = await fetch(apiUrl(`/api/orders/${id}`), {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update order");
  }
  return json.data;
}

export async function adminDeleteOrder(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/orders/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to delete order");
  }
}

export async function adminUpdateSettings(data: Partial<SiteSettingData>): Promise<SiteSettingData> {
  const res = await fetch(apiUrl("/api/settings"), {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update settings");
  }
  return json.data;
}

export async function adminUploadHeroImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("heroImage", file);
  const res = await fetch(apiUrl("/api/settings/hero-image"), {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to upload hero image");
  }
  return formatImageUrl(json.heroBannerUrl || json.imageUrl);
}

export async function adminUploadHeroPortrait(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("heroPortrait", file);
  const res = await fetch(apiUrl("/api/settings/hero-portrait"), {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to upload founder portrait");
  }
  return formatImageUrl(json.heroPortraitUrl || json.imageUrl);
}

export async function adminUploadLogo(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("logo", file);
  const res = await fetch(apiUrl("/api/settings/logo"), {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to upload logo");
  }
  return formatImageUrl(json.logoUrl || json.imageUrl);
}

export async function adminUploadOgImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("ogImage", file);
  const res = await fetch(apiUrl("/api/settings/og-image"), {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to upload social share image");
  }
  return formatImageUrl(json.ogImageUrl || json.imageUrl);
}

export async function adminCreatePortfolioPiece(formData: FormData): Promise<any> {
  const res = await fetch(apiUrl("/api/portfolio"), {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to create piece");
  return json.data;
}

export async function adminUpdatePortfolioPiece(id: string, formData: FormData): Promise<any> {
  const res = await fetch(apiUrl(`/api/portfolio/${id}`), {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to update piece");
  return json.data;
}

export async function adminDeletePortfolioPiece(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/portfolio/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to delete piece");
}

export async function adminCreateProduct(formData: FormData): Promise<any> {
  const res = await fetch(apiUrl("/api/products"), {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to create product");
  return json.data;
}

export async function adminUpdateProduct(id: string, formData: FormData): Promise<any> {
  const res = await fetch(apiUrl(`/api/products/${id}`), {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to update product");
  return json.data;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/products/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to delete product");
}

export async function adminRenameProductCategory(oldCategory: string, newCategory: string): Promise<any> {
  const res = await fetch(apiUrl("/api/products/categories/rename"), {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify({ oldCategory, newCategory }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to rename category");
  return json;
}

export async function adminDeleteProductCategory(category: string, fallbackCategory?: string): Promise<any> {
  const res = await fetch(apiUrl("/api/products/categories/delete"), {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify({ category, fallbackCategory }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to delete category");
  return json;
}

export async function adminCreateService(formData: FormData): Promise<any> {
  const res = await fetch(apiUrl("/api/services"), {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to create service");
  return json.data;
}

export async function adminUpdateService(id: string, formData: FormData): Promise<any> {
  const res = await fetch(apiUrl(`/api/services/${id}`), {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to update service");
  return json.data;
}

export async function adminDeleteService(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/services/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to delete service");
}

export async function adminCreateTestimonial(data: any): Promise<any> {
  const res = await fetch(apiUrl("/api/testimonials"), {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to create testimonial");
  return json.data;
}

export async function adminUpdateTestimonial(id: string, data: any): Promise<any> {
  const res = await fetch(apiUrl(`/api/testimonials/${id}`), {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to update testimonial");
  return json.data;
}

export async function adminDeleteTestimonial(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/testimonials/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to delete testimonial");
}

// ================= ADMIN USERS / CLIENTS CRM ================= //

export async function adminGetUsers(search?: string): Promise<any[]> {
  const params = new URLSearchParams();
  if (search) params.append("search", search);

  const url = `/api/users${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await fetch(apiUrl(url), {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to fetch users");
  return json.data || [];
}

export async function adminGetUserById(id: string): Promise<any> {
  const res = await fetch(apiUrl(`/api/users/${id}`), {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to fetch user");
  return json.data;
}

export async function adminUpdateUser(id: string, data: any): Promise<any> {
  const res = await fetch(apiUrl(`/api/users/${id}`), {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to update user profile");
  return json.data;
}

export async function adminDeleteUser(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/users/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to delete user");
}

export async function adminSyncLegacyUsers(): Promise<any> {
  const res = await fetch(apiUrl("/api/users/sync-legacy"), {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to sync legacy users");
  return json;
}

// ================= ADMIN MEMBERS / TEAM APIS ================= //

export async function adminGetMembers(search?: string): Promise<ArtistProfile[]> {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  const url = `/api/members${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await fetch(apiUrl(url), {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to fetch team members");
  return (json.data || []).map((m: any) => ({
    id: m.id,
    slug: m.slug,
    name: m.name,
    title: m.title,
    role: m.role || m.title,
    avatar: formatImageUrl(m.avatar || "/images/marvin-founder.png"),
    experience: m.experience || "1+ Years",
    specialty: m.specialty || "Custom Artistry",
    slotsRemaining: m.slotsRemaining ?? 4,
    bio: m.bio,
    badges: Array.isArray(m.badges) ? m.badges : [],
    instagram: m.instagram,
    active: m.active !== false,
    sortOrder: m.sortOrder || 0,
  }));
}

export async function adminCreateMember(formData: FormData): Promise<any> {
  const res = await fetch(apiUrl("/api/members"), {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to add team member");
  return json.data;
}

export async function adminUpdateMember(id: string, formData: FormData): Promise<any> {
  const res = await fetch(apiUrl(`/api/members/${id}`), {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to update team member");
  return json.data;
}

export async function adminDeleteMember(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/members/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to delete team member");
}
