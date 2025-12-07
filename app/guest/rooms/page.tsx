'use client';

import React, { useState } from 'react';
import { RoomCard } from '@/components/guest/RoomCard';
import { Button } from '@/components/ui/Button';
import { Search, SlidersHorizontal, Users, Bed } from 'lucide-react';

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGuests, setFilterGuests] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with API call
  const allRooms = [
    {
      id: 'deluxe-room',
      name: 'Deluxe Rooms',
      description: 'Spacious rooms with stunning views of the tea plantations and modern amenities for a comfortable stay.',
      price: 15000,
      maxGuests: 2,
      size: 350,
      image: '/images/rooms/deluxe.jpg',
      badge: 'Best Value',
      amenities: ['WiFi', 'Coffee', 'TV', 'AC'],
    },
    {
      id: 'junior-suite',
      name: 'Junior Suites',
      description: 'Elegant suites featuring separate living areas and premium furnishings for an enhanced experience.',
      price: 22000,
      maxGuests: 3,
      size: 450,
      image: '/images/rooms/junior.jpg',
      amenities: ['WiFi', 'Coffee', 'TV', 'AC', 'Minibar'],
    },
    {
      id: 'family-room',
      name: 'Family Rooms',
      description: 'Perfect for families with interconnected rooms and child-friendly amenities.',
      price: 28000,
      maxGuests: 4,
      size: 550,
      image: '/images/rooms/family.jpg',
      badge: 'Family Pick',
      amenities: ['WiFi', 'Coffee', 'TV', 'AC', 'Kitchen'],
    },
    {
      id: 'single-room',
      name: 'Single Rooms',
      description: 'Cozy rooms perfect for solo travelers seeking comfort and privacy.',
      price: 12000,
      maxGuests: 1,
      size: 280,
      image: '/images/rooms/single.jpg',
      amenities: ['WiFi', 'Coffee', 'TV'],
    },
    {
      id: 'premium-suite',
      name: 'Premium Suite',
      description: 'Luxurious suite with panoramic views, private balcony, and exclusive amenities.',
      price: 35000,
      maxGuests: 2,
      size: 600,
      image: '/images/rooms/premium.jpg',
      badge: 'Luxury',
      amenities: ['WiFi', 'Coffee', 'TV', 'AC', 'Minibar', 'Jacuzzi', 'Balcony'],
    },
    {
      id: 'garden-view',
      name: 'Garden View Room',
      description: 'Peaceful rooms overlooking our landscaped gardens with direct garden access.',
      price: 18000,
      maxGuests: 2,
      size: 380,
      image: '/images/rooms/garden.jpg',
      amenities: ['WiFi', 'Coffee', 'TV', 'AC', 'Garden Access'],
    },
  ];

  // Filter and sort logic
  const filteredRooms = allRooms
    .filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           room.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGuests = filterGuests === 'all' || room.maxGuests >= parseInt(filterGuests);
      return matchesSearch && matchesGuests;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'capacity':
          return b.maxGuests - a.maxGuests;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-heading font-bold mb-4">Our Rooms & Suites</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Choose from our collection of beautifully appointed rooms and suites
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white shadow-md sticky top-0 z-40 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 w-full md:w-auto">
              <select
                value={filterGuests}
                onChange={(e) => setFilterGuests(e.target.value)}
                className="flex-1 md:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Guests</option>
                <option value="1">1 Guest</option>
                <option value="2">2+ Guests</option>
                <option value="3">3+ Guests</option>
                <option value="4">4+ Guests</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 md:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="capacity">Guest Capacity</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden px-4 py-2 bg-primary text-white rounded-lg"
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-heading font-bold">
              {filteredRooms.length} Room{filteredRooms.length !== 1 ? 's' : ''} Available
            </h2>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="text-center py-20">
              <Bed className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No rooms found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
              <Button
                variant="primary"
                size="lg"
                className="mt-6"
                onClick={() => {
                  setSearchTerm('');
                  setFilterGuests('all');
                  setSortBy('recommended');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} {...room} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-light py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Our team is here to help you find the perfect room for your stay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              Contact Us
            </Button>
            <Button variant="outline" size="lg">
              View Gallery
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}