export type PageView = 'home' | 'portfolio' | 'about' | 'booking' | 'equipment' | 'location' | 'socials' | 'aftercare';

export interface ServiceItem {
  id: string;
  disciplineNumber: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  iconName: string;
  accentColor: 'primary' | 'secondary';
  specs: {
    label: string;
    value: string;
  }[];
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
  name: string;
  title: string;
  role: string;
  avatar: string;
  experience: string;
  specialty: string;
  slotsRemaining: number;
  bio: string;
  badges: string[];
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
  category: 'Hard Goods' | 'Aftercare' | 'Needles' | 'Titanium Jewelry';
  price: number;
  description: string;
  image: string;
  accentColor: 'primary' | 'secondary';
  inStock: boolean;
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
