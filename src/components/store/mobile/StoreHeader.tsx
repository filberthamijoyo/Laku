'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Share, Search } from 'lucide-react';
import { Store } from '@/types/store';

interface StoreHeaderProps {
  store: Store;
  onSearchClick?: () => void;
  scrollProgress?: number; // 0 = at top, 1 = fully scrolled
}

export function StoreHeader({ store, onSearchClick, scrollProgress = 0 }: StoreHeaderProps) {
  const router = useRouter();
  
  // Calculate background opacity: gradual based on scroll position (full white at ~150px)
  const bgOpacity = Math.min(scrollProgress * 2, 1);
  
  // Icon color: white at top, black when scrolled
  const iconColor = scrollProgress > 0.3 ? '#111827' : 'white';
  
  // Search bar background: transparent at top, gray when scrolled
  const searchBarBgOpacity = 0.15 + (Math.min(scrollProgress * 2, 1) * 0.1);
  
  // Placeholder color: white at top, dark when scrolled
  const placeholderColor = scrollProgress > 0.3 ? '#6B7280' : 'rgba(255, 255, 255, 0.7)';

  const handleBack = () => router.back();

  const handleSearchClick = () => {
    if (onSearchClick) return onSearchClick();
    // TODO: Wire up store search action
    console.log('Open store search');
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
      // TODO: Show toast notification
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[70]"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
          transition: 'background-color 0.3s ease-out',
        }}
    >
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: iconColor }} />
        </button>

        {/* Search Bar - extends to fill space with equal gaps */}
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
    </header>
  );
}
