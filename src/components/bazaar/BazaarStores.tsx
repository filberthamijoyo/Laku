'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ShoppingBag } from 'lucide-react';
import { BazaarBrand } from '@/lib/bazaar-data';
import { storesData } from '@/lib/stores-data';

interface BazaarStoresProps {
  brands: BazaarBrand[];
}

interface BrandWithCategories extends BazaarBrand {
  categories: string[];
}

interface CategoryGroup {
  category: string;
  brands: BrandWithCategories[];
}

export function BazaarStores({ brands }: BazaarStoresProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Clear all selected categories
  const clearSelection = () => {
    setSelectedCategories([]);
  };

  // Get all unique categories from all stores
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    brands.forEach((brand) => {
      const store = storesData[brand.slug];
      if (store?.categories) {
        store.categories.forEach((cat) => categories.add(cat));
      }
    });
    return Array.from(categories).sort();
  }, [brands]);

  // Group brands by ALL their categories from stores-data
  const categoryGroups: CategoryGroup[] = useMemo(() => {
    const groups = brands.reduce((acc, brand) => {
      const store = storesData[brand.slug];
      const categories = store?.categories || ['Other'];
      
      categories.forEach((category) => {
        const existingGroup = acc.find(g => g.category === category);
        if (existingGroup) {
          existingGroup.brands.push({ ...brand, categories });
        } else {
          acc.push({ category, brands: [{ ...brand, categories }] });
        }
      });
      
      return acc;
    }, [] as CategoryGroup[]);

    // Sort categories alphabetically
    groups.sort((a, b) => a.category.localeCompare(b.category));
    return groups;
  }, [brands]);

  // Filter groups based on selected categories (show only selected if any, otherwise show all)
  const filteredGroups = selectedCategories.length > 0
    ? categoryGroups.filter(g => selectedCategories.includes(g.category))
    : categoryGroups;

  return (
    <div className="space-y-6">
      {/* Category Filter Badges */}
      <div className="flex flex-wrap gap-2 pb-4">
        <button
          onClick={clearSelection}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategories.length === 0
              ? 'bg-[#ff2742] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategories.includes(category)
                ? 'bg-[#ff2742] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Store Groups - Sorted Alphabetically by Category */}
      {filteredGroups.map(({ category, brands: categoryBrands }) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
          <div className="space-y-3">
            {categoryBrands.map(brand => (
              <div 
                key={`${brand.id}-${category}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#ff2742]/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Store Logo */}
                  {storesData[brand.slug] ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={storesData[brand.slug].logoImage}
                        alt={brand.brandName}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-[#ff2742]/10 border border-[#ff2742]/30 rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold text-[#ff2742]">{brand.boothNumber}</span>
                    </div>
                  )}
                  
                  {/* Brand Info */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{brand.brandName}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">Booth {brand.boothNumber}</span>
                    </div>
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
        </div>
      ))}
    </div>
  );
}
