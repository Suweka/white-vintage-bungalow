'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/rooms', label: 'Rooms & Suites' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:+94123456789" className="flex items-center gap-2 hover:text-accent">
              <Phone size={14} />
              <span>+94 (12) 345 6789</span>
            </a>
            <a href="mailto:info@whitevintage.com" className="flex items-center gap-2 hover:text-accent">
              <Mail size={14} />
              <span>info@whitevintage.com</span>
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
              <Link href="/booking">
                <Button variant="primary" size="md">
                  Book Now
                </Button>
              </Link>
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
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/booking">
                <Button variant="primary" size="md" className="w-full">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};