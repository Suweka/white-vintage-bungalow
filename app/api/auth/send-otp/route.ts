// app/api/auth/send-otp/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
    }

    const code = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Invalidate previous unused OTPs for this phone
    await prisma.otpCode.updateMany({
      where: { phone, used: false },
      data: { used: true },
    })

    // Store new OTP
    await prisma.otpCode.create({
      data: { phone, code, expiresAt },
    })

    // Send SMS via your preferred provider
    // Option A: Twilio
    // await twilioClient.messages.create({
    //   body: `Your White Vintage Bungalow verification code is: ${code}. Valid for 10 minutes.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone,
    // })

    // Option B: Firebase SMS (handled client-side with reCAPTCHA)
    // Option C: For development — just log it
    console.log(`OTP for ${phone}: ${code}`)

    return NextResponse.json({ success: true, message: 'OTP sent successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}