// Bazaar data for the LAKOO app
// Contains bazaar information, brands, booth layouts, and outfits

export interface BazaarBrand {
  id: string;
  brandName: string;
  logo: string;
  slug: string; // seller slug for lakoo store
  boothNumber: string; // e.g., "A1", "B2"
  mapPosition: {
    row: number;
    col: number;
  };
  discount?: number; // optional discount percentage
}

export interface BazaarOutfit {
  id: string;
  name: string;
  items: {
    productSlug: string;
    brandId: string; // links to BazaarBrand
  }[];
}

export interface LiveUpdate {
  text: string;
  time: string;
  type: 'org' | 'user';
}

export interface Bazaar {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  startDate: string;
  endDate: string;
  image: string;
  brands: BazaarBrand[];
  outfits: BazaarOutfit[];
  mapLayout: {
    rows: number;
    cols: number;
  };
  // Additional fields for UI
  caption?: string;
  stores?: number;
  endsIn?: string;
  attendees?: string;
  vibe?: string;
  color1?: string;
  color2?: string;
  tags?: string[];
  featured?: string[];
  isLive?: boolean;
  daysLeft?: number;
  predicted?: string;
  liveUpdates?: LiveUpdate[];
}

// Mock bazaar data (from temp/index.html)
export const bazaarData: Record<string, Bazaar> = {
  'slowmove-bazaar': {
    id: 'slowmove-bazaar',
    name: 'Slowmove Bazaar',
    description: 'Thrift, Local Brand, Vintage fashion bazaar',
    location: 'Jakarta',
    address: 'Senayan Park, Jakarta',
    startDate: '2026-02-22',
    endDate: '2026-02-24',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    mapLayout: { rows: 4, cols: 6 },
    brands: [
      { id: 'kove-studio', brandName: 'Kóve Studio', logo: '', slug: 'kove-studio', boothNumber: 'A1', mapPosition: { row: 1, col: 1 } },
      { id: 'moreth', brandName: 'Moreth', logo: '', slug: 'moreth', boothNumber: 'A2', mapPosition: { row: 1, col: 2 } },
      { id: 'thenblank', brandName: 'Thenblank', logo: '', slug: 'thenblank', boothNumber: 'A3', mapPosition: { row: 1, col: 3 } },
    ],
    outfits: [],
    caption: "The biggest Y2K girl genz fashion in town. girl run !",
    endsIn: '4 hours',
    stores: 52,
    attendees: '2.3k',
    vibe: 'Packed 🔥',
    color1: '#c62828',
    color2: '#e53935',
    tags: ['Thrift', 'Local Brand', 'Vintage'],
    featured: ['Kóve Studio', 'Moreth', 'Thenblank', '+49 more'],
    isLive: true,
    liveUpdates: [
      { text: "⚡ Flash sale at Kóve Studio — 50% off next 30 min!", time: "2m", type: "org" },
      { text: "Area A is packed 😭 go to Area C for hidden gems", time: "8m", type: "user" },
      { text: "🎤 DJ set starting at main stage now!", time: "15m", type: "org" },
    ],
  },
  'lalamarket': {
    id: 'lalamarket',
    name: 'Lalamarket',
    description: 'Premium, Korean Style, Aesthetic fashion market',
    location: 'Jakarta',
    address: 'PIK Avenue, Jakarta',
    startDate: '2026-02-22',
    endDate: '2026-02-23',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
    mapLayout: { rows: 3, cols: 5 },
    brands: [
      { id: 'pomelo', brandName: 'Pomelo', logo: '', slug: 'pomelo', boothNumber: 'B1', mapPosition: { row: 1, col: 1 } },
      { id: 'calla-atelier', brandName: 'Calla Atelier', logo: '', slug: 'calla-atelier', boothNumber: 'B2', mapPosition: { row: 1, col: 2 } },
      { id: 'sevendays', brandName: 'Sevendays', logo: '', slug: 'sevendays', boothNumber: 'B3', mapPosition: { row: 1, col: 3 } },
    ],
    outfits: [],
    caption: "Jakarta's premium Korean style hub. aesthetic overload!",
    endsIn: '6 hours',
    stores: 38,
    attendees: '1.8k',
    vibe: 'Vibing ✨',
    color1: '#1a1a1a',
    color2: '#424242',
    tags: ['Premium', 'Korean Style', 'Aesthetic'],
    featured: ['Pomelo', 'Calla Atelier', 'Sevendays', '+35 more'],
    isLive: true,
    liveUpdates: [
      { text: "🛍️ New collection just dropped at Calla Atelier!", time: "5m", type: "org" },
      { text: "Long queue at Pomelo fitting room 👗", time: "12m", type: "user" },
      { text: "☕ Free coffee at Sevendays booth - limited time!", time: "20m", type: "org" },
    ],
  },
  'brightspot': {
    id: 'brightspot',
    name: 'Brightspot',
    description: 'Mixed, Art, Fashion event',
    location: 'Tangerang',
    address: 'ICE BSD, Tangerang',
    startDate: '2026-03-08',
    endDate: '2026-03-10',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    mapLayout: { rows: 5, cols: 8 },
    brands: [],
    outfits: [],
    caption: "Indonesia's biggest creative market. art meets fashion!",
    stores: 80,
    color1: '#4a148c',
    color2: '#7b1fa2',
    tags: ['Mixed', 'Art', 'Fashion'],
    daysLeft: 14,
    predicted: '8.5k',
  },
  'market-museum': {
    id: 'market-museum',
    name: 'Market Museum',
    description: 'Curated, Designer, Art exhibition',
    location: 'Jakarta',
    address: 'Museum MACAN, Jakarta',
    startDate: '2026-03-22',
    endDate: '2026-03-22',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80',
    mapLayout: { rows: 3, cols: 4 },
    brands: [],
    outfits: [],
    caption: "Curated designer pieces in a museum setting. art you can wear!",
    stores: 30,
    color1: '#004d40',
    color2: '#00796b',
    tags: ['Curated', 'Designer', 'Art'],
    daysLeft: 28,
    predicted: '2.1k',
  },
  'jakcloth': {
    id: 'jakcloth',
    name: 'Jakcloth',
    description: 'Streetwear, Distro, Music festival',
    location: 'Jakarta',
    address: 'Gambir Expo, Jakarta',
    startDate: '2026-04-05',
    endDate: '2026-04-07',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
    mapLayout: { rows: 6, cols: 10 },
    brands: [],
    outfits: [],
    caption: "The OG streetwear festival. distro culture lives here!",
    stores: 120,
    color1: '#e65100',
    color2: '#ff9800',
    tags: ['Streetwear', 'Distro', 'Music'],
    daysLeft: 42,
    predicted: '15k',
  },
  'sunday-market': {
    id: 'sunday-market',
    name: 'Sunday Market',
    description: 'Casual, Brunch, Thrift weekend market',
    location: 'Jakarta',
    address: 'Kemang, Jakarta',
    startDate: '2026-03-01',
    endDate: '2026-03-01',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    mapLayout: { rows: 3, cols: 4 },
    brands: [],
    outfits: [],
    caption: "Sunday chill vibes. brunch, thrift & good music!",
    stores: 25,
    color1: '#795548',
    color2: '#a1887f',
    tags: ['Casual', 'Brunch', 'Thrift'],
    daysLeft: 5,
    predicted: '800',
  },
};

// Helper function to get upcoming bazaars
export const upcomingBazaars = Object.values(bazaarData).filter(
  bazaar => new Date(bazaar.startDate) > new Date()
);

// Helper function to get bazaar by location
export const getBazaarsByLocation = (location: string) => {
  return Object.values(bazaarData).filter(b => b.location.toLowerCase() === location.toLowerCase());
};

// Helper function to get live bazaars
export const liveBazaars = Object.values(bazaarData).filter(bazaar => bazaar.isLive === true);

// Helper function to get upcoming bazaars (not live)
export const upcomingBazaarsOnly = Object.values(bazaarData).filter(
  bazaar => !bazaar.isLive && new Date(bazaar.startDate) > new Date()
);
