'use client';

import React, { useState } from 'react';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    {
      name: 'Booking & Reservations',
      faqs: [
        {
          question: 'How can I make a reservation?',
          answer: 'You can make a reservation directly through our website booking form, by calling us at +94 (52) 222 5232, or via WhatsApp. We recommend booking in advance, especially during peak season (December-March).',
        },
        {
          question: 'What is your cancellation policy?',
          answer: 'We offer free cancellation up to 24 hours before your check-in date. Cancellations made within 24 hours of check-in will be charged one night\'s accommodation. No-shows are charged the full booking amount.',
        },
        {
          question: 'Do you require a deposit?',
          answer: 'Yes, we require a 30% deposit at the time of booking to confirm your reservation. The remaining balance can be paid upon arrival or during checkout.',
        },
        {
          question: 'Can I modify my booking?',
          answer: 'Yes, you can modify your booking up to 48 hours before check-in, subject to availability. Please contact us directly to make changes.',
        },
      ],
    },
    {
      name: 'Check-in & Check-out',
      faqs: [
        {
          question: 'What are your check-in and check-out times?',
          answer: 'Check-in time is 2:00 PM and check-out time is 11:00 AM. Early check-in and late check-out may be available upon request and subject to availability with additional charges.',
        },
        {
          question: 'Is early check-in or late check-out available?',
          answer: 'Subject to availability, early check-in and late check-out can be arranged. Half-day charges apply for late check-out after 3:00 PM. Please contact us in advance to arrange.',
        },
        {
          question: 'What documents do I need for check-in?',
          answer: 'All guests must present a valid government-issued photo ID (passport, national ID card, or driver\'s license) at check-in. International guests need to provide passport and visa details.',
        },
      ],
    },
    {
      name: 'Rooms & Facilities',
      faqs: [
        {
          question: 'Do all rooms have mountain views?',
          answer: 'Most of our rooms offer stunning mountain and tea plantation views. Specific room preferences can be requested during booking, though we cannot guarantee specific room assignments.',
        },
        {
          question: 'Are rooms equipped with heating?',
          answer: 'Yes, all rooms have heating facilities. Nuwara Eliya can get quite cold, especially at night, so we ensure your comfort with heaters and extra blankets.',
        },
        {
          question: 'Is WiFi available?',
          answer: 'Yes, complimentary high-speed WiFi is available throughout the property, including all guest rooms and public areas.',
        },
        {
          question: 'Do you have parking facilities?',
          answer: 'Yes, we provide free on-site parking for all guests. The parking area is secure and monitored.',
        },
      ],
    },
    {
      name: 'Dining & Food',
      faqs: [
        {
          question: 'Is breakfast included in the room rate?',
          answer: 'Breakfast is included with most of our room packages. Please check your booking confirmation or contact us to verify what\'s included in your rate.',
        },
        {
          question: 'Do you cater to special dietary requirements?',
          answer: 'Yes, we can accommodate various dietary needs including vegetarian, vegan, gluten-free, and other special requests. Please inform us of any dietary restrictions at the time of booking.',
        },
        {
          question: 'Is room service available?',
          answer: 'Yes, 24-hour room service is available. Our menu includes a variety of local and international dishes.',
        },
      ],
    },
    {
      name: 'Policies',
      faqs: [
        {
          question: 'Are pets allowed?',
          answer: 'Unfortunately, we do not allow pets in the property, with the exception of registered service animals.',
        },
        {
          question: 'Is smoking allowed?',
          answer: 'White Vintage Bungalow is a non-smoking property. Smoking is only permitted in designated outdoor areas.',
        },
        {
          question: 'What is your policy on children?',
          answer: 'Children of all ages are welcome. Children under 6 years stay free when using existing beds. Extra beds for older children are available at additional cost.',
        },
      ],
    },
    {
      name: 'Payment & Pricing',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept cash (LKR, USD, EUR, GBP), credit/debit cards (Visa, Mastercard), and online bank transfers. We also accept payments through local payment gateways like HelaPay and WebXPay.',
        },
        {
          question: 'Are prices inclusive of taxes?',
          answer: 'All prices displayed on our website are inclusive of applicable taxes and service charges unless otherwise stated.',
        },
        {
          question: 'Do you offer discounts for extended stays?',
          answer: 'Yes, we offer special rates for stays of 5 nights or more. Please contact us directly for extended stay packages.',
        },
      ],
    },
    {
      name: 'Location & Transportation',
      faqs: [
        {
          question: 'How far is the hotel from the airport?',
          answer: 'We are approximately 160 km from Bandaranaike International Airport (CMB), which is about a 4-5 hour drive. We offer airport pickup services for your convenience.',
        },
        {
          question: 'Do you provide airport transportation?',
          answer: 'Yes, we offer airport pickup and drop-off services at competitive rates. Please book in advance through our reservations team.',
        },
        {
          question: 'What are the nearby attractions?',
          answer: 'Popular nearby attractions include Gregory Lake (2 km), Hakgala Botanical Garden (5 km), Victoria Park (3 km), and numerous tea factories. We can arrange guided tours.',
        },
      ],
    },
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-heading font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Find answers to common questions about your stay
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search your questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="container mx-auto px-4 py-16">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No questions found matching your search.</p>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-heading font-bold mb-4 text-primary">
                  {category.name}
                </h2>
                <div className="space-y-2">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    const isOpen = openIndex === globalIndex;

                    return (
                      <div
                        key={faqIndex}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-left font-medium text-gray-900">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`text-primary flex-shrink-0 ml-4 transition-transform ${
                              isOpen ? 'transform rotate-180' : ''
                            }`}
                            size={20}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Still Have Questions */}
      <section className="bg-primary-light py-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <MessageCircle className="mx-auto mb-4 text-primary" size={48} />
          <h2 className="text-3xl font-heading font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-700 mb-8">
            Can't find what you're looking for? Our team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              Contact Us
            </Button>
            <Button variant="outline" size="lg">
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-heading font-bold">Need More Information?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { title: 'View Our Rooms', link: '/rooms' },
            { title: 'Check Services', link: '/services' },
            { title: 'Booking Policy', link: '/terms' },
          ].map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
            >
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <span className="text-primary">Learn More →</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}