'use client';

import React, { useState, useEffect } from 'react';
import { Download, Filter, TrendingUp, TrendingDown, DollarSign, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getFinancialsData } from '@/lib/admin-actions';

interface FinancialData {
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  monthlyRevenue: { month: string; revenue: number }[];
}

export default function FinancialsPage() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchData() {
    setLoading(true);
    setError(false);
    const result = await getFinancialsData();
    if (result) {
      setData(result);
    } else {
      setError(true);
    }
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="text-red-500" size={40} />
        <p className="text-gray-600">Failed to load financial data.</p>
        <button onClick={fetchData} className="px-4 py-2 bg-primary text-white rounded-lg">Retry</button>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.monthlyRevenue.map(d => d.revenue), 1);

  const financialStats = [
    {
      title: 'Total Revenue',
      value: `LKR ${Number(data.totalRevenue).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      trend: 'up' as const,
    },
    {
      title: 'Total Bookings',
      value: data.totalBookings.toString(),
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
      trend: 'up' as const,
    },
    {
      title: 'Occupancy Rate',
      value: `${data.occupancyRate}%`,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      trend: 'up' as const,
    },
    {
      title: 'Avg. Revenue / Booking',
      value: data.totalBookings > 0
        ? `LKR ${Math.round(data.totalRevenue / data.totalBookings).toLocaleString()}`
        : 'LKR 0',
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-600',
      trend: 'up' as const,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Financials</h1>
          <p className="text-gray-600">Track revenue and financial performance</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary">
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {financialStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <TrendingUp size={16} />
                Live
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-6">Monthly Revenue (Last 6 Months)</h3>
        {data.monthlyRevenue.every(d => d.revenue === 0) ? (
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>No revenue data yet. Revenue will appear here after paid bookings.</p>
          </div>
        ) : (
          <>
            <div className="h-64 flex items-end justify-between gap-2">
              {data.monthlyRevenue.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-primary font-medium mb-1">
                    {d.revenue > 0 ? `${(d.revenue / 1000).toFixed(0)}k` : ''}
                  </span>
                  <div
                    className="w-full bg-primary rounded-t transition-all"
                    style={{ height: `${(d.revenue / maxRevenue) * 180}px`, minHeight: d.revenue > 0 ? '4px' : '0' }}
                    title={`LKR ${d.revenue.toLocaleString()}`}
                  />
                  <span className="text-xs text-gray-500 mt-2">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded" />
                <span className="text-sm text-gray-600">Revenue (LKR)</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Note */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Source</h3>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Room Bookings</span>
            <span className="text-sm font-semibold">LKR {Number(data.totalRevenue).toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-primary h-3 rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">100% of total revenue from direct room bookings</p>
        </div>
      </div>
    </div>
  );
}
