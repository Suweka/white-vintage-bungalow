'use client';

import React, { useState } from 'react';
import { Search, Plus, Trash2, Archive, Star, Reply, Clock } from 'lucide-react';

type MessageStatus = 'unread' | 'read' | 'archived';

interface Message {
  id: string;
  sender: string;
  email: string;
  subject: string;
  preview: string;
  message: string;
  date: string;
  status: MessageStatus;
  starred: boolean;
  category: 'booking' | 'inquiry' | 'complaint' | 'feedback';
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<MessageStatus | 'all'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const messages: Message[] = [
    {
      id: 'MSG001',
      sender: 'Sarah Johnson',
      email: 'sarah@example.com',
      subject: 'Room Upgrade Request',
      preview: 'Hi, I would like to upgrade my room to a suite if available...',
      message: 'Hi, I would like to upgrade my room to a suite if available during my stay. Would that be possible?',
      date: '2025-12-14 09:30 AM',
      status: 'unread',
      starred: false,
      category: 'booking',
    },
    {
      id: 'MSG002',
      sender: 'Michael Chen',
      email: 'michael@example.com',
      subject: 'Inquiry about Group Bookings',
      preview: 'We are planning a corporate retreat and would like to know about group rates...',
      message: 'We are planning a corporate retreat for 20 people. Could you provide information about group rates and availability?',
      date: '2025-12-13 02:15 PM',
      status: 'unread',
      starred: true,
      category: 'inquiry',
    },
    {
      id: 'MSG003',
      sender: 'Emma Wilson',
      email: 'emma@example.com',
      subject: 'Complaint about Noise',
      preview: 'There was excessive noise from the adjacent room last night...',
      message: 'There was excessive noise from the adjacent room last night. We couldn\'t sleep properly. This is unacceptable.',
      date: '2025-12-12 08:45 AM',
      status: 'read',
      starred: false,
      category: 'complaint',
    },
    {
      id: 'MSG004',
      sender: 'David Brown',
      email: 'david@example.com',
      subject: 'Thank You for the Great Service',
      preview: 'Your staff was incredibly helpful and the accommodation was excellent...',
      message: 'Your staff was incredibly helpful and the accommodation was excellent. We had a wonderful stay and will definitely come back!',
      date: '2025-12-11 11:20 AM',
      status: 'read',
      starred: true,
      category: 'feedback',
    },
    {
      id: 'MSG005',
      sender: 'Lisa Anderson',
      email: 'lisa@example.com',
      subject: 'Availability for Next Month',
      preview: 'Hello, I am interested in booking a room for next month. Could you...',
      message: 'Hello, I am interested in booking a room for next month. Could you provide availability and pricing information?',
      date: '2025-12-10 03:50 PM',
      status: 'archived',
      starred: false,
      category: 'inquiry',
    },
  ];

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || msg.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'booking':
        return 'bg-blue-100 text-blue-700';
      case 'inquiry':
        return 'bg-green-100 text-green-700';
      case 'complaint':
        return 'bg-red-100 text-red-700';
      case 'feedback':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Messages</h1>
        <p className="text-gray-600">Manage guest inquiries and communications</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by sender, subject, or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as MessageStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`p-4 rounded-lg cursor-pointer transition-all border-l-4 ${
                message.status === 'unread'
                  ? 'bg-blue-50 border-primary'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{message.sender}</h3>
                    {message.status === 'unread' && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{message.subject}</h4>
                  <p className="text-sm text-gray-600">{message.preview}</p>
                </div>
                <button
                  className={`p-1 rounded-lg transition-colors ${
                    message.starred
                      ? 'text-yellow-500 bg-yellow-50'
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Star size={18} fill={message.starred ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(message.category)}`}>
                    {message.category.charAt(0).toUpperCase() + message.category.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={14} />
                  {message.date}
                </div>
              </div>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No messages found</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        {selectedMessage && (
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="flex items-start justify-between mb-4 pb-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{selectedMessage.sender}</h3>
                <p className="text-sm text-gray-600">{selectedMessage.email}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">{selectedMessage.subject}</h4>
              <p className="text-sm text-gray-600 mb-4">
                {new Date(selectedMessage.date).toLocaleString()}
              </p>
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                {selectedMessage.message}
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                <Reply size={18} />
                Reply
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Archive size={18} />
                Archive
              </button>
              <button className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Total Messages</p>
          <p className="text-3xl font-bold text-primary">{messages.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Unread</p>
          <p className="text-3xl font-bold text-blue-600">{messages.filter(m => m.status === 'unread').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Complaints</p>
          <p className="text-3xl font-bold text-red-600">{messages.filter(m => m.category === 'complaint').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Starred</p>
          <p className="text-3xl font-bold text-yellow-600">{messages.filter(m => m.starred).length}</p>
        </div>
      </div>
    </div>
  );
}
