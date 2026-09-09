import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { processAndSaveImage } from '../services/imageService.js';
import { upsertUserOnAction } from '../services/userService.js';
import { notifyAdminNewBooking, notifyCustomerBookingReceived } from '../services/whatsappService.js';
import { z } from 'zod';

const bookingSchema = z.object({
  serviceType: z.string().min(1, 'Service type is required'),
  placement: z.string().min(1, 'Placement is required'),
  size: z.string().min(1, 'Size is required'),
  description: z.string().min(3, 'Description is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  timeSlot: z.string().default('afternoon'),
  clientName: z.string().min(2, 'Full name is required'),
  clientPhone: z.string().min(7, 'Phone/WhatsApp number is required'),
  clientEmail: z.string().email('Valid email is required'),
  notes: z.string().optional().nullable(),
});

function generateReferenceCode(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MRT-${year}-${randomNum}`;
}

export async function createBooking(req: Request, res: Response): Promise<void> {
  try {
    const validated = bookingSchema.parse(req.body);

    let referenceImageUrl: string | null = null;
    if (req.file) {
      referenceImageUrl = await processAndSaveImage(req.file, 'booking');
    }

    let referenceCode = generateReferenceCode();
    let exists = await prisma.booking.findUnique({ where: { referenceCode } });
    while (exists) {
      referenceCode = generateReferenceCode();
      exists = await prisma.booking.findUnique({ where: { referenceCode } });
    }

    // Auto-upsert Client / User record in database
    const user = await upsertUserOnAction({
      name: validated.clientName,
      phone: validated.clientPhone,
      email: validated.clientEmail,
      notes: validated.notes,
    });

    const booking = await prisma.booking.create({
      data: {
        referenceCode,
        serviceType: validated.serviceType,
        placement: validated.placement,
        size: validated.size,
        description: validated.description,
        referenceImage: referenceImageUrl,
        preferredDate: new Date(validated.preferredDate),
        timeSlot: validated.timeSlot,
        status: 'PENDING_REVIEW',
        clientName: validated.clientName,
        clientPhone: validated.clientPhone,
        clientEmail: validated.clientEmail,
        notes: validated.notes || null,
        userPhone: user ? user.phone : null,
      },
    });

    // Send automated WhatsApp alerts in background
    Promise.allSettled([
      notifyAdminNewBooking({
        referenceCode,
        clientName: validated.clientName,
        clientPhone: validated.clientPhone,
        clientEmail: validated.clientEmail,
        serviceType: validated.serviceType,
        placement: validated.placement,
        size: validated.size,
        preferredDate: validated.preferredDate,
        timeSlot: validated.timeSlot,
        notes: validated.notes,
      }),
      notifyCustomerBookingReceived({
        referenceCode,
        clientName: validated.clientName,
        clientPhone: validated.clientPhone,
        serviceType: validated.serviceType,
        placement: validated.placement,
        preferredDate: validated.preferredDate,
        timeSlot: validated.timeSlot,
      }),
    ]).catch((err) => console.error('Booking WhatsApp notifications error:', err));

    const whatsAppMessage = encodeURIComponent(
      `Hello Marvin Tattoos Atelier! I have submitted a consultation/booking request.\n\n*Ref Code:* ${referenceCode}\n*Name:* ${validated.clientName}\n*Service:* ${validated.serviceType}\n*Placement:* ${validated.placement}\n*Preferred Date:* ${new Date(validated.preferredDate).toLocaleDateString()}`
    );
    const directWhatsAppUrl = `https://wa.me/256705748774?text=${whatsAppMessage}`;

    res.status(201).json({
      success: true,
      message: 'Booking request received successfully',
      data: {
        ...booking,
        directWhatsAppUrl,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
      return;
    }
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
}

export async function getBookingByRef(req: Request, res: Response): Promise<void> {
  try {
    const referenceCode = req.params.referenceCode as string;
    const booking = await prisma.booking.findUnique({
      where: { referenceCode },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Get booking by ref error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch booking' });
  }
}

// Admin: Get all bookings
export async function getAllBookings(req: Request, res: Response): Promise<void> {
  try {
    const { status, search } = req.query;

    const whereClause: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      whereClause.status = status;
    }
    if (search && typeof search === 'string') {
      whereClause.OR = [
        { clientName: { contains: search } },
        { clientPhone: { contains: search } },
        { referenceCode: { contains: search } },
        { serviceType: { contains: search } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error('Admin getAllBookings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
}

// Admin: Update booking
export async function updateBooking(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status, notes, timeSlot, preferredDate } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (timeSlot) updateData.timeSlot = timeSlot;
    if (preferredDate) updateData.preferredDate = new Date(preferredDate);

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to update booking' });
  }
}

// Admin: Delete booking
export async function deleteBooking(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    await prisma.booking.delete({ where: { id } });
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete booking' });
  }
}
