'use client';

import { Badge } from '@/components/ui/badge';
import StatsBar from '@/components/StatsBar';

export default function HeroHeader({ onCTAClick }) {
  return (
    <div className="relative overflow-hidden">
      {/* gradients & blobs keep the current styling */}
      <div className="relative container mx-auto px-6 pt-20 pb-32 text-center">
        <Badge className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2">
          ✨ CreatorHaven: Your Holistic AI Partner for Creator Mastery
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Beyond the Grind:
          </span>
          <br />
          <span className="text-gray-800">
            Your Path to Sustainable Creation.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
          {/* …copy unchanged… */}
        </p>

        <StatsBar />

        {/* If you keep the top-of-page CTA button, put it here and call onCTAClick */}
      </div>
    </div>
  );
}