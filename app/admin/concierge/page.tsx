'use client';

import React, { useState } from 'react';
import { Search, Plus, CheckCircle, AlertCircle, Clock, Phone, MapPin, Zap } from 'lucide-react';

type RequestStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

interface ConciergeRequest {
  id: string;
  guestName: string;
  room: string;
  service: string;
  description: string;
  status: RequestStatus;
  priority: 'low' | 'medium' | 'high';
  requestTime: string;
  completedTime?: string;
  assignedTo: string;
  contact: string;
}

export default function ConciergePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'all'>('all');

  const requests: ConciergeRequest[] = [
    {
      id: 'CR001',
      guestName: 'Sarah Johnson',
      room: '101',
      service: 'Restaurant Reservation',
      description: 'Book a table for 2 at a local Italian restaurant for tonight at 7 PM',
      status: 'completed',
      priority: 'medium',
      requestTime: '2025-12-14 10:30 AM',
      completedTime: '2025-12-14 11:15 AM',
      assignedTo: 'James Wilson',
      contact: '+94 12 345 6789',
    },
    {
      id: 'CR002',
      guestName: 'Michael Chen',
      room: '202',
      service: 'Transportation',
      description: 'Arrange airport pickup for tomorrow at 3 PM',
      status: 'in-progress',
      priority: 'high',
      requestTime: '2025-12-14 02:15 PM',
      assignedTo: 'Maria Garcia',
      contact: '+94 98 765 4321',
    },
    {
      id: 'CR003',
      guestName: 'Emma Wilson',
      room: '303',
      service: 'Spa Booking',
      description: 'Schedule a couples massage for tomorrow afternoon',
      status: 'pending',
      priority: 'low',
      requestTime: '2025-12-14 03:45 PM',
      assignedTo: 'Unassigned',
      contact: '+94 55 123 4567',
    },
    {
      id: 'CR004',
      guestName: 'David Brown',
      room: '104',
      service: 'Tour Arrangement',
      description: 'Book a guided tea plantation tour for 3 people',
      status: 'in-progress',
      priority: 'high',
      requestTime: '2025-12-14 11:00 AM',
      assignedTo: 'Robert Khan',
      contact: '+94 77 890 1234',
    },
    {
      id: 'CR005',
      guestName: 'Lisa Anderson',
      room: '401',
      service: 'Dining Room Service',
      description: 'Special dietary requirements for dinner',
      status: 'completed',
      priority: 'medium',
      requestTime: '2025-12-14 05:30 PM',
      completedTime: '2025-12-14 06:15 PM',
      assignedTo: 'Chef Antonio',
      contact: '+94 33 456 7890',
    },
  ];

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.room.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return <Zap size={18} className="text-red-600" />;
    if (priority === 'medium') return <AlertCircle size={18} className="text-yellow-600" />;
    return <Clock size={18} className="text-blue-600" />;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Concierge</h1>
        <p className="text-gray-600">Manage guest requests and special services</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by guest, room, or service"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as RequestStatus | 'all')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
              <Plus size={20} />
              <span className="hidden sm:inline">New Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold">{request.guestName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Room {request.room} • {request.service}</p>
              </div>
              <div className="flex items-center gap-2">
                {getPriorityIcon(request.priority)}
              </div>
            </div>

            <p className="text-gray-700 mb-3">{request.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b">
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">Requested</p>
                <p className="text-sm text-gray-700">{request.requestTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">Assigned To</p>
                <p className="text-sm text-gray-700">{request.assignedTo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">Contact</p>
                <p className="text-sm text-gray-700 flex items-center gap-1">
                  <Phone size={14} />
                  {request.contact}
                </p>
              </div>
              {request.completedTime && (
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Completed</p>
                  <p className="text-sm text-green-700 flex items-center gap-1">
                    <CheckCircle size={14} />
                    {request.completedTime}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {request.status === 'pending' && (
                <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                  Start Processing
                </button>
              )}
              {request.status === 'in-progress' && (
                <button className="flex-1 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle size={16} />
                  Mark Complete
                </button>
              )}
              <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No requests found</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Total Requests</p>
          <p className="text-3xl font-bold text-primary">{requests.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{requests.filter(r => r.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">In Progress</p>
          <p className="text-3xl font-bold text-blue-600">{requests.filter(r => r.status === 'in-progress').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Completed</p>
          <p className="text-3xl font-bold text-green-600">{requests.filter(r => r.status === 'completed').length}</p>
        </div>
      </div>
    </div>
  );
}
