import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Calendar, 
  LogOut, 
  Camera,
  CreditCard,
  Check,
  Award
} from 'lucide-react';

const TABS = ['Overview', 'My Bookings', 'Saved Payments', 'Loyalty', 'Edit Profile'];

const LOYALTY_TIERS = {
  BRONZE: { label: 'Bronze', color: 'text-amber-700', bg: 'bg-amber-100', next: 500 },
  SILVER: { label: 'Silver', color: 'text-gray-500', bg: 'bg-gray-100', next: 1500 },
  GOLD: { label: 'Gold', color: 'text-yellow-600', bg: 'bg-yellow-100', next: 3000 },
  PLATINUM: { label: 'Platinum', color: 'text-blue-600', bg: 'bg-blue-100', next: null },
};

function formatCurrency(amount: number) {
  return `LKR ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

interface ProfileClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    country?: string;
    address?: string;
    avatarUrl?: string;
    loyaltyPoints: number;
    loyaltyTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    preferredLanguage?: string;
    bookings: any[];
    savedPayments: any[];
    reviews?: any[];
  };
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    country: user.country || '',
    address: user.address || '',
    preferredLanguage: user.preferredLanguage || 'en',
  });

  const tier = LOYALTY_TIERS[user.loyaltyTier];

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 text-center mb-4">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto">
                    <span className="text-3xl text-white font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow">
                  <Camera size={14} />
                </button>
              </div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>

              {/* Loyalty Badge */}
              <div className={`mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${tier.bg} ${tier.color}`}>
                <Star size={14} />
                {tier.label} Member
              </div>

              {/* Points */}
              <div className="mt-4 p-3 bg-light-green rounded-lg">
                <div className="text-2xl font-bold text-primary">{user.loyaltyPoints}</div>
                <div className="text-xs text-gray-600">Loyalty Points</div>
                {tier.next && (
                  <div className="text-xs text-gray-500 mt-1">
                    {tier.next - user.loyaltyPoints} pts to next tier
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition border-l-4 ${
                    activeTab === tab
                      ? 'border-primary bg-light-green text-primary'
                      : 'border-transparent hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 border-l-4 border-transparent"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">

            {/* Overview Tab */}
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Stays', value: user.bookings.length, icon: Calendar },
                    { label: 'Loyalty Points', value: user.loyaltyPoints, icon: Star },
                    { label: 'Reviews', value: user.reviews?.length || 0, icon: Award },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg shadow-md p-6 text-center">
                      <stat.icon size={32} className="mx-auto text-primary mb-2" />
                      <div className="text-3xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-bold text-lg mb-4">Recent Bookings</h3>
                  {user.bookings.slice(0, 3).length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No bookings yet</p>
                  ) : (
                    <div className="space-y-3">
                      {user.bookings.slice(0, 3).map((booking: any) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition">
                          <div>
                            <p className="font-medium">{booking.room?.name || 'Room'}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">{formatCurrency(Number(booking.totalAmount))}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* My Bookings Tab */}
            {activeTab === 'My Bookings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-lg mb-4">All Bookings</h3>
                {user.bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">You haven't made any bookings yet</p>
                    <a href="/booking" className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition">
                      Book Now
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.bookings.map((booking: any) => (
                      <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-lg">{booking.room?.name || 'Room'}</p>
                            <p className="text-sm text-gray-500 mb-2">#{booking.bookingNumber}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <span>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</span>
                              <span>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</span>
                              <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary text-lg">{formatCurrency(Number(booking.totalAmount))}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                              booking.status === 'CHECKED_IN' ? 'bg-blue-100 text-blue-700' :
                              booking.status === 'CHECKED_OUT' ? 'bg-gray-100 text-gray-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                        {booking.status === 'PENDING' && (
                          <div className="mt-3 pt-3 border-t">
                            <button className="text-sm text-red-500 hover:underline">
                              Cancel Booking
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Saved Payments Tab */}
            {activeTab === 'Saved Payments' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Saved Payment Methods</h3>
                  <button className="text-sm text-primary hover:underline font-medium">+ Add New</button>
                </div>

                {user.savedPayments.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <CreditCard size={48} className="mx-auto mb-4" />
                    <p className="mb-2">No saved payment methods</p>
                    <p className="text-sm">Add a payment method for faster checkout</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {user.savedPayments.map((pm: any) => (
                      <div key={pm.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition">
                        <div className="flex items-center gap-3">
                          <CreditCard size={22} className="text-primary" />
                          <div>
                            <p className="font-medium">{pm.label}</p>
                            <p className="text-xs text-gray-500">{pm.type}</p>
                          </div>
                          {pm.isDefault && (
                            <span className="text-xs bg-light-green text-primary px-2 py-0.5 rounded-full font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <button className="text-xs text-red-500 hover:underline">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Loyalty Tab */}
            {activeTab === 'Loyalty' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-lg mb-6">Loyalty Rewards</h3>

                {/* Tier progress */}
                <div className="relative flex justify-between mb-2 text-xs font-medium text-gray-500">
                  {['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'].map(t => (
                    <span key={t} className={user.loyaltyTier === t ? 'text-primary font-bold' : ''}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{
                      width: `${Math.min((user.loyaltyPoints / 3000) * 100, 100)}%`
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-light-green p-6 rounded-xl text-center">
                    <div className="text-4xl font-bold text-primary">{user.loyaltyPoints}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Points</div>
                  </div>
                  <div className="bg-accent/20 p-6 rounded-xl text-center">
                    <div className="text-4xl font-bold text-yellow-700">
                      {user.loyaltyTier}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Current Tier</div>
                  </div>
                </div>

                <div className="border rounded-xl p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Star size={20} className="text-primary" />
                    How to Earn Points
                  </h4>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">🛏</span>
                      <span>Each night booked = <strong className="text-primary">50 points</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">⭐</span>
                      <span>Leave a review = <strong className="text-primary">25 points</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">🎉</span>
                      <span>Complete your profile = <strong className="text-primary">50 points</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">📧</span>
                      <span>Refer a friend = <strong className="text-primary">200 points</strong></span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Edit Profile Tab */}
            {activeTab === 'Edit Profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-lg mb-6">Edit Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={profileForm.country}
                      onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
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
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                      <textarea
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        rows={3}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleProfileSave}
                    disabled={saving}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={20} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}