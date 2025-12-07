'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCalendarProps {
  onDateSelect: (checkIn: Date | null, checkOut: Date | null) => void;
  unavailableDates?: Date[];
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onDateSelect,
  unavailableDates = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(
      (unavailable) =>
        unavailable.getDate() === date.getDate() &&
        unavailable.getMonth() === date.getMonth() &&
        unavailable.getFullYear() === date.getFullYear()
    );
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateInRange = (date: Date) => {
    if (!checkInDate || !checkOutDate) return false;
    return date > checkInDate && date < checkOutDate;
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (isDateInPast(selectedDate) || isDateUnavailable(selectedDate)) {
      return;
    }

    if (!checkInDate || (checkInDate && checkOutDate)) {
      // Select check-in date
      setCheckInDate(selectedDate);
      setCheckOutDate(null);
      setSelectingCheckOut(true);
      onDateSelect(selectedDate, null);
    } else if (selectingCheckOut) {
      // Select check-out date
      if (selectedDate > checkInDate) {
        setCheckOutDate(selectedDate);
        setSelectingCheckOut(false);
        onDateSelect(checkInDate, selectedDate);
      }
    }
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const prevMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    const today = new Date();
    if (newDate >= new Date(today.getFullYear(), today.getMonth())) {
      setCurrentMonth(newDate);
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isPast = isDateInPast(date);
      const isUnavailable = isDateUnavailable(date);
      const isCheckIn = checkInDate?.toDateString() === date.toDateString();
      const isCheckOut = checkOutDate?.toDateString() === date.toDateString();
      const isInRange = isDateInRange(date);
      const isDisabled = isPast || isUnavailable;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isDisabled}
          className={`h-12 flex items-center justify-center rounded-lg font-medium transition-all
            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-primary-light cursor-pointer'}
            ${isCheckIn || isCheckOut ? 'bg-primary text-white hover:bg-primary-dark' : ''}
            ${isInRange ? 'bg-primary-light text-primary' : ''}
            ${!isDisabled && !isCheckIn && !isCheckOut && !isInRange ? 'text-gray-700' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-semibold text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary-light rounded"></div>
          <span className="text-gray-600">In Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-gray-600">Unavailable</span>
        </div>
      </div>

      {/* Selected Dates Display */}
      {(checkInDate || checkOutDate) && (
        <div className="mt-6 p-4 bg-primary-light rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Check-in</p>
              <p className="font-semibold">
                {checkInDate ? checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Check-out</p>
              <p className="font-semibold">
                {checkOutDate ? checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
              </p>
            </div>
          </div>
          {checkInDate && checkOutDate && (
            <p className="mt-3 text-sm text-gray-600">
              {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} night(s)
            </p>
          )}
        </div>
      )}
    </div>
  );
};