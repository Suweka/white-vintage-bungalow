'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { BookingCalendar } from '@/components/guest/BookingCalendar';
import { formatCurrency } from '@/lib/utils';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Check,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
} from 'lucide-react';

type BookingStep = 'dates' | 'details' | 'payment' | 'confirmation';

// Room data
const ROOMS = [
  {
    id: 'deluxe-room',
    name: 'Deluxe Room',
    price: 15000,
    maxGuests: 2,
    image: '/images/rooms/deluxe.jpeg',
  },
  {
    id: 'suite-room',
    name: 'Suite Room',
    price: 25000,
    maxGuests: 3,
    image: '/images/rooms/suite.jpeg',
  },
  {
    id: 'family-room',
    name: 'Family Room',
    price: 35000,
    maxGuests: 4,
    image: '/images/rooms/family.jpeg',
  },
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    price: 45000,
    maxGuests: 2,
    image: '/images/rooms/executive.jpeg',
  },
];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('dates');
  const [selectedRoom, setSelectedRoom] = useState('deluxe-room');
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // February 2026
  
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    specialRequests: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'helapay' | 'webxpay' | 'bank'>('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Get selected room data
  const room = ROOMS.find(r => r.id === selectedRoom) || ROOMS[0];

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return { nights: 0, subtotal: 0, tax: 0, total: 0 };
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const subtotal = nights * room.price;
    const tax = subtotal * 0.1; // 10% tax
    return { nights, subtotal, tax, total: subtotal + tax };
  };

  const totals = calculateTotal();

  // Calendar generation
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const handleDateClick = (date: Date) => {
    if (!checkInDate || (checkInDate && checkOutDate)) {
      // Set check-in date
      setCheckInDate(date);
      setCheckOutDate(null);
    } else if (checkInDate && !checkOutDate) {
      // Set check-out date
      if (date > checkInDate) {
        setCheckOutDate(date);
      } else {
        // If selected date is before check-in, reset
        setCheckInDate(date);
        setCheckOutDate(null);
      }
    }
  };

  const isDateSelected = (date: Date | null) => {
    if (!date) return false;
    if (checkInDate && date.getTime() === checkInDate.getTime()) return true;
    if (checkOutDate && date.getTime() === checkOutDate.getTime()) return true;
    return false;
  };

  const isDateInRange = (date: Date | null) => {
    if (!date || !checkInDate || !checkOutDate) return false;
    return date > checkInDate && date < checkOutDate;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleDateSelect = (checkIn: Date | null, checkOut: Date | null) => {
    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);
  };

  const handleGuestDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setGuestDetails({
      ...guestDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Update guests when room changes to not exceed max
  const handleRoomChange = (roomId: string) => {
    setSelectedRoom(roomId);
    const newRoom = ROOMS.find(r => r.id === roomId);
    if (newRoom && guests > newRoom.maxGuests) {
      setGuests(newRoom.maxGuests);
    }
  };

  const canProceedToDetails = checkInDate && checkOutDate;
  const canProceedToPayment = guestDetails.firstName && guestDetails.lastName && guestDetails.email && guestDetails.phone;

  const handleSubmit = () => {
    // Handle booking submission
    setCurrentStep('confirmation');
  };

  const steps = [
    { id: 'dates', label: 'Select Dates', icon: '1' },
    { id: 'details', label: 'Guest Details', icon: '2' },
    { id: 'payment', label: 'Payment', icon: '3' },
    { id: 'confirmation', label: 'Confirmation', icon: '4' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                      currentStep === step.id
                        ? 'bg-primary text-white'
                        : steps.findIndex(s => s.id === currentStep) > index
                        ? 'bg-primary text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {steps.findIndex(s => s.id === currentStep) > index ? (
                      <Check size={20} />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="ml-3 hidden sm:block font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 sm:w-24 h-0.5 bg-gray-300 mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Select Dates */}
            {currentStep === 'dates' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-heading font-bold mb-6">Select Your Dates</h2>
                
                {/* Room Selection Dropdown */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Room
                  </label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => handleRoomChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    {ROOMS.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} - {formatCurrency(room.price)} per night (Max {room.maxGuests} guests)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    {[...Array(room.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} Guest{i > 0 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calendar */}
                <div className="border border-gray-200 rounded-lg p-4">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-lg font-semibold">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-600 py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {days.map((date, index) => {
                      if (!date) {
                        return <div key={`empty-${index}`} className="aspect-square" />;
                      }

                      const isSelected = isDateSelected(date);
                      const inRange = isDateInRange(date);
                      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => !isPast && handleDateClick(date)}
                          disabled={isPast}
                          className={`
                            aspect-square flex items-center justify-center rounded-lg text-sm
                            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                            ${isSelected ? 'bg-primary text-white hover:bg-primary/90' : ''}
                            ${inRange ? 'bg-primary-light' : ''}
                          `}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-primary rounded"></div>
                      <span className="text-gray-600">Selected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-primary-light rounded"></div>
                      <span className="text-gray-600">In Range</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-200 rounded"></div>
                      <span className="text-gray-600">Unavailable</span>
                    </div>
                  </div>

                  {/* Selected Dates Display */}
                  {checkInDate && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Check-in</p>
                          <p className="font-semibold">{formatDate(checkInDate)}</p>
                        </div>
                        {checkOutDate && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Check-out</p>
                            <p className="font-semibold">{formatDate(checkOutDate)}</p>
                          </div>
                        )}
                      </div>
                      {totals.nights > 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                          {totals.nights} night{totals.nights !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    size="lg"
                    disabled={!canProceedToDetails}
                    onClick={() => setCurrentStep('details')}
                  >
                    Continue to Guest Details
                    <ChevronRight size={20} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Guest Details */}
            {currentStep === 'details' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-heading font-bold mb-6">Guest Information</h2>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="firstName"
                          value={guestDetails.firstName}
                          onChange={handleGuestDetailsChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="John"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="lastName"
                          value={guestDetails.lastName}
                          onChange={handleGuestDetailsChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={guestDetails.email}
                        onChange={handleGuestDetailsChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="phone"
                        value={guestDetails.phone}
                        onChange={handleGuestDetailsChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+94 12 345 6789"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={guestDetails.country}
                      onChange={handleGuestDetailsChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Country</option>
                      <option value="LK">Sri Lanka</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="IN">India</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="address"
                        value={guestDetails.address}
                        onChange={handleGuestDetailsChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={guestDetails.specialRequests}
                      onChange={handleGuestDetailsChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Any special requests or requirements..."
                    />
                  </div>
                </form>

                <div className="mt-6 flex gap-4 justify-between">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep('dates')}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    disabled={!canProceedToPayment}
                    onClick={() => setCurrentStep('payment')}
                  >
                    Continue to Payment
                    <ChevronRight size={20} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-heading font-bold mb-6">Payment Method</h2>

                <div className="space-y-4 mb-6">
                  {/* Credit/Debit Card */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-primary bg-primary-light' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-primary" size={24} />
                      <div>
                        <h3 className="font-semibold">Credit / Debit Card</h3>
                        <p className="text-sm text-gray-600">Visa, Mastercard, Amex</p>
                      </div>
                    </div>
                  </div>

                  {/* HelaPay */}
                  <div
                    onClick={() => setPaymentMethod('helapay')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'helapay' ? 'border-primary bg-primary-light' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded"></div>
                      <div>
                        <h3 className="font-semibold">HelaPay</h3>
                        <p className="text-sm text-gray-600">Sri Lankan payment gateway</p>
                      </div>
                    </div>
                  </div>

                  {/* WebXPay */}
                  <div
                    onClick={() => setPaymentMethod('webxpay')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'webxpay' ? 'border-primary bg-primary-light' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded"></div>
                      <div>
                        <h3 className="font-semibold">WebXPay</h3>
                        <p className="text-sm text-gray-600">Online payment gateway</p>
                      </div>
                    </div>
                  </div>

                  {/* Bank Transfer */}
                  <div
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'bank' ? 'border-primary bg-primary-light' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-500 rounded"></div>
                      <div>
                        <h3 className="font-semibold">Direct Bank Transfer</h3>
                        <p className="text-sm text-gray-600">Pay directly to our bank account</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                <div className="flex gap-4 justify-between">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep('details')}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    disabled={!agreedToTerms}
                    onClick={handleSubmit}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 'confirmation' && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="text-green-600" size={40} />
                </div>
                <h2 className="text-3xl font-heading font-bold mb-4">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-2">Thank you for your reservation</p>
                <p className="text-lg font-semibold mb-6">
                  Booking Reference: <span className="text-primary">WVB-2026-001</span>
                </p>

                <div className="bg-primary-light p-6 rounded-lg mb-6 text-left">
                  <h3 className="font-semibold mb-4">Booking Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guest Name:</span>
                      <span className="font-medium">{guestDetails.firstName} {guestDetails.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Type:</span>
                      <span className="font-medium">{room.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">
                        {checkInDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">
                        {checkOutDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-medium">{guests} Guest{guests > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">{formatCurrency(totals.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg mb-6 text-left">
                  <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-gray-700">
                    A confirmation email has been sent to <strong>{guestDetails.email}</strong> with all the booking details.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="primary" size="lg">
                    View Booking
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.href = '/'}>
                    Return to Home
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-heading font-semibold mb-4">Booking Summary</h3>

              {/* Room Info */}
              <div className="mb-4 pb-4 border-b">
                <img 
                  src={room.image} 
                  alt={room.name}
                  className="h-32 w-full object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold">{room.name}</h4>
                <p className="text-sm text-gray-600">{guests} Guest{guests > 1 ? 's' : ''}</p>
              </div>

              {/* Dates */}
              {checkInDate && checkOutDate && (
                <div className="mb-4 pb-4 border-b space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium">
                      {checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium">
                      {checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{totals.nights} night{totals.nights > 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              {checkInDate && checkOutDate && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {formatCurrency(room.price)} × {totals.nights} night{totals.nights > 1 ? 's' : ''}
                    </span>
                    <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees (10%)</span>
                    <span className="font-medium">{formatCurrency(totals.tax)}</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="mt-6 p-4 bg-primary-light rounded-lg">
                <p className="text-sm text-gray-700">
                  <Check className="inline text-primary mr-2" size={16} />
                  Free cancellation within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}