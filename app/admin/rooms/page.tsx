'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, DollarSign, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getRoomsData } from '@/lib/admin-actions';

type RoomStatus = 'available' | 'booked' | 'maintenance' | 'cleaning';

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  status: RoomStatus;
  activeTaskCount: number;
}

export default function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<RoomStatus | 'all'>('all');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchRooms() {
    setLoading(true);
    setError(false);
    const data = await getRoomsData();
    if (data) {
      setRooms(data);
    } else {
      setError(true);
    }
    setLoading(false);
  }

  useEffect(() => { fetchRooms(); }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case 'available':   return 'bg-green-100 text-green-700';
      case 'booked':      return 'bg-blue-100 text-blue-700';
      case 'cleaning':    return 'bg-yellow-100 text-yellow-700';
      case 'maintenance': return 'bg-red-100 text-red-700';
      default:            return 'bg-gray-100 text-gray-700';
    }
  };

  const statusLabel = (s: RoomStatus) => s.charAt(0).toUpperCase() + s.slice(1);

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
        <p className="text-gray-600">Failed to load rooms data.</p>
        <button onClick={fetchRooms} className="px-4 py-2 bg-primary text-white rounded-lg">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Rooms</h1>
          <p className="text-gray-600">Manage hotel rooms and availability</p>
        </div>
        <button onClick={fetchRooms} className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary">
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
              placeholder="Search by room name or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <div className="select-wrapper flex-1">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as RoomStatus | 'all')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
              <Plus size={20} />
              <span className="hidden sm:inline">Add Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">{rooms.length === 0 ? 'No rooms in database yet. Add rooms to get started.' : 'No rooms match your search.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Room Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-primary-light to-primary/20 relative flex items-center justify-center">
                <span className="text-primary/40 text-4xl font-bold">{room.name.charAt(0)}</span>
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                  {statusLabel(room.status)}
                </span>
              </div>

              {/* Room Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{room.name}</h3>
                  {room.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{room.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={16} className="text-gray-400" />
                    <span className="text-gray-600">LKR {room.price.toLocaleString()}/night</span>
                  </div>
                  {room.activeTaskCount > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle size={16} className="text-yellow-500" />
                      <span className="text-yellow-600">{room.activeTaskCount} active task{room.activeTaskCount > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Total Rooms</p>
          <p className="text-3xl font-bold text-primary">{rooms.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Available</p>
          <p className="text-3xl font-bold text-green-600">{rooms.filter(r => r.status === 'available').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Booked</p>
          <p className="text-3xl font-bold text-blue-600">{rooms.filter(r => r.status === 'booked').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Maintenance / Cleaning</p>
          <p className="text-3xl font-bold text-red-600">
            {rooms.filter(r => r.status === 'maintenance' || r.status === 'cleaning').length}
          </p>
        </div>
      </div>
    </div>
  );
}
