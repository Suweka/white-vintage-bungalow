// components/guest/AuthModal.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Mail, Lock, Phone, User, Eye, EyeOff, ChevronLeft } from 'lucide-react'

type AuthView = 'menu' | 'login' | 'register' | 'phone'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultView?: AuthView
}

export function AuthModal({ isOpen, onClose, defaultView = 'menu' }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(defaultView)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // OTP state
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)

  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  // Register form
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  })

  const resetState = () => {
    setError('')
    setLoading(false)
    setOtpSent(false)
    setOtp('')
    setPhone('')
    setLoginForm({ email: '', password: '' })
    setRegisterForm({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  }

  const handleClose = () => {
    resetState()
    setView('menu')
    onClose()
  }

  // --- Google ---
  const handleGoogle = () => signIn('google', { callbackUrl: '/profile' })

  // --- Email Login ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email: loginForm.email,
      password: loginForm.password,
      redirect: false,
    })
    if (result?.error) {
      setError('Invalid email or password.')
    } else {
      handleClose()
      window.location.reload()
    }
    setLoading(false)
  }

  // --- Email Register ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (registerForm.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Registration failed')
      setLoading(false)
      return
    }
    // Auto login after register
    await signIn('credentials', {
      email: registerForm.email,
      password: registerForm.password,
      redirect: false,
    })
    handleClose()
    window.location.reload()
    setLoading(false)
  }

  // --- Phone OTP: Send ---
  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError('Enter a valid phone number')
      return
    }
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    if (res.ok) {
      setOtpSent(true)
      // Start 60s countdown for resend
      setOtpTimer(60)
      const interval = setInterval(() => {
        setOtpTimer(t => {
          if (t <= 1) { clearInterval(interval); return 0 }
          return t - 1
        })
      }, 1000)
    } else {
      setError('Failed to send OTP. Try again.')
    }
    setLoading(false)
  }

  // --- Phone OTP: Verify ---
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP')
      return
    }
    setLoading(true)
    setError('')
    const result = await signIn('phone-otp', {
      phone,
      otp,
      redirect: false,
    })
    if (result?.error) {
      setError('Invalid or expired OTP.')
    } else {
      handleClose()
      window.location.reload()
    }
    setLoading(false)
  }

  // Google SVG
  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />

        {/* Modal */}
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 focus:outline-none">
          {/* Close button */}
          <Dialog.Close
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={22} />
          </Dialog.Close>

          {/* Back button (when not on menu) */}
          {view !== 'menu' && (
            <button
              onClick={() => { setView('menu'); setError(''); }}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition flex items-center gap-1 text-sm"
            >
              <ChevronLeft size={18} /> Back
            </button>
          )}

          {/* ── MENU VIEW ─────────────────────────────── */}
          {view === 'menu' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
                <p className="text-gray-500 text-sm mt-1">Sign in or create an account</p>
              </div>

              <div className="space-y-3">
                {/* Google */}
                <button
                  onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                {/* Phone OTP */}
                <button
                  onClick={() => { setView('phone'); setError(''); }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  <Phone size={20} className="text-primary" />
                  Continue with Phone
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-400">or use email</span>
                  </div>
                </div>

                {/* Email Login */}
                <button
                  onClick={() => { setView('login'); setError(''); }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition font-medium"
                >
                  <Mail size={20} />
                  Sign in with Email
                </button>

                {/* Register */}
                <button
                  onClick={() => { setView('register'); setError(''); }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-primary text-primary rounded-xl hover:bg-light-green transition font-medium"
                >
                  <User size={20} />
                  Create an Account
                </button>
              </div>

              {/* Guest checkout note */}
              <p className="text-center text-xs text-gray-400 mt-6">
                You can also{' '}
                <button onClick={handleClose} className="text-primary hover:underline font-medium">
                  continue as guest
                </button>{' '}
                without signing in
              </p>
            </div>
          )}

          {/* ── LOGIN VIEW ─────────────────────────────── */}
          {view === 'login' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Sign In</h2>
                <p className="text-gray-500 text-sm mt-1">Welcome back!</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <button type="button" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Your password"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-4">
                Don't have an account?{' '}
                <button onClick={() => setView('register')} className="text-primary font-medium hover:underline">
                  Create one
                </button>
              </p>
            </div>
          )}

          {/* ── REGISTER VIEW ─────────────────────────────── */}
          {view === 'register' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Create Account</h2>
                <p className="text-gray-500 text-sm mt-1">Join and earn loyalty rewards</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={registerForm.name}
                      onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      value={registerForm.phone}
                      onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      placeholder="+94 77 123 4567"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerForm.password}
                      onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={e => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      placeholder="Repeat password"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60 mt-2"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <button onClick={() => setView('login')} className="text-primary font-medium hover:underline">
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* ── PHONE OTP VIEW ─────────────────────────────── */}
          {view === 'phone' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-light-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-primary" size={28} />
                </div>
                <h2 className="text-2xl font-bold">Phone Verification</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {otpSent
                    ? `Enter the 6-digit code sent to ${phone}`
                    : 'Enter your phone number to receive a code'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              {!otpSent ? (
                // Step 1: Enter Phone
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => { setPhone(e.target.value); setError('') }}
                        placeholder="+94 77 123 4567"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
                  >
                    {loading ? 'Sending...' : 'Send OTP Code'}
                  </button>
                </div>
              ) : (
                // Step 2: Enter OTP
                <div className="space-y-4">
                  {/* 6 separate OTP boxes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                      Verification Code
                    </label>
                    <div className="flex gap-2 justify-center">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          value={otp[i] || ''}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '')
                            const newOtp = otp.split('')
                            newOtp[i] = val
                            setOtp(newOtp.join(''))
                            // Auto-focus next
                            if (val && i < 5) {
                              const next = document.getElementById(`otp-${i + 1}`)
                              next?.focus()
                            }
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Backspace' && !otp[i] && i > 0) {
                              document.getElementById(`otp-${i - 1}`)?.focus()
                            }
                          }}
                          id={`otp-${i}`}
                          className="w-11 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
                  >
                    {loading ? 'Verifying...' : 'Verify & Sign In'}
                  </button>

                  {/* Resend */}
                  <p className="text-center text-sm text-gray-500">
                    Didn't receive the code?{' '}
                    {otpTimer > 0 ? (
                      <span className="text-gray-400">Resend in {otpTimer}s</span>
                    ) : (
                      <button
                        onClick={handleSendOtp}
                        className="text-primary font-medium hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </p>

                  <p className="text-center text-xs text-gray-400">
                    Wrong number?{' '}
                    <button
                      onClick={() => { setOtpSent(false); setOtp(''); setPhone(''); }}
                      className="text-primary hover:underline"
                    >
                      Change it
                    </button>
                  </p>
                </div>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}