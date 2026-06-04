'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { RoomCard } from '@/components/guest/RoomCard';
import { QuickBookingWidget } from '@/components/guest/QuickBookingWidget';
import {
  Wifi,
  Coffee,
  Waves,
  Dumbbell,
  Car,
  UtensilsCrossed,
  Star,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function HomePage() {

  // Mock data - replace with API calls
  const rooms = [
    {
      id: 'deluxe-room',
      name: 'Deluxe Rooms',
      description: 'Spacious rooms with stunning views of the tea plantations and modern amenities for a comfortable stay.',
      price: 15000,
      maxGuests: 2,
      size: 350,
      image: '/images/rooms/deluxe.jpeg',
      badge: 'Best Value',
    },
    {
      id: 'junior-suite',
      name: 'Junior Suites',
      description: 'Elegant suites featuring separate living areas and premium furnishings for an enhanced experience.',
      price: 22000,
      maxGuests: 3,
      size: 450,
      image: '/images/rooms/junior.jpeg',
    },
    {
      id: 'family-room',
      name: 'Family Rooms',
      description: 'Perfect for families with interconnected rooms and child-friendly amenities.',
      price: 28000,
      maxGuests: 4,
      size: 550,
      image: '/images/rooms/family.jpeg',
      badge: 'Family Pick',
    },
  ];

  const services = [
    { icon: Dumbbell, title: 'Fitness Center', description: 'State-of-the-art equipment for your wellness routine' },
    { icon: Coffee, title: 'Jacuzzi', description: 'Relax and unwind in our heated jacuzzi' },
    { icon: Waves, title: 'Swimming Pool', description: 'Outdoor pool with mountain views' },
    { icon: UtensilsCrossed, title: 'Restaurant', description: 'Fine dining with local and international cuisine' },
    { icon: Car, title: 'Transportation', description: 'Airport pickup and local tour arrangements' },
    { icon: Wifi, title: 'WiFi Router', description: 'High-speed internet throughout the property' },
  ];

  const testimonials = [
    {
      name: 'John Andrew',
      rating: 5,
      text: 'Amazing experience! The colonial architecture combined with modern amenities made our stay unforgettable.',
      avatar: '/images/avatars/john.png',
    },
    {
      name: 'Sarah Mitchell',
      rating: 5,
      text: 'Best hotel in Nuwara Eliya! The staff was incredibly helpful and the rooms were spotless.',
      avatar: '/images/avatars/sarah.png',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <div className="mb-4 text-accent font-medium">LUXURY HOTEL & RESORT</div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
            White Vintage Bungalow
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Experience colonial elegance in the heart of Sri Lanka's hill country
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button variant="primary" size="lg">
                Book Your Stay
              </Button>
            </Link>
            <Link href="/rooms">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                Explore Rooms
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Down Indicator */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className="bg-white shadow-lg -mt-16 relative z-20 max-w-6xl mx-auto rounded-xl border border-gray-100">
        <QuickBookingWidget />
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-primary font-medium mb-2">ABOUT US</div>
              <h2 className="text-4xl font-heading font-bold mb-6">
                The Best Luxury Rooms And Suites
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                White Vintage Bungalow is a historic colonial-era property nestled in the 
                picturesque hills of Nuwara Eliya. Built in the early 1900s, our bungalow 
                has been carefully restored to preserve its original charm while incorporating 
                modern luxury amenities.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Surrounded by lush tea plantations and offering breathtaking views of the 
                misty mountains, we provide an authentic Sri Lankan hill country experience 
                with world-class hospitality.
              </p>
              <Link href="/about">
                <Button variant="primary" size="lg">
                  Learn More →
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-64 rounded-lg overflow-hidden">
                <img 
                  src="/images/about/about1.jpeg" 
                  alt="White Vintage Bungalow interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-64 rounded-lg overflow-hidden mt-8">
                <img 
                  src="/images/about/about2.jpeg" 
                  alt="Luxury suite" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="text-primary font-medium mb-2">ROOMS AND SUITES</div>
            <h2 className="text-4xl font-heading font-bold">The Best Luxury Rooms And Suites</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/rooms">
              <Button variant="outline" size="lg">
                View All Rooms →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="text-primary font-medium mb-2">OUR SERVICES</div>
            <h2 className="text-4xl font-heading font-bold">Get The Best Hotel Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow group"
              >
                <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <service.icon className="text-primary group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <video
              src="/videos/intro.mp4"
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-primary-light">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="text-primary font-medium mb-2">TESTIMONIALS</div>
            <h2 className="text-4xl font-heading font-bold">Amazing Feedback From Our Guests</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="fill-accent text-accent" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">Guest</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="text-primary font-medium mb-2">LOCATION</div>
              <h2 className="text-4xl font-heading font-bold mb-6">Visit Us in Nuwara Eliya</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-gray-600">78/5 Bakers Park, Dawson Hills, Nuwara Eliya</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="text-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold mb-1">Nearby Attractions</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Gregory Lake - 2 km</li>
                      <li>• Hakgala Botanical Garden - 5 km</li>
                      <li>• Victoria Park - 3 km</li>
                    </ul>
                  </div>
                </div>
              </div>
              <a 
                href="https://www.google.com/maps/search/78%2F5+Bakers+Park,+Dawson+Hills,+Nuwara+Eliya/@6.942114,80.793866,15z" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="lg">
                  Get Directions
                </Button>
              </a>
            </div>
            <div className="h-96 bg-gray-300 rounded-lg overflow-hidden relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.568038677998!2d80.79386617448296!3d6.942114618158248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae38127c9b1b06d%3A0x98ebbcd4fa73d315!2sWhite%20Vintage%20Bungalow!5e0!3m2!1sen!2slk!4v1765016591928!5m2!1sen!2slk"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-primary text-white py-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-heading font-bold mb-4">
            We Offer Every Month 20% Off for Our Subscribers
          </h2>
          <div className="flex gap-2 max-w-md mx-auto mt-8">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button variant="secondary" size="lg">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}