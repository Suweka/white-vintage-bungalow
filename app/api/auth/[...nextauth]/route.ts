import NextAuth from 'next-auth'
import { authOptions } from '@/lib/authOptions'

// Ensure this route runs in Node (required for Prisma)
export const runtime = 'nodejs'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
