import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { bookingNumber, transactionRef, transferDate, amountPaid, receiptUrl, notes } = await request.json();

    if (!bookingNumber || !transactionRef || !transferDate || !amountPaid) {
      return NextResponse.json({ error: 'Transaction reference, date and amount are required.' }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { bookingNumber },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found. Please check your reference number.' }, { status: 404 });
    }

    if (booking.paymentMethod !== 'bank') {
      return NextResponse.json({ error: 'This booking is not set up for bank transfer payment.' }, { status: 400 });
    }

    // Upsert — allow resubmission if they made an error
    await prisma.bankTransferReceipt.upsert({
      where:  { bookingId: booking.id },
      create: {
        bookingId:     booking.id,
        transactionRef,
        transferDate:  new Date(transferDate),
        amountPaid:    Number(amountPaid),
        receiptUrl:    receiptUrl || null,
        notes:         notes || null,
        status:        'PENDING',
      },
      update: {
        transactionRef,
        transferDate: new Date(transferDate),
        amountPaid:   Number(amountPaid),
        receiptUrl:   receiptUrl || null,
        notes:        notes || null,
        status:       'PENDING',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/bookings/upload-receipt]', error);
    return NextResponse.json({ error: 'Failed to submit receipt. Please try again.' }, { status: 500 });
  }
}
