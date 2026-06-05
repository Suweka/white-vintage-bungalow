'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import {
  ChefHat,
  Wifi,
  Trees,
  Droplets,
  Sofa,
  Flame,
  Speaker,
  Mountain,
  Tv,
  Car,
  Sparkles,
  Briefcase,
  Check,
} from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: ChefHat,
      title: 'In-House Chef',
      description: 'Enjoy freshly prepared home-style meals crafted by our dedicated in-house chef using local ingredients.',
      features: [
        'Sri Lankan home-cooked meals',
        'Complimentary breakfast',
        'Lunch & dinner on request',
        'Dietary preferences accommodated',
        'Fresh local produce',
      ],
      price: 'Breakfast included',
    },
    {
      icon: Wifi,
      title: 'Free WiFi',
      description: 'High-speed internet access available throughout the entire property at no extra charge.',
      features: [
        'Available in all rooms',
        'Available in common areas',
        'High-speed connection',
        'No usage limits',
        '24/7 availability',
      ],
      price: 'Complimentary',
    },
    {
      icon: Trees,
      title: 'Garden Space',
      description: 'Lush private garden offering a peaceful retreat amid nature, perfect for morning walks or relaxing evenings.',
      features: [
        'Beautifully landscaped garden',
        'Seating areas outdoors',
        'Scenic nature walks',
        'Perfect for photography',
        'Available all day',
      ],
      price: 'Complimentary for guests',
    },
    {
      icon: Droplets,
      title: 'Hot Water',
      description: 'Reliable 24-hour hot water available in every bathroom across the property.',
      features: [
        'Available in all rooms',
        'Round-the-clock supply',
        'Consistent pressure',
        'Electric water heaters',
        'No disruptions',
      ],
      price: 'Complimentary',
    },
    {
      icon: Sofa,
      title: 'Living & Dining Rooms',
      description: 'Spacious shared living room and a beautifully set dining area for family gatherings and relaxation.',
      features: [
        'Comfortable lounge seating',
        'Elegant dining table',
        'Colonial-era décor',
        'Board games & books available',
        'Shared access for all guests',
      ],
      price: 'Complimentary for guests',
    },
    {
      icon: Flame,
      title: 'Barbeque Grill',
      description: 'Outdoor BBQ grill available for guests to enjoy a fun evening cookout in the garden.',
      features: [
        'Full BBQ setup provided',
        'Charcoal & utensils included',
        'Outdoor garden setting',
        'Available on request',
        'Best for evenings',
      ],
      price: 'Arrangements on request',
    },
    {
      icon: Speaker,
      title: 'Bluetooth Mic & Speakers',
      description: 'Entertainment-ready Bluetooth speakers and microphone for gatherings, karaoke nights, and celebrations.',
      features: [
        'High-quality speakers',
        'Wireless Bluetooth mic',
        'Perfect for karaoke',
        'Great for group events',
        'Available on request',
      ],
      price: 'Complimentary for guests',
    },
    {
      icon: Mountain,
      title: 'Picturesque Surroundings',
      description: 'Breathtaking views of misty mountains, tea plantations, and lush greenery at every turn.',
      features: [
        'Mountain panoramic views',
        'Tea plantation scenery',
        'Ideal for photography',
        'Sunrise & sunset views',
        'Cool hill-country climate',
      ],
      price: 'Complimentary',
    },
    {
      icon: Tv,
      title: 'TV in Every Room',
      description: 'Each guest room is equipped with a television for your entertainment and comfort.',
      features: [
        'Available in all rooms',
        'Multiple channels',
        'Clear picture quality',
        'Remote control provided',
        'Free to use',
      ],
      price: 'Complimentary',
    },
    {
      icon: Car,
      title: 'Transportation',
      description: 'Airport transfers and local sightseeing tour arrangements for your convenience.',
      features: [
        'Airport pickup/drop-off',
        'Local tour packages',
        'Driver services available',
        'Tea estate visits',
        'Advance booking required',
      ],
      price: 'From LKR 8,000',
    },
    {
      icon: Sparkles,
      title: 'Laundry Services',
      description: 'Professional laundry services with quick turnaround for a fresh, comfortable stay.',
      features: [
        'Same-day service',
        'Ironing services',
        'Eco-friendly products',
        'Door-to-door pickup',
        'Affordable rates',
      ],
      price: 'From LKR 500',
    },
    {
      icon: Briefcase,
      title: 'Concierge Services',
      description: '24/7 concierge assistance for all your travel and accommodation needs.',
      features: [
        'Local recommendations',
        'Booking assistance',
        'Event & tour planning',
        'Emergency support',
        'Friendly & attentive staff',
      ],
      price: 'Complimentary',
    },
  ];

  const additionalServices = [
    'Luggage storage',
    'Wake-up calls',
    'Local tour guidance',
    'Celebration setups',
    'Currency exchange',
    'Medical assistance',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-heading font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Everything you need for a comfortable, memorable stay at White Vintage Bungalow
          </p>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-primary font-medium mb-2">WHAT WE OFFER</div>
          <h2 className="text-4xl font-heading font-bold">Our Facilities & Services</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            From home-cooked meals to scenic garden spaces, every detail is crafted for your comfort
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                <service.icon className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <Check size={16} className="text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-gray-200">
                <span className="text-primary font-semibold">{service.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Services */}
      <section className="bg-primary-light py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold">Additional Services</h2>
            <p className="text-gray-600 mt-4">More ways we make your stay comfortable</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <Check className="text-primary mx-auto mb-2" size={24} />
                <p className="text-sm font-medium text-gray-700">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-primary font-medium mb-2">SPECIAL OFFERS</div>
          <h2 className="text-4xl font-heading font-bold">Experience Packages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* BBQ Evening Package */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-primary">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-heading font-bold mb-2">BBQ Evening Package</h3>
              <div className="text-3xl font-bold text-primary mb-1">LKR 15,000</div>
              <p className="text-gray-600">per group</p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Full BBQ grill setup',
                'Chef-prepared sides',
                'Bluetooth speaker access',
                'Garden seating',
                'Evening drinks',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={16} className="text-primary" /><span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="primary" size="lg" className="w-full">Book Package</Button>
          </div>

          {/* Romance Package */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-accent">
            <div className="bg-accent text-gray-900 px-3 py-1 rounded-full inline-block mb-4 text-sm font-semibold">
              POPULAR
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-heading font-bold mb-2">Romance Package</h3>
              <div className="text-3xl font-bold text-primary mb-1">LKR 35,000</div>
              <p className="text-gray-600">per couple</p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Chef-prepared candlelight dinner',
                'Room decoration',
                'Garden evening walk',
                'Bluetooth music setup',
                'Late checkout',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={16} className="text-primary" /><span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="primary" size="lg" className="w-full">Book Package</Button>
          </div>

          {/* Adventure Package */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-primary">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-heading font-bold mb-2">Adventure Package</h3>
              <div className="text-3xl font-bold text-primary mb-1">LKR 30,000</div>
              <p className="text-gray-600">per person</p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Tea estate guided tour',
                'Local sightseeing',
                'Transportation included',
                'Packed chef-made meals',
                'Photography spots',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={16} className="text-primary" /><span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="primary" size="lg" className="w-full">Book Package</Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Ready to Experience Our Services?</h2>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
            Book your stay and enjoy all our genuine amenities and warm hospitality
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">Book Now</Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Service Hours */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gray-100 p-8 rounded-lg max-w-3xl mx-auto">
          <h3 className="text-2xl font-heading font-bold mb-6 text-center">Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { service: 'Reception / Check-in',    hours: '24/7' },
              { service: 'In-House Chef (meals)',    hours: '7:00 AM – 9:00 PM' },
              { service: 'BBQ Grill',               hours: '4:00 PM – 9:00 PM' },
              { service: 'Garden Access',            hours: 'All day' },
              { service: 'Transportation',           hours: 'By appointment' },
              { service: 'Concierge',               hours: '24/7' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white rounded-lg">
                <span className="font-medium">{item.service}</span>
                <span className="text-primary font-semibold">{item.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
