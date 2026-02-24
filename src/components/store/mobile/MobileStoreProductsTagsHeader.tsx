'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share, Search } from 'lucide-react';
import Image from 'next/image';
import { Store } from '@/types/store';
import { StoreLogo } from './StoreLogo';
import { StoreInfo } from './StoreInfo';
import MobileStoreFollowing from './MobileStoreFollowing';

interface Props {
  store: Store;
  expandedHeight?: number;
  isFollowing?: boolean;
  onFollow?: () => void;
}

export default function MobileStoreProductsTagsHeader({
  store,
  expandedHeight = 147,
  isFollowing,
  onFollow,
}: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bgColor, setBgColor] = useState<string>('rgba(0,0,0,0.12)');
  const formatShort = (n?: number) => {
    if (n === undefined || n === null) return '0';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    return String(n);
  };

  // Scroll listener for background transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Calculate scroll progress: 0 = at top, 1 = fully scrolled (at ~75px)
      setScrollProgress(Math.min(scrollY / 75, 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const preferredStoreImage = (store as any)?.banner || (store as any)?.coverImage || store?.products?.[0]?.image || store?.logo;
    if (!preferredStoreImage || typeof window === 'undefined') return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = encodeURI(preferredStoreImage);
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const w = 50;
        const h = 50;
        canvas.width = w;
        canvas.height = h;
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          r += data[i];
          g += data[i+1];
          b += data[i+2];
          count++;
        }
        if (count === 0) return;
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        setBgColor(`rgb(${r}, ${g}, ${b})`);
      } catch {
        // ignore
      }
    };
  }, [store]);

  // Calculate colors based on scroll progress (0 = at top, 1 = fully scrolled)
  const bgOpacity = Math.min(scrollProgress * 2, 1);
  const iconColor = scrollProgress > 0.3 ? '#111827' : 'white';
  const searchBarBgOpacity = 0.15 + (Math.min(scrollProgress * 2, 1) * 0.1);
  const placeholderColor = scrollProgress > 0.3 ? '#6B7280' : 'rgba(255, 255, 255, 0.7)';

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    // noop for now
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: store.name,
          text: store.description,
          url: window.location.href,
        });
      } catch {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div
      className="relative w-full"
      style={{
        height: `${expandedHeight}px`,
        background: `linear-gradient(180deg, ${bgColor} 0%, rgba(255,255,255,1) 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-black/15" />
      
      {/* Section 1: Search Bar with Back and Share buttons */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
          transition: 'background-color 0.3s ease-out',
        }}
      >
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: iconColor }} />
        </button>

        <div 
          className="flex items-center gap-3 h-9 px-3.5 rounded-lg flex-1 mx-3"
          style={{
            backgroundColor: `rgba(128, 128, 128, ${searchBarBgOpacity})`,
            transition: 'background-color 0.3s ease-out',
          }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: iconColor }} />
          <input
            type="text"
            placeholder={`Find Products In ${store.name}`}
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ 
              color: iconColor,
              ['--tw-placeholder-color' as string]: placeholderColor,
            } as React.CSSProperties}
          />
        </div>

        <button
          onClick={handleShare}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Share className="w-5 h-5" style={{ color: iconColor }} />
        </button>
      </div>

      {/* Section 2: Store Bio - no background transition */}
      <div className="relative z-10 px-4 pb-3 pt-14">
        <div className="flex items-start gap-4 pt-1.5">
          <StoreLogo store={store} />
          <div className="flex-1 pt-1">
            <StoreInfo store={store} />

            {/* Stats row with follow/chat buttons placed below StoreInfo */}
            <div className="mt-2 w-full overflow-hidden">
              <div className="flex items-center justify-between pt-2.5 pb-2.5">
                <div className="flex items-center justify-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold text-white">{formatShort(store.followers)}</div>
                    <div className="text-xs text-white/80">Followers</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold text-white">{formatShort(store.productCount)}</div>
                    <div className="text-xs text-white/80">Products</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold text-white">{String(store.rating ?? '-')}</div>
                    <div className="text-xs text-white/80">Rating</div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <MobileStoreFollowing isFollowing={isFollowing} onToggle={onFollow} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
