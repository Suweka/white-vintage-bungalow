import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBookingConfirmedEmail } from '@/lib/email';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { action } = await request.json(); // 'approve' | 'reject'

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: 'Invalid action. Use "approve" or "reject".' }, { status: 400 });
    }

    const receipt = await prisma.bankTransferReceipt.findUnique({
      where:   { id: params.id },
      include: {
        booking: {
          include: { guestCheckout: true, room: true },
        },
      },
    });

    if (!receipt) {
      return NextResponse.json({ error: 'Receipt not found.' }, { status: 404 });
    }

    const newReceiptStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
    const newBookingStatus = action === 'approve' ? 'CONFIRMED' : 'CANCELLED';
    const newPaymentStatus = action === 'approve' ? 'PAID'      : 'FAILED';

    // Update receipt status
    await prisma.bankTransferReceipt.update({
      where: { id: params.id },
      data:  { status: newReceiptStatus, reviewedAt: new Date() },
    });

    // Update all bookings for this reservation (primary + multi-room siblings)
    const baseNumber = receipt.booking.bookingNumber.split('-R')[0];
    await prisma.booking.updateMany({
      where: {
        OR: [
          { bookingNumber: baseNumber },
          { bookingNumber: { startsWith: `${baseNumber}-R` } },
        ],
      },
      data: { status: newBookingStatus, paymentStatus: newPaymentStatus },
    });

    // Send confirmation email on approval
    if (action === 'approve') {
      const guest = receipt.booking.guestCheckout;
      if (guest?.email) {
        const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        sendBookingConfirmedEmail({
          to:            guest.email,
          guestName:     `${guest.firstName} ${guest.lastName}`,
          bookingNumber: baseNumber,
          rooms:         receipt.booking.room.name,
          checkIn:       fmtDate(receipt.booking.checkIn),
          checkOut:      fmtDate(receipt.booking.checkOut),
        }).catch(err => console.error('[email] confirmation email failed:', err));
      }
    }

    return NextResponse.json({ success: true, status: newReceiptStatus });
  } catch (error) {
    console.error('[PATCH /api/admin/receipts/[id]]', error);
    return NextResponse.json({ error: 'Failed to update receipt status.' }, { status: 500 });
  }
}
