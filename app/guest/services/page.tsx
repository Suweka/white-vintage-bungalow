'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import {
  Dumbbell,
  Coffee,
  Waves,
  UtensilsCrossed,
  Car,
  Wifi,
  Sparkles,
  Briefcase,
  Check,
} from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: Dumbbell,
      title: 'Fitness Center',
      description: 'State-of-the-art gymnasium with modern equipment, personal training available.',
      features: [
        'Cardio equipment',
        'Weight training',
        'Yoga mats & accessories',
        'Personal trainer on request',
        'Open 6 AM - 10 PM',
      ],
      price: 'Complimentary for guests',
    },
    {
      icon: Coffee,
      title: 'Jacuzzi & Spa',
      description: 'Relax and rejuvenate in our heated jacuzzi with stunning mountain views.',
      features: [
        'Heated jacuzzi',
        'Massage services',
        'Aromatherapy treatments',
        'Couple packages available',
        'Appointment based',
      ],
      price: 'From LKR 5,000',
    },
    {
      icon: Waves,
      title: 'Swimming Pool',
      description: 'Outdoor heated pool surrounded by landscaped gardens with panoramic views.',
      features: [
        'Heated outdoor pool',
        'Pool towels provided',
        'Poolside bar service',
        'Children-friendly area',
        'Open 7 AM - 8 PM',
      ],
      price: 'Complimentary for guests',
    },
    {
      icon: UtensilsCrossed,
      title: 'Restaurant & Dining',
      description: 'Fine dining experience featuring local and international cuisine.',
      features: [
        'Breakfast buffet',
        'À la carte menu',
        'Room service',
        'Special dietary options',
        'Private dining available',
      ],
      price: 'Varies by menu',
    },
    {
      icon: Car,
      title: 'Transportation',
      description: 'Airport transfers and local tour arrangements for your convenience.',
      features: [
        'Airport pickup/drop-off',
        'Local tour packages',
        'Car rental services',
        'Driver services',
        'Advanced booking required',
      ],
      price: 'From LKR 8,000',
    },
    {
      icon: Wifi,
      title: 'WiFi & Business',
      description: 'High-speed internet and business facilities throughout the property.',
      features: [
        'Free high-speed WiFi',
        'Business center',
        'Meeting rooms',
        'Printing services',
        '24/7 availability',
      ],
      price: 'Complimentary',
    },
    {
      icon: Sparkles,
      title: 'Laundry Services',
      description: 'Professional laundry and dry cleaning services with quick turnaround.',
      features: [
        'Same-day service',
        'Dry cleaning',
        'Ironing services',
        'Eco-friendly products',
        'Door-to-door pickup',
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
        'Event planning',
        'Emergency support',
        'Multilingual staff',
      ],
      price: 'Complimentary',
    },
  ];

  const additionalServices = [
    'Babysitting services',
    'Medical assistance',
    'Currency exchange',
    'Luggage storage',
    'Wake-up calls',
    'Newspaper delivery',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-heading font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Comprehensive amenities and services designed for your comfort and convenience
          </p>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-primary font-medium mb-2">WHAT WE OFFER</div>
          <h2 className="text-4xl font-heading font-bold">Get The Best Hotel Services</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            From wellness facilities to business amenities, we provide everything you need for a perfect stay
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
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">{service.price}</span>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
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
            <p className="text-gray-600 mt-4">
              More ways we can make your stay comfortable
            </p>
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

      {/* Special Packages */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-primary font-medium mb-2">SPECIAL OFFERS</div>
          <h2 className="text-4xl font-heading font-bold">Service Packages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-primary">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-heading font-bold mb-2">Wellness Package</h3>
              <div className="text-3xl font-bold text-primary mb-1">LKR 25,000</div>
              <p className="text-gray-600">per person</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                '2 spa treatments',
                'Jacuzzi access',
                'Fitness sessions',
                'Healthy meals',
                'Yoga classes',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="primary" size="lg" className="w-full">
              Book Package
            </Button>
          </div>

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
                'Couples massage',
                'Candlelight dinner',
                'Room decoration',
                'Champagne',
                'Late checkout',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="primary" size="lg" className="w-full">
              Book Package
            </Button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-primary">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-heading font-bold mb-2">Adventure Package</h3>
              <div className="text-3xl font-bold text-primary mb-1">LKR 30,000</div>
              <p className="text-gray-600">per person</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'Local tours',
                'Transportation',
                'Hiking guide',
                'Packed meals',
                'Photography',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="primary" size="lg" className="w-full">
              Book Package
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Ready to Experience Our Services?</h2>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
            Book your stay and enjoy all our premium amenities and services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Book Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Service Hours */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gray-100 p-8 rounded-lg max-w-3xl mx-auto">
          <h3 className="text-2xl font-heading font-bold mb-6 text-center">Service Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { service: 'Reception', hours: '24/7' },
              { service: 'Restaurant', hours: '7:00 AM - 10:00 PM' },
              { service: 'Pool', hours: '7:00 AM - 8:00 PM' },
              { service: 'Fitness Center', hours: '6:00 AM - 10:00 PM' },
              { service: 'Spa', hours: '9:00 AM - 8:00 PM' },
              { service: 'Room Service', hours: '24/7' },
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