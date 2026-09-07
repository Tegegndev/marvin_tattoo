import {
  HERO_IMAGE,
  MARVIN_DIRECT_PHONE,
  PORTFOLIO_DATA,
  SERVICES_DATA,
  TESTIMONIALS_DATA,
  PRODUCTS_DATA,
} from "../data/atelierData";
import { PortfolioPiece, ProductItem, ServiceItem, SiteSettingData, Testimonial } from "../types";

export const DEFAULT_SITE_SETTINGS: SiteSettingData = {
  id: "studio_config",
  studioName: "Marvin Tattoos & Piercing Atelier",
  heroStatement: "Clean Lines. Heavy Blackwork. Made to Age Well.",
  heroSubtext:
    "Kampala's premier sanctuary for bespoke dark realism, clinical titanium piercings, and aesthetic PMU. 14+ years of master craft.",
  heroBannerUrl: HERO_IMAGE,
  heroOpacity: 0.45,
  announcementActive: false,
  announcementText: null,
  primaryPhone: MARVIN_DIRECT_PHONE,
  whatsappNumber: "+256705748774",
  contactEmail: "info@marvintattoos.com",
  physicalAddress: "Level 5, New Pioneer Mall, Burton St, Kampala, Uganda",
  googleMapsUrl: "https://maps.google.com/?q=New+Pioneer+Mall+Kampala",
  openingHours: [
    { day: "Monday - Saturday", hours: "10:00 AM - 8:00 PM" },
    { day: "Sunday", hours: "By Appointment Only" },
  ],
  socialLinks: [
    {
      id: "soc-1",
      platform: "instagram",
      label: "Instagram",
      url: "https://instagram.com/marvin_tattoos",
      icon: "instagram",
      active: true,
    },
    {
      id: "soc-2",
      platform: "tiktok",
      label: "TikTok",
      url: "https://tiktok.com/@marvintattoos",
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
    const res = await fetch("/api/settings");
    if (!res.ok) throw new Error("Failed to fetch site settings");
    const json = await res.json();
    return json.data || DEFAULT_SITE_SETTINGS;
  } catch (err) {
    console.warn("Using default static site settings fallback:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function fetchPortfolioPieces(): Promise<PortfolioPiece[]> {
  try {
    const res = await fetch("/api/portfolio");
    if (!res.ok) throw new Error("Failed to fetch portfolio");
    const json = await res.json();
    if (json.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((p: any) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        categoryLabel: p.categoryLabel || p.category,
        artist: "Marvin",
        healingState: "Masterpiece",
        cycle: "healed",
        zone: p.zone || "General",
        flashId: p.flashId || "",
        image: p.imageUrl,
        description: p.description,
        duration: p.duration,
        pigment: p.pigment,
        featured: p.featured,
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
    const res = await fetch("/api/services");
    if (!res.ok) throw new Error("Failed to fetch services");
    const json = await res.json();
    if (json.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((s: any) => ({
        id: s.id,
        disciplineNumber: s.disciplineNumber,
        title: s.title,
        subtitle: s.subtitle,
        description: s.description,
        image: s.imageUrl,
        iconName: s.iconName,
        accentColor: "primary",
        specs: s.specs || [],
      }));
    }
    return SERVICES_DATA;
  } catch (err) {
    console.warn("Using default static services fallback:", err);
    return SERVICES_DATA;
  }
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch("/api/testimonials");
    if (!res.ok) throw new Error("Failed to fetch testimonials");
    const json = await res.json();
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

export async function fetchProducts(): Promise<ProductItem[]> {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    const json = await res.json();
    if (json.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        description: p.description,
        image: p.imageUrl,
        accentColor: "primary",
        inStock: p.inStock,
        specs: Array.isArray(p.specs) ? p.specs : [],
      }));
    }
    return PRODUCTS_DATA;
  } catch (err) {
    console.warn("Using default static products fallback:", err);
    return PRODUCTS_DATA;
  }
}

// ================= SHOP & PAYMENT APIS ================= //

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
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to create order");
  }
  return json.data;
}

export async function initializePayment(data: {
  orderId?: string;
  orderNumber?: string;
  paymentMethod: "MTN_MOMO" | "AIRTEL_MONEY" | "CARD";
  phoneNumber: string;
}): Promise<any> {
  const res = await fetch("/api/payments/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to initialize payment");
  }
  return json.data;
}

export async function verifyPayment(txRef: string): Promise<any> {
  const res = await fetch(`/api/payments/verify/${txRef}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to verify payment");
  }
  return json.data;
}

// ================= ADMIN AUTH & CMS APIS ================= //

export async function adminLogin(email: string, password: string): Promise<any> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Login failed");
  }
  return json.data;
}

export async function adminLogout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function adminGetMe(): Promise<any> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) throw new Error("Unauthorized");
  const json = await res.json();
  return json.data;
}

export async function adminGetBookings(status?: string, search?: string): Promise<any[]> {
  const params = new URLSearchParams();
  if (status && status !== "ALL") params.append("status", status);
  if (search) params.append("search", search);
  const res = await fetch(`/api/bookings?${params.toString()}`);
  const json = await res.json();
  return json.data || [];
}

export async function adminUpdateBooking(id: string, data: any): Promise<any> {
  const res = await fetch(`/api/bookings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function adminDeleteBooking(id: string): Promise<void> {
  await fetch(`/api/bookings/${id}`, { method: "DELETE" });
}

export async function adminGetOrders(orderStatus?: string, paymentStatus?: string, search?: string): Promise<any[]> {
  const params = new URLSearchParams();
  if (orderStatus && orderStatus !== "ALL") params.append("orderStatus", orderStatus);
  if (paymentStatus && paymentStatus !== "ALL") params.append("paymentStatus", paymentStatus);
  if (search) params.append("search", search);
  const res = await fetch(`/api/orders?${params.toString()}`);
  const json = await res.json();
  return json.data || [];
}

export async function adminUpdateOrder(id: string, data: any): Promise<any> {
  const res = await fetch(`/api/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function adminDeleteOrder(id: string): Promise<void> {
  await fetch(`/api/orders/${id}`, { method: "DELETE" });
}

export async function adminUpdateSettings(data: Partial<SiteSettingData>): Promise<SiteSettingData> {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function adminUploadHeroImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("heroImage", file);
  const res = await fetch("/api/settings/hero-image", {
    method: "POST",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to upload hero image");
  }
  return json.imageUrl;
}

export async function adminCreatePortfolioPiece(formData: FormData): Promise<any> {
  const res = await fetch("/api/portfolio", {
    method: "POST",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to create piece");
  return json.data;
}

export async function adminUpdatePortfolioPiece(id: string, formData: FormData): Promise<any> {
  const res = await fetch(`/api/portfolio/${id}`, {
    method: "PUT",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to update piece");
  return json.data;
}

export async function adminDeletePortfolioPiece(id: string): Promise<void> {
  await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
}
