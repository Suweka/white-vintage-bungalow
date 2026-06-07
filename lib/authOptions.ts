import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
        return { id: user.id, email: user.email, name: user.name, role: user.role } as any
      },
    }),
    CredentialsProvider({
      id: 'phone-otp',
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Phone', type: 'tel' },
        otp: { label: 'OTP Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null
        const record = await prisma.otpCode.findFirst({
          where: {
            phone: credentials.phone,
            code: credentials.otp,
            used: false,
            expiresAt: { gt: new Date() },
          },
        })
        if (!record) return null
        await prisma.otpCode.update({
          where: { id: record.id },
          data: { used: true },
        })
        let user = await prisma.user.findUnique({ where: { phone: credentials.phone } })
        if (!user) {
          user = await prisma.user.create({
            data: {
              phone: credentials.phone,
              phoneVerified: true,
              loyaltyPoints: 100,
            },
          })
        }
        return { id: user.id, email: user.email, name: user.name, role: user.role } as any
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/' },
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role ?? 'GUEST'
        token.name = user.name ?? token.name
        token.email = user.email ?? token.email
        token.picture = (user as any).image ?? (profile as any)?.picture ?? token.picture
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.image = (token.picture as string) ?? session.user.image ?? null;
      }
      return session
    },
  },
}
