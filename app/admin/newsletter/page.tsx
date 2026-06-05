'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Users, Send, Check, AlertCircle, Loader2, Trash2 } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/newsletter/subscribers')
      .then(r => r.json())
      .then(data => { setSubscribers(data.subscribers || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const activeCount = subscribers.filter(s => s.isActive).length;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ type: 'success', text: `Newsletter sent to ${data.sent} subscriber${data.sent !== 1 ? 's' : ''}${data.failed > 0 ? ` (${data.failed} failed)` : ''}!` });
        setSubject('');
        setMessage('');
      } else {
        setResult({ type: 'error', text: data.error || 'Failed to send newsletter.' });
      }
    } catch {
      setResult({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Newsletter</h1>
        <p className="text-gray-500 mt-1">Manage subscribers and send newsletters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Compose & Send */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
              <Send className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg">Compose Newsletter</h2>
              <p className="text-sm text-gray-500">Sending to <strong>{activeCount}</strong> active subscriber{activeCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {result && (
            <div className={`flex items-start gap-2 p-3 rounded-lg mb-4 text-sm ${result.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {result.type === 'success' ? <Check size={16} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />}
              {result.text}
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Special offer for June..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={8}
                placeholder="Write your newsletter message here..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Each line becomes a paragraph in the email.</p>
            </div>
            <button
              type="submit"
              disabled={sending || activeCount === 0}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <><Loader2 size={18} className="animate-spin" /> Sending...</>
              ) : (
                <><Send size={18} /> Send to {activeCount} Subscriber{activeCount !== 1 ? 's' : ''}</>
              )}
            </button>
          </form>
        </div>

        {/* Subscribers list */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                <Users className="text-primary" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-lg">Subscribers</h2>
                <p className="text-sm text-gray-500">{activeCount} active · {subscribers.length - activeCount} unsubscribed</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="mx-auto text-gray-300 mb-3" size={40} />
              <p className="text-gray-500">No subscribers yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {subscribers.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sub.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm text-gray-800 truncate">{sub.email}</span>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
