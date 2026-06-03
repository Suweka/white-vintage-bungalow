'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  Maximize,
  Wifi,
  Coffee,
  Bath,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Calendar,
} from 'lucide-react';

interface RoomInfo {
  name: string;
  price: number;
  originalPrice: number;
  maxGuests: number;
  size: number;
  beds: string;
  description: string;
  image: string;
}

const ROOM_BY_SLUG: Record<string, RoomInfo> = {
  'deluxe-room': {
    name: 'Deluxe Room',
    price: 15000,
    originalPrice: 18000,
    maxGuests: 2,
    size: 350,
    beds: '1 King Bed',
    description: 'Spacious room with stunning views of the tea plantations and modern amenities for a comfortable stay. Perfect for couples or solo business travellers seeking comfort.',
    image: '/images/rooms/deluxe.jpeg',
  },
  'junior-suite': {
    name: 'Junior Suite',
    price: 22000,
    originalPrice: 26000,
    maxGuests: 3,
    size: 450,
    beds: '1 King Bed + Sofa Bed',
    description: 'Elegant suite featuring a separate living area and premium furnishings for an enhanced experience. Ideal for those who appreciate a little extra space and style.',
    image: '/images/rooms/junior.jpeg',
  },
  'family-room': {
    name: 'Family Room',
    price: 28000,
    originalPrice: 32000,
    maxGuests: 4,
    size: 550,
    beds: '2 Queen Beds',
    description: 'Perfect for families with interconnected rooms and child-friendly amenities. Enjoy a comfortable stay with plenty of space for the whole family to relax and unwind.',
    image: '/images/rooms/family.jpeg',
  },
  'single-room': {
    name: 'Single Room',
    price: 12000,
    originalPrice: 14000,
    maxGuests: 1,
    size: 280,
    beds: '1 Single Bed',
    description: 'Cosy room perfect for solo travellers seeking comfort and privacy at an excellent price. Everything you need for a restful stay in the hills.',
    image: '/images/rooms/single.jpeg',
  },
  'premium-suite': {
    name: 'Premium Suite',
    price: 35000,
    originalPrice: 42000,
    maxGuests: 2,
    size: 600,
    beds: '1 King Bed',
    description: 'Luxurious suite with panoramic views, private balcony, and exclusive amenities for a truly indulgent experience. The pinnacle of colonial comfort.',
    image: '/images/rooms/premium.jpeg',
  },
  'garden-view': {
    name: 'Garden View Room',
    price: 18000,
    originalPrice: 21000,
    maxGuests: 2,
    size: 380,
    beds: '1 Queen Bed',
    description: 'Peaceful room overlooking our landscaped gardens with direct garden access. Wake up to birdsong and lush greenery every morning.',
    image: '/images/rooms/garden.jpeg',
  },
};

const SHARED_AMENITIES = {
  room: ['King Size Bed', 'Work Desk', 'Wardrobe', 'Seating Area', 'Mountain View'],
  bathroom: ['Shower', 'Bathtub', 'Hair Dryer', 'Premium Toiletries', 'Hot Water'],
  technology: ['Free WiFi', 'Smart TV', 'Safe', 'Telephone', 'AC'],
  food: ['Mini Bar', 'Coffee/Tea Maker', 'Room Service', 'Complimentary Breakfast'],
};

const SHARED_POLICIES = {
  checkIn: '2:00 PM',
  checkOut: '11:00 AM',
  cancellation: 'Free cancellation up to 24 hours before check-in',
  smoking: 'No smoking',
  pets: 'Pets not allowed',
};

const SHARED_REVIEWS = [
  {
    name: 'Sarah Johnson',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Absolutely stunning room with incredible views. The bed was so comfortable and the staff was amazing!',
  },
  {
    name: 'Michael Chen',
    rating: 5,
    date: '1 month ago',
    comment: 'Best hotel experience in Nuwara Eliya. The room was spotless and had everything we needed.',
  },
  {
    name: 'Emma Wilson',
    rating: 4,
    date: '2 months ago',
    comment: 'Beautiful colonial charm with modern comforts. Highly recommend for a romantic getaway.',
  },
];

