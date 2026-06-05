import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletterBroadcast } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { subject, message } = await request.json();

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Subject and message are required.' }, { status: 400 });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers found.' }, { status: 400 });
    }

    // Send in small batches to avoid rate-limiting
    let sent = 0;
    let failed = 0;
    for (const sub of subscribers) {
      try {
        await sendNewsletterBroadcast({ to: sub.email, subject, message });
        sent++;
      } catch {
        failed++;
      }
    }

    return NextResponse.json({ success: true, sent, failed, total: subscribers.length });
  } catch (error) {
    console.error('[POST /api/admin/newsletter/send]', error);
    return NextResponse.json({ error: 'Failed to send newsletter.' }, { status: 500 });
  }
}
