'use server';

import { prisma } from '@/lib/prisma';

export async function getDashboardStats() {
  try {
    // 1. Get total bookings and status counts
    const totalBookings = await prisma.booking.count();
    const confirmedBookings = await prisma.booking.count({
      where: { status: 'CONFIRMED' }
    });
    const pendingBookings = await prisma.booking.count({
      where: { status: 'PENDING' }
    });
    const cancelledBookings = await prisma.booking.count({
      where: { status: 'CANCELLED' }
    });

    // 2. Get total revenue (sum of PAID bookings)
    const totalRevenue = await prisma.booking.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: {
        totalAmount: true
      }
    });

    // 3. Get Room Availability
    const totalRooms = await prisma.room.count();
    // For simplicity, let's assume rooms with active bookings today are "booked"
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activeBookingsCount = await prisma.booking.count({
      where: {
        status: 'CONFIRMED',
        checkIn: { lte: today },
        checkOut: { gte: today }
      }
    });

    const roomStats = {
      total: totalRooms,
      booked: activeBookingsCount,
      available: Math.max(0, totalRooms - activeBookingsCount),
      maintenance: 0 // In a real app, you'd check Task status for maintenance
    };

    // 4. Recent Bookings (limit 5)
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        guestCheckout: true,
        room: true
      }
    });

    // 5. Active Tasks
    const activeTasks = await prisma.task.findMany({
      where: {
        status: { not: 'COMPLETED' }
      },
      take: 5,
      orderBy: { priority: 'desc' }
    });

    return {
      stats: {
        totalBookings,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        revenue: totalRevenue._sum.totalAmount || 0
      },
      roomStats,
      recentBookings: recentBookings.map(b => ({
        id: b.id,
        guest: b.user?.name || `${b.guestCheckout?.firstName} ${b.guestCheckout?.lastName}` || 'Unknown',
        room: b.room.name,
        checkIn: b.checkIn.toISOString().split('T')[0],
        status: b.status.toLowerCase(),
        amount: Number(b.totalAmount)
      })),
      tasks: activeTasks.map(t => ({
        id: t.id,
        title: t.title,
        priority: t.priority.toLowerCase(),
        time: t.dueAt ? t.dueAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No deadline'
      }))
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

export async function getRoomsData() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rooms = await prisma.room.findMany({
      include: {
        bookings: {
          where: {
            status: 'CONFIRMED',
            checkIn: { lte: today },
            checkOut: { gte: today },
          },
        },
        tasks: {
          where: { status: { not: 'COMPLETED' } },
        },
      },
      orderBy: { name: 'asc' },
    });

    return rooms.map(r => {
      const isBooked = r.bookings.length > 0;
      const hasMaintenance = r.tasks.some(t => t.category === 'MAINTENANCE');
      const hasCleaning = r.tasks.some(t => t.category === 'HOUSEKEEPING');
      const status: 'available' | 'booked' | 'maintenance' | 'cleaning' =
        isBooked ? 'booked' : hasMaintenance ? 'maintenance' : hasCleaning ? 'cleaning' : 'available';

      return {
        id: r.id,
        name: r.name,
        description: r.description || '',
        price: Number(r.price),
        status,
        activeTaskCount: r.tasks.length,
      };
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return null;
  }
}

export async function getReservationsData() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        room: true,
        user: true,
        guestCheckout: true,
      },
    });

    return bookings.map(b => {
      const nights = Math.ceil(
        (b.checkOut.getTime() - b.checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      const guestName = b.user?.name
        || (b.guestCheckout ? `${b.guestCheckout.firstName} ${b.guestCheckout.lastName}` : 'Unknown');
      const email = b.user?.email || b.guestCheckout?.email || '';
      const phone = b.user?.phone || b.guestCheckout?.phone || '';

      return {
        id: b.bookingNumber,
        guestName,
        email,
        phone,
        room: b.room.name,
        checkIn: b.checkIn.toISOString().split('T')[0],
        checkOut: b.checkOut.toISOString().split('T')[0],
        nights,
        amount: Number(b.totalAmount),
        status: b.status.toLowerCase() as 'confirmed' | 'pending' | 'cancelled',
        guests: b.guests,
      };
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return null;
  }
}

export async function getGuestsData() {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'GUEST' },
      include: {
        bookings: {
          include: { room: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const guestCheckouts = await prisma.guestCheckout.findMany({
      include: { bookings: true },
      orderBy: { createdAt: 'desc' },
    });

    const fromUsers = users.map(u => {
      const totalSpent = u.bookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
      const lastBooking = u.bookings.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )[0];
      return {
        id: u.id,
        name: u.name || u.email || 'Unknown',
        email: u.email || '',
        phone: u.phone || '',
        country: u.country || '',
        totalStays: u.bookings.length,
        totalSpent,
        lastVisit: lastBooking ? lastBooking.checkIn.toISOString().split('T')[0] : null,
        joinDate: u.createdAt.toISOString().split('T')[0],
        type: 'registered' as const,
      };
    });

    const fromGuests = guestCheckouts.map(g => {
      const totalSpent = g.bookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
      const lastBooking = g.bookings.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )[0];
      return {
        id: g.id,
        name: `${g.firstName} ${g.lastName}`,
        email: g.email,
        phone: g.phone,
        country: g.country || '',
        totalStays: g.bookings.length,
        totalSpent,
        lastVisit: lastBooking ? lastBooking.checkIn.toISOString().split('T')[0] : null,
        joinDate: g.createdAt.toISOString().split('T')[0],
        type: 'guest' as const,
      };
    });

    return [...fromUsers, ...fromGuests].sort(
      (a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
    );
  } catch (error) {
    console.error('Error fetching guests:', error);
    return null;
  }
}

export async function getHousekeepingData() {
  try {
    const tasks = await prisma.task.findMany({
      where: { category: 'HOUSEKEEPING' },
      include: { user: true, room: true },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return tasks.map(t => ({
      id: t.id,
      roomName: t.room?.name || 'General',
      title: t.title,
      description: t.description || '',
      assignedTo: t.user?.name || 'Unassigned',
      status: t.status === 'IN_PROGRESS' ? 'in-progress' : t.status.toLowerCase() as 'pending' | 'in-progress' | 'completed',
      priority: t.priority.toLowerCase() as 'low' | 'medium' | 'high',
      dueAt: t.dueAt ? t.dueAt.toISOString().split('T')[0] : null,
    }));
  } catch (error) {
    console.error('Error fetching housekeeping tasks:', error);
    return null;
  }
}

export async function getFinancialsData() {
  try {
    const totalRevenue = await prisma.payment.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    });

    const totalBookings = await prisma.booking.count();
    const confirmedBookings = await prisma.booking.count({ where: { status: 'CONFIRMED' } });
    const totalRooms = await prisma.room.count();

    const occupancyRate = totalRooms > 0
      ? Math.round((confirmedBookings / (totalRooms * 30)) * 100)
      : 0;

    // Revenue by month (last 6 months)
    const now = new Date();
    const monthlyRevenue: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const result = await prisma.payment.aggregate({
        where: { status: 'PAID', createdAt: { gte: start, lte: end } },
        _sum: { amount: true },
      });
      monthlyRevenue.push({
        month: d.toLocaleString('en-US', { month: 'short' }),
        revenue: Number(result._sum.amount || 0),
      });
    }

    const revenue = Number(totalRevenue._sum.amount || 0);

    return {
      totalRevenue: revenue,
      totalBookings,
      occupancyRate: Math.min(occupancyRate, 100),
      monthlyRevenue,
    };
  } catch (error) {
    console.error('Error fetching financials:', error);
    return null;
  }
}
