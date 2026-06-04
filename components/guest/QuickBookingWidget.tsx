'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Users, ChevronLeft, ChevronRight, Minus, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// ── Mini calendar popover ──────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function MiniCalendar({
  selected,
  minDate,
  onSelect,
}: {
  selected: Date | null;
  minDate: Date;
  onSelect: (d: Date) => void;
}) {
  const init = selected ?? minDate;
  const [viewMonth, setViewMonth] = useState(new Date(init.getFullYear(), init.getMonth()));

  const y = viewMonth.getFullYear();
  const m = viewMonth.getMonth();
  const firstDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(y, m, i + 1)),
  ];

  const isDisabled = (d: Date) => d < minDate;
  const isSelected = (d: Date) => selected?.toDateString() === d.toDateString();

  return (
    <div className="p-4 w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setViewMonth(new Date(y, m - 1))}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {MONTH_NAMES[m]} {y}
        </span>
        <button
          onClick={() => setViewMonth(new Date(y, m + 1))}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="h-7 flex items-center justify-center text-xs font-medium text-gray-400">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {cells.map((d, i) =>
          d ? (
            <button
              key={i}
              disabled={isDisabled(d)}
              onClick={() => !isDisabled(d) && onSelect(d)}
              className={[
                'h-8 w-full flex items-center justify-center rounded-lg text-xs transition-colors',
                isDisabled(d)
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-primary-light text-gray-700',
                isSelected(d)
                  ? '!bg-primary text-white font-semibold'
                  : '',
              ].join(' ')}
            >
              {d.getDate()}
            </button>
          ) : (
            <div key={i} className="h-8" />
          )
        )}
      </div>
    </div>
  );
}

// ── Main widget ────────────────────────────────────────────────────────────────

function fmtDate(d: Date | null) {
  if (!d) return null;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function todayMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

type Picker = 'checkIn' | 'checkOut' | null;

export function QuickBookingWidget() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);
  const [openPicker, setOpenPicker] = useState<Picker>(null);
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close calendar on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenPicker(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (picker: Picker) =>
    setOpenPicker(prev => (prev === picker ? null : picker));

  const handleCheckIn = (d: Date) => {
    setCheckIn(d);
    if (checkOut && d >= checkOut) setCheckOut(null);
    setError('');
    setOpenPicker('checkOut'); // auto-advance to check-out
  };

  const handleCheckOut = (d: Date) => {
    setCheckOut(d);
    setError('');
    setOpenPicker(null);
  };

  const handleSearch = () => {
    setError('');
    const today = todayMidnight();
    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out dates.');
      return;
    }
    if (checkIn < today) {
      setError('Check-in date cannot be in the past.');
      return;
    }
    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date.');
      return;
    }
    router.push(`/booking?checkIn=${toISODate(checkIn)}&checkOut=${toISODate(checkOut)}&guests=${guests}`);
  };

  const today = todayMidnight();
  const checkOutMin = checkIn
    ? new Date(checkIn.getTime() + 86_400_000)
    : new Date(today.getTime() + 86_400_000);

  return (
    <div ref={containerRef}>
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">

        {/* Check In */}
        <div className="p-6 relative">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <CalendarDays size={13} className="text-primary" />
            Check In
          </p>
          <button
            onClick={() => toggle('checkIn')}
            className="w-full text-left focus:outline-none"
          >
            <span className={`text-base font-semibold ${checkIn ? 'text-gray-900' : 'text-gray-400'}`}>
              {fmtDate(checkIn) ?? 'Select date'}
            </span>
          </button>
          {openPicker === 'checkIn' && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-fadeIn">
              <MiniCalendar selected={checkIn} minDate={today} onSelect={handleCheckIn} />
            </div>
          )}
        </div>

        {/* Check Out */}
        <div className="p-6 relative">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <CalendarDays size={13} className="text-primary" />
            Check Out
          </p>
          <button
            onClick={() => toggle('checkOut')}
            className="w-full text-left focus:outline-none"
          >
            <span className={`text-base font-semibold ${checkOut ? 'text-gray-900' : 'text-gray-400'}`}>
              {fmtDate(checkOut) ?? 'Select date'}
            </span>
          </button>
          {openPicker === 'checkOut' && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-fadeIn">
              <MiniCalendar selected={checkOut} minDate={checkOutMin} onSelect={handleCheckOut} />
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="p-6">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <Users size={13} className="text-primary" />
            Guests
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGuests(g => Math.max(1, g - 1))}
              disabled={guests <= 1}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus size={13} />
            </button>
            <span className="font-semibold text-gray-900 min-w-[5rem] text-center text-base">
              {guests} {guests === 1 ? 'Guest' : 'Guests'}
            </span>
            <button
              onClick={() => setGuests(g => Math.min(8, g + 1))}
              disabled={guests >= 8}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="p-6 flex items-center">
          <Button variant="primary" size="lg" className="w-full" onClick={handleSearch}>
            Check Availability
          </Button>
        </div>
      </div>

      {error && (
        <div className="px-6 py-3 bg-red-50 border-t border-red-200 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
