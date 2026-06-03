'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, RotateCcw, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function CancelContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || '—';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="text-red-500" size={44} />
        </div>

        <h1 className="text-3xl font-heading font-bold mb-3">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was not completed. Your booking has been placed on hold — no charge was made.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-8 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Booking Reference</span>
            <span className="font-semibold">{ref}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold text-yellow-600">Payment Pending</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-8">
          You can retry payment or contact us to pay via bank transfer. Your booking reference is valid for 24 hours.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.href = `/booking?ref=${ref}`}
          >
            <RotateCcw size={18} className="mr-2" />
            Try Again
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.location.href = '/contact'}>
            <Phone size={18} className="mr-2" />
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BookingCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>}>
      <CancelContent />
    </Suspense>
  );
}
