'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BazaarBrand, Booth } from '@/lib/bazaar-data';

interface InteractiveMapProps {
  mapImage: string;
  brands: BazaarBrand[];
  bazaarName: string;
  booths?: Booth[];
}

interface BrandPosition {
  brand: BazaarBrand;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function InteractiveMap({ mapImage, brands, bazaarName, booths }: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [brandPositions, setBrandPositions] = useState<BrandPosition[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<BazaarBrand | null>(null);
  
  // Pinch-to-zoom state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const touchStartRef = useRef<{ distance: number; center: { x: number; y: number } } | null>(null);

  // Calculate distance between two touch points
  const getTouchDistance = (touches: TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Calculate center point between two touches
  const getTouchCenter = (touches: TouchList) => {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  };

  // Calculate container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Touch event handlers for pinch-to-zoom
  const lastTapRef = useRef<number>(0);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      touchStartRef.current = { distance, center };
    } else if (e.touches.length === 1) {
      // Double tap detection
      const now = Date.now();
      if (lastTapRef.current && now - lastTapRef.current < 300) {
        // Double tap - reset zoom
        e.preventDefault();
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
      lastTapRef.current = now;
      
      // Pan start (only when zoomed in)
      if (scale > 1) {
        e.preventDefault();
        setIsDragging(true);
        setStartPosition({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y
        });
      }
    }
  }, [scale, position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartRef.current) {
      // Pinch move
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      
      // Calculate new scale
      const scaleFactor = distance / touchStartRef.current.distance;
      const newScale = Math.min(Math.max(scale * scaleFactor, 1), 4); // Limit scale between 1 and 4
      
      // Calculate position adjustment to zoom towards center
      const scaleDiff = newScale / scale;
      const newPosition = {
        x: position.x - (center.x - touchStartRef.current.center.x) * (scaleDiff - 1),
        y: position.y - (center.y - touchStartRef.current.center.y) * (scaleDiff - 1)
      };
      
      setScale(newScale);
      setPosition(newPosition);
      touchStartRef.current = { distance, center };
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Pan move
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - startPosition.x,
        y: e.touches[0].clientY - startPosition.y
      });
    }
  }, [scale, position, isDragging, startPosition]);

  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null;
    setIsDragging(false);
  }, []);

  // Reset zoom when leaving the page
  useEffect(() => {
    return () => {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    };
  }, []);

  // Calculate brand positions based on their mapPosition or booth coordinates
  useEffect(() => {
    if (containerSize.width === 0 || brands.length === 0) return;

    let positions: BrandPosition[];

    // If booths are provided, use their coordinates directly
    if (booths && booths.length > 0) {
      // Original image dimensions
      const originalWidth = 926;
      const originalHeight = 566;
      
      // Calculate scale based on container size vs original image
      const scale = containerSize.width / originalWidth;

      positions = brands.map(brand => {
        const booth = booths.find(b => b.id === brand.boothNumber);
        if (booth) {
          return { 
            brand, 
            x: booth.x * scale, 
            y: booth.y * scale, 
            width: booth.w * scale, 
            height: booth.h * scale 
          };
        }
        // Fallback to grid calculation if booth not found
        return null;
      }).filter((p): p is BrandPosition => p !== null);
    } else {
      // Calculate grid dimensions based on max row and col
      const maxRow = Math.max(...brands.map(b => b.mapPosition.row));
      const maxCol = Math.max(...brands.map(b => b.mapPosition.col));

      const cellWidth = containerSize.width / maxCol;
      const cellHeight = containerSize.height / maxRow;

      positions = brands.map(brand => {
        // Calculate position based on mapPosition
        const col = brand.mapPosition.col - 1;
        const row = brand.mapPosition.row - 1;

        // Add some padding within the cell
        const padding = 0.15;
        const x = col * cellWidth + cellWidth * padding;
        const y = row * cellHeight + cellHeight * padding;
        const width = cellWidth * (1 - padding * 2);
        const height = cellHeight * (1 - padding * 2);

        return { brand, x, y, width, height };
      });
    }

    setBrandPositions(positions);
  }, [containerSize, brands, booths]);

  return (
    <div className="relative w-full">
      {/* Map Image Container - stays fixed */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[926/566] bg-gray-100 rounded-lg overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Inner wrapper - transforms for zoom */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {/* Map Image */}
          <Image
            src={mapImage}
            alt={`${bazaarName} map`}
            fill
            className="object-contain"
            priority
          />

          {/* Brand Booth Overlays - invisible touch targets */}
          {brandPositions.map(({ brand, x, y, width, height }) => (
            <Link
              key={brand.id}
              href={`/store/${brand.slug}`}
              className="absolute cursor-pointer"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`,
              }}
              onClick={(e) => {
                // Don't navigate, just show the brand info
                e.preventDefault();
                setSelectedBrand(brand);
              }}
            />
          ))}
        </div>
      </div>

      {/* Selected Brand Modal */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setSelectedBrand(null)} 
          />
          <div className="relative w-full bg-white rounded-t-2xl p-4 pb-8 animate-slideUp">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-[#ff2742]">{selectedBrand.boothNumber}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedBrand.brandName}</h3>
                <p className="text-sm text-gray-500">Booth {selectedBrand.boothNumber}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Link 
                href={`/store/${selectedBrand.slug}`}
                className="block w-full bg-[#ff2742] text-white text-center py-3 rounded-lg font-medium"
              >
                View Store
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
