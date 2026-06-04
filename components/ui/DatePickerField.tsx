'use client';

import { useState, useRef, useEffect } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

// ── Mini-calendar (internal) ───────────────────────────────────────────────────

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
  const [view, setView] = useState(new Date(init.getFullYear(), init.getMonth()));

  const y = view.getFullYear();
  const m = view.getMonth();
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
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setView(new Date(y, m - 1))}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {MONTH_NAMES[m]} {y}
        </span>
        <button
          type="button"
          onClick={() => setView(new Date(y, m + 1))}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="h-7 flex items-center justify-center text-xs font-medium text-gray-400">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((d, i) =>
          d ? (
            <button
              key={i}
              type="button"
              disabled={isDisabled(d)}
              onClick={() => !isDisabled(d) && onSelect(d)}
              className={[
                'h-8 w-full flex items-center justify-center rounded-lg text-xs transition-colors',
                isDisabled(d)
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-primary-light text-gray-700',
                isSelected(d) ? '!bg-primary !text-white font-semibold' : '',
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

// ── Public component ───────────────────────────────────────────────────────────

interface Props {
  label?: string;
  value: Date | null;
  onChange: (d: Date) => void;
  minDate: Date;
  placeholder?: string;
  className?: string;
}

function fmt(d: Date | null) {
  return d
    ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;
}

export function DatePickerField({
  label,
  value,
  onChange,
  minDate,
  placeholder = 'Select date',
  className = '',
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-left"
      >
        <CalendarDays size={16} className="text-primary flex-shrink-0" />
        <span className={value ? 'text-gray-900 font-medium text-sm' : 'text-gray-400 text-sm'}>
          {fmt(value) ?? placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-fadeIn">
          <MiniCalendar
            selected={value}
            minDate={minDate}
            onSelect={d => { onChange(d); setOpen(false); }}
          />
        </div>
      )}
    </div>
  );
}
