'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Wifi, Users, Square, DollarSign } from 'lucide-react';

type RoomStatus = 'available' | 'booked' | 'maintenance' | 'cleaning';

interface Room {
  id: string;
  name: string;
  roomNumber: string;
  type: string;
  status: RoomStatus;
  capacity: number;
  price: number;
  amenities: string[];
  floor: number;
  lastCleaned: string;
}

export default function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<RoomStatus | 'all'>('all');

  const rooms: Room[] = [
    {
      id: 'R001',
      name: 'Deluxe Room',
      roomNumber: '101',
      type: 'Deluxe',
      status: 'available',
      capacity: 2,
      price: 15000,
      amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
      floor: 1,
      lastCleaned: '2025-12-14',
    },
    {
      id: 'R002',
      name: 'Junior Suite',
      roomNumber: '202',
      type: 'Suite',
      status: 'booked',
      capacity: 3,
      price: 25000,
      amenities: ['WiFi', 'TV', 'AC', 'Jacuzzi', 'Balcony'],
      floor: 2,
      lastCleaned: '2025-12-13',
    },
    {
      id: 'R003',
      name: 'Family Room',
      roomNumber: '303',
      type: 'Family',
      status: 'booked',
      capacity: 4,
      price: 35000,
      amenities: ['WiFi', 'TV', 'AC', 'Kitchen', 'Dining Area'],
      floor: 3,
      lastCleaned: '2025-12-12',
    },
    {
      id: 'R004',
      name: 'Deluxe Room',
      roomNumber: '104',
      type: 'Deluxe',
      status: 'cleaning',
      capacity: 2,
      price: 15000,
      amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
      floor: 1,
      lastCleaned: '2025-12-14',
    },
    {
      id: 'R005',
      name: 'Executive Suite',
      roomNumber: '401',
      type: 'Executive',
      status: 'maintenance',
      capacity: 2,
      price: 45000,
      amenities: ['WiFi', 'TV', 'AC', 'Premium Amenities'],
      floor: 4,
      lastCleaned: '2025-12-10',
    },
    {
      id: 'R006',
      name: 'Standard Room',
      roomNumber: '105',
      type: 'Standard',
      status: 'available',
      capacity: 2,
      price: 10000,
      amenities: ['WiFi', 'TV', 'AC'],
      floor: 1,
      lastCleaned: '2025-12-14',
    },
  ];

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || room.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'booked':
        return 'bg-blue-100 text-blue-700';
      case 'cleaning':
        return 'bg-yellow-100 text-yellow-700';
      case 'maintenance':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Rooms</h1>
        <p className="text-gray-600">Manage hotel rooms and availability</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by room name, number, or type"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as RoomStatus | 'all')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="cleaning">Cleaning</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
              <Plus size={20} />
              <span className="hidden sm:inline">Add Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Room Image */}
            <div className="h-48 bg-gradient-to-br from-gray-300 to-gray-400 relative">
              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
              </span>
            </div>

            {/* Room Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{room.name}</h3>
                  <p className="text-sm text-gray-600">Room #{room.roomNumber} • Floor {room.floor}</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-gray-600">{room.capacity} Guests</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={16} className="text-gray-400" />
                  <span className="text-gray-600">LKR {room.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 font-medium mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.slice(0, 3).map((amenity, i) => (
                    <span key={i} className="bg-primary-light text-primary px-2 py-1 rounded text-xs font-medium">
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                      +{room.amenities.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Last Cleaned */}
              <div className="mb-4 pb-4 border-b">
                <p className="text-xs text-gray-600 font-medium">Last Cleaned</p>
                <p className="text-sm text-gray-700">{new Date(room.lastCleaned).toLocaleDateString()}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1">
                  <Eye size={16} />
                  <span className="text-sm">View</span>
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                  <Edit size={16} />
                  <span className="text-sm">Edit</span>
                </button>
                <button className="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-1">
                  <Trash2 size={16} />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No rooms found</p>
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
          <p className="text-gray-600 text-sm mb-2">Maintenance</p>
          <p className="text-3xl font-bold text-red-600">{rooms.filter(r => r.status === 'maintenance').length}</p>
        </div>
      </div>
    </div>
  );
}
