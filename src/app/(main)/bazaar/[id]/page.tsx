'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Shirt, ExternalLink, Navigation, ShoppingBag } from 'lucide-react';
import { productsData, ProductData } from '@/lib/products-data';
import { bazaarData, Bazaar, BazaarBrand, BazaarOutfit, Thread } from '@/lib/bazaar-data';
import { BottomNavBazaar } from '@/components/layouts/BottomNavBazaar';
import { ThreadBazaar } from '@/components/bazaar/ThreadBazaar';
import { BazaarGallery } from '@/components/bazaar/BazaarGallery';

export default function BazaarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bazaarId = params.id as string;
  
  // Get bazaar data
  const bazaar = bazaarData[bazaarId];
  
  const [selectedBrand, setSelectedBrand] = useState<BazaarBrand | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<{ id: string; name: string; items: { product: ProductData; brand: BazaarBrand }[] } | null>(null);
  const [newThreadContent, setNewThreadContent] = useState('');
  const [userThreads, setUserThreads] = useState<Thread[]>([]);
  const [activeTab, setActiveTab] = useState<'threads' | 'map'>('threads');

  // Handle posting a new thread
  const handlePostThread = () => {
    if (!newThreadContent.trim()) return;

    const newThread = {
      id: `user-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      userAvatar: '/avatar-default.png',
      content: newThreadContent,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      replies: [],
      replyCount: 0
    };

    // Add new thread to the top of the list
    setUserThreads([newThread, ...userThreads]);
    setNewThreadContent('');
  };

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
      {/* Welcome Header - with bazaar background image */}
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
      </div>
      {bazaar.gallery && bazaar.gallery.length > 0 && (
        <BazaarGallery images={bazaar.gallery} bazaarName={bazaar.name} />
      )}

      {/* Highlights Content - Threads */}
      <div className="pb-4">
        {/* Create Thread Section - First */}
        <div className="px-4 py-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Share Your Experience</h3>
            <textarea
              placeholder="Tell us about your bazaar experience..."
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#ff2742] focus:border-transparent"
              rows={3}
              value={newThreadContent}
              onChange={(e) => setNewThreadContent(e.target.value)}
            />
            <div className="flex items-center justify-between mt-3">
              <button className="flex items-center gap-2 text-gray-500 hover:text-[#ff2742] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Add Photo</span>
              </button>
              <button 
                className="bg-[#ff2742] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e61e3a] transition-colors"
                onClick={handlePostThread}
                disabled={!newThreadContent.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Discussion Section Header - Second */}
        <div className="px-4 py-3">
          <h2 className="font-semibold text-gray-900">Discussion</h2>
          <p className="text-base font-semibold text-gray-500">See what people are talking about</p>
        </div>
        
        {/* Show user threads first, then bazaar threads */}
        {userThreads.length > 0 && (
          <ThreadBazaar threads={userThreads} />
        )}

        {bazaar.threads && bazaar.threads.length > 0 ? (
          <ThreadBazaar threads={bazaar.threads} />
        ) : (
          userThreads.length === 0 && (
            <div className="text-center py-8">
              <Shirt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No discussions yet</p>
              <p className="text-sm text-gray-400 mt-1">Be the first to start a conversation!</p>
            </div>
          )
        )}
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
