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

export interface ThreadReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export interface Thread {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: ThreadReply[];
  replyCount: number;
}

export interface Booth {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
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
  map?: string; // Map image path for this bazaar
  brands: BazaarBrand[];
  outfits: BazaarOutfit[];
  booths?: Booth[];
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
  threads?: Thread[];
  gallery?: string[];
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
    map: '/mapSMB.png',
    booths: [
      { id: "A1", x: 397, y: 429, w: 30, h: 28 },
      { id: "A2", x: 96, y: 24, w: 75, h: 112 },
      { id: "A3", x: 176, y: 24, w: 75, h: 112 },
      { id: "A4", x: 256, y: 24, w: 75, h: 112 },
      { id: "A5", x: 336, y: 24, w: 75, h: 112 },
      { id: "A6", x: 16, y: 145, w: 75, h: 112 },
      { id: "A7", x: 96, y: 145, w: 75, h: 112 },
      { id: "A8", x: 176, y: 145, w: 75, h: 112 },
    ],
    brands: [
      { id: 'cult-suri', brandName: 'CULT SURI', logo: '', slug: 'cult-suri', boothNumber: 'A1', mapPosition: { row: 1, col: 1 } },
      { id: 'karakiri', brandName: 'Karakiri', logo: '', slug: 'karakiri', boothNumber: 'A2', mapPosition: { row: 1, col: 2 } },
      { id: 'rue', brandName: 'RUE', logo: '', slug: 'rue', boothNumber: 'A3', mapPosition: { row: 1, col: 3 } },
      { id: 'wearthreek', brandName: 'WEAR THREEK', logo: '', slug: 'wearthreek', boothNumber: 'A4', mapPosition: { row: 1, col: 4 } },
      { id: 'maisonmargiela', brandName: 'Maison Margiela', logo: '', slug: 'maisonmargiela', boothNumber: 'A5', mapPosition: { row: 2, col: 1 } },
      { id: 'stanley', brandName: 'Stanley', logo: '', slug: 'stanley', boothNumber: 'A6', mapPosition: { row: 2, col: 2 } },
      { id: 'lululemon', brandName: 'Lululemon', logo: '', slug: 'lululemon', boothNumber: 'A7', mapPosition: { row: 2, col: 3 } },
      { id: 'prada', brandName: 'Prada', logo: '', slug: 'prada', boothNumber: 'A8', mapPosition: { row: 2, col: 4 } },
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
    gallery: [
      '/bannermarket1.jpg',
      '/bannermarket2.webp',
      '/bannermarket3.jpg',
      '/viena/rb1.png',
      '/viena/rb2.png',
      '/viena/rb3.png',
      '/batikbg.png',
      '/batikbg2.png',
      '/batik-pattern.png',
      '/viena/bgrb.png',
    ],
    liveUpdates: [
      { text: "⚡ Flash sale at Kóve Studio — 50% off next 30 min!", time: "2m", type: "org" },
      { text: "Area A is packed 😭 go to Area C for hidden gems", time: "8m", type: "user" },
      { text: "🎤 DJ set starting at main stage now!", time: "15m", type: "org" },
    ],
    threads: [
      {
        id: 'thread-1',
        userId: 'user-1',
        userName: 'Ayu Lestari',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        content: "Guys! Kóve Studio booth has amazing Y2K collection right now. Don't miss it! The butterfly tops are 🔥",
        timestamp: '5m',
        likes: 24,
        isLiked: false,
        replyCount: 8,
        replies: [
          {
            id: 'reply-1-1',
            userId: 'user-2',
            userName: 'Budi Santoso',
            userAvatar: 'https://i.pravatar.cc/150?img=2',
            content: "Just went there! Got the pink one 👀",
            timestamp: '3m',
            likes: 5,
            isLiked: false,
          },
          {
            id: 'reply-1-2',
            userId: 'user-3',
            userName: 'Citra Dewi',
            userAvatar: 'https://i.pravatar.cc/150?img=3',
            content: "Is there a fitting room there?",
            timestamp: '2m',
            likes: 2,
            isLiked: false,
          },
        ],
      },
      {
        id: 'thread-2',
        userId: 'user-4',
        userName: 'Dewi Kurnia',
        userAvatar: 'https://i.pravatar.cc/150?img=4',
        content: "Anyone know where to find good vintage denim? Been searching everywhere 😅",
        timestamp: '12m',
        likes: 15,
        isLiked: false,
        replyCount: 6,
        replies: [
          {
            id: 'reply-2-1',
            userId: 'user-5',
            userName: 'Eko Prasetyo',
            userAvatar: 'https://i.pravatar.cc/150?img=5',
            content: "Try booth A3! Thenblank has some vintage Levi's",
            timestamp: '8m',
            likes: 8,
            isLiked: false,
          },
        ],
      },
      {
        id: 'thread-3',
        userId: 'user-6',
        userName: 'Fani Akbar',
        userAvatar: 'https://i.pravatar.cc/150?img=6',
        content: "The crowd is insane today! Pro tip: come early morning or late afternoon for better shopping experience 👏",
        timestamp: '20m',
        likes: 42,
        isLiked: true,
        replyCount: 12,
        replies: [],
      },
      {
        id: 'thread-4',
        userId: 'user-7',
        userName: 'Gita Nurul',
        userAvatar: 'https://i.pravatar.cc/150?img=7',
        content: "Moreth is doing a buy 2 get 1 free promo! Girls gather! 💃",
        timestamp: '1m',
        likes: 18,
        isLiked: false,
        replyCount: 4,
        replies: [],
      },
      {
        id: 'thread-5',
        userId: 'user-8',
        userName: 'Hadi Wijaya',
        userAvatar: 'https://i.pravatar.cc/150?img=8',
        content: "Has anyone tried the food trucks here? Looking for recommendations! 🍜",
        timestamp: '8m',
        likes: 12,
        isLiked: false,
        replyCount: 5,
        replies: [
          {
            id: 'reply-5-1',
            userId: 'user-9',
            userName: 'Ira Melissa',
            userAvatar: 'https://i.pravatar.cc/150?img=9',
            content: "The Thai food truck near entrance B is amazing! Pad Thai is a must try 👌",
            timestamp: '5m',
            likes: 6,
            isLiked: false,
          },
          {
            id: 'reply-5-2',
            userId: 'user-10',
            userName: 'Joko Pramono',
            userAvatar: 'https://i.pravatar.cc/150?img=10',
            content: "There's a bubble tea stall too! Perfect for hot weather ☀️",
            timestamp: '3m',
            likes: 3,
            isLiked: false,
          },
        ],
      },
      {
        id: 'thread-6',
        userId: 'user-11',
        userName: 'Kartika Sari',
        userAvatar: 'https://i.pravatar.cc/150?img=11',
        content: "Tips for first-timers: Bring a big tote bag and wear comfortable shoes! The venue is huge and you'll be walking a lot 👟👜",
        timestamp: '15m',
        likes: 56,
        isLiked: true,
        replyCount: 10,
        replies: [
          {
            id: 'reply-6-1',
            userId: 'user-12',
            userName: 'Luthfi Hamdani',
            userAvatar: 'https://i.pravatar.cc/150?img=12',
            content: "Great tip! Also bring a portable charger 📱",
            timestamp: '12m',
            likes: 8,
            isLiked: false,
          },
          {
            id: 'reply-6-2',
            userId: 'user-13',
            userName: 'Maya Pertiwi',
            userAvatar: 'https://i.pravatar.cc/150?img=13',
            content: "Don't forget sunscreen if you're going to the outdoor area ☂️",
            timestamp: '10m',
            likes: 4,
            isLiked: false,
          },
          {
            id: 'reply-6-3',
            userId: 'user-14',
            userName: 'Nico Andika',
            userAvatar: 'https://i.pravatar.cc/150?img=14',
            content: "Agreed on the comfy shoes! Learned that the hard way yesterday 😅",
            timestamp: '8m',
            likes: 2,
            isLiked: false,
          },
        ],
      },
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
    map: '/mapSMB.png',
    brands: [
      { id: 'wearthreek', brandName: 'WEAR THREEK', logo: '', slug: 'wearthreek', boothNumber: 'B1', mapPosition: { row: 1, col: 1 } },
      { id: 'lululemon', brandName: 'Lululemon', logo: '', slug: 'lululemon', boothNumber: 'B2', mapPosition: { row: 1, col: 2 } },
      { id: 'prada', brandName: 'Prada', logo: '', slug: 'prada', boothNumber: 'B3', mapPosition: { row: 1, col: 3 } },
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
    gallery: [
      '/MM/IMG_0030.JPG',
      '/MM/IMG_0031.JPG',
      '/MM/IMG_0032.JPG',
      '/MM/IMG_0033.JPG',
      '/MM/IMG_0034.JPG',
      '/Prada/IMG_0020.JPG',
      '/Prada/IMG_0021.JPG',
      '/Prada/IMG_0022.JPG',
      '/Prada/IMG_0023.JPG',
      '/Prada/IMG_0024.JPG',
      '/Prada/IMG_0025.JPG',
    ],
    liveUpdates: [
      { text: "🛍️ New collection just dropped at Calla Atelier!", time: "5m", type: "org" },
      { text: "Long queue at Pomelo fitting room 👗", time: "12m", type: "user" },
      { text: "☕ Free coffee at Sevendays booth - limited time!", time: "20m", type: "org" },
    ],
    threads: [
      {
        id: 'thread-lala-1',
        userId: 'user-10',
        userName: 'Hana Lee',
        userAvatar: 'https://i.pravatar.cc/150?img=10',
        content: "Calla Atelier's new spring collection is EVERYTHING! 🌸 Korean style goals right here",
        timestamp: '8m',
        likes: 31,
        isLiked: false,
        replyCount: 5,
        replies: [
          {
            id: 'reply-lala-1-1',
            userId: 'user-11',
            userName: 'Ira Maharani',
            userAvatar: 'https://i.pravatar.cc/150?img=11',
            content: "I saw it! The pastel colors are so cute ✨",
            timestamp: '5m',
            likes: 3,
            isLiked: false,
          },
        ],
      },
      {
        id: 'thread-lala-2',
        userId: 'user-12',
        userName: 'Joko Wijaya',
        userAvatar: 'https://i.pravatar.cc/150?img=12',
        content: "Best Korean fashion bazaar in Jakarta IMO. Quality + variety = perfect 👌",
        timestamp: '25m',
        likes: 19,
        isLiked: false,
        replyCount: 3,
        replies: [],
      },
      {
        id: 'thread-lala-3',
        userId: 'user-13',
        userName: 'Siti Nurhaliza',
        userAvatar: 'https://i.pravatar.cc/150?img=13',
        content: "Pomelo has 30% off everything today! Don't miss out ladies 💕",
        timestamp: '3m',
        likes: 27,
        isLiked: false,
        replyCount: 7,
        replies: [
          {
            id: 'reply-lala-3-1',
            userId: 'user-14',
            userName: 'Rina Octavia',
            userAvatar: 'https://i.pravatar.cc/150?img=14',
            content: "Waited for this sale! Running there now 🏃‍♀️",
            timestamp: '2m',
            likes: 5,
            isLiked: false,
          },
          {
            id: 'reply-lala-3-2',
            userId: 'user-15',
            userName: 'Dedy Cristiano',
            userAvatar: 'https://i.pravatar.cc/150?img=15',
            content: "Is it for all items or only specific collection?",
            timestamp: '1m',
            likes: 2,
            isLiked: false,
          },
        ],
      },
      {
        id: 'thread-lala-4',
        userId: 'user-16',
        userName: 'Kevin Owen',
        userAvatar: 'https://i.pravatar.cc/150?img=16',
        content: "Anyone know if Sevendays has a loyalty program? Shopping here so often 😅",
        timestamp: '18m',
        likes: 14,
        isLiked: false,
        replyCount: 4,
        replies: [
          {
            id: 'reply-lala-4-1',
            userId: 'user-17',
            userName: 'Luna Gabrielle',
            userAvatar: 'https://i.pravatar.cc/150?img=17',
            content: "Yes! Download their app and you get points every purchase 🏆",
            timestamp: '15m',
            likes: 8,
            isLiked: false,
          },
        ],
      },
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
    map: '/mapSMB.png',
    brands: [],
    outfits: [],
    caption: "Indonesia's biggest creative market. art meets fashion!",
    stores: 80,
    color1: '#4a148c',
    color2: '#7b1fa2',
    tags: ['Mixed', 'Art', 'Fashion'],
    daysLeft: 14,
    predicted: '8.5k',
    gallery: [
      '/Softstreme/IMG_0039.JPG',
      '/Softstreme/IMG_0040.JPG',
      '/Softstreme/IMG_0041.JPG',
      '/Softstreme/IMG_0042.JPG',
      '/Softstreme/IMG_0043.JPG',
      '/Swiftly/IMG_0051.JPG',
      '/Swiftly/IMG_0052.JPG',
      '/Swiftly_Tagged1/IMG_0049.JPG',
      '/Swiftly_Tagged1/IMG_0050.JPG',
      '/Swiftly_Tagged2/IMG_0053.JPG',
      '/Stanley/IMG_0026.JPG',
      '/Stanley/IMG_0027.JPG',
    ],
    threads: [
      {
        id: 'thread-bs-1',
        userId: 'user-20',
        userName: 'Rina Octavia',
        userAvatar: 'https://i.pravatar.cc/150?img=20',
        content: "Brightspot is going to be HUGE this year! 80+ booths confirmed 🎉 Can't wait for the art installations!",
        timestamp: '2h',
        likes: 56,
        isLiked: false,
        replyCount: 8,
        replies: [
          {
            id: 'reply-bs-1-1',
            userId: 'user-21',
            userName: 'Tono Sudrajat',
            userAvatar: 'https://i.pravatar.cc/150?img=21',
            content: "Any info about the food vendors? 😋",
            timestamp: '1h',
            likes: 3,
            isLiked: false,
          },
        ],
      },
      {
        id: 'thread-bs-2',
        userId: 'user-22',
        userName: 'Sari Dewi',
        userAvatar: 'https://i.pravatar.cc/150?img=22',
        content: "Anyone going on Sunday? Want to carpool from South Jakarta",
        timestamp: '5h',
        likes: 12,
        isLiked: false,
        replyCount: 4,
        replies: [],
      },
      {
        id: 'thread-bs-3',
        userId: 'user-23',
        userName: 'Bimo Prasetyo',
        userAvatar: 'https://i.pravatar.cc/150?img=23',
        content: "Has anyone been to Brightspot before? Is it worth the ticket price? 🎟️",
        timestamp: '3h',
        likes: 23,
        isLiked: false,
        replyCount: 9,
        replies: [
          {
            id: 'reply-bs-3-1',
            userId: 'user-24',
            userName: 'Nadila Putri',
            userAvatar: 'https://i.pravatar.cc/150?img=24',
            content: "Absolutely worth it! I've been 3 times. The art installations alone are amazing 🎨",
            timestamp: '2h',
            likes: 7,
            isLiked: false,
          },
          {
            id: 'reply-bs-3-2',
            userId: 'user-25',
            userName: 'Oki Fernandez',
            userAvatar: 'https://i.pravatar.cc/150?img=25',
            content: "You can spend whole day there! Food, music, shopping - complete experience",
            timestamp: '1h',
            likes: 4,
            isLiked: false,
          },
        ],
      },
      {
        id: 'thread-bs-4',
        userId: 'user-26',
        userName: 'Dewi Angelina',
        userAvatar: 'https://i.pravatar.cc/150?img=26',
        content: "Pro tip: Download the Brightspot app for early access tickets! Members get in 1 hour before general public ⏰",
        timestamp: '6h',
        likes: 34,
        isLiked: true,
        replyCount: 6,
        replies: [],
      },
    ],
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
    map: '/mapSMB.png',
    brands: [],
    outfits: [],
    caption: "Curated designer pieces in a museum setting. art you can wear!",
    stores: 30,
    color1: '#004d40',
    color2: '#00796b',
    tags: ['Curated', 'Designer', 'Art'],
    daysLeft: 28,
    predicted: '2.1k',
    gallery: [
      '/Prada+MM+Stanley/IMG_0016.JPG',
      '/Prada+MM+Stanley/IMG_0017.JPG',
      '/Prada+MM+Stanley/IMG_0018.JPG',
      '/Prada+MM+Stanley/IMG_0019.JPG',
      '/MM/IMG_0030.JPG',
      '/MM/IMG_0031.JPG',
      '/MM/IMG_0032.JPG',
      '/Prada/IMG_0020.JPG',
      '/Prada/IMG_0021.JPG',
      '/Prada/IMG_0022.JPG',
      '/Stanley/IMG_0026.JPG',
      '/Stanley/IMG_0027.JPG',
    ],
    threads: [
      {
        id: 'thread-mm-1',
        userId: 'user-25',
        userName: 'Maya Putri',
        userAvatar: 'https://i.pravatar.cc/150?img=25',
        content: "This is literally art you can wear! 🎨 Museum setting + designer pieces = perfect combo",
        timestamp: '1d',
        likes: 34,
        isLiked: false,
        replyCount: 5,
        replies: [
          {
            id: 'reply-mm-1-1',
            userId: 'user-26',
            userName: 'Doni Kusuma',
            userAvatar: 'https://i.pravatar.cc/150?img=26',
            content: "Is the ticket included or separate?",
            timestamp: '20h',
            likes: 2,
            isLiked: false,
          },
        ],
      },
    ],
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
    map: '/mapSMB.png',
    brands: [],
    outfits: [],
    caption: "The OG streetwear festival. distro culture lives here!",
    stores: 120,
    color1: '#e65100',
    color2: '#ff9800',
    tags: ['Streetwear', 'Distro', 'Music'],
    daysLeft: 42,
    predicted: '15k',
    gallery: [
      '/Lululemon_Softstreme+Swiftly/IMG_0035.JPG',
      '/Lululemon_Softstreme+Swiftly/IMG_0036.JPG',
      '/Lululemon_Softstreme+Swiftly/IMG_0037.JPG',
      '/Lululemon_Softstreme+Swiftly/IMG_0038.JPG',
      '/Softstreme/IMG_0039.JPG',
      '/Softstreme/IMG_0040.JPG',
      '/Softstreme_Tagged1/IMG_0046.JPG',
      '/Softstreme_Tagged1/IMG_0048.JPG',
      '/Swiftly/IMG_0051.JPG',
      '/Swiftly/IMG_0052.JPG',
      '/Swiftly_Tagged1/IMG_0049.JPG',
      '/Swiftly_Tagged1/IMG_0050.JPG',
    ],
    threads: [
      {
        id: 'thread-jc-1',
        userId: 'user-30',
        userName: 'Rizky Fernando',
        userAvatar: 'https://i.pravatar.cc/150?img=30',
        content: "JAKCLOTH IS BACK! 🥶 The OG streetwear festival. Who else is excited?!",
        timestamp: '3d',
        likes: 89,
        isLiked: false,
        replyCount: 15,
        replies: [
          {
            id: 'reply-jc-1-1',
            userId: 'user-31',
            userName: 'Anisa Rahmawati',
            userAvatar: 'https://i.pravatar.cc/150?img=31',
            content: "Been waiting for this! Drop list is crazy this year 🔥",
            timestamp: '2d',
            likes: 7,
            isLiked: false,
          },
        ],
      },
    ],
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
    map: '/mapSMB.png',
    brands: [],
    outfits: [],
    caption: "Sunday chill vibes. brunch, thrift & good music!",
    stores: 25,
    color1: '#795548',
    color2: '#a1887f',
    tags: ['Casual', 'Brunch', 'Thrift'],
    daysLeft: 5,
    predicted: '800',
    gallery: [
      '/viena/atasan1-removebg-preview.png',
      '/viena/atasan2-removebg-preview.png',
      '/viena/celana1-removebg-preview.png',
      '/viena/celana2-removebg-preview.png',
      '/viena/rbb.png',
      '/viena/rb1.png',
      '/viena/rb2.png',
      '/viena/rb3.png',
      '/viena/bgrb.png',
      '/batik-pattern.png',
      '/batikbg.png',
      '/batikbg2.png',
    ],
    threads: [
      {
        id: 'thread-sm-1',
        userId: 'user-35',
        userName: 'Lia Hartati',
        userAvatar: 'https://i.pravatar.cc/150?img=35',
        content: "Sunday Market this weekend! Perfect combo: thrift finds + brunch + good music 🎵",
        timestamp: '6h',
        likes: 23,
        isLiked: false,
        replyCount: 3,
        replies: [
          {
            id: 'reply-sm-1-1',
            userId: 'user-36',
            userName: 'Bagas Prakoso',
            userAvatar: 'https://i.pravatar.cc/150?img=36',
            content: "Best weekend plan! See you there 👋",
            timestamp: '4h',
            likes: 1,
            isLiked: false,
          },
        ],
      },
    ],
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
