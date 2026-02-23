'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Grid, Navigation, ShoppingBag } from 'lucide-react';
import { bazaarData, BazaarBrand } from '@/lib/bazaar-data';
import { BottomNavBazaar } from '@/components/layouts/BottomNavBazaar';

export default function BazaarMapPage() {
  const params = useParams();
  const router = useRouter();
  const bazaarId = params.id as string;
  
  const bazaar = bazaarData[bazaarId];
  const [selectedBrand, setSelectedBrand] = useState<BazaarBrand | null>(null);

  if (!bazaar) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Bazaar not found</p>
          <Link href="/bazaar" className="text-[#ff2742] mt-2 inline-block">
            Back to Bazaar list
          </Link>
        </div>
      </div>
    );
  }

  // Generate map grid
  const renderMap = () => {
    const { rows, cols } = bazaar.mapLayout;
    const cells = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const brand = bazaar.brands.find(b => b.mapPosition.row === row + 1 && b.mapPosition.col === col + 1);
        
        cells.push(
          <div
            key={`${row}-${col}`}
            onClick={() => brand && setSelectedBrand(brand)}
            className={`
              aspect-square border rounded-lg flex items-center justify-center text-xs font-medium transition-all
              ${brand 
                ? 'bg-[#ff2742]/10 border-[#ff2742]/30 text-[#ff2742] cursor-pointer hover:bg-[#ff2742]/20' 
                : 'bg-gray-50 border-gray-100 text-gray-300'
              }
            `}
          >
            {brand ? brand.boothNumber : ''}
          </div>
        );
      }
    }
    
    return (
      <div 
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cells}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff2742] to-pink-500 text-white p-4 pt-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold">Bazaar Map</h1>
          <p className="text-white/80 mt-1">{bazaar.name}</p>
        </div>
      </div>

      {/* Map Content */}
      <div className="p-4">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">Booth Layout</h3>
          <p className="text-sm text-gray-500">Tap a booth to see the brand</p>
        </div>
        
        {renderMap()}
        
        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-3">All Brands</h4>
          <div className="grid grid-cols-2 gap-2">
            {bazaar.brands.map(brand => (
              <div key={brand.id} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#ff2742]/10 border border-[#ff2742]/30 rounded flex items-center justify-center text-xs font-bold text-[#ff2742]">
                  {brand.boothNumber}
                </div>
                <span className="text-sm text-gray-600">{brand.brandName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Detail Modal */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedBrand(null)} />
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
            
            <div className="flex gap-2 mt-6">
              <Link 
                href={`/store/${selectedBrand.slug}`}
                className="flex-1 bg-[#ff2742] text-white text-center py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                View Store
              </Link>
              <button 
                onClick={() => setSelectedBrand(null)}
                className="px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Navigate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavBazaar bazaarId={bazaarId} />
    </div>
  );
}
