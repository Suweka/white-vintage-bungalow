'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getReservationsData } from '@/lib/admin-actions';

type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

interface Reservation {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  amount: number;
  status: ReservationStatus;
  guests: number;
}

export default function ReservationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | 'all'>('all');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchReservations() {
    setLoading(true);
    setError(false);
    const data = await getReservationsData();
    if (data) {
      setReservations(data);
    } else {
      setError(true);
    }
    setLoading(false);
  }

  useEffect(() => { fetchReservations(); }, []);

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || res.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending':   return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default:          return 'bg-gray-100 text-gray-700';
    }
  };

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
        <p className="text-gray-600">Failed to load reservations data.</p>
        <button onClick={fetchReservations} className="px-4 py-2 bg-primary text-white rounded-lg">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Reservations</h1>
          <p className="text-gray-600">Manage all guest reservations</p>
        </div>
        <button onClick={fetchReservations} className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary">
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
              placeholder="Search by guest name, email, or booking ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ReservationStatus | 'all')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
              <Plus size={20} />
              <span className="hidden sm:inline">New Reservation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Booking ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Guest</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Room</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dates</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {reservations.length === 0
                      ? 'No reservations yet. Bookings will appear here once guests book.'
                      : 'No reservations match your search.'}
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary text-sm">{reservation.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{reservation.guestName}</p>
                        <p className="text-sm text-gray-500">{reservation.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{reservation.room}</p>
                      <p className="text-xs text-gray-500">{reservation.guests} guest{reservation.guests > 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-700">{reservation.checkIn} → {reservation.checkOut}</p>
                        <p className="text-gray-500">{reservation.nights} night{reservation.nights > 1 ? 's' : ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">LKR {reservation.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors" title="View">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors" title="Cancel">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Total Reservations</p>
          <p className="text-3xl font-bold text-primary">{reservations.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Confirmed</p>
          <p className="text-3xl font-bold text-green-600">{reservations.filter(r => r.status === 'confirmed').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{reservations.filter(r => r.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-primary">
            LKR {reservations.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
