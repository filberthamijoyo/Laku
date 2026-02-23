'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, ShoppingBag, Star } from 'lucide-react';
import { bazaarData } from '@/lib/bazaar-data';
import { BottomNavBazaar } from '@/components/layouts/BottomNavBazaar';

export default function BazaarStoresPage() {
  const params = useParams();
  const router = useRouter();
  const bazaarId = params.id as string;
  
  const bazaar = bazaarData[bazaarId];

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
          <h1 className="text-2xl font-bold">All Stores</h1>
          <p className="text-white/80 mt-1">{bazaar.name}</p>
          <p className="text-white/60 text-sm mt-2">{bazaar.brands.length} brands participating</p>
        </div>
      </div>

      {/* Stores List */}
      <div className="p-4 space-y-3">
        {bazaar.brands.map(brand => (
          <div 
            key={brand.id}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#ff2742]/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Booth Number */}
              <div className="w-14 h-14 bg-[#ff2742]/10 border border-[#ff2742]/30 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-[#ff2742]">{brand.boothNumber}</span>
              </div>
              
              {/* Brand Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{brand.brandName}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">Booth {brand.boothNumber}</span>
                </div>
                {brand.discount && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3" />
                    {brand.discount}% OFF
                  </div>
                )}
              </div>
              
              {/* View Store Button */}
              <Link 
                href={`/store/${brand.slug}`}
                className="bg-[#ff2742] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNavBazaar bazaarId={bazaarId} />
    </div>
  );
}
