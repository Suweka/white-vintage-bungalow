'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminUser } from '@/lib/auth';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Bed,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminUser = getAdminUser();
    if (!adminUser) {
      router.push('/admin/login');
    } else {
      setUser(adminUser);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // Mock data - replace with real API calls
  const stats = [
    {
      title: 'Check In',
      value: '840',
      change: '+4.75%',
      trend: 'up',
      subtitle: 'Best last week',
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Check Out',
      value: '231',
      change: '+5.41%',
      trend: 'up',
      subtitle: 'Best last week',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Check Out',
      value: '87',
      change: '-2.34%',
      trend: 'down',
      subtitle: 'Worst last week',
      icon: XCircle,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Total Revenue',
      value: '$123,980',
      change: '+3.96%',
      trend: 'up',
      subtitle: 'Best last week',
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const roomAvailability = {
    totalRooms: 286,
    availableRooms: 32,
    bookedRooms: 87,
    unavailableRooms: 13,
  };

  const recentBookings = [
    {
      id: 1,
      guest: 'Sarah Johnson',
      room: 'Deluxe Room 101',
      checkIn: '2025-12-10',
      checkOut: '2025-12-13',
      status: 'confirmed',
      amount: 45000,
    },
    {
      id: 2,
      guest: 'Michael Chen',
      room: 'Junior Suite 202',
      checkIn: '2025-12-11',
      checkOut: '2025-12-15',
      status: 'confirmed',
      amount: 88000,
    },
    {
      id: 3,
      guest: 'Emma Wilson',
      room: 'Family Room 303',
      checkIn: '2025-12-12',
      checkOut: '2025-12-14',
      status: 'pending',
      amount: 56000,
    },
    {
      id: 4,
      guest: 'David Brown',
      room: 'Deluxe Room 104',
      checkIn: '2025-12-10',
      checkOut: '2025-12-12',
      status: 'cancelled',
      amount: 30000,
    },
  ];

  const tasks = [
    { id: 1, title: 'Set Up Conference Room B for 10 AM Meeting', time: '9:00 AM', priority: 'high' },
    { id: 2, title: 'Restock Housekeeping Supplies on 3rd Floor', time: '10:30 AM', priority: 'medium' },
    { id: 3, title: 'Inspect and Clean the Pool Area', time: '2:00 PM', priority: 'low' },
  ];

  const bookingPlatforms = [
    { name: 'Direct Booking', percentage: 62, color: 'bg-primary' },
    { name: 'Booking.com', percentage: 12, color: 'bg-blue-500' },
    { name: 'Others', percentage: 26, color: 'bg-gray-400' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stat.change}
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1">{stat.title}</div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.subtitle}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Room Availability */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Room Availability</h3>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Total Rooms</span>
                <span className="font-semibold">{roomAvailability.totalRooms}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-400 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Available Rooms</span>
                <span className="font-semibold text-green-600">{roomAvailability.availableRooms}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Booked Rooms</span>
                <span className="font-semibold text-blue-600">{roomAvailability.bookedRooms}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Out of Service</span>
                <span className="font-semibold text-red-600">{roomAvailability.unavailableRooms}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '13%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Revenue</h3>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="h-48 flex items-end justify-between gap-2">
            {[40, 60, 45, 75, 55, 80].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t ${i === 4 ? 'bg-accent' : 'bg-primary'}`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500">
                  {['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking by Platform */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Booking by Platform</h3>
            <button className="text-sm text-primary hover:underline">Details</button>
          </div>
          <div className="space-y-4">
            {bookingPlatforms.map((platform, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700">{platform.name}</span>
                  <span className="font-semibold">{platform.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${platform.color} h-2 rounded-full`}
                    style={{ width: `${platform.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reservations */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Reservations</h3>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>All</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 border-b">
                  <th className="pb-3">Guest</th>
                  <th className="pb-3">Room</th>
                  <th className="pb-3">Check-in</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <span className="font-medium">{booking.guest}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{booking.room}</td>
                    <td className="py-4 text-sm text-gray-600">{booking.checkIn}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 font-semibold">LKR {booking.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Tasks</h3>
            <button className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
              +
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border-l-4 ${
                  task.priority === 'high'
                    ? 'bg-red-50 border-red-500'
                    : task.priority === 'medium'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock size={12} />
                  <span>{task.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Rating */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-6">Overall Rating</h3>
        <div className="flex items-center gap-12">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">4.6</div>
            <div className="text-sm text-gray-600">Impressive</div>
            <div className="text-xs text-gray-500">1000 reviews</div>
          </div>

          <div className="flex-1 space-y-3">
            {[
              { label: 'Facilities', score: 4.4 },
              { label: 'Cleanliness', score: 4.7 },
              { label: 'Services', score: 4.6 },
              { label: 'Location', score: 4.5 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="font-semibold">{item.score}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${(item.score / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}