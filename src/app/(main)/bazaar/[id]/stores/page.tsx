'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { bazaarData } from '@/lib/bazaar-data';
import { BottomNavBazaar } from '@/components/layouts/BottomNavBazaar';
import { BazaarStores } from '@/components/bazaar/BazaarStores';

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
            <h1 className="text-2xl font-bold">All Stores</h1>
            <p className="text-white/80 mt-1">{bazaar.name}</p>
            <p className="text-white/60 text-sm mt-2">{bazaar.brands.length} brands participating</p>
          </div>
        </div>
      </div>

      {/* Stores List - grouped by category */}
      <div className="p-4">
        <BazaarStores brands={bazaar.brands} />
      </div>

      {/* Bottom Navigation */}
      <BottomNavBazaar bazaarId={bazaarId} />
    </div>
  );
}
