import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const MERCHANT_ID     = process.env.PAYHERE_MERCHANT_ID     || '';
const MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || '';

// PayHere status codes
// 2  = Successful
// 0  = Pending
// -1 = Cancelled
// -2 = Failed
// -3 = Chargedback
function resolveStatuses(statusCode: string): {
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  bookingStatus:  'CONFIRMED' | 'PENDING' | 'CANCELLED';
} {
  switch (statusCode) {
    case '2':  return { paymentStatus: 'PAID',    bookingStatus: 'CONFIRMED' };
    case '0':  return { paymentStatus: 'PENDING', bookingStatus: 'PENDING'   };
    case '-1': return { paymentStatus: 'FAILED',  bookingStatus: 'CANCELLED' };
    default:   return { paymentStatus: 'FAILED',  bookingStatus: 'PENDING'   };
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const get = (key: string) => formData.get(key)?.toString() ?? '';

    const merchantId      = get('merchant_id');
    const orderId         = get('order_id');
    const payhereAmount   = get('payhere_amount');
    const payhereCurrency = get('payhere_currency');
    const statusCode      = get('status_code');
    const md5sig          = get('md5sig');

    // 1. Verify merchant ID matches ours
    if (merchantId !== MERCHANT_ID) {
      console.warn('[notify] merchant_id mismatch');
      return NextResponse.json({ error: 'Invalid merchant' }, { status: 400 });
    }

    // 2. Verify MD5 signature
    // MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(secret).toUpperCase()).toUpperCase()
    const secretHash = crypto.createHash('md5').update(MERCHANT_SECRET).digest('hex').toUpperCase();
    const expected   = crypto
      .createHash('md5')
      .update(`${merchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${secretHash}`)
      .digest('hex')
      .toUpperCase();

    if (md5sig !== expected) {
      console.warn('[notify] signature mismatch — possible spoofed request');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { paymentStatus, bookingStatus } = resolveStatuses(statusCode);

    // 3. Update all bookings for this reservation (primary + multi-room siblings)
    await prisma.booking.updateMany({
      where: {
        OR: [
          { bookingNumber: orderId },
          { bookingNumber: { startsWith: `${orderId}-R` } },
        ],
      },
      data: {
        paymentStatus,
        status: bookingStatus,
      },
    });

    // 4. Upsert a Payment record for the primary booking
    const primary = await prisma.booking.findFirst({
      where: { bookingNumber: orderId },
    });

    if (primary) {
      await prisma.payment.upsert({
        where:  { bookingId: primary.id },
        create: { bookingId: primary.id, amount: Number(payhereAmount), status: paymentStatus },
        update: { status: paymentStatus, amount: Number(payhereAmount) },
      });
    }

    console.log(`[notify] order=${orderId} status=${statusCode} (${paymentStatus})`);
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[POST /api/payments/payhere/notify]', error);
    // Return 200 so PayHere doesn't keep retrying on our internal errors
    return NextResponse.json({ error: 'Internal error' }, { status: 200 });
  }
}
