'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Bed,
  Users,
  MessageSquare,
  Package,
  CalendarRange,
  DollarSign,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar, label: 'Reservation', href: '/reservations' },
    { icon: Bed, label: 'Rooms', href: '/rooms' },
    { icon: Users, label: 'Guests', href: '/guests' },
    { icon: MessageSquare, label: 'Messages', href: '/messages', badge: 3 },
    { icon: Package, label: 'Housekeeping', href: '/housekeeping' },
    { icon: CalendarRange, label: 'Calendar', href: '/calendar' },
    { icon: DollarSign, label: 'Financials', href: '/financials' },
    { icon: Star, label: 'Reviews', href: '/reviews' },
    { icon: Settings, label: 'Concierge', href: '/concierge' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: '260px' }}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-gray-900">Lodgify</h1>
              <p className="text-xs text-gray-500">V1.0</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 180px)' }}>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon size={20} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Jaylan Dorwart</h4>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};