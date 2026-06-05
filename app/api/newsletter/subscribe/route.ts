import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletterWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ message: 'You are already subscribed!' }, { status: 200 });
      } else {
        // Re-activate
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true }
        });
        return NextResponse.json({ message: 'Welcome back! Your subscription has been reactivated.' }, { status: 200 });
      }
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: { email }
    });

    // Send welcome email (non-fatal)
    sendNewsletterWelcomeEmail({ to: email }).catch(err =>
      console.error('[newsletter] welcome email failed:', err)
    );

    return NextResponse.json({ success: true, message: 'Thank you for subscribing!' }, { status: 201 });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
