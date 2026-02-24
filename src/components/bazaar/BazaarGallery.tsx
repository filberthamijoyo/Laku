'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface BazaarGalleryProps {
  images: string[];
  bazaarName: string;
}

export function BazaarGallery({ images, bazaarName }: BazaarGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  // Group images into pairs (2 images per column)
  const pairedImages: string[][] = [];
  for (let i = 0; i < images.length; i += 2) {
    pairedImages.push(images.slice(i, i + 2));
  }

  const totalPages = pairedImages.length;

  // Handle scroll to update progress (0 to 1)
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(progress);
    }
  };

  // All images have the same height
  const getImageHeight = () => {
    return 'h-40';
  };

  // Padding for staggered alignment within the container
  // Columns 0, 2, 4... have no padding (align at top)
  // Columns 1, 3, 5... have top padding to push down (align with next column)
  const getColumnPadding = (pairIndex: number) => {
    const isEvenColumn = pairIndex % 2 === 0;
    return isEvenColumn ? 'pt-0' : 'pt-8';
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Caption */}
      <div className="px-4 py-3">
        <h2 className="text-base font-semibold text-gray-900">
          Keseruan di {bazaarName} !
        </h2>
      </div>
      
      {/* Horizontal scrollable container */}
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-3 -mx-4"
        onScroll={handleScroll}
      >
        {pairedImages.map((pair, pairIndex) => (
          <div
            key={pairIndex}
            className={`flex-shrink-0 flex flex-col gap-2 ${getColumnPadding(pairIndex)}`}
          >
            {/* First image in the pair */}
            <div
              className={`relative w-32 sm:w-40 rounded-lg overflow-hidden bg-gray-100 ${getImageHeight()}`}
            >
              <Image
                src={pair[0]}
                alt={`Gallery image ${pairIndex * 2 + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 128px, 160px"
              />
            </div>
            
            {/* Second image in the pair */}
            {pair[1] && (
              <div
                className={`relative w-32 sm:w-40 rounded-xl overflow-hidden bg-gray-100 ${getImageHeight()}`}
              >
                <Image
                  src={pair[1]}
                  alt={`Gallery image ${pairIndex * 2 + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 128px, 160px"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Continuous Band Indicator */}
      {totalPages > 1 && (
        <div className="flex justify-center py-3">
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#ff2742] transition-all duration-300 ease-out rounded-full"
              style={{ 
                width: `${totalPages > 1 ? (1 / totalPages) * 100 : 100}%`,
                marginLeft: `${scrollProgress * (100 - (totalPages > 1 ? (1 / totalPages) * 100 : 100))}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
