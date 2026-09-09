import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { syncHistoricalUsers } from '../services/userService.js';

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const { search } = req.query;

    const whereClause: any = {};
    if (search && typeof search === 'string') {
      whereClause.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
        },
        orders: {
          include: {
            items: {
              include: { product: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const enrichedUsers = users.map((u) => {
      const totalBookings = u.bookings.length;
      const totalOrders = u.orders.length;

      // Determine latest activity date
      const dates = [
        u.updatedAt,
        ...u.bookings.map((b) => b.createdAt),
        ...u.orders.map((o) => o.createdAt),
      ].filter(Boolean);
      const latestDate = dates.length > 0 ? new Date(Math.max(...dates.map((d) => new Date(d).getTime()))) : u.createdAt;

      return {
        id: u.phone,
        phone: u.phone,
        name: u.name,
        email: u.email,
        notes: u.notes,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        lastActive: latestDate,
        totalBookings,
        totalOrders,
        bookings: u.bookings,
        orders: u.orders,
      };
    });

    res.json({
      success: true,
      count: enrichedUsers.length,
      data: enrichedUsers,
    });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const phone = req.params.id as string;
    const user = await prisma.user.findUnique({
      where: { phone },
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
        },
        orders: {
          include: {
            items: {
              include: { product: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const totalBookings = user.bookings.length;
    const totalOrders = user.orders.length;

    res.json({
      success: true,
      data: {
        ...user,
        id: user.phone,
        totalBookings,
        totalOrders,
      },
    });
  } catch (error) {
    console.error('getUserById error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const phone = req.params.id as string;
    const { name, email, notes } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.user.update({
      where: { phone },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'User profile updated successfully',
      data: { ...updated, id: updated.phone },
    });
  } catch (error) {
    console.error('updateUser error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user profile' });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const phone = req.params.id as string;
    await prisma.user.delete({ where: { phone } });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
}

export async function syncLegacyClients(req: Request, res: Response): Promise<void> {
  try {
    const result = await syncHistoricalUsers();
    res.json({
      success: true,
      message: `Database fed successfully! Processed ${result.syncedUsers} client profiles, linked ${result.syncedBookings} bookings and ${result.syncedOrders} orders.`,
      data: result,
    });
  } catch (error) {
    console.error('syncLegacyClients error:', error);
    res.status(500).json({ success: false, message: 'Failed to sync legacy clients' });
  }
}
