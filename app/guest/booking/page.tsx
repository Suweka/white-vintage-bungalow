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
  AlertCircle,
} from 'lucide-react';

type BookingStep = 'dates' | 'details' | 'payment' | 'confirmation';

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('dates');
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);
  
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

  // Mock room data
  const roomDetails = {
    name: 'Deluxe Room',
    pricePerNight: 15000,
    image: '/images/rooms/deluxe.jpg',
  };

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return { nights: 0, subtotal: 0, tax: 0, total: 0 };
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const subtotal = nights * roomDetails.pricePerNight;
    const tax = subtotal * 0.1; // 10% tax
    return { nights, subtotal, tax, total: subtotal + tax };
  };

  const totals = calculateTotal();

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
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <BookingCalendar
                  onDateSelect={handleDateSelect}
                  unavailableDates={[]}
                />

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
                  Booking Reference: <span className="text-primary">WVB-2025-001</span>
                </p>

                <div className="bg-primary-light p-6 rounded-lg mb-6 text-left">
                  <h3 className="font-semibold mb-4">Booking Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guest Name:</span>
                      <span className="font-medium">{guestDetails.firstName} {guestDetails.lastName}</span>
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
                      <span className="text-gray-600">Room Type:</span>
                      <span className="font-medium">{roomDetails.name}</span>
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
                <div className="h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg mb-3"></div>
                <h4 className="font-semibold">{roomDetails.name}</h4>
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
                      {formatCurrency(roomDetails.pricePerNight)} × {totals.nights} night{totals.nights > 1 ? 's' : ''}
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