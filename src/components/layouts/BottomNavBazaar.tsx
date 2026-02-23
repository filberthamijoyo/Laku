'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPinned, Sparkles, Store } from 'lucide-react';

interface BottomNavBazaarProps {
  bazaarId: string;
}

export function BottomNavBazaar({ bazaarId }: BottomNavBazaarProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>('highlights');

  // Determine active tab based on pathname
  const getActiveTab = () => {
    if (pathname.includes('/map')) return 'map';
    if (pathname.includes('/stores')) return 'stores';
    return 'highlights';
  };

  const currentTab = getActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[70] bg-white border-t border-gray-200">
      <div className="flex items-center justify-around h-20 pb-6 px-2">
        {/* Map */}
        <Link
          href={`/bazaar/${bazaarId}/map`}
          className="flex flex-col items-center gap-1 flex-1"
          onClick={() => setActiveTab('map')}
        >
          <MapPinned
            className={`w-6 h-6 ${
              currentTab === 'map' ? 'text-[#ff2742]' : 'text-gray-500'
            }`}
          />
          <span className={`text-xs ${currentTab === 'map' ? 'text-[#ff2742] font-medium' : 'text-gray-600'}`}>
            Map
          </span>
        </Link>

        {/* Highlights */}
        <Link
          href={`/bazaar/${bazaarId}`}
          className="flex flex-col items-center gap-1 flex-1"
          onClick={() => setActiveTab('highlights')}
        >
          <Sparkles
            className={`w-6 h-6 ${
              currentTab === 'highlights' ? 'text-[#ff2742]' : 'text-gray-500'
            }`}
          />
          <span className={`text-xs ${currentTab === 'highlights' ? 'text-[#ff2742] font-medium' : 'text-gray-600'}`}>
            Highlights
          </span>
        </Link>

        {/* Stores */}
        <Link
          href={`/bazaar/${bazaarId}/stores`}
          className="flex flex-col items-center gap-1 flex-1"
          onClick={() => setActiveTab('stores')}
        >
          <Store
            className={`w-6 h-6 ${
              currentTab === 'stores' ? 'text-[#ff2742]' : 'text-gray-500'
            }`}
          />
          <span className={`text-xs ${currentTab === 'stores' ? 'text-[#ff2742] font-medium' : 'text-gray-600'}`}>
            Stores
          </span>
        </Link>
      </div>
    </nav>
  );
}

export default BottomNavBazaar;
