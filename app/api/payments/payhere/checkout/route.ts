import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const SANDBOX        = process.env.PAYHERE_SANDBOX !== 'false';
const MERCHANT_ID    = process.env.PAYHERE_MERCHANT_ID    || '';
const MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || '';
const BASE_URL       = process.env.NEXTAUTH_URL || 'http://localhost:3000';

const CHECKOUT_URL = SANDBOX
  ? 'https://sandbox.payhere.lk/pay/checkout'
  : 'https://www.payhere.lk/pay/checkout';

// PayHere hash: MD5(merchant_id + order_id + amount + currency + MD5(secret).toUpperCase()).toUpperCase()
function makeHash(orderId: string, amount: string, currency: string): string {
  const secretHash = crypto.createHash('md5').update(MERCHANT_SECRET).digest('hex').toUpperCase();
  return crypto
    .createHash('md5')
    .update(`${MERCHANT_ID}${orderId}${amount}${currency}${secretHash}`)
    .digest('hex')
    .toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    if (!MERCHANT_ID || !MERCHANT_SECRET || MERCHANT_ID === 'your_payhere_merchant_id') {
      return NextResponse.json(
        { error: 'PayHere credentials are not configured. Add PAYHERE_MERCHANT_ID and PAYHERE_MERCHANT_SECRET to .env' },
        { status: 503 }
      );
    }

    const { bookingNumber } = await request.json();
    if (!bookingNumber) {
      return NextResponse.json({ error: 'bookingNumber is required' }, { status: 400 });
    }

    // Load primary booking and all linked room bookings for this reservation
    const allBookings = await prisma.booking.findMany({
      where: {
        OR: [
          { bookingNumber },
          { bookingNumber: { startsWith: `${bookingNumber}-R` } },
        ],
      },
      include: { guestCheckout: true, room: true },
      orderBy: { createdAt: 'asc' },
    });

    if (allBookings.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const primary = allBookings[0];
    const guest   = primary.guestCheckout;

    // Total across all room bookings
    const totalAmount = allBookings
      .reduce((sum, b) => sum + Number(b.totalAmount), 0)
      .toFixed(2);

    const currency = 'LKR';
    const items    = allBookings.map(b => b.room.name).join(', ');

    const hash = makeHash(bookingNumber, totalAmount, currency);

    return NextResponse.json({
      checkoutUrl: CHECKOUT_URL,
      fields: {
        merchant_id:  MERCHANT_ID,
        return_url:   `${BASE_URL}/booking/success?ref=${bookingNumber}`,
        cancel_url:   `${BASE_URL}/booking/cancel?ref=${bookingNumber}`,
        notify_url:   `${BASE_URL}/api/payments/payhere/notify`,
        order_id:     bookingNumber,
        items,
        currency,
        amount:       totalAmount,
        first_name:   guest?.firstName ?? 'Guest',
        last_name:    guest?.lastName  ?? '',
        email:        guest?.email     ?? '',
        phone:        guest?.phone     ?? '',
        address:      'N/A',
        city:         'Nuwara Eliya',
        country:      guest?.country   ?? 'Sri Lanka',
        hash,
      },
    });

  } catch (error) {
    console.error('[POST /api/payments/payhere/checkout]', error);
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
  }
}
