'use client';

import { useState, useEffect } from 'react';
import { Store, StoreTab, StoreFilter, StoreSortOption } from '@/types/store';

import { MobileStoreBody } from './MobileStoreBody';
import { MobileStoreTabs } from './MobileStoreTabs';
import { MobileStoreProducts } from './MobileStoreProducts';
import MobileStoreTags from './MobileStoreTags';
import { MobileStoreBioBackground } from './MobileStoreBioBackground';
import { MobileStoreBioName } from './MobileStoreBioName';
import { MobileStoreBioCaption } from './MobileStoreBioCaption';
import { StoreHeader } from './StoreHeader';
import MobileStoreProductsTagsHeader from './MobileStoreProductsTagsHeader';


interface MobileStorePageProps {
  store: Store;
  showBottomNav?: boolean;
}

export function MobileStorePage({ store, showBottomNav = true }: MobileStorePageProps) {
  const [activeTab, setActiveTab] = useState<StoreTab>('home');
  const [filters, setFilters] = useState<StoreFilter>({});
  const [sortBy, setSortBy] = useState<StoreSortOption>('recommended');
  const [isFollowing, setIsFollowing] = useState<boolean>(!!store.isFollowing);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = 300; // Match height of store bio section
      // Calculate progress from 0 to 1 based on scroll position
      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFollow = () => {
    setIsFollowing((s) => !s);
  };

  const handleTabChange = (tab: StoreTab) => {
    setActiveTab(tab);
  };

  const handleFiltersChange = (newFilters: StoreFilter) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: StoreSortOption) => {
    setSortBy(newSort);
  };

  return (
    <div className="min-h-screen bg-white">

      {showBottomNav && (
        <MobileStoreTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          store={store}
        />
      )}
      {/* Sticky header - placed outside MobileStoreBioBackground so it stays fixed at top */}
      {activeTab === 'home' && <StoreHeader store={store} scrollProgress={scrollProgress} />}

      {/* Sticky header for selected tabs - placed above tab content to avoid ancestor overflow */}
      {(['home', 'products', 'tags'] as StoreTab[]).includes(activeTab) && (
        <>
          {activeTab === 'home' ? (
            <MobileStoreBioBackground store={store} expandedHeight={300}>
              <MobileStoreBioName store={store} />
              <MobileStoreBioCaption store={store} isFollowing={isFollowing} onFollow={toggleFollow} />
            </MobileStoreBioBackground>
          ) : (
            <MobileStoreProductsTagsHeader store={store} expandedHeight={147} isFollowing={isFollowing} onFollow={toggleFollow} />
          )}
        </>
      )}

      {/* Tab Content */}
      <div className="pt-0 pb-0"> {/* padding reset per preview changes */}

        {activeTab === 'home' && (
          <>
            <MobileStoreBody store={store} images={store.products.map((p) => p.image)} />
            <MobileStoreProducts
              store={store}
              filters={filters}
              sortBy={sortBy}
              onFiltersChange={handleFiltersChange}
              onSortChange={handleSortChange}
              showDivision={false}
            />
          </>
        )}

        {activeTab === 'products' && (
          <>
          <MobileStoreProducts
            store={store}
            filters={filters}
            sortBy={sortBy}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
          />
          </>
        )}

        {activeTab === 'tags' && (
          <MobileStoreTags store={store} />
        )}

        {activeTab === 'chat' && (
          <div className="p-4 text-center text-gray-600">Chat room coming soon</div>
        )}
      </div>
    </div>
  );
}