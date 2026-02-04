'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11)); // December 2025

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const bookings = {
    '10': [{ room: '101', guest: 'Sarah Johnson', type: 'Check-in' }],
    '12': [{ room: '202', guest: 'Michael Chen', type: 'Check-out' }],
    '14': [{ room: '303', guest: 'Emma Wilson', type: 'Check-in' }],
    '15': [{ room: '104', guest: 'David Brown', type: 'Check-in' }],
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Calendar</h1>
        <p className="text-gray-600">View and manage bookings and events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-2xl font-heading font-bold">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 py-3">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              const dateStr = date ? date.getDate().toString() : '';
              const hasBooking = bookings[dateStr as keyof typeof bookings];
              const isToday = date && new Date().toDateString() === date.toDateString();

              return (
                <div
                  key={index}
                  className={`aspect-square p-2 rounded-lg border-2 transition-all ${
                    !date
                      ? 'bg-transparent border-transparent'
                      : isToday
                      ? 'border-primary bg-primary-light'
                      : hasBooking
                      ? 'border-accent bg-accent-light'
                      : 'border-gray-200 bg-white hover:border-primary hover:bg-primary-light'
                  }`}
                >
                  {date && (
                    <div className="h-full flex flex-col">
                      <p className={`text-sm font-semibold ${isToday ? 'text-primary' : 'text-gray-700'}`}>
                        {date.getDate()}
                      </p>
                      {hasBooking && (
                        <div className="mt-1 text-xs">
                          {hasBooking.map((booking, i) => (
                            <p key={i} className="bg-blue-100 text-blue-700 px-1 rounded truncate">
                              {booking.room}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary rounded"></div>
              <span className="text-sm text-gray-600">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-accent rounded bg-accent-light"></div>
              <span className="text-sm text-gray-600">Booking Event</span>
            </div>
          </div>
        </div>

        {/* Sidebar - Upcoming Events */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <button className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark">
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Event 1 */}
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="font-semibold text-sm text-blue-900">Check-in</p>
                <p className="text-xs text-blue-700 mt-1">Room 101 - Sarah Johnson</p>
                <p className="text-xs text-blue-600 mt-1">Dec 10, 2025</p>
              </div>

              {/* Event 2 */}
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="font-semibold text-sm text-green-900">Check-out</p>
                <p className="text-xs text-green-700 mt-1">Room 202 - Michael Chen</p>
                <p className="text-xs text-green-600 mt-1">Dec 12, 2025</p>
              </div>

              {/* Event 3 */}
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="font-semibold text-sm text-purple-900">Check-in</p>
                <p className="text-xs text-purple-700 mt-1">Room 303 - Emma Wilson</p>
                <p className="text-xs text-purple-600 mt-1">Dec 14, 2025</p>
              </div>

              {/* Event 4 */}
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="font-semibold text-sm text-orange-900">Check-in</p>
                <p className="text-xs text-orange-700 mt-1">Room 104 - David Brown</p>
                <p className="text-xs text-orange-600 mt-1">Dec 15, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
