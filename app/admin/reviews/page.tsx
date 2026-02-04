'use client';

import React, { useState } from 'react';
import { Search, Filter, Star, Trash2, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

type ReviewRating = 5 | 4 | 3 | 2 | 1;

interface Review {
  id: string;
  guestName: string;
  rating: ReviewRating;
  date: string;
  comment: string;
  room: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  response?: string;
  responseDate?: string;
}

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<'all' | ReviewRating>(5);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');

  const reviews: Review[] = [
    {
      id: 'REV001',
      guestName: 'Sarah Johnson',
      rating: 5,
      date: '2025-12-13',
      comment: 'Absolutely stunning room with incredible views. The bed was so comfortable and the staff was amazing! Will definitely come back.',
      room: 'Deluxe Room 101',
      verified: true,
      helpful: 24,
      notHelpful: 2,
      response: 'Thank you for your wonderful review! We look forward to welcoming you again soon.',
      responseDate: '2025-12-14',
    },
    {
      id: 'REV002',
      guestName: 'Michael Chen',
      rating: 5,
      date: '2025-12-11',
      comment: 'Best hotel experience in Nuwara Eliya. The room was spotless and had everything we needed. Highly recommend!',
      room: 'Junior Suite 202',
      verified: true,
      helpful: 18,
      notHelpful: 1,
    },
    {
      id: 'REV003',
      guestName: 'Emma Wilson',
      rating: 4,
      date: '2025-12-10',
      comment: 'Beautiful colonial charm with modern comforts. Great location with stunning views. Only minor issue was water pressure.',
      room: 'Family Room 303',
      verified: true,
      helpful: 12,
      notHelpful: 3,
    },
    {
      id: 'REV004',
      guestName: 'David Brown',
      rating: 3,
      date: '2025-12-08',
      comment: 'Good stay overall. Room was nice but a bit noisy from adjacent rooms. Could use better soundproofing.',
      room: 'Deluxe Room 104',
      verified: true,
      helpful: 8,
      notHelpful: 5,
    },
    {
      id: 'REV005',
      guestName: 'Lisa Anderson',
      rating: 2,
      date: '2025-12-05',
      comment: 'The room was okay but breakfast was disappointing. WiFi was unreliable throughout the stay.',
      room: 'Standard Room 105',
      verified: true,
      helpful: 10,
      notHelpful: 2,
    },
  ];

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterRating === 'all' || review.rating === filterRating;

    return matchesSearch && matchesFilter;
  });

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const renderStars = (rating: ReviewRating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-accent text-accent' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Reviews</h1>
        <p className="text-gray-600">Manage guest reviews and ratings</p>
      </div>

      {/* Rating Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">{averageRating}</div>
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(Math.round(parseFloat(averageRating)) as ReviewRating)}
            </div>
            <p className="text-sm text-gray-600">{reviews.length} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex gap-1 w-16">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < rating ? 'fill-accent text-accent' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold w-8">
                  {ratingDistribution[rating as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by guest name or review content"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value as 'all' | ReviewRating)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              onClick={() => setSelectedReview(review)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{review.guestName}</h3>
                  <p className="text-sm text-gray-600">{review.room}</p>
                </div>
                {review.verified && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
              </div>

              <p className="text-gray-700 mb-3">{review.comment}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <ThumbsUp size={16} />
                  <span>{review.helpful}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsDown size={16} />
                  <span>{review.notHelpful}</span>
                </div>
              </div>

              {review.response && (
                <div className="mt-4 pt-4 border-t bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 font-medium mb-1">Your Response</p>
                  <p className="text-sm text-gray-700">{review.response}</p>
                </div>
              )}
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No reviews found</p>
            </div>
          )}
        </div>

        {/* Review Detail */}
        {selectedReview && (
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedReview.guestName}</h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <div className="flex gap-1 mb-2">{renderStars(selectedReview.rating)}</div>
              <p className="text-sm text-gray-600">{new Date(selectedReview.date).toLocaleDateString()}</p>
            </div>

            <div className="mb-4 pb-4 border-b">
              <p className="text-sm font-medium text-gray-700 mb-2">Room</p>
              <p className="text-gray-700">{selectedReview.room}</p>
            </div>

            <div className="mb-4 pb-4 border-b">
              <p className="text-sm font-medium text-gray-700 mb-2">Review</p>
              <p className="text-gray-700 text-sm">{selectedReview.comment}</p>
            </div>

            {selectedReview.response ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                <p className="text-xs text-green-700 font-medium mb-1">Your Response</p>
                <p className="text-sm text-green-900">{selectedReview.response}</p>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Write a Response</p>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Share your response to this review..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button className="mt-2 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
                  Post Response
                </button>
              </div>
            )}

            <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm">
              <Trash2 size={16} />
              Delete Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
