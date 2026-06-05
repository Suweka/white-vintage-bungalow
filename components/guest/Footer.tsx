'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Loader2 } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to connect to the server.');
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Instagram Gallery Section */}
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <Instagram className="inline-block text-accent mb-2" size={32} />
            <h3 className="text-xl font-heading font-semibold">Follow Our Instagram</h3>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              "/images/instagram/insta1.png",
              "/images/instagram/insta2.png",
              "/images/instagram/insta3.jpeg",
              "/images/instagram/insta4.jpeg",
              "/images/instagram/insta5.jpeg",
              "/images/instagram/insta6.jpeg",
            ].map((src, index) => (
      <a 
          key={index} 
          href="https://www.instagram.com/"
          target="_blank"
          className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
      >
      <img
        src={src}
        alt={`Instagram ${index}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </a>
  ))}
</div>

        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4">White Vintage Bungalow</h3>
            <p className="text-gray-400 mb-4">
              Experience the charm of colonial-era hospitality in the heart of Nuwara Eliya, 
              Sri Lanka's Little England.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4">EXPLORE</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-accent transition-colors">About Hotel</Link></li>
              <li><Link href="/rooms" className="hover:text-accent transition-colors">Rooms</Link></li>
              <li><Link href="/gallery" className="hover:text-accent transition-colors">Gallery</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Services</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4">CONTACT</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-accent mt-1 flex-shrink-0" />
                <span>78/5 Bakers Park, 18 Dawson Hills, Nuwara Eliya, LK</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <span>+94 777 180 599</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <span>whitevintagebunglow@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4">NEWSLETTER</h4>
            <p className="text-gray-400 mb-4">Subscribe to get special offers and updates</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@domain.com"
                  required
                  disabled={status === 'loading'}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-accent text-gray-900 px-4 py-2 rounded-md hover:bg-accent-light transition-colors font-medium disabled:opacity-50"
                >
                  {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : '→'}
                </button>
              </div>
              {message && (
                <p className={`text-xs ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}
            </form>
            <label className="flex items-center gap-2 mt-3 text-sm text-gray-400">
              <input type="checkbox" className="rounded" required />
              I agree to all terms and policies
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© Copyright 2026 White Vintage Bungalow. All Rights Reserved</p>
          <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-accent transition-colors">Terms &amp; Conditions</Link>
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/refund-policy" className="hover:text-accent transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};