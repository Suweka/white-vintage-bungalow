// components/guest/Navbar.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Phone, Mail, User, LogOut, ChevronDown, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AuthModal } from '@/components/guest/AuthModal'

export const Navbar = () => {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/rooms', label: 'Rooms & Suites' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:+94777180599" className="flex items-center gap-2 hover:text-accent transition">
              <Phone size={14} />
              <span className="hidden sm:inline">+94 777 180 599</span>
            </a>
            <a href="mailto:whitevintagebunglow@gmail.com" className="flex items-center gap-2 hover:text-accent transition">
              <Mail size={14} />
              <span className="hidden sm:inline">whitevintagebunglow@gmail.com</span>
            </a>
          </div>
          <div className="hidden md:block">
            <span>Nuwara Eliya, Sri Lanka</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-heading font-bold text-primary">
                White Vintage Bungalow
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}

              {/* Auth Section */}
              {status === 'loading' ? (
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
              ) : session ? (
                // Logged in - show profile dropdown
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || ''}
                        className="w-9 h-9 rounded-full object-cover border-2 border-primary"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                        {session.user.name?.charAt(0).toUpperCase() || 'G'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {session.user.name?.split(' ')[0] || 'Guest'}
                    </span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div 
                        className="fixed inset-0 z-30"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border py-2 z-40">
                        <div className="px-4 py-3 border-b">
                          <p className="text-sm font-semibold text-gray-900">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                          </p>
                        </div>
                        
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-light-green transition"
                        >
                          <User size={16} />
                          <span>My Profile</span>
                        </Link>
                        
                        <Link
                          href="/profile?tab=bookings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-light-green transition"
                        >
                          <Settings size={16} />
                          <span>My Bookings</span>
                        </Link>
                        
                        <hr className="my-1" />
                        
                        <button
                          onClick={() => {
                            setDropdownOpen(false)
                            signOut({ callbackUrl: '/' })
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // Not logged in - show Sign In + Book Now
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="text-sm font-medium text-gray-700 hover:text-primary transition"
                  >
                    Sign In
                  </button>
                  <Link href="/booking">
                    <Button variant="primary" size="md">
                      Book Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-primary transition-colors py-2 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="border-t pt-3 mt-2">
                {status === 'loading' ? (
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                ) : session ? (
                  <>
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {session.user.name?.charAt(0).toUpperCase() || 'G'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-500">{session.user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="block py-2 text-gray-700 hover:text-primary transition"
                      onClick={() => setIsOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/profile?tab=bookings"
                      className="block py-2 text-gray-700 hover:text-primary transition"
                      onClick={() => setIsOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
                      className="block w-full text-left py-2 text-red-600 hover:text-red-700 transition"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        setAuthModalOpen(true)
                      }}
                      className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium"
                    >
                      Sign In / Register
                    </button>
                  </>
                )}
              </div>

              <Link href="/booking">
                <Button variant="primary" size="md" className="w-full">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  )
}