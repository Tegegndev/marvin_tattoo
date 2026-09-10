import { BookingPayload, BookingRecord, BookingResponse } from '../types';
import { apiUrl } from '../config/api';

const STORAGE_KEY = 'marvin_tattoos_bookings_db';
const USER_BOOKINGS_KEY = 'marvin_user_bookings';
const LAST_BOOKING_KEY = 'marvin_last_booking';

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
    serviceType: 'body_piercing',
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

export const getLocalBookings = (): BookingRecord[] => {
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

export const getUserBookings = (): BookingRecord[] => {
  try {
    const data = localStorage.getItem(USER_BOOKINGS_KEY);
    return data ? (JSON.parse(data) as BookingRecord[]) : [];
  } catch {
    return [];
  }
};

export const getLastBooking = (): BookingRecord | null => {
  try {
    const data = localStorage.getItem(LAST_BOOKING_KEY);
    return data ? (JSON.parse(data) as BookingRecord) : null;
  } catch {
    return null;
  }
};

export const saveLocalBookings = (records: BookingRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to persist bookings to localStorage:', err);
  }
};

export const saveUserBooking = (record: BookingRecord) => {
  try {
    const userList = getUserBookings();
    const filtered = userList.filter((b) => b.referenceCode !== record.referenceCode && b.id !== record.id);
    localStorage.setItem(USER_BOOKINGS_KEY, JSON.stringify([record, ...filtered]));
    localStorage.setItem(LAST_BOOKING_KEY, JSON.stringify(record));
  } catch (err) {
    console.error('Failed to persist user booking to localStorage:', err);
  }
};

export const bookingApi = {
  async createBooking(payload: BookingPayload): Promise<BookingResponse> {
    try {
      const res = await fetch(apiUrl('/api/bookings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: payload.serviceType,
          placement: payload.placement,
          size: payload.approximateSize,
          description: payload.description,
          preferredDate: payload.preferredDate,
          timeSlot: payload.preferredTimeSlot || 'afternoon',
          clientName: payload.fullName,
          clientPhone: payload.phone,
          clientEmail: payload.email,
          notes: payload.notes || null,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const serverData = json.data;
        const newRecord: BookingRecord = {
          id: serverData.id,
          referenceCode: serverData.referenceCode,
          serviceType: serverData.serviceType,
          placement: serverData.placement,
          approximateSize: serverData.size,
          description: serverData.description,
          artistId: payload.artistId || 'marvin',
          preferredDate: serverData.preferredDate,
          preferredTimeSlot: serverData.timeSlot,
          fullName: serverData.clientName,
          phone: serverData.clientPhone,
          email: serverData.clientEmail,
          notes: serverData.notes,
          createdAt: serverData.createdAt,
          status: (serverData.status || 'pending_review').toLowerCase() as any,
          referenceFileName: payload.referenceFileName,
          referenceFilePreview: payload.referenceFilePreview,
        };

        const currentList = getLocalBookings();
        saveLocalBookings([newRecord, ...currentList]);
        saveUserBooking(newRecord);

        return {
          success: true,
          message: 'Booking request received successfully. Studio team will review your specs.',
          booking: newRecord,
        };
      }
    } catch (err) {
      console.warn('Backend /api/bookings unavailable, falling back to local simulation:', err);
    }

    // Fallback if backend offline
    if (!payload.fullName?.trim() || !payload.phone?.trim() || !payload.email?.trim()) {
      return {
        success: false,
        message: 'Validation failed: Full Name, Phone, and Email are required.',
        error: 'MISSING_REQUIRED_FIELDS',
      };
    }

    const timestamp = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `MRT-${new Date().getFullYear()}-${randomSuffix}`;
    const id = `bkg-${Date.now()}-${randomSuffix}`;

    const newRecord: BookingRecord = {
      ...payload,
      id,
      referenceCode,
      createdAt: timestamp,
      status: 'pending_review',
    };

    const currentList = getLocalBookings();
    saveLocalBookings([newRecord, ...currentList]);
    saveUserBooking(newRecord);

    return {
      success: true,
      message: 'Booking request received successfully. Studio team will review your specs.',
      booking: newRecord,
    };
  },

  async getBookings(): Promise<BookingRecord[]> {
    try {
      const res = await fetch(apiUrl('/api/bookings'));
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          return json.data.map((b: any) => ({
            id: b.id,
            referenceCode: b.referenceCode,
            serviceType: b.serviceType,
            placement: b.placement,
            approximateSize: b.size,
            description: b.description,
            artistId: 'marvin',
            preferredDate: b.preferredDate,
            preferredTimeSlot: b.timeSlot,
            fullName: b.clientName,
            phone: b.clientPhone,
            email: b.clientEmail,
            notes: b.notes,
            createdAt: b.createdAt,
            status: (b.status || 'pending_review').toLowerCase(),
          }));
        }
      }
    } catch (err) {
      console.warn('Backend getBookings fallback:', err);
    }
    return getLocalBookings();
  },

  async getBookingByReference(referenceCode: string): Promise<BookingRecord | null> {
    try {
      const res = await fetch(apiUrl(`/api/bookings/ref/${referenceCode}`));
      if (res.ok) {
        const json = await res.json();
        const b = json.data;
        if (b) {
          return {
            id: b.id,
            referenceCode: b.referenceCode,
            serviceType: b.serviceType,
            placement: b.placement,
            approximateSize: b.size,
            description: b.description,
            artistId: 'marvin',
            preferredDate: b.preferredDate,
            preferredTimeSlot: b.timeSlot,
            fullName: b.clientName,
            phone: b.clientPhone,
            email: b.clientEmail,
            notes: b.notes,
            createdAt: b.createdAt,
            status: (b.status || 'pending_review').toLowerCase(),
          };
        }
      }
    } catch (err) {
      console.warn('Backend getBookingByReference fallback:', err);
    }
    const list = getLocalBookings();
    return list.find((b) => b.referenceCode.toUpperCase() === referenceCode.toUpperCase()) || null;
  },
};
