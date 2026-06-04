import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SLUG_TO_NAME: Record<string, string> = {
  'deluxe-room':   'Deluxe Room',
  'junior-suite':  'Junior Suite',
  'family-room':   'Family Room',
  'premium-suite': 'Premium Suite',
  'single-room':   'Single Room',
  'garden-view':   'Garden View Room',
};

export async function POST(request: NextRequest) {
  try {
    const { roomSlugs } = await request.json();

    if (!roomSlugs?.length) {
      return NextResponse.json({ unavailableDates: [] });
    }

    const roomNames = (roomSlugs as string[]).map(s => SLUG_TO_NAME[s] || s);

    const rooms = await prisma.room.findMany({
      where: { name: { in: roomNames, mode: 'insensitive' } },
      select: { id: true },
    });

    if (rooms.length === 0) {
      return NextResponse.json({ unavailableDates: [] });
    }

    const roomIds = rooms.map(r => r.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch all active bookings for these rooms from today onwards
    const bookings = await prisma.booking.findMany({
      where: {
        roomId:   { in: roomIds },
        status:   { not: 'CANCELLED' },
        checkOut: { gt: today },
      },
      select: { checkIn: true, checkOut: true },
    });

    // Expand each booking into individual dates (checkIn inclusive, checkOut exclusive)
    const unavailableSet = new Set<string>();

    for (const booking of bookings) {
      const cur = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      cur.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      while (cur < end) {
        // Format as YYYY-MM-DD in UTC to match how we stored the dates
        unavailableSet.add(cur.toISOString().split('T')[0]);
        cur.setDate(cur.getDate() + 1);
      }
    }

    return NextResponse.json({ unavailableDates: Array.from(unavailableSet) });

  } catch (error) {
    console.error('[POST /api/rooms/availability]', error);
    return NextResponse.json({ unavailableDates: [] });
  }
}
