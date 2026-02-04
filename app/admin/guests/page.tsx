'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  totalStays: number;
  totalSpent: number;
  lastVisit: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export default function GuestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const guests: Guest[] = [
    {
      id: 'G001',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+94 12 345 6789',
      country: 'United States',
      city: 'New York',
      totalStays: 3,
      totalSpent: 135000,
      lastVisit: '2025-12-13',
      joinDate: '2024-06-15',
      status: 'active',
    },
    {
      id: 'G002',
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '+94 98 765 4321',
      country: 'Australia',
      city: 'Sydney',
      totalStays: 2,
      totalSpent: 88000,
      lastVisit: '2025-12-15',
      joinDate: '2024-08-22',
      status: 'active',
    },
    {
      id: 'G003',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '+94 55 123 4567',
      country: 'United Kingdom',
      city: 'London',
      totalStays: 1,
      totalSpent: 56000,
      lastVisit: '2025-12-14',
      joinDate: '2024-10-10',
      status: 'active',
    },
    {
      id: 'G004',
      name: 'David Brown',
      email: 'david@example.com',
      phone: '+94 77 890 1234',
      country: 'Canada',
      city: 'Toronto',
      totalStays: 4,
      totalSpent: 180000,
      lastVisit: '2025-12-12',
      joinDate: '2023-05-03',
      status: 'active',
    },
    {
      id: 'G005',
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      phone: '+94 33 456 7890',
      country: 'Germany',
      city: 'Berlin',
      totalStays: 1,
      totalSpent: 75000,
      lastVisit: '2024-11-20',
      joinDate: '2024-11-18',
      status: 'inactive',
    },
  ];

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || guest.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Guests</h1>
        <p className="text-gray-600">Manage guest information and profiles</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by guest name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Guests</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
              <Plus size={20} />
              <span className="hidden sm:inline">Add Guest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuests.map((guest) => (
          <div key={guest.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {guest.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{guest.name}</h3>
                  <p className={`text-xs font-medium ${
                    guest.status === 'active' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="View Details">
                <Eye size={18} />
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} className="flex-shrink-0" />
                <a href={`mailto:${guest.email}`} className="hover:text-primary truncate">
                  {guest.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} className="flex-shrink-0" />
                <a href={`tel:${guest.phone}`} className="hover:text-primary">
                  {guest.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="flex-shrink-0" />
                <span>{guest.city}, {guest.country}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{guest.totalStays}</p>
                <p className="text-xs text-gray-500">Stays</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">LKR {(guest.totalSpent / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">Spent</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">{new Date(guest.lastVisit).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500">Last Visit</p>
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>Joined {new Date(guest.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredGuests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No guests found</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Total Guests</p>
          <p className="text-3xl font-bold text-primary">{guests.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Active Guests</p>
          <p className="text-3xl font-bold text-green-600">{guests.filter(g => g.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-primary">
            LKR {guests.reduce((sum, g) => sum + g.totalSpent, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
