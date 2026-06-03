import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import ProfileClient from './ProfileClient'

async function getUserData(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      bookings: {
        include: { room: true, payment: true },
        orderBy: { createdAt: 'desc' },
      },
      savedPayments: true,
      reviews: true,
    },
  })
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login?callbackUrl=/profile')
  }

  const user = await getUserData(session.user.id)

  if (!user) redirect('/login')

  return <ProfileClient user={user} />
}