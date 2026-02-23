'use client';

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/layouts/BottomNav';
import { usePathname } from 'next/navigation';
import { useBottomNav } from '@/components/layouts/BottomNavContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { hideBottomNav: contextHideBottomNav } = useBottomNav();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hide bottom navigation on store pages, product pages, bazaar detail pages, or when context says to hide
  const isStorePage = pathname?.startsWith('/store/');
  const isProductPage = pathname?.startsWith('/product/');
  const isBazaarDetailPage = pathname?.startsWith('/bazaar/') && pathname.split('/').length > 2;

  return (
    <div className="min-h-screen bg-laku-feed px-0">
      <main>
        {children}
      </main>
      {isMounted && !isStorePage && !isProductPage && !isBazaarDetailPage && !contextHideBottomNav && <BottomNav />}
    </div>
  );
}
