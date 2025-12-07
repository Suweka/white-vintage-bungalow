'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Category = 'all' | 'rooms' | 'facilities' | 'location' | 'food';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  const categories = [
    { id: 'all' as Category, label: 'All Photos' },
    { id: 'rooms' as Category, label: 'Rooms' },
    { id: 'facilities' as Category, label: 'Facilities' },
    { id: 'location' as Category, label: 'Location' },
    { id: 'food' as Category, label: 'Food & Dining' },
  ];

  // Mock gallery data
  const images = [
    { id: 1, category: 'rooms', title: 'Deluxe Room' },
    { id: 2, category: 'rooms', title: 'Junior Suite' },
    { id: 3, category: 'rooms', title: 'Family Room' },
    { id: 4, category: 'facilities', title: 'Swimming Pool' },
    { id: 5, category: 'facilities', title: 'Fitness Center' },
    { id: 6, category: 'facilities', title: 'Spa Area' },
    { id: 7, category: 'location', title: 'Tea Plantation View' },
    { id: 8, category: 'location', title: 'Mountain Scenery' },
    { id: 9, category: 'location', title: 'Garden Area' },
    { id: 10, category: 'food', title: 'Restaurant' },
    { id: 11, category: 'food', title: 'Breakfast Buffet' },
    { id: 12, category: 'food', title: 'Fine Dining' },
    { id: 13, category: 'rooms', title: 'Bathroom' },
    { id: 14, category: 'rooms', title: 'Living Area' },
    { id: 15, category: 'facilities', title: 'Reception' },
    { id: 16, category: 'location', title: 'Exterior View' },
    { id: 17, category: 'food', title: 'Bar Area' },
    { id: 18, category: 'facilities', title: 'Conference Room' },
  ];

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  const openLightbox = (index: number) => {
    setLightboxImage(index);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const nextImage = () => {
    if (lightboxImage !== null) {
      setLightboxImage((lightboxImage + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (lightboxImage !== null) {
      setLightboxImage((lightboxImage - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-heading font-bold mb-4">Our Gallery</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Explore the beauty of White Vintage Bungalow through our photo collection
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-heading font-semibold">
            {filteredImages.length} Photo{filteredImages.length !== 1 ? 's' : ''}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-semibold">{image.title}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No images found in this category</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Experience It In Person</h2>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            Book your stay and discover the charm of our colonial bungalow
          </p>
          <button className="bg-accent text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-accent-light transition-colors">
            Book Your Stay
          </button>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X size={32} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 z-10"
          >
            <ChevronLeft size={48} />
          </button>

          <div className="max-w-6xl w-full h-full flex items-center justify-center p-8">
            <div className="relative w-full aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg" />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 z-10"
          >
            <ChevronRight size={48} />
          </button>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
            <p className="text-lg font-semibold mb-2">{filteredImages[lightboxImage].title}</p>
            <p className="text-sm text-gray-300">
              {lightboxImage + 1} / {filteredImages.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}