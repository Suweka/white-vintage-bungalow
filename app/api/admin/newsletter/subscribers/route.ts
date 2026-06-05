import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, isActive: true, createdAt: true },
    });
    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error('[GET /api/admin/newsletter/subscribers]', error);
    return NextResponse.json({ subscribers: [] });
  }
}
