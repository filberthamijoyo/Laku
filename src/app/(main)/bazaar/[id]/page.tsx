'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Shirt, ExternalLink, Navigation, ShoppingBag } from 'lucide-react';
import { productsData, ProductData } from '@/lib/products-data';
import { bazaarData, Bazaar, BazaarBrand, BazaarOutfit } from '@/lib/bazaar-data';
import { BottomNavBazaar } from '@/components/layouts/BottomNavBazaar';

export default function BazaarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bazaarId = params.id as string;
  
  // Get bazaar data
  const bazaar = bazaarData[bazaarId];
  
  const [selectedBrand, setSelectedBrand] = useState<BazaarBrand | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<{ id: string; name: string; items: { product: ProductData; brand: BazaarBrand }[] } | null>(null);

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

  // Generate outfits from bazaar brands
  const bazaarOutfits = useMemo(() => {
    const outfits: { id: string; name: string; items: { product: ProductData; brand: BazaarBrand }[] }[] = [];
    
    // Create combinations from bazaar brands
    bazaar.brands.forEach((brand, idx) => {
      // Find products from this brand
      const brandProducts = Object.values(productsData).filter(p => 
        p.brand.toLowerCase().includes(brand.brandName.toLowerCase().split(' ')[0].toLowerCase())
      );
      
      if (brandProducts.length > 0) {
        outfits.push({
          id: `outfit-${brand.id}`,
          name: `${brand.brandName} Look`,
          items: brandProducts.slice(0, 2).map(product => ({ product, brand }))
        });
      }
    });
    
    return outfits;
  }, [bazaar]);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#ff2742] to-pink-500 text-white p-4 pt-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to</h1>
          <h2 className="text-2xl font-bold mt-1">{bazaar.name}!</h2>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{bazaar.startDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{bazaar.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Content */}
      <div className="p-4">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">Bazaar Exclusive Outfits</h3>
          <p className="text-sm text-gray-500">Curated looks from brands at this bazaar</p>
        </div>
        
        <div className="space-y-4">
          {bazaarOutfits.map(outfit => (
            <div 
              key={outfit.id}
              onClick={() => setSelectedOutfit(outfit)}
              className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#ff2742]/50 transition-colors"
            >
              <h4 className="font-semibold text-gray-900">{outfit.name}</h4>
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {outfit.items.map((item, idx) => (
                  <div key={idx} className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={item.product.productImages[0]} 
                        alt={item.product.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate w-20">{item.product.brand}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-[#ff2742]">
                <span>View in store</span>
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </div>
            </div>
          ))}
          
          {bazaarOutfits.length === 0 && (
            <div className="text-center py-8">
              <Shirt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No outfits available yet</p>
            </div>
          )}
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
                onClick={() => setActiveTab('map')}
                className="px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Find on Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Outfit Detail Modal */}
      {selectedOutfit && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedOutfit(null)} />
          <div className="relative w-full bg-white rounded-t-2xl p-4 pb-8 max-h-[85vh] overflow-y-auto animate-slideUp">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            
            <h3 className="text-lg font-bold text-gray-900">{selectedOutfit.name}</h3>
            
            <div className="space-y-3 mt-4">
              {selectedOutfit.items.map((item, idx) => {
                // Find brand info
                const brand = bazaar.brands.find(b => b.id === item.brand.id);
                
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                      <img 
                        src={item.product.productImages[0]} 
                        alt={item.product.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.product.brand}</p>
                      <p className="text-xs text-gray-500">{item.product.name}</p>
                      <p className="text-sm font-semibold text-[#ff2742] mt-1">
                        Rp {item.product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {brand && (
                        <button 
                          onClick={() => {
                            setSelectedOutfit(null);
                            setSelectedBrand(brand);
                          }}
                          className="p-2 bg-white border border-gray-200 rounded-lg"
                          title="Find on Map"
                        >
                          <Navigation className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                      <Link 
                        href={`/product/${item.product.slug}`}
                        className="p-2 bg-[#ff2742] text-white rounded-lg"
                        title="View in Store"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavBazaar bazaarId={bazaarId} />
    </div>
  );
}
