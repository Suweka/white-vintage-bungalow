'use client';

import React, { useState } from 'react';
import { Download, Filter, TrendingUp, TrendingDown, DollarSign, Eye } from 'lucide-react';

export default function FinancialsPage() {
  const [filterPeriod, setFilterPeriod] = useState('month');

  const financialStats = [
    {
      title: 'Total Revenue',
      value: 'LKR 1,245,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Expenses',
      value: 'LKR 425,000',
      change: '+3.2%',
      trend: 'up',
      icon: TrendingDown,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Net Income',
      value: 'LKR 820,000',
      change: '+18.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Occupancy Rate',
      value: '85.5%',
      change: '+2.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const revenueBySource = [
    { source: 'Room Bookings', amount: 1000000, percentage: 80 },
    { source: 'F&B', amount: 150000, percentage: 12 },
    { source: 'Other Services', amount: 95000, percentage: 8 },
  ];

  const expenses = [
    { category: 'Staff Salaries', amount: 200000, percentage: 47 },
    { category: 'Utilities', amount: 85000, percentage: 20 },
    { category: 'Maintenance', amount: 70000, percentage: 16 },
    { category: 'Supplies', amount: 50000, percentage: 12 },
    { category: 'Marketing', amount: 20000, percentage: 5 },
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 850000, expenses: 380000 },
    { month: 'Feb', revenue: 920000, expenses: 400000 },
    { month: 'Mar', revenue: 1050000, expenses: 420000 },
    { month: 'Apr', revenue: 1100000, expenses: 410000 },
    { month: 'May', revenue: 1200000, expenses: 425000 },
    { month: 'Jun', revenue: 1245000, expenses: 425000 },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Financials</h1>
          <p className="text-gray-600">Track revenue, expenses, and financial performance</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
          <Download size={20} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Period Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600" />
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
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
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stat.change}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue vs Expenses</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {monthlyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-1 items-center">
                  <div
                    className="w-full bg-primary rounded-t"
                    style={{ height: `${(data.revenue / maxRevenue) * 150}px` }}
                    title={`Revenue: ${data.revenue}`}
                  ></div>
                  <div
                    className="w-full bg-red-400 rounded-t"
                    style={{ height: `${(data.expenses / maxRevenue) * 150}px` }}
                    title={`Expenses: ${data.expenses}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          </div>
        </div>

        {/* Revenue by Source */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue by Source</h3>
          <div className="space-y-4">
            {revenueBySource.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.source}</span>
                  <span className="text-sm font-semibold">LKR {item.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.percentage}% of total</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-6">Expense Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Percentage</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trend</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{expense.category}</td>
                  <td className="px-6 py-4">LKR {expense.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{ width: `${expense.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{expense.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <TrendingDown size={16} />
                      -2.3%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
