import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Ensure this route runs in Node (required for Prisma)
export const runtime = 'nodejs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // 1. Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 2. Email & Password
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user?.password) return null
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),

    // 3. Phone OTP (we verify OTP ourselves, then sign in via this provider)
    CredentialsProvider({
      id: 'phone-otp',
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Phone', type: 'tel' },
        otp: { label: 'OTP Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null

        // Verify OTP from database
        const record = await prisma.otpCode.findFirst({
          where: {
            phone: credentials.phone,
            code: credentials.otp,
            used: false,
            expiresAt: { gt: new Date() },
          },
        })

        if (!record) return null

        // Mark OTP as used
        await prisma.otpCode.update({
          where: { id: record.id },
          data: { used: true },
        })

        // Find or create user by phone
        let user = await prisma.user.findUnique({ where: { phone: credentials.phone } })
        if (!user) {
          user = await prisma.user.create({
            data: {
              phone: credentials.phone,
              phoneVerified: true,
              loyaltyPoints: 100, // welcome bonus
            },
          })
        }

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/' }, // stay on same page — modal handles this
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role ?? 'GUEST'
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
