'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Loader2, AlertCircle, RefreshCw, CheckCircle, XCircle, FileText, ExternalLink } from 'lucide-react';
import { getReservationsData } from '@/lib/admin-actions';

type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';
type ReceiptStatus     = 'PENDING' | 'APPROVED' | 'REJECTED';

interface Receipt {
  id:             string;
  transactionRef: string | null;
  transferDate:   string | null;
  amountPaid:     number | null;
  receiptUrl:     string | null;
  notes:          string | null;
  status:         ReceiptStatus;
}

interface Reservation {
  id:            string;
  guestName:     string;
  email:         string;
  phone:         string;
  room:          string;
  checkIn:       string;
  checkOut:      string;
  nights:        number;
  amount:        number;
  status:        ReservationStatus;
  guests:        number;
  paymentMethod: string | null;
  receipt:       Receipt | null;
}

export default function ReservationsPage() {
  const [searchQuery,     setSearchQuery]     = useState('');
  const [filterStatus,    setFilterStatus]    = useState<ReservationStatus | 'all'>('all');
  const [reservations,    setReservations]    = useState<Reservation[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Reservation | null>(null);
  const [reviewLoading,   setReviewLoading]   = useState(false);
  const [reviewMessage,   setReviewMessage]   = useState('');

  async function fetchReservations() {
    setLoading(true);
    setError(false);
    const data = await getReservationsData();
    if (data) setReservations(data as Reservation[]);
    else       setError(true);
    setLoading(false);
  }

  useEffect(() => { fetchReservations(); }, []);

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || res.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const pendingReceipts = reservations.filter(r => r.paymentMethod === 'bank' && r.receipt?.status === 'PENDING');

  async function handleReceiptAction(receiptId: string, action: 'approve' | 'reject') {
    setReviewLoading(true);
    setReviewMessage('');
    try {
      const res = await fetch(`/api/admin/receipts/${receiptId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) { setReviewMessage(data.error || 'Action failed.'); return; }
      setReviewMessage(action === 'approve' ? '✅ Booking confirmed and confirmation email sent.' : '❌ Booking cancelled.');
      setSelectedReceipt(null);
      fetchReservations();
    } catch {
      setReviewMessage('Network error. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  }

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending':   return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default:          return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  if (error)   return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <AlertCircle className="text-red-500" size={40} />
      <p className="text-gray-600">Failed to load reservations data.</p>
      <button onClick={fetchReservations} className="px-4 py-2 bg-primary text-white rounded-lg">Retry</button>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Reservations</h1>
          <p className="text-gray-600">Manage all guest reservations</p>
        </div>
        <button onClick={fetchReservations} className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Pending receipts banner */}
      {pendingReceipts.length > 0 && (
        <div className="bg-orange-50 border border-orange-300 rounded-lg p-4 mb-6 flex items-start gap-3">
          <FileText className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="font-semibold text-orange-800">
              {pendingReceipts.length} bank transfer receipt{pendingReceipts.length > 1 ? 's' : ''} pending review
            </p>
            <div className="mt-2 space-y-1">
              {pendingReceipts.map(r => (
                <button key={r.id} onClick={() => { setSelectedReceipt(r); setReviewMessage(''); }}
                  className="block text-sm text-orange-700 hover:underline text-left">
                  {r.id} — {r.guestName} → Review receipt
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {reviewMessage && !selectedReceipt && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-300 rounded-lg text-sm text-green-800">{reviewMessage}</div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search by guest name, email, or booking ID"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex gap-2">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ReservationStatus | 'all')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
              <Plus size={20} /><span className="hidden sm:inline">New Reservation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Booking ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Guest</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Room</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dates</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  {reservations.length === 0 ? 'No reservations yet.' : 'No reservations match your search.'}
                </td></tr>
              ) : filteredReservations.map((res) => (
                <tr key={res.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-primary text-sm">{res.id}</span>
                    {res.paymentMethod === 'bank' && (
                      <div className="mt-1">
                        {!res.receipt
                          ? <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Awaiting receipt</span>
                          : res.receipt.status === 'PENDING'
                          ? <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Receipt pending review</span>
                          : res.receipt.status === 'APPROVED'
                          ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Receipt approved</span>
                          : <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Receipt rejected</span>
                        }
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{res.guestName}</p>
                    <p className="text-sm text-gray-500">{res.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{res.room}</p>
                    <p className="text-xs text-gray-500">{res.guests} guest{res.guests > 1 ? 's' : ''}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{res.checkIn} → {res.checkOut}</p>
                    <p className="text-xs text-gray-500">{res.nights} night{res.nights > 1 ? 's' : ''}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">LKR {res.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(res.status)}`}>
                      {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600" title="View"><Eye size={18} /></button>
                      {res.paymentMethod === 'bank' && res.receipt?.status === 'PENDING' && (
                        <button onClick={() => { setSelectedReceipt(res); setReviewMessage(''); }}
                          className="p-2 hover:bg-orange-100 rounded-lg text-orange-600" title="Review Receipt">
                          <FileText size={18} />
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Edit"><Edit size={18} /></button>
                      <button className="p-2 hover:bg-red-100 rounded-lg text-red-600" title="Cancel"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {[
          { label: 'Total Reservations', value: reservations.length, color: 'text-primary' },
          { label: 'Confirmed',          value: reservations.filter(r => r.status === 'confirmed').length,  color: 'text-green-600' },
          { label: 'Pending',            value: reservations.filter(r => r.status === 'pending').length,    color: 'text-yellow-600' },
          { label: 'Total Revenue',      value: `LKR ${reservations.filter(r => r.status === 'confirmed').reduce((s, r) => s + r.amount, 0).toLocaleString()}`, color: 'text-primary' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Receipt Review Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-heading font-bold">Review Bank Transfer Receipt</h2>
              <button onClick={() => { setSelectedReceipt(null); setReviewMessage(''); }} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                <p className="font-semibold text-gray-700 mb-2">Booking Details</p>
                <div className="flex justify-between"><span className="text-gray-500">Booking Ref</span><span className="font-semibold text-primary">{selectedReceipt.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Guest</span><span>{selectedReceipt.guestName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{selectedReceipt.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Room</span><span>{selectedReceipt.room}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Dates</span><span>{selectedReceipt.checkIn} → {selectedReceipt.checkOut}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Booking Amount</span><span className="font-bold">LKR {selectedReceipt.amount.toLocaleString()}</span></div>
              </div>

              {selectedReceipt.receipt ? (
                <div className="border border-orange-200 bg-orange-50 rounded-lg p-4 text-sm space-y-2">
                  <p className="font-semibold text-orange-800 mb-2">Customer Submitted Receipt</p>
                  <div className="flex justify-between"><span className="text-gray-600">Transaction Ref</span><span className="font-mono font-medium">{selectedReceipt.receipt.transactionRef || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Transfer Date</span><span>{selectedReceipt.receipt.transferDate || '—'}</span></div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className={`font-bold ${selectedReceipt.receipt.amountPaid && selectedReceipt.receipt.amountPaid < selectedReceipt.amount ? 'text-red-600' : 'text-green-700'}`}>
                      LKR {selectedReceipt.receipt.amountPaid?.toLocaleString() || '—'}
                      {selectedReceipt.receipt.amountPaid && selectedReceipt.receipt.amountPaid < selectedReceipt.amount && ' ⚠ Less than required'}
                    </span>
                  </div>
                  {selectedReceipt.receipt.notes && (
                    <div className="pt-2 border-t border-orange-200">
                      <span className="text-gray-600">Notes: </span>{selectedReceipt.receipt.notes}
                    </div>
                  )}
                  {selectedReceipt.receipt.receiptUrl && (
                    <a href={selectedReceipt.receipt.receiptUrl} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1 text-primary hover:underline mt-2 font-medium">
                      <ExternalLink size={14} /> View Receipt Image
                    </a>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-500 text-center">
                  Customer has not submitted a receipt yet.
                </div>
              )}

              {reviewMessage && (
                <p className="text-sm text-center font-medium py-2">{reviewMessage}</p>
              )}
            </div>

            <div className="p-6 border-t flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => selectedReceipt.receipt && handleReceiptAction(selectedReceipt.receipt.id, 'reject')}
                disabled={reviewLoading || !selectedReceipt.receipt}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 font-medium transition-colors"
              >
                {reviewLoading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />} Reject
              </button>
              <button
                onClick={() => selectedReceipt.receipt && handleReceiptAction(selectedReceipt.receipt.id, 'approve')}
                disabled={reviewLoading || !selectedReceipt.receipt}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
              >
                {reviewLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} Approve & Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
