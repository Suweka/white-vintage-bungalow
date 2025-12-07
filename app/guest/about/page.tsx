'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Award, Users, Heart, Shield, Star, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: '100+', label: 'Years of Heritage' },
    { number: '10k+', label: 'Happy Guests' },
    { number: '50+', label: 'Staff Members' },
    { number: '4.9', label: 'Average Rating' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Hospitality',
      description: 'We treat every guest like family, ensuring comfort and care throughout your stay.',
    },
    {
      icon: Shield,
      title: 'Heritage',
      description: 'Preserving colonial charm while providing modern luxury and convenience.',
    },
    {
      icon: Star,
      title: 'Excellence',
      description: 'Committed to delivering exceptional service and unforgettable experiences.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Supporting local businesses and creating sustainable tourism practices.',
    },
  ];

  const team = [
    { name: 'John Anderson', position: 'General Manager', image: '/images/team/1.jpg' },
    { name: 'Sarah Williams', position: 'Guest Relations Manager', image: '/images/team/2.jpg' },
    { name: 'Michael Chen', position: 'Head Chef', image: '/images/team/3.jpg' },
    { name: 'Emma Thompson', position: 'Housekeeping Manager', image: '/images/team/4.jpg' },
  ];

  const milestones = [
    { year: '1895', event: 'Bungalow constructed during British colonial era' },
    { year: '1950', event: 'Converted into a boutique guesthouse' },
    { year: '2010', event: 'Comprehensive restoration preserving original architecture' },
    { year: '2024', event: 'Awarded Best Heritage Hotel in Nuwara Eliya' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">About Us</h1>
          <p className="text-xl text-gray-200">
            A Legacy of Elegance in Sri Lanka's Hill Country
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-primary font-medium mb-2">OUR STORY</div>
              <h2 className="text-4xl font-heading font-bold mb-6">
                A Century of Hospitality Excellence
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                White Vintage Bungalow stands as a testament to colonial-era elegance, 
                originally built in 1895 during the British colonial period. Nestled in 
                the misty hills of Nuwara Eliya, our historic property has been carefully 
                restored to preserve its original charm while incorporating modern luxury.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                For over a century, we've welcomed travelers from around the world, 
                offering them a unique blend of heritage architecture, warm Sri Lankan 
                hospitality, and breathtaking natural beauty. Our bungalow is surrounded 
                by lush tea plantations and offers panoramic views of the mountain ranges.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Today, we continue this legacy by providing guests with an authentic 
                experience that honors our past while embracing contemporary comfort 
                and service standards.
              </p>
              <Button variant="primary" size="lg">
                Discover Our Rooms
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-64 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg" />
              <div className="h-64 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="text-primary font-medium mb-2">OUR VALUES</div>
            <h2 className="text-4xl font-heading font-bold">What We Stand For</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="text-primary font-medium mb-2">OUR JOURNEY</div>
            <h2 className="text-4xl font-heading font-bold">Historical Milestones</h2>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="text-3xl font-bold text-primary">{milestone.year}</div>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full mt-2 relative">
                  {index !== milestones.length - 1 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-20 bg-primary-light" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <p className="text-lg text-gray-700">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="text-primary font-medium mb-2">OUR TEAM</div>
            <h2 className="text-4xl font-heading font-bold">Meet the People Behind Our Service</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our dedicated team is committed to making your stay memorable
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-gray-300 to-gray-400" />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-heading font-semibold mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="text-primary font-medium mb-2">AWARDS & RECOGNITION</div>
            <h2 className="text-4xl font-heading font-bold">Our Achievements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: 'Best Heritage Hotel 2024', org: 'Sri Lanka Tourism Awards' },
              { title: 'Excellence in Service', org: 'TripAdvisor Certificate' },
              { title: 'Sustainable Tourism', org: 'Green Hotels Association' },
            ].map((award, index) => (
              <div key={index} className="text-center p-6 bg-primary-light rounded-lg">
                <Award className="text-primary mx-auto mb-4" size={48} />
                <h3 className="text-lg font-semibold mb-2">{award.title}</h3>
                <p className="text-gray-600">{award.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Why Choose White Vintage Bungalow?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              'Authentic colonial architecture',
              'Prime location in Nuwara Eliya',
              'Personalized service',
              'Modern luxury amenities',
              'Stunning mountain views',
              'Award-winning hospitality',
            ].map((reason, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle size={24} className="text-accent flex-shrink-0" />
                <span className="text-lg">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Experience Our Heritage</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your stay and become part of our century-long story
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              Book Your Stay
            </Button>
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}