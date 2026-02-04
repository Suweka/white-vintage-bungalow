'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Category = 'all' | 'rooms' | 'facilities' | 'location' | 'food';

interface GalleryImage {
  id: number;
  category: Category | string;
  title: string;
  src: string;
}

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

  const images: GalleryImage[] = [
    // Rooms
    { id: 1, category: 'rooms', title: 'Deluxe Room', src: '/images/rooms/deluxe.jpeg' },
    { id: 2, category: 'rooms', title: 'Junior Suite', src: '/images/rooms/suite.jpeg' },
    { id: 3, category: 'rooms', title: 'Family Room', src: '/images/rooms/family.jpeg' },
    { id: 13, category: 'rooms', title: 'Bathroom', src: '/images/rooms/junior.jpeg' },
    { id: 14, category: 'rooms', title: 'Living Area', src: '/images/rooms/executive.jpeg' },

    // Facilities
    { id: 4, category: 'facilities', title: 'Kitchen', src: '/images/kitchen.jpeg' },
    { id: 5, category: 'facilities', title: 'Living Area', src: '/images/living-area.jpeg' },
    { id: 6, category: 'facilities', title: 'Living Area', src: '/images/living-area2.jpeg' },
    { id: 15, category: 'facilities', title: 'Dining Area', src: '/images/dining-area.jpeg' },
    { id: 18, category: 'facilities', title: 'Garden', src: '/images/location5.jpeg' },

    // Location
    { id: 7, category: 'location', title: 'Tea Plantation View', src: '/images/location1.jpeg' },
    { id: 8, category: 'location', title: 'Mountain Scenery', src: '/images/location2.jpeg' },
    { id: 9, category: 'location', title: 'Garden Area', src: '/images/location3.jpeg' },
    { id: 16, category: 'location', title: 'Exterior View', src: '/images/location4.jpeg' },
    { id: 20, category: 'location', title: 'Exterior View', src: '/images/location6.jpeg' },


    // Food & Dining
    { id: 10, category: 'food', title: 'Garden', src: '/images/food1.jpeg' },
    { id: 11, category: 'food', title: 'Breakfast Buffet', src: '/images/food2.jpeg' },
    { id: 12, category: 'food', title: 'Fine Dining', src: '/images/food3.jpeg' },
    { id: 17, category: 'food', title: 'Bar Area', src: '/images/food4.jpeg' },
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
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
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
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
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

          <div className="max-w-6xl w-full h-full flex items-center justify-center">
            <img
              src={filteredImages[lightboxImage].src}
              alt={filteredImages[lightboxImage].title}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
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