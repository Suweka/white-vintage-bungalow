'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Upload, Loader2, ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

async function uploadToCloudinary(file: File): Promise<string> {
  // Step 1 — get a signed upload signature from our server
  const sigRes = await fetch('/api/upload/signature');
  if (!sigRes.ok) throw new Error('Could not get upload signature');
  const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

  // Step 2 — upload directly to Cloudinary (bypasses Vercel body-size limit)
  const form = new FormData();
  form.append('file', file);
  form.append('signature', signature);
  form.append('timestamp', String(timestamp));
  form.append('api_key', apiKey);
  form.append('folder', folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: form }
  );
  if (!uploadRes.ok) throw new Error('Image upload failed');
  const data = await uploadRes.json();
  return data.secure_url as string;
}

function UploadReceiptContent() {
  const searchParams  = useSearchParams();
  const refFromUrl    = searchParams.get('ref') || '';

  const [bookingRef,     setBookingRef]     = useState(refFromUrl);
  const [transactionRef, setTransactionRef] = useState('');
  const [transferDate,   setTransferDate]   = useState('');
  const [amountPaid,     setAmountPaid]     = useState('');
  const [notes,          setNotes]          = useState('');

  const [receiptFile,    setReceiptFile]    = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [uploading,      setUploading]      = useState(false);
  const [submitting,     setSubmitting]     = useState(false);
  const [success,        setSuccess]        = useState(false);
  const [error,          setError]          = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, etc.)');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Image must be smaller than 8 MB.');
      return;
    }
    setError('');
    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange({ target: { files: e.dataTransfer.files } } as any);
  };

  const clearFile = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRef.trim() || !transactionRef.trim() || !transferDate || !amountPaid) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');

    let receiptUrl = '';

    // Upload image to Cloudinary if one was selected
    if (receiptFile) {
      setUploading(true);
      try {
        receiptUrl = await uploadToCloudinary(receiptFile);
      } catch (err) {
        setError('Image upload failed. Please try again or submit without an image.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings/upload-receipt', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          bookingNumber: bookingRef.trim().toUpperCase(),
          transactionRef,
          transferDate,
          amountPaid:    Number(amountPaid),
          receiptUrl,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Submission failed.'); return; }
      setSuccess(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500" size={44} />
          </div>
          <h1 className="text-2xl font-heading font-bold mb-3">Receipt Submitted!</h1>
          <p className="text-gray-600 mb-4">
            Thank you. We have received your payment details for booking{' '}
            <span className="font-semibold text-primary">{bookingRef}</span>.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Our team will verify your transfer and confirm your booking within <strong>2–4 hours</strong> during business hours.
            You will receive a confirmation email once approved.
          </p>
          <Button variant="primary" size="lg" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const isBusy = uploading || submitting;

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="container mx-auto max-w-xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
              <Upload className="text-primary" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold">Submit Payment Receipt</h1>
              <p className="text-sm text-gray-500">White Vintage Bungalow — Bank Transfer Confirmation</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
            Fill in your bank transfer details and upload a photo or screenshot of your receipt. Your booking will be confirmed after our team verifies the payment.
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Booking reference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking Reference <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bookingRef}
                onChange={e => setBookingRef(e.target.value.toUpperCase())}
                placeholder="WVB-2026-XXXXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase tracking-wider"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Found in your booking confirmation email.</p>
            </div>

            {/* Transaction reference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Transaction / Reference No. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={e => setTransactionRef(e.target.value)}
                placeholder="e.g. TRX2026061100234"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Transfer <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={transferDate}
                onChange={e => setTransferDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Transferred (LKR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">LKR</span>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={e => setAmountPaid(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Receipt Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Image <span className="text-gray-400 font-normal">(optional but recommended)</span>
              </label>

              {receiptPreview ? (
                /* Preview */
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="w-full max-h-64 object-contain bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <div className="px-3 py-2 bg-green-50 border-t border-green-200 text-xs text-green-700 flex items-center gap-1">
                    <CheckCircle size={12} /> {receiptFile?.name}
                  </div>
                </div>
              ) : (
                /* Drop zone */
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary-light/30 transition-colors"
                >
                  <ImageIcon className="mx-auto text-gray-400 mb-3" size={36} />
                  <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 8 MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Any additional information about the transfer..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isBusy}
            >
              {uploading ? (
                <><Loader2 size={18} className="animate-spin mr-2 inline" /> Uploading image...</>
              ) : submitting ? (
                <><Loader2 size={18} className="animate-spin mr-2 inline" /> Submitting...</>
              ) : (
                'Submit Receipt'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function UploadReceiptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <UploadReceiptContent />
    </Suspense>
  );
}
