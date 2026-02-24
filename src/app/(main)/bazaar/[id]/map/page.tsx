'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { bazaarData } from '@/lib/bazaar-data';
import { BottomNavBazaar } from '@/components/layouts/BottomNavBazaar';
import { InteractiveMap } from '@/components/bazaar/InteractiveMap';

export default function BazaarMapPage() {
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
      {/* Header - with bazaar background image */}
      <div className="relative text-white p-4 pt-12 h-[180px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bazaar.image}
            alt={bazaar.name}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        {/* Header Content */}
        <div className="relative z-10">
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
      </div>

      {/* Interactive Map */}
      <div className="p-4">
        {bazaar.map && bazaar.brands.length > 0 ? (
          <InteractiveMap 
            mapImage={bazaar.map}
            brands={bazaar.brands}
            bazaarName={bazaar.name}
            booths={bazaar.booths}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No map available for this bazaar</p>
          </div>
        )}
        
        {/* Legend */}
        {bazaar.brands.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-3">All Brands</h4>
            <div className="grid grid-cols-2 gap-2">
              {bazaar.brands.map(brand => (
                <Link 
                  key={brand.id}
                  href={`/store/${brand.slug}`}
                  className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded"
                >
                  <div className="w-8 h-8 bg-[#ff2742]/10 border border-[#ff2742]/30 rounded flex items-center justify-center text-xs font-bold text-[#ff2742]">
                    {brand.boothNumber}
                  </div>
                  <span className="text-sm text-gray-600">{brand.brandName}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavBazaar bazaarId={bazaarId} />
    </div>
  );
}
