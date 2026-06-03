'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Mail, Phone, MapPin, Calendar, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getGuestsData } from '@/lib/admin-actions';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  totalStays: number;
  totalSpent: number;
  lastVisit: string | null;
  joinDate: string;
  type: 'registered' | 'guest';
}

export default function GuestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'registered' | 'guest'>('all');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchGuests() {
    setLoading(true);
    setError(false);
    const data = await getGuestsData();
    if (data) {
      setGuests(data);
    } else {
      setError(true);
    }
    setLoading(false);
  }

  useEffect(() => { fetchGuests(); }, []);

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || guest.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="text-red-500" size={40} />
        <p className="text-gray-600">Failed to load guests data.</p>
        <button onClick={fetchGuests} className="px-4 py-2 bg-primary text-white rounded-lg">Retry</button>
      </div>
    );
  }

  const totalRevenue = guests.reduce((sum, g) => sum + g.totalSpent, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Guests</h1>
          <p className="text-gray-600">Manage guest information and profiles</p>
        </div>
        <button onClick={fetchGuests} className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'registered' | 'guest')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Guests</option>
              <option value="registered">Registered Users</option>
              <option value="guest">Guest Checkout</option>
            </select>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
              <Plus size={20} />
              <span className="hidden sm:inline">Add Guest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guests Grid */}
      {filteredGuests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">
            {guests.length === 0
              ? 'No guests yet. Guest profiles will appear after their first booking.'
              : 'No guests match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuests.map((guest) => (
            <div key={guest.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {guest.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{guest.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      guest.type === 'registered' ? 'bg-primary-light text-primary' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {guest.type === 'registered' ? 'Registered' : 'Guest Checkout'}
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="View Details">
                  <Eye size={18} />
                </button>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-4 pb-4 border-b">
                {guest.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} className="flex-shrink-0" />
                    <a href={`mailto:${guest.email}`} className="hover:text-primary truncate">{guest.email}</a>
                  </div>
                )}
                {guest.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} className="flex-shrink-0" />
                    <a href={`tel:${guest.phone}`} className="hover:text-primary">{guest.phone}</a>
                  </div>
                )}
                {guest.country && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span>{guest.country}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{guest.totalStays}</p>
                  <p className="text-xs text-gray-500">Stays</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">
                    {guest.totalSpent > 0 ? `LKR ${(guest.totalSpent / 1000).toFixed(0)}k` : 'LKR 0'}
                  </p>
                  <p className="text-xs text-gray-500">Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    {guest.lastVisit ? new Date(guest.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                  </p>
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
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Total Guests</p>
          <p className="text-3xl font-bold text-primary">{guests.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Registered Users</p>
          <p className="text-3xl font-bold text-green-600">{guests.filter(g => g.type === 'registered').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-primary">LKR {totalRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
