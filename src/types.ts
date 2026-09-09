export type PageView = 'home' | 'services' | 'service-detail' | 'portfolio' | 'about' | 'booking' | 'equipment' | 'location' | 'socials' | 'aftercare' | 'admin';

export interface ServiceProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ServicePricingTier {
  tier: string;
  price: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  disciplineNumber: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  category?: 'TATTOO' | 'PMU' | 'PIERCING' | 'REMOVAL' | string;
  image: string;
  imageUrl?: string;
  iconName: string;
  accentColor?: 'primary' | 'secondary' | string;
  specs: {
    label: string;
    value: string;
  }[];
  processSteps?: ServiceProcessStep[];
  pricingTiers?: ServicePricingTier[];
  faqs?: ServiceFAQ[];
  prepGuidelines?: string[];
  aftercareGuidelines?: string[];
  galleryImages?: string[];
  sortOrder?: number;
}

export interface PortfolioPiece {
  id: string;
  title: string;
  category: 'dark-realism' | 'neo-traditional' | 'micro-detail' | 'piercing' | 'coverup';
  categoryLabel: string;
  artist: string;
  healingState: string;
  cycle: 'all' | 'healed' | 'fresh';
  zone: string;
  flashId: string;
  image: string;
  description: string;
  duration?: string;
  pigment?: string;
  morphology?: string;
  featured?: boolean;
}

export interface ArtistProfile {
  id: string;
  slug?: string;
  name: string;
  title: string;
  role: string;
  avatar: string;
  experience: string;
  specialty: string;
  slotsRemaining: number;
  bio: string;
  badges: string[];
  instagram?: string | null;
  active?: boolean;
  sortOrder?: number;
}


export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stars: number;
  quote: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'Hard Goods' | 'Aftercare' | 'Needles' | 'Titanium Jewelry' | string;
  price: number;
  currency?: string;
  description: string;
  image: string;
  accentColor?: 'primary' | 'secondary';
  inStock: boolean;
  stockCount?: number;
  specs: string[];
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export type BookingServiceType = 
  | 'custom_tattoo' 
  | 'realism_portrait'
  | 'fine_line'
  | 'lettering_script'
  | 'tribal_traditional'
  | 'cover_up' 
  | 'pmu_makeup'
  | 'body_piercing' 
  | 'laser_removal'
  | 'keloid_removal';
export type BookingSize = 'small' | 'medium' | 'large' | 'full_day' | 'piercing_std';
export type BookingTimeSlot = 'morning' | 'afternoon' | 'evening';
export type BookingStatus = 'pending_review' | 'confirmed' | 'rescheduled' | 'cancelled';

export interface BookingPayload {
  serviceType: BookingServiceType;
  placement: string;
  approximateSize: BookingSize;
  description: string;
  artistId: string;
  preferredDate: string;
  preferredTimeSlot: BookingTimeSlot;
  fullName: string;
  phone: string;
  email: string;
  notes?: string;
  referenceFileName?: string;
  referenceFilePreview?: string;
}

export interface BookingRecord extends BookingPayload {
  id: string;
  referenceCode: string;
  createdAt: string;
  status: BookingStatus;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking?: BookingRecord;
  error?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
  active: boolean;
}

export interface SiteSettingData {
  id: string;
  studioName: string;
  heroStatement: string;
  heroSubtext: string;
  heroBannerUrl: string;
  heroOpacity: number;
  announcementActive: boolean;
  announcementText?: string | null;
  primaryPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  physicalAddress: string;
  googleMapsUrl: string;
  openingHours: { day: string; hours: string }[];
  socialLinks: SocialLink[];
}

export interface ClientUserData {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  lastActive?: string | Date;
  totalBookings: number;
  totalOrders: number;
  bookings?: any[];
  orders?: any[];
}

