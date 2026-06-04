'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Address',
      details: ['78/5 Bakers Park, 18 Dawson Hills,', 'Nuwara Eliya, LK'],
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['Monday-Friday: 08:00-22:00', '+94 (52) 222 5232'],
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['Send us your query anytime!', 'info@whitevintage.com'],
    },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'facebook', url: 'https://facebook.com/whitevintage' },
    { icon: Twitter, label: 'twitter', url: 'https://twitter.com/whitevintage' },
    { icon: Instagram, label: 'instagram', url: 'https://instagram.com/whitevintage' },
    { icon: Youtube, label: 'youtube', url: 'https://youtube.com/@whitevintage' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-heading font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-20 relative z-10">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-gray-600">
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="mb-6">
              <h2 className="text-3xl font-heading font-bold mb-2">Let's Get in Touch</h2>
              <p className="text-gray-600">Fill up the form and our team will get back to you within 24 hours</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+94 12 345 6789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <div className="select-wrapper">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="booking">Booking Inquiry</option>
                      <option value="general">General Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Send Message →
              </Button>
            </form>
          </div>

          {/* Info Card & Map */}
          <div className="space-y-6">
            {/* Get in Touch Card */}
            <div className="bg-accent p-8 rounded-lg">
              <h3 className="text-2xl font-heading font-bold mb-4">Get in Touch With Us Today</h3>
              <p className="text-gray-800 mb-6">
                Whether you're planning a romantic getaway, family vacation, or business trip, 
                we're here to make your stay memorable.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold">Address:</p>
                    <p className="text-gray-700">78/5 Bakers Park, 18 Dawson Hills, Nuwara Eliya, LK</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold">Phone:</p>
                    <p className="text-gray-700">+94 (52) 222 5232</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold">Email:</p>
                    <p className="text-gray-700">info@whitevintage.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold">Hours:</p>
                    <p className="text-gray-700">24/7 Reception Service</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-300">
                <p className="font-semibold mb-3">Follow us</p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="h-80 rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps?q=6.942114,80.793866&z=16&output=embed"
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="White Vintage Bungalow Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-primary text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <MessageCircle className="mx-auto mb-4" size={48} />
          <h2 className="text-3xl font-heading font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            Chat with us on WhatsApp for quick responses to your queries
          </p>
          <Button variant="secondary" size="lg">
            <MessageCircle className="mr-2" size={20} />
            Chat on WhatsApp
          </Button>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-4">Come And Visit One Of Our Offices</h2>
          <p className="text-gray-600">We'd love to welcome you in person</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-heading font-semibold mb-4">Main Office</h3>
            <p className="text-gray-700 mb-2">White Vintage Bungalow</p>
            <p className="text-gray-600 mb-4">78/5 Bakers Park, 18 Dawson Hills, Nuwara Eliya</p>
            <a 
              href="https://www.google.com/maps/search/78%2F5+Bakers+Park,+Dawson+Hills,+Nuwara+Eliya/@6.942114,80.793866,15z" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="md">
                Get Directions
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}