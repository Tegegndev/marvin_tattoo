export type PageView = 'home' | 'portfolio' | 'about' | 'booking' | 'equipment' | 'location' | 'socials';

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

export interface BookingFormData {
  discipline: string;
  zone: string;
  dimension: string;
  styleTags: string[];
  narrative: string;
  selectedFlashId?: string;
  artist: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  termsAccepted: boolean;
}
