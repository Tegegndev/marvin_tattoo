import { BookingPayload, BookingRecord, BookingResponse } from '../types';

const STORAGE_KEY = 'marvin_tattoos_bookings_db';

// Initial pre-populated records mimicking database entries
const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'bkg-101',
    referenceCode: 'MRT-2026-8492',
    serviceType: 'custom_tattoo',
    placement: 'Forearm',
    approximateSize: 'medium',
    description: 'Dark gothic skull with intricate fine-line filigree and botanical accents.',
    artistId: 'marvin',
    preferredDate: '2026-09-19',
    preferredTimeSlot: 'afternoon',
    fullName: 'Brian Kato',
    phone: '+256 701 234567',
    email: 'brian.kato@example.com',
    notes: 'First tattoo with Marvin, looking forward to the custom stencil fitting.',
    createdAt: '2026-09-06T10:15:00.000Z',
    status: 'confirmed'
  },
  {
    id: 'bkg-102',
    referenceCode: 'MRT-2026-9134',
    serviceType: 'piercing',
    placement: 'Ear Cartilage (Helix)',
    approximateSize: 'piercing_std',
    description: 'Double helix piercing with ASTM F-136 implant-grade titanium studs.',
    artistId: 's-choi',
    preferredDate: '2026-09-20',
    preferredTimeSlot: 'morning',
    fullName: 'Sandra Nabirye',
    phone: '+256 705 748774',
    email: 'sandra.n@example.com',
    notes: 'Sensitive skin, please use anodized titanium jewelry.',
    createdAt: '2026-09-07T08:30:00.000Z',
    status: 'pending_review'
  }
];

// Helper to retrieve current mock database array
const getLocalBookings = (): BookingRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(data) as BookingRecord[];
  } catch {
    return INITIAL_BOOKINGS;
  }
};

// Helper to save records
const saveLocalBookings = (records: BookingRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to persist bookings to localStorage:', err);
  }
};

/**
 * Simulated Backend API Client for Bookings
 * Easy to replace with fetch('/api/bookings') once real backend endpoint is ready.
 */
export const bookingApi = {
  /**
   * Submit a new booking request (POST /api/bookings)
   */
  async createBooking(payload: BookingPayload): Promise<BookingResponse> {
    // 1. Simulate network latency (650ms)
    await new Promise((resolve) => setTimeout(resolve, 650));

    // 2. Validate essential fields
    if (!payload.fullName?.trim() || !payload.phone?.trim() || !payload.email?.trim()) {
      return {
        success: false,
        message: 'Validation failed: Full Name, Phone, and Email are required.',
        error: 'MISSING_REQUIRED_FIELDS'
      };
    }

    if (!payload.description?.trim()) {
      return {
        success: false,
        message: 'Validation failed: Project description is required.',
        error: 'MISSING_DESCRIPTION'
      };
    }

    // 3. Generate unique identifiers mimicking server-side ID & Reference Number
    const timestamp = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `MRT-${new Date().getFullYear()}-${randomSuffix}`;
    const id = `bkg-${Date.now()}-${randomSuffix}`;

    const newRecord: BookingRecord = {
      ...payload,
      id,
      referenceCode,
      createdAt: timestamp,
      status: 'pending_review'
    };

    // 4. Store record in mock backend database array
    const currentList = getLocalBookings();
    const updatedList = [newRecord, ...currentList];
    saveLocalBookings(updatedList);

    console.log('[Mock Backend API] POST /api/bookings - Created record:', newRecord);

    // 5. Return typed response
    return {
      success: true,
      message: 'Booking request received successfully. Studio team will review your specs.',
      booking: newRecord
    };
  },

  /**
   * Retrieve all bookings (GET /api/bookings)
   */
  async getBookings(): Promise<BookingRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getLocalBookings();
  },

  /**
   * Retrieve single booking by reference code (GET /api/bookings/:referenceCode)
   */
  async getBookingByReference(referenceCode: string): Promise<BookingRecord | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = getLocalBookings();
    return list.find((b) => b.referenceCode.toUpperCase() === referenceCode.toUpperCase()) || null;
  }
};
