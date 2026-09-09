import { prisma } from '../config/database.js';

export interface UpsertUserParams {
  name: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
}

/**
 * Normalizes phone numbers (removes extraneous spaces and formatting)
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.trim().replace(/[\s\-()]/g, '');
}

/**
 * Upsert a User (Client) record whenever a booking or order is created.
 * Uses phone as the primary key.
 */
export async function upsertUserOnAction(params: UpsertUserParams) {
  const cleanPhone = normalizePhoneNumber(params.phone);
  if (!cleanPhone) return null;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (existingUser) {
      // Update details if improved or new email provided
      const updateData: any = {};
      if (params.name && params.name.trim() && params.name.trim() !== 'Guest' && params.name.trim() !== existingUser.name) {
        updateData.name = params.name.trim();
      }
      if (params.email && params.email.trim() && (!existingUser.email || existingUser.email !== params.email.trim())) {
        updateData.email = params.email.trim();
      }
      if (params.notes && params.notes.trim()) {
        const combinedNotes = existingUser.notes
          ? `${existingUser.notes}\n[Update]: ${params.notes.trim()}`
          : params.notes.trim();
        updateData.notes = combinedNotes;
      }

      if (Object.keys(updateData).length > 0) {
        return await prisma.user.update({
          where: { phone: cleanPhone },
          data: updateData,
        });
      }
      return existingUser;
    }

    // Create brand new User record with phone as PK
    return await prisma.user.create({
      data: {
        phone: cleanPhone,
        name: params.name?.trim() || 'Client',
        email: params.email?.trim() || null,
        notes: params.notes?.trim() || null,
      },
    });
  } catch (error) {
    console.error('upsertUserOnAction error:', error);
    return null;
  }
}

/**
 * Sync / feed historical bookings and shop orders into the User table,
 * linking foreign keys (userPhone) automatically.
 */
export async function syncHistoricalUsers() {
  try {
    const allBookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'asc' },
    });

    const allOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'asc' },
    });

    let syncedUsers = 0;
    let syncedBookings = 0;
    let syncedOrders = 0;

    for (const b of allBookings) {
      const cleanPhone = normalizePhoneNumber(b.clientPhone);
      if (cleanPhone) {
        const user = await upsertUserOnAction({
          name: b.clientName,
          phone: cleanPhone,
          email: b.clientEmail,
          notes: b.notes,
        });
        if (user) {
          syncedUsers++;
          if (b.userPhone !== cleanPhone) {
            await prisma.booking.update({
              where: { id: b.id },
              data: { userPhone: cleanPhone },
            });
            syncedBookings++;
          }
        }
      }
    }

    for (const o of allOrders) {
      const cleanPhone = normalizePhoneNumber(o.clientPhone);
      if (cleanPhone) {
        const user = await upsertUserOnAction({
          name: o.clientName,
          phone: cleanPhone,
          email: o.clientEmail,
          notes: o.deliveryNotes,
        });
        if (user) {
          syncedUsers++;
          if (o.userPhone !== cleanPhone) {
            await prisma.order.update({
              where: { id: o.id },
              data: { userPhone: cleanPhone },
            });
            syncedOrders++;
          }
        }
      }
    }

    return {
      syncedUsers,
      syncedBookings,
      syncedOrders,
      totalBookings: allBookings.length,
      totalOrders: allOrders.length,
    };
  } catch (error) {
    console.error('syncHistoricalUsers error:', error);
    throw error;
  }
}
