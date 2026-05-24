// app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json()

    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, phone, password: hashed, loyaltyPoints: 100 },
      select: { id: true, name: true, email: true },
    })

    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}