'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Check, Search, X, Sparkles, RotateCcw } from 'lucide-react';
import { productsData, ProductData } from '@/lib/products-data';

// Types for outfit recommendation
export interface OutfitItem {
  productSlug: string;
  category: 'top' | 'bottom' | 'shoes' | 'accessory';
}

export interface Outfit {
  id: string;
  name: string;
  description: string;
  style: 'casual' | 'formal' | 'sporty' | 'date' | 'work';
  season: 'summer' | 'winter' | 'all';
  items: OutfitItem[];
  totalPrice: number;
}

// Product categories for recommendation
const PRODUCT_CATEGORIES = {
  top: ['cult-suri', 'rue', 'lulu-swiftly-ls', 'wearthreek'],
  bottom: ['karakiri', 'lulu-softstreme-pant', 'wearthreek'],
  shoes: ['mm-tabi-flats'],
  accessory: ['prada-tote-bag', 'stanley-quencher'],
};

// Category labels
const CATEGORY_LABELS: Record<string, string> = {
  top: 'Tops',
  bottom: 'Bottoms',
  shoes: 'Shoes',
  accessory: 'Accessories',
};

// Style labels
const styleLabels: Record<string, string> = {
  casual: 'Casual',
  formal: 'Formal',
  sporty: 'Sporty',
  date: 'Date',
  work: 'Work',
};

// Mock cart items (in real app, this would come from cart context)
const mockCartItems = [
  { slug: 'cult-suri', quantity: 1 },
  { slug: 'karakiri', quantity: 1 },
  { slug: 'lulu-swiftly-ls', quantity: 2 },
];

// Pre-defined outfit templates
const outfitTemplates: Outfit[] = [
  {
    id: 'template-1',
    name: 'Summer Date',
    description: 'Romantic afternoon look',
    style: 'date',
    season: 'summer',
    totalPrice: 0,
    items: [
      { productSlug: 'cult-suri', category: 'top' },
      { productSlug: 'karakiri', category: 'bottom' },
      { productSlug: 'mm-tabi-flats', category: 'shoes' },
    ]
  },
  {
    id: 'template-2',
    name: 'Office Ready',
    description: 'Professional & chic',
    style: 'work',
    season: 'all',
    totalPrice: 0,
    items: [
      { productSlug: 'rue', category: 'top' },
      { productSlug: 'wearthreek', category: 'bottom' },
      { productSlug: 'prada-tote-bag', category: 'accessory' },
    ]
  },
  {
    id: 'template-3',
    name: 'Weekend Vibes',
    description: 'Relaxed weekend style',
    style: 'casual',
    season: 'summer',
    totalPrice: 0,
    items: [
      { productSlug: 'lulu-swiftly-ls', category: 'top' },
      { productSlug: 'lulu-softstreme-pant', category: 'bottom' },
      { productSlug: 'stanley-quencher', category: 'accessory' },
    ]
  },
  {
    id: 'template-4',
    name: 'Luxe Casual',
    description: 'Effortless elegance',
    style: 'casual',
    season: 'all',
    totalPrice: 0,
    items: [
      { productSlug: 'cult-suri', category: 'top' },
      { productSlug: 'karakiri', category: 'bottom' },
      { productSlug: 'prada-tote-bag', category: 'accessory' },
    ]
  },
  {
    id: 'template-5',
    name: 'Active Day',
    description: 'Athleisure look',
    style: 'sporty',
    season: 'all',
    totalPrice: 0,
    items: [
      { productSlug: 'lulu-swiftly-ls', category: 'top' },
      { productSlug: 'wearthreek', category: 'bottom' },
      { productSlug: 'stanley-quencher', category: 'accessory' },
    ]
  },
  {
    id: 'template-6',
    name: 'Date Night',
    description: 'Evening out look',
    style: 'date',
    season: 'all',
    totalPrice: 0,
    items: [
      { productSlug: 'rue', category: 'top' },
      { productSlug: 'karakiri', category: 'bottom' },
      { productSlug: 'mm-tabi-flats', category: 'shoes' },
    ]
  },
];

// Calculate total price
const calculateTotalPrice = (items: OutfitItem[]): number => {
  return items.reduce((total, item) => {
    const product = productsData[item.productSlug];
    return total + (product?.price || 0);
  }, 0);
};

// Get category from product slug
const getProductCategory = (slug: string): string => {
  for (const [category, slugs] of Object.entries(PRODUCT_CATEGORIES)) {
    if (slugs.includes(slug)) return category;
  }
  return 'top';
};

// Generate outfit based on a seed product
const generateOutfitFromProduct = (seedSlug: string): Outfit | null => {
  const seedCategory = getProductCategory(seedSlug);
  const seedProduct = productsData[seedSlug];
  if (!seedProduct) return null;

  // Find complementary categories
  const complementaryCategories = ['top', 'bottom', 'shoes', 'accessory'].filter(
    cat => cat !== seedCategory
  );

  const outfitItems: OutfitItem[] = [
    { productSlug: seedSlug, category: seedCategory as any }
  ];

  // Add one item from each complementary category
  for (const cat of complementaryCategories.slice(0, 2)) {
    const catProducts = PRODUCT_CATEGORIES[cat as keyof typeof PRODUCT_CATEGORIES];
    if (catProducts && catProducts.length > 0) {
      // Pick a random product from category
      const randomSlug = catProducts[Math.floor(Math.random() * catProducts.length)];
      outfitItems.push({ productSlug: randomSlug, category: cat as any });
    }
  }

  return {
    id: `generated-${seedSlug}-${Date.now()}`,
    name: `${seedProduct.brand} Look`,
    description: `Stylized outfit with ${seedProduct.name}`,
    style: 'casual',
    season: 'all',
    items: outfitItems,
    totalPrice: calculateTotalPrice(outfitItems),
  };
};

// Search products and generate outfits
const searchAndGenerateOutfits = (query: string): Outfit[] => {
  const lowerQuery = query.toLowerCase();
  const results: Outfit[] = [];
  
  // Find matching products
  const matchingProducts = Object.values(productsData).filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery)
  );

  // Generate outfit for each matching product
  matchingProducts.forEach(product => {
    const outfit = generateOutfitFromProduct(product.slug);
    if (outfit) {
      results.push(outfit);
    }
  });

  // If no direct matches, try to find by category keywords
  if (results.length === 0) {
    let targetCategory = '';
    if (lowerQuery.includes('top') || lowerQuery.includes('shirt') || lowerQuery.includes('blouse')) {
      targetCategory = 'top';
    } else if (lowerQuery.includes('pant') || lowerQuery.includes('jean') || lowerQuery.includes('trouser')) {
      targetCategory = 'bottom';
    } else if (lowerQuery.includes('shoe') || lowerQuery.includes('flat') || lowerQuery.includes('sneaker')) {
      targetCategory = 'shoes';
    } else if (lowerQuery.includes('bag') || lowerQuery.includes('quench')) {
      targetCategory = 'accessory';
    }

    if (targetCategory) {
      const categoryProducts = PRODUCT_CATEGORIES[targetCategory as keyof typeof PRODUCT_CATEGORIES];
      if (categoryProducts) {
        categoryProducts.forEach(slug => {
          const outfit = generateOutfitFromProduct(slug);
          if (outfit) results.push(outfit);
        });
      }
    }
  }

  return results;
};

// Fitting Room Card Component
function FittingRoomCard({ outfit, onClick }: { outfit: Outfit; onClick: () => void }) {
  const top = outfit.items.find(i => i.category === 'top');
  const bottom = outfit.items.find(i => i.category === 'bottom');
  const otherItem = outfit.items.find(i => i.category !== 'top' && i.category !== 'bottom');
  
  const topProduct = top ? productsData[top.productSlug] : null;
  const bottomProduct = bottom ? productsData[bottom.productSlug] : null;
  const otherProduct = otherItem ? productsData[otherItem.productSlug] : null;

  return (
    <div onClick={onClick} className="cursor-pointer">
      <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl overflow-hidden">
        {/* Fitting Room Layout */}
        <div className="absolute inset-0 flex flex-col">
          {/* Top Section */}
          <div className="flex-1 relative">
            {topProduct && (
              <img
                src={topProduct.productImages[0]}
                alt={topProduct.name}
                className="w-full h-full object-contain p-2"
              />
            )}
          </div>
          
          {/* Bottom Section */}
          <div className="h-[45%] flex">
            <div className="flex-1 relative">
              {bottomProduct && (
                <img
                  src={bottomProduct.productImages[0]}
                  alt={bottomProduct.name}
                  className="w-full h-full object-contain p-2"
                />
              )}
            </div>
            {otherProduct && (
              <div className="w-[35%] relative bg-white/50">
                <img
                  src={otherProduct.productImages[0]}
                  alt={otherProduct.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* Style Badge */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-xs font-medium text-gray-700">{styleLabels[outfit.style]}</span>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-xs font-bold text-white">
            Rp {outfit.totalPrice.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
      
      <div className="p-2">
        <h3 className="font-semibold text-gray-900 text-sm">{outfit.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{outfit.description}</p>
      </div>
    </div>
  );
}

// Search Bar Component
function SearchBar({ 
  value, 
  onChange, 
  onClear,
  placeholder 
}: { 
  value: string; 
  onChange: (v: string) => void;
  onClear: () => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ff2742]/20"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}

// Cart Item Selector Component
function CartItemSelector({ 
  onSelect 
}: { 
  onSelect: (slug: string) => void 
}) {
  const cartProducts = mockCartItems
    .map(item => ({
      ...item,
      product: productsData[item.slug]
    }))
    .filter(item => item.product);

  if (cartProducts.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {cartProducts.map(({ slug, quantity, product }) => (
        <button
          key={slug}
          onClick={() => onSelect(slug)}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={product!.productImages[0]}
              alt={product!.name}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{product!.brand}</p>
            <p className="text-xs text-gray-500 truncate">{product!.name}</p>
            <p className="text-xs text-gray-400">Qty: {quantity}</p>
          </div>
          <Sparkles className="w-4 h-4 text-[#ff2742]" />
        </button>
      ))}
    </div>
  );
}

export default function OutfitsPage() {
  const [mode, setMode] = useState<'browse' | 'search' | 'cart'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [generatedOutfits, setGeneratedOutfits] = useState<Outfit[]>([]);

  // Search results
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return searchAndGenerateOutfits(searchQuery);
  }, [searchQuery]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setMode('search');
      setGeneratedOutfits(searchResults);
    } else if (query.length === 0) {
      setMode('browse');
      setGeneratedOutfits([]);
    }
  };

  // Handle cart product selection
  const handleCartSelect = (slug: string) => {
    const outfit = generateOutfitFromProduct(slug);
    if (outfit) {
      setGeneratedOutfits([outfit]);
      setMode('search');
      setSelectedOutfit(outfit);
    }
  };

  // Generate more outfits like current
  const handleGenerateMore = () => {
    if (generatedOutfits.length > 0) {
      const randomTemplate = outfitTemplates[Math.floor(Math.random() * outfitTemplates.length)];
      const newOutfits = [...generatedOutfits];
      
      // Add 2 more random outfits
      for (let i = 0; i < 2; i++) {
        const template = outfitTemplates[Math.floor(Math.random() * outfitTemplates.length)];
        newOutfits.push({
          ...template,
          id: `generated-${Date.now()}-${i}`,
          totalPrice: calculateTotalPrice(template.items),
        });
      }
      
      setGeneratedOutfits(newOutfits);
    }
  };

  const handleAddToCart = (productSlug: string) => {
    setAddedItems(prev => new Set(prev).add(productSlug));
  };

  const handleAddAllToCart = (outfit: Outfit) => {
    outfit.items.forEach(item => {
      handleAddToCart(item.productSlug);
    });
  };

  const currentOutfits = mode === 'browse' ? outfitTemplates : generatedOutfits;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ff2742]" />
            <h1 className="text-xl font-bold text-gray-900">Fitting Room</h1>
          </div>
          <span className="text-sm text-gray-500">
            {currentOutfits.length} looks
          </span>
        </div>

        {/* Search & Options */}
        <div className="px-4 pb-3 space-y-3">
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            onClear={() => {
              setSearchQuery('');
              setMode('browse');
              setGeneratedOutfits([]);
            }}
            placeholder="Search styles (e.g., baggy jeans, summer dress)"
          />

          {/* Mode Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode('browse');
                setSearchQuery('');
                setGeneratedOutfits([]);
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'browse'
                  ? 'bg-[#ff2742] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ✨ Browse
            </button>
            <button
              onClick={() => setMode('cart')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'cart'
                  ? 'bg-[#ff2742] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🛒 From Cart
            </button>
          </div>
        </div>
      </div>

      {/* Cart Selector Modal */}
      {mode === 'cart' && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 mb-3">Select a product from your cart to generate outfit:</p>
          <CartItemSelector onSelect={handleCartSelect} />
        </div>
      )}

      {/* Search Results Info */}
      {mode === 'search' && searchQuery.length >= 2 && (
        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {searchResults.length} outfits found for "{searchQuery}"
          </p>
          <button
            onClick={handleGenerateMore}
            className="flex items-center gap-1 text-sm text-[#ff2742] font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Generate More
          </button>
        </div>
      )}

      {/* Outfit Grid */}
      <div className="p-2 grid grid-cols-2 gap-3">
        {currentOutfits.map((outfit) => (
          <FittingRoomCard
            key={outfit.id}
            outfit={outfit}
            onClick={() => setSelectedOutfit(outfit)}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentOutfits.length === 0 && mode !== 'cart' && (
        <div className="p-8 text-center">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No outfits found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
        </div>
      )}

      {/* Outfit Detail Modal */}
      {selectedOutfit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedOutfit(null)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white rounded-t-2xl max-h-[85vh] overflow-hidden animate-slideUp">
            {/* Handle bar */}
            <div className="w-full flex justify-center pt-3 pb-1 cursor-grab">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedOutfit.name}</h2>
                <p className="text-sm text-gray-500">{selectedOutfit.description}</p>
              </div>
              <button
                onClick={() => setSelectedOutfit(null)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Fitting Room Preview */}
            <div className="p-4 bg-gray-50">
              <div className="flex gap-2 justify-center">
                {selectedOutfit.items.map((item) => {
                  const product = productsData[item.productSlug];
                  if (!product) return null;
                  return (
                    <div key={item.productSlug} className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shadow-sm">
                        <img
                          src={product.productImages[0]}
                          alt={product.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 capitalize">{item.category}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Product List */}
            <div className="p-4 overflow-y-auto max-h-[calc(85vh-320px)]">
              <div className="space-y-3">
                {selectedOutfit.items.map((item) => {
                  const product = productsData[item.productSlug];
                  if (!product) return null;
                  
                  const isAdded = addedItems.has(item.productSlug);

                  return (
                    <div
                      key={item.productSlug}
                      className="flex items-center p-3 bg-gray-50 rounded-xl"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/product/${product.slug}`}
                        className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white"
                      >
                        <img
                          src={product.productImages[0]}
                          alt={product.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="ml-3 flex-1 min-w-0">
                        <Link href={`/product/${product.slug}`}>
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.brand}
                          </h4>
                          <p className="text-xs text-gray-600 truncate">
                            {product.name}
                          </p>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold text-[#ff2742]">
                            {product.currency} {product.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(item.productSlug)}
                        disabled={isAdded}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isAdded
                            ? 'bg-green-500 text-white'
                            : 'bg-[#ff2742] text-white hover:bg-[#e61e3a]'
                        }`}
                      >
                        {isAdded ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <ShoppingCart className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Total Price & Add All */}
              <div className="mt-4 p-4 bg-gray-900 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Outfit</p>
                    <p className="text-xl font-bold text-white">
                      Rp {selectedOutfit.totalPrice.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddAllToCart(selectedOutfit)}
                    className="px-6 py-3 bg-[#ff2742] text-white font-semibold rounded-lg hover:bg-[#e61e3a] transition-colors"
                  >
                    Add All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
