'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
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
  Tag,
  Loader2,
  ExternalLink,
} from 'lucide-react';

type BookingStep = 'dates' | 'details' | 'payment' | 'confirmation';

const ROOMS = [
  {
    id: 'deluxe-room',
    name: 'Deluxe Room',
    price: 15000,
    maxGuests: 2,
    image: '/images/rooms/deluxe.jpeg',
  },
  {
    id: 'junior-suite',
    name: 'Junior Suite',
    price: 22000,
    maxGuests: 3,
    image: '/images/rooms/junior.jpeg',
  },
  {
    id: 'family-room',
    name: 'Family Room',
    price: 28000,
    maxGuests: 4,
    image: '/images/rooms/family.jpeg',
  },
  {
    id: 'premium-suite',
    name: 'Premium Suite',
    price: 35000,
    maxGuests: 2,
    image: '/images/rooms/premium.jpeg',
  },
];

function parseLocalDate(dateStr: string): Date | null {
  const d = new Date(dateStr + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function BookingPageContent() {
  const searchParams = useSearchParams();

  const [selectedRooms, setSelectedRooms] = useState<string[]>(() => {
    const p = searchParams.get('room');
    return p && ROOMS.some(r => r.id === p) ? [p] : ['deluxe-room'];
  });

  const [checkInDate, setCheckInDate] = useState<Date | null>(() => {
    const p = searchParams.get('checkIn');
    return p ? parseLocalDate(p) : null;
  });

  const [checkOutDate, setCheckOutDate] = useState<Date | null>(() => {
    const p = searchParams.get('checkOut');
    return p ? parseLocalDate(p) : null;
  });

  const [guests, setGuests] = useState<number>(() => {
    const p = searchParams.get('guests');
    return p ? (parseInt(p) || 2) : 2;
  });

  const [currentMonth, setCurrentMonth] = useState(() => {
    const p = searchParams.get('checkIn');
    if (p) {
      const d = parseLocalDate(p);
      if (d) return new Date(d.getFullYear(), d.getMonth());
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth());
  });

  const [currentStep, setCurrentStep] = useState<BookingStep>('dates');

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

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingReference, setBookingReference] = useState('');

  const selectedRoomObjects = ROOMS.filter(r => selectedRooms.includes(r.id));
  const totalMaxGuests = selectedRoomObjects.reduce((sum, r) => sum + r.maxGuests, 0) || 1;
  const totalNightlyRate = selectedRoomObjects.reduce((sum, r) => sum + r.price, 0);

  const handleRoomToggle = (roomId: string) => {
    const isSelected = selectedRooms.includes(roomId);
    if (isSelected && selectedRooms.length === 1) return;
    const newSelected = isSelected
      ? selectedRooms.filter(id => id !== roomId)
      : [...selectedRooms, roomId];
    const newMax = ROOMS.filter(r => newSelected.includes(r.id)).reduce((sum, r) => sum + r.maxGuests, 0);
    setSelectedRooms(newSelected);
    if (guests > newMax) setGuests(newMax);
  };

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return { nights: 0, subtotal: 0, discount: 0, tax: 0, total: 0 };
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const subtotal = nights * totalNightlyRate;
    const discount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
    const tax = (subtotal - discount) * 0.1;
    return { nights, subtotal, discount, tax, total: subtotal - discount + tax };
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'Invalid coupon code');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({ code: data.code, discountPercent: data.discountPercent });
        setCouponError('');
      }
    } catch {
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const totals = calculateTotal();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const handleDateClick = (date: Date) => {
    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(date);
      setCheckOutDate(null);
    } else if (checkInDate && !checkOutDate) {
      if (date > checkInDate) setCheckOutDate(date);
      else { setCheckInDate(date); setCheckOutDate(null); }
    }
  };

  const isDateSelected = (date: Date | null) => {
    if (!date) return false;
    return (checkInDate?.getTime() === date.getTime()) || (checkOutDate?.getTime() === date.getTime());
  };

  const isDateInRange = (date: Date | null) => {
    if (!date || !checkInDate || !checkOutDate) return false;
    return date > checkInDate && date < checkOutDate;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

  const handleGuestDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setGuestDetails({ ...guestDetails, [e.target.name]: e.target.value });
  };

  const canProceedToDetails = checkInDate && checkOutDate && selectedRooms.length > 0;
  const canProceedToPayment = guestDetails.firstName && guestDetails.lastName && guestDetails.email && guestDetails.phone;

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      // Step 1 — persist the booking
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rooms: selectedRooms,
          checkIn: checkInDate?.toISOString().split('T')[0],
          checkOut: checkOutDate?.toISOString().split('T')[0],
          guests,
          guestDetails,
          paymentMethod,
          couponCode: appliedCoupon?.code || null,
          totalAmount: totals.total,
        }),
      });
      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) {
        setSubmitError(bookingData.error || 'Failed to create booking. Please try again.');
        return;
      }

      const bookingNumber: string = bookingData.bookingNumber;
      setBookingReference(bookingNumber);

      // Step 2 — bank transfer: show confirmation screen directly
      if (paymentMethod === 'bank') {
        setCurrentStep('confirmation');
        return;
      }

      // Step 3 — online payment: get PayHere form fields and redirect
      const payRes = await fetch('/api/payments/payhere/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingNumber }),
      });
      const payData = await payRes.json();

      if (!payRes.ok) {
        // PayHere not configured yet — fall back to confirmation with a notice
        if (payRes.status === 503) {
          setSubmitError('Payment gateway not configured. Your booking is saved — please contact us to complete payment.');
          setCurrentStep('confirmation');
          return;
        }
        setSubmitError(payData.error || 'Payment initiation failed. Please try again.');
        return;
      }

      // Auto-submit a hidden form to PayHere's hosted checkout page
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payData.checkoutUrl;
      Object.entries(payData.fields as Record<string, string>).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();

    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
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
                    {steps.findIndex(s => s.id === currentStep) > index ? <Check size={20} /> : step.icon}
                  </div>
                  <span className="ml-3 hidden sm:block font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && <div className="w-16 sm:w-24 h-0.5 bg-gray-300 mx-2" />}
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

                {/* Room Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Room(s)
                    <span className="ml-2 text-xs text-gray-400 font-normal">You can select multiple rooms</span>
                  </label>
                  <div className="space-y-3">
                    {ROOMS.map((r) => {
                      const isSelected = selectedRooms.includes(r.id);
                      return (
                        <div
                          key={r.id}
                          onClick={() => handleRoomToggle(r.id)}
                          className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'border-primary bg-primary-light'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <img
                            src={r.image}
                            alt={r.name}
                            className="w-16 h-14 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900">{r.name}</h4>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(r.price)}/night &middot; Max {r.maxGuests} guests
                            </p>
                          </div>
                          {/* View Details link — stops propagation so it doesn't toggle the card */}
                          <a
                            href={`/rooms/${r.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0 px-2 py-1 rounded hover:bg-primary-light transition-colors"
                            title="View room details"
                          >
                            <ExternalLink size={13} />
                            Details
                          </a>
                          <div
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected ? 'bg-primary border-primary' : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check size={14} className="text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {selectedRooms.length > 1 && (
                    <p className="mt-2 text-sm text-primary font-medium">
                      {selectedRooms.length} rooms selected &middot; {formatCurrency(totalNightlyRate)}/night combined
                    </p>
                  )}
                </div>

                {/* Number of Guests */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                    <span className="ml-2 text-xs text-gray-400 font-normal">(max {totalMaxGuests} across selected rooms)</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    {[...Array(totalMaxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} Guest{i > 0 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calendar */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-lg font-semibold">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {days.map((date, index) => {
                      if (!date) return <div key={`empty-${index}`} className="aspect-square" />;
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

                  <div className="flex items-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-primary rounded" /><span className="text-gray-600">Selected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-primary-light rounded" /><span className="text-gray-600">In Range</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-200 rounded" /><span className="text-gray-600">Unavailable</span>
                    </div>
                  </div>

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
                        <p className="text-sm text-gray-600 mt-2">{totals.nights} night{totals.nights !== 1 ? 's' : ''}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button variant="primary" size="lg" disabled={!canProceedToDetails} onClick={() => setCurrentStep('details')}>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" name="firstName" value={guestDetails.firstName} onChange={handleGuestDetailsChange} required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="John" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" name="lastName" value={guestDetails.lastName} onChange={handleGuestDetailsChange} required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Doe" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input type="email" name="email" value={guestDetails.email} onChange={handleGuestDetailsChange} required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input type="tel" name="phone" value={guestDetails.phone} onChange={handleGuestDetailsChange} required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+94 12 345 6789" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select name="country" value={guestDetails.country} onChange={handleGuestDetailsChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select Country</option>
                      <option value="LK">Sri Lanka</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="IN">India</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input type="text" name="address" value={guestDetails.address} onChange={handleGuestDetailsChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your address" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
                    <textarea name="specialRequests" value={guestDetails.specialRequests} onChange={handleGuestDetailsChange} rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Any special requests or requirements..." />
                  </div>
                </form>

                <div className="mt-6 flex gap-4 justify-between">
                  <Button variant="outline" size="lg" onClick={() => setCurrentStep('dates')}>Back</Button>
                  <Button variant="primary" size="lg" disabled={!canProceedToPayment} onClick={() => setCurrentStep('payment')}>
                    Continue to Payment <ChevronRight size={20} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-heading font-bold mb-6">Payment Method</h2>

                {/* Online payment via PayHere */}
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Pay Online via PayHere</p>
                <div className="space-y-3 mb-4">
                  {[
                    { value: 'card'    as const, label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex',           icon: <CreditCard className="text-primary" size={24} /> },
                    { value: 'helapay' as const, label: 'HelaPay',              sub: 'Dialog Genie, Frimi & more',       icon: <div className="w-6 h-6 bg-blue-500 rounded" /> },
                    { value: 'webxpay' as const, label: 'WebXPay',              sub: 'Local Sri Lankan payment gateway', icon: <div className="w-6 h-6 bg-green-500 rounded" /> },
                  ].map((m) => (
                    <div key={m.value} onClick={() => setPaymentMethod(m.value)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === m.value ? 'border-primary bg-primary-light' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-center gap-3">
                        {m.icon}
                        <div>
                          <h3 className="font-semibold text-sm">{m.label}</h3>
                          <p className="text-xs text-gray-500">{m.sub}</p>
                        </div>
                        {paymentMethod === m.value && <Check className="ml-auto text-primary" size={18} />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bank transfer */}
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Manual Payment</p>
                <div
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all mb-6 ${paymentMethod === 'bank' ? 'border-primary bg-primary-light' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-500 rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">Direct Bank Transfer</h3>
                      <p className="text-xs text-gray-500">Pay to our account — booking confirmed after receipt</p>
                    </div>
                    {paymentMethod === 'bank' && <Check className="text-primary" size={18} />}
                  </div>
                </div>

                {/* Bank details — shown only when bank is selected */}
                {paymentMethod === 'bank' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-sm space-y-1">
                    <p className="font-semibold text-gray-700 mb-2">Bank Transfer Details</p>
                    <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-medium">Commercial Bank of Ceylon</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Account Name</span><span className="font-medium">White Vintage Bungalow</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Account No.</span><span className="font-medium">8000123456</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Branch</span><span className="font-medium">Nuwara Eliya</span></div>
                    <p className="text-xs text-gray-400 mt-2">Use your booking reference as the payment reference.</p>
                  </div>
                )}

                {/* Coupon */}
                <div className="mb-6">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                    <Tag size={15} /> Coupon Code
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-300 rounded-lg">
                      <span className="text-sm text-green-700 font-medium">
                        <Check size={14} className="inline mr-1" />
                        <strong>{appliedCoupon.code}</strong> — {appliedCoupon.discountPercent}% off applied!
                      </span>
                      <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:underline ml-2">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input type="text" value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm uppercase tracking-wider" />
                      <button onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50 flex items-center gap-1">
                        {couponLoading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} /> {couponError}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1" />
                    <span className="text-sm text-gray-700">
                      I agree to the <a href="/terms" className="text-primary hover:underline">Terms and Conditions</a> and{' '}
                      <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <div className="flex gap-4 justify-between">
                  <Button variant="outline" size="lg" onClick={() => setCurrentStep('details')} disabled={submitting}>
                    Back
                  </Button>
                  <Button variant="primary" size="lg" disabled={!agreedToTerms || submitting} onClick={handleSubmit}>
                    {submitting ? (
                      <><Loader2 size={18} className="animate-spin mr-2 inline" /> Processing...</>
                    ) : 'Confirm Booking'}
                  </Button>
                </div>
                {submitError && (
                  <p className="mt-3 text-sm text-red-600 flex items-center justify-center gap-1">
                    <AlertCircle size={14} /> {submitError}
                  </p>
                )}
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
                  Booking Reference: <span className="text-primary">{bookingReference}</span>
                </p>

                <div className="bg-primary-light p-6 rounded-lg mb-6 text-left">
                  <h3 className="font-semibold mb-4">Booking Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guest Name:</span>
                      <span className="font-medium">{guestDetails.firstName} {guestDetails.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room{selectedRoomObjects.length > 1 ? 's' : ''}:</span>
                      <span className="font-medium text-right max-w-[60%]">{selectedRoomObjects.map(r => r.name).join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">{checkInDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">{checkOutDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
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
                  <Button variant="primary" size="lg">View Booking</Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.href = '/'}>Return to Home</Button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-heading font-semibold mb-4">Booking Summary</h3>

              <div className="mb-4 pb-4 border-b space-y-3">
                {selectedRoomObjects.map((r) => (
                  <div key={r.id} className="flex items-center gap-3">
                    <img src={r.image} alt={r.name} className="w-16 h-12 object-cover rounded-md flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{r.name}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(r.price)}/night</p>
                    </div>
                  </div>
                ))}
                <p className="text-sm text-gray-600">{guests} Guest{guests > 1 ? 's' : ''}</p>
              </div>

              {checkInDate && checkOutDate && (
                <div className="mb-4 pb-4 border-b space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium">{checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium">{checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{totals.nights} night{totals.nights > 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}

              {checkInDate && checkOutDate && (
                <div className="space-y-2">
                  {selectedRoomObjects.map((r) => (
                    <div key={r.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate mr-2">{r.name} × {totals.nights}n</span>
                      <span className="font-medium flex-shrink-0">{formatCurrency(r.price * totals.nights)}</span>
                    </div>
                  ))}
                  {appliedCoupon && totals.discount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm">
                      <span>Discount ({appliedCoupon.discountPercent}% — {appliedCoupon.code})</span>
                      <span className="font-medium">−{formatCurrency(totals.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees (10%)</span>
                    <span className="font-medium">{formatCurrency(totals.tax)}</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              )}

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

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
