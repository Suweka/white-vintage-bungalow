import React from 'react';
import Link from 'next/link';
import { Users, Maximize, Wifi, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface RoomCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  size: number;
  image: string;
  amenities?: string[];
  badge?: string;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  id,
  name,
  description,
  price,
  maxGuests,
  size,
  image,
  amenities = [],
  badge,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <div 
          className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        {badge && (
          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">{name}</h3>
        
        {/* Features */}
        <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{maxGuests} Guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize size={16} />
            <span>{size} sqft</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

        {/* Amenities */}
        <div className="flex gap-3 mb-4">
          <div className="flex items-center gap-1 text-primary">
            <Wifi size={18} />
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Coffee size={18} />
          </div>
        </div>

        {/* Price & Button */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            <span className="text-3xl font-bold text-primary">{formatCurrency(price)}</span>
            <span className="text-gray-500 text-sm ml-1">/ night</span>
          </div>
          <Link href={`/rooms/${id}`}>
            <Button variant="primary" size="md">
              View Details →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};