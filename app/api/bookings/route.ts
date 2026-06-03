import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBankTransferPendingEmail } from '@/lib/email';

const SLUG_TO_NAME: Record<string, string> = {
  'deluxe-room':   'Deluxe Room',
  'junior-suite':  'Junior Suite',
  'family-room':   'Family Room',
  'premium-suite': 'Premium Suite',
  'single-room':   'Single Room',
  'garden-view':   'Garden View Room',
};

function generateBookingNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WVB-${year}-${random}`;
}

async function resolveRoom(slug: string) {
  const targetName = SLUG_TO_NAME[slug] || slug;

  // 1. Exact name match (case-insensitive)
  let room = await prisma.room.findFirst({
    where: { name: { equals: targetName, mode: 'insensitive' } },
  });

  // 2. Partial match on first word (e.g. "Deluxe" matches "Deluxe Rooms")
  if (!room) {
    const firstWord = targetName.split(' ')[0];
    room = await prisma.room.findFirst({
      where: { name: { contains: firstWord, mode: 'insensitive' } },
    });
  }

  // 3. Fall back to any room so the booking still gets created
  if (!room) {
    room = await prisma.room.findFirst();
  }

  return room;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rooms, checkIn, checkOut, guests, guestDetails, paymentMethod, couponCode, totalAmount } = body;

    if (!rooms?.length || !checkIn || !checkOut || !guestDetails?.email) {
      return NextResponse.json({ error: 'Missing required booking fields.' }, { status: 400 });
    }

    // Resolve each slug → DB room (deduplicate by room ID to avoid conflicts)
    const resolvedRooms: NonNullable<Awaited<ReturnType<typeof resolveRoom>>>[] = [];
    const seenIds = new Set<string>();

    for (const slug of rooms as string[]) {
      const room = await resolveRoom(slug);
      if (room && !seenIds.has(room.id)) {
        resolvedRooms.push(room);
        seenIds.add(room.id);
      }
    }

    if (resolvedRooms.length === 0) {
      return NextResponse.json({ error: 'No rooms available in database. Please contact the hotel.' }, { status: 400 });
    }

    // Create GuestCheckout record
    const guestCheckout = await prisma.guestCheckout.create({
      data: {
        email:     guestDetails.email,
        firstName: guestDetails.firstName,
        lastName:  guestDetails.lastName,
        phone:     guestDetails.phone,
        country:   guestDetails.country || null,
      },
    });

    // Increment coupon usage if one was applied
    if (couponCode) {
      await prisma.coupon.updateMany({
        where: { code: couponCode, isActive: true },
        data:  { usageCount: { increment: 1 } },
      }).catch(() => {}); // non-fatal if coupon already expired
    }

    // Distribute totalAmount proportionally across rooms by their DB price
    const totalNightlyRate = resolvedRooms.reduce((sum, r) => sum + Number(r.price), 0);
    const baseBookingNumber = generateBookingNumber();

    const createdBookings = await Promise.all(
      resolvedRooms.map((room, index) => {
        const share = totalNightlyRate > 0 ? Number(room.price) / totalNightlyRate : 1 / resolvedRooms.length;
        const roomTotal = Math.round(Number(totalAmount) * share * 100) / 100;

        return prisma.booking.create({
          data: {
            bookingNumber:   index === 0 ? baseBookingNumber : `${baseBookingNumber}-R${index + 1}`,
            guestCheckoutId: guestCheckout.id,
            roomId:          room.id,
            checkIn:         new Date(checkIn),
            checkOut:        new Date(checkOut),
            guests:          Number(guests),
            totalAmount:     roomTotal,
            status:          'PENDING',
            paymentStatus:   'PENDING',
            paymentMethod:   paymentMethod || null,
            specialRequests: guestDetails.specialRequests || null,
          },
        });
      })
    );

    // Send bank transfer pending email
    if (paymentMethod === 'bank') {
      const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      sendBankTransferPendingEmail({
        to:            guestDetails.email,
        guestName:     `${guestDetails.firstName} ${guestDetails.lastName}`,
        bookingNumber: baseBookingNumber,
        rooms:         resolvedRooms.map(r => r.name).join(', '),
        checkIn:       fmtDate(checkIn),
        checkOut:      fmtDate(checkOut),
        totalAmount:   Number(totalAmount),
      }).catch(err => console.error('[email] bank transfer email failed:', err));
    }

    return NextResponse.json({
      success:       true,
      bookingNumber: baseBookingNumber,
      bookingIds:    createdBookings.map(b => b.id),
      roomCount:     resolvedRooms.length,
    });

  } catch (error) {
    console.error('[POST /api/bookings]', error);
    return NextResponse.json({ error: 'Failed to create booking. Please try again.' }, { status: 500 });
  }
}