export default function RoomDetailsPage({ params: { slug } }: { params: { slug: string } }) {
  const router = useRouter();

  const roomInfo = ROOM_BY_SLUG[slug] || ROOM_BY_SLUG['deluxe-room'];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(Math.min(2, roomInfo.maxGuests));

  const images = [roomInfo.image, roomInfo.image, roomInfo.image, roomInfo.image];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const averageRating = SHARED_REVIEWS.reduce((acc, r) => acc + r.rating, 0) / SHARED_REVIEWS.length;

  const handleBookNow = () => {
    const params = new URLSearchParams({ room: slug, guests: guests.toString() });
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[500px]">
          <div
            className="md:col-span-3 relative overflow-hidden cursor-pointer group"
            onClick={() => setShowLightbox(true)}
          >
            <img src={roomInfo.image} alt={roomInfo.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
              View All Photos
            </div>
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2">
            <div className="relative overflow-hidden cursor-pointer" onClick={() => setShowLightbox(true)}>
              <img src={roomInfo.image} alt={roomInfo.name} className="w-full h-full object-cover" />
            </div>
            <div className="relative overflow-hidden cursor-pointer" onClick={() => setShowLightbox(true)}>
              <img src={roomInfo.image} alt={roomInfo.name} className="w-full h-full object-cover" />
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
                <h1 className="text-4xl font-heading font-bold">{roomInfo.name}</h1>
                <div className="flex items-center gap-2">
                  <Star className="fill-accent text-accent" size={20} />
                  <span className="text-xl font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-500">({SHARED_REVIEWS.length} reviews)</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span>Up to {roomInfo.maxGuests} Guest{roomInfo.maxGuests > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize size={20} />
                  <span>{roomInfo.size} sqft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath size={20} />
                  <span>{roomInfo.beds}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-4">About This Room</h2>
              <p className="text-gray-700 leading-relaxed">{roomInfo.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-6">Room Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Maximize size={20} className="text-primary" /> Room Features
                  </h3>
                  <ul className="space-y-2">
                    {SHARED_AMENITIES.room.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <Check size={16} className="text-primary" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Bath size={20} className="text-primary" /> Bathroom
                  </h3>
                  <ul className="space-y-2">
                    {SHARED_AMENITIES.bathroom.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <Check size={16} className="text-primary" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Wifi size={20} className="text-primary" /> Technology
                  </h3>
                  <ul className="space-y-2">
                    {SHARED_AMENITIES.technology.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <Check size={16} className="text-primary" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Coffee size={20} className="text-primary" /> Food & Beverage
                  </h3>
                  <ul className="space-y-2">
                    {SHARED_AMENITIES.food.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <Check size={16} className="text-primary" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-heading font-semibold mb-4">Rules & Regulations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-primary" size={20} />
                    <span className="font-semibold">Check-in/Check-out</span>
                  </div>
                  <p className="text-gray-700">Check-in: {SHARED_POLICIES.checkIn}</p>
                  <p className="text-gray-700">Check-out: {SHARED_POLICIES.checkOut}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <X className="text-primary" size={20} />
                    <span className="font-semibold">Cancellation</span>
                  </div>
                  <p className="text-gray-700">{SHARED_POLICIES.cancellation}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <X size={16} className="text-red-500" /> {SHARED_POLICIES.smoking}
                  </li>
                  <li className="flex items-center gap-2">
                    <X size={16} className="text-red-500" /> {SHARED_POLICIES.pets}
                  </li>
                </ul>
              </div>
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-6">Guest Reviews</h2>
              <div className="space-y-6">
                {SHARED_REVIEWS.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {review.name.charAt(0)}
                      </div>
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
                  <span className="text-4xl font-bold text-primary">{formatCurrency(roomInfo.price)}</span>
                  <span className="text-gray-500 line-through">{formatCurrency(roomInfo.originalPrice)}</span>
                </div>
                <p className="text-gray-600">per night (includes taxes)</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  >
                    {[...Array(roomInfo.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} Guest{i > 0 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button variant="primary" size="lg" className="w-full mb-4" onClick={handleBookNow}>
                Book Now
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>Free cancellation within 24 hours</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-300">
                <p className="text-sm text-gray-600 mb-3">Need help booking?</p>
                <Button variant="outline" size="md" className="w-full" onClick={() => router.push('/contact')}>
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
          <button onClick={() => setShowLightbox(false)} className="absolute top-4 right-4 text-white hover:text-gray-300">
            <X size={32} />
          </button>
          <button onClick={prevImage} className="absolute left-4 text-white hover:text-gray-300">
            <ChevronLeft size={48} />
          </button>
          <div className="max-w-5xl w-full aspect-video">
            <img src={images[currentImageIndex]} alt={roomInfo.name} className="w-full h-full object-contain" />
          </div>
          <button onClick={nextImage} className="absolute right-4 text-white hover:text-gray-300">
            <ChevronRight size={48} />
          </button>
          <div className="absolute bottom-4 text-white text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
