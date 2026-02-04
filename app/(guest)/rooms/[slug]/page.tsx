'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  Maximize,
  Wifi,
  Coffee,
  Tv,
  Wind,
  Utensils,
  Bath,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Calendar,
} from 'lucide-react';

export default function RoomDetailsPage({ params }: { params: { slug: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  // Mock data - replace with API call based on params.slug
  const room = {
    id: 'deluxe-room',
    name: 'Luxury Double Bed',
    price: 15000,
    originalPrice: 18000,
    maxGuests: 2,
    size: 350,
    beds: '1 King Bed',
    description: 'Experience ultimate comfort in our spacious Luxury Double Bed room. Featuring elegant colonial-era decor combined with modern amenities, this room offers stunning views of the surrounding tea plantations. Perfect for couples seeking a romantic getaway or business travelers wanting a peaceful retreat.',
    images: [
      '/images/rooms/deluxe-1.jpg',
      '/images/rooms/deluxe-2.jpg',
      '/images/rooms/deluxe-3.jpg',
      '/images/rooms/deluxe-4.jpg',
    ],
    amenities: {
      room: ['King Size Bed', 'Work Desk', 'Wardrobe', 'Seating Area', 'Mountain View'],
      bathroom: ['Shower', 'Bathtub', 'Hair Dryer', 'Premium Toiletries', 'Hot Water'],
      technology: ['Free WiFi', 'Smart TV', 'Safe', 'Telephone', 'AC'],
      food: ['Mini Bar', 'Coffee/Tea Maker', 'Room Service', 'Complimentary Breakfast'],
    },
    policies: {
      checkIn: '2:00 PM',
      checkOut: '11:00 AM',
      cancellation: 'Free cancellation up to 24 hours before check-in',
      smoking: 'No smoking',
      pets: 'Pets not allowed',
    },
    reviews: [
      {
        name: 'Sarah Johnson',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Absolutely stunning room with incredible views. The bed was so comfortable and the staff was amazing!',
        avatar: '/images/avatars/1.jpg',
      },
      {
        name: 'Michael Chen',
        rating: 5,
        date: '1 month ago',
        comment: 'Best hotel experience in Nuwara Eliya. The room was spotless and had everything we needed.',
        avatar: '/images/avatars/2.jpg',
      },
      {
        name: 'Emma Wilson',
        rating: 4,
        date: '2 months ago',
        comment: 'Beautiful colonial charm with modern comforts. Highly recommend for a romantic getaway.',
        avatar: '/images/avatars/3.jpg',
      },
    ],
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  const averageRating = room.reviews.reduce((acc, r) => acc + r.rating, 0) / room.reviews.length;

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[500px]">
          {/* Main Image */}
          <div
            className="md:col-span-3 relative bg-gray-300 cursor-pointer overflow-hidden group"
            onClick={() => setShowLightbox(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500" />
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
              View All Photos
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="hidden md:grid grid-rows-2 gap-2">
            <div className="bg-gray-300 relative overflow-hidden cursor-pointer" onClick={() => setShowLightbox(true)}>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500" />
            </div>
            <div className="bg-gray-300 relative overflow-hidden cursor-pointer" onClick={() => setShowLightbox(true)}>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-heading font-bold">{room.name}</h1>
                <div className="flex items-center gap-2">
                  <Star className="fill-accent text-accent" size={20} />
                  <span className="text-xl font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-500">({room.reviews.length} reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span>Up to {room.maxGuests} Guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize size={20} />
                  <span>{room.size} sqft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath size={20} />
                  <span>{room.beds}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-4">About This Room</h2>
              <p className="text-gray-700 leading-relaxed">{room.description}</p>
            </div>

            {/* Room Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-6">Room Amenities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Room Features */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Maximize size={20} className="text-primary" />
                    Room Features
                  </h3>
                  <ul className="space-y-2">
                    {room.amenities.room.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <Check size={16} className="text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bathroom */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Bath size={20} className="text-primary" />
                    Bathroom
                  </h3>
                  <ul className="space-y-2">
                    {room.amenities.bathroom.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <Check size={16} className="text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technology */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Wifi size={20} className="text-primary" />
                    Technology
                  </h3>
                  <ul className="space-y-2">
                    {room.amenities.technology.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <Check size={16} className="text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Food & Beverage */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Coffee size={20} className="text-primary" />
                    Food & Beverage
                  </h3>
                  <ul className="space-y-2">
                    {room.amenities.food.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <Check size={16} className="text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Rules & Regulations */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-heading font-semibold mb-4">Rules & Regulations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-primary" size={20} />
                    <span className="font-semibold">Check-in/Check-out</span>
                  </div>
                  <p className="text-gray-700">Check-in: {room.policies.checkIn}</p>
                  <p className="text-gray-700">Check-out: {room.policies.checkOut}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <X className="text-primary" size={20} />
                    <span className="font-semibold">Cancellation</span>
                  </div>
                  <p className="text-gray-700">{room.policies.cancellation}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <X size={16} className="text-red-500" />
                    {room.policies.smoking}
                  </li>
                  <li className="flex items-center gap-2">
                    <X size={16} className="text-red-500" />
                    {room.policies.pets}
                  </li>
                </ul>
              </div>
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-6">Guest Reviews</h2>
              
              <div className="space-y-6">
                {room.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{review.name}</h4>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="fill-accent text-accent" size={16} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-primary-light p-6 rounded-lg shadow-lg">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary">{formatCurrency(room.price)}</span>
                  <span className="text-gray-500 line-through">{formatCurrency(room.originalPrice)}</span>
                </div>
                <p className="text-gray-600">per night (includes taxes)</p>
              </div>

              {/* Booking Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {[...Array(room.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} Guest{i > 0 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button variant="primary" size="lg" className="w-full mb-4">
                Book Now
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>Free cancellation within 24 hours</p>
              </div>

              {/* Contact */}
              <div className="mt-6 pt-6 border-t border-gray-300">
                <p className="text-sm text-gray-600 mb-3">Need help booking?</p>
                <Button variant="outline" size="md" className="w-full">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X size={32} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300"
          >
            <ChevronLeft size={48} />
          </button>

          <div className="max-w-5xl w-full aspect-video bg-gradient-to-br from-gray-700 to-gray-800" />

          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300"
          >
            <ChevronRight size={48} />
          </button>

          <div className="absolute bottom-4 text-white">
            {currentImageIndex + 1} / {room.images.length}
          </div>
        </div>
      )}
    </div>
  );
}