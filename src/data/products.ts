export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  category: string;
  image?: string;
  description?: string;
  composition?: string[];
  deliveryInfo?: string;
  offers?: string[];
}

// Diverse flower images from Unsplash
const flowerImages = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1080&q=80', // Pink roses bouquet
  'https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=1080&q=80', // Tulips
  'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1080&q=80', // Sunflowers
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&q=80', // White lilies
  'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=1080&q=80', // Red roses
  'https://images.unsplash.com/photo-1460467820054-c87ab43e9b59?auto=format&fit=crop&w=1080&q=80', // Purple orchids
  'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1080&q=80', // Mixed bouquet
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1080&q=80', // Dahlias
  'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1080&q=80', // Peonies
  'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1080&q=80', // Hydrangeas
  'https://images.unsplash.com/photo-1556306535-0c5942c27a9d?auto=format&fit=crop&w=1080&q=80', // Carnations
  'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1080&q=80', // Gerberas
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1080&q=80', // Ranunculus
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1080&q=80', // Wildflowers
  'https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=1080&q=80', // Lavender
  'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=1080&q=80', // Cherry blossoms
];

const getImage = (index: number) => flowerImages[index % flowerImages.length];

export const categories = [
  { name: 'All', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=200&q=80' },
  { name: 'Roses', image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=200&q=80' },
  { name: 'Lilies', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80' },
  { name: 'Sunflowers', image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=200&q=80' },
  { name: 'Tulips', image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=200&q=80' },
  { name: 'Orchids', image: 'https://images.unsplash.com/photo-1460467820054-c87ab43e9b59?auto=format&fit=crop&w=200&q=80' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Purple Orchid Basket Arrangement',
    price: 4499,
    originalPrice: 5499,
    rating: 4.7,
    reviews: 238,
    badge: 'Hot Pick',
    category: 'Orchids',
    image: getImage(0),
    description: 'Handcrafted bouquet with premium red roses, styled with lush foliage for dramatic presence.',
    composition: ['100 premium long-stem roses', 'Seasonal foliage collar', 'Luxury matte wrap'],
    deliveryInfo: 'Same-day delivery available in metro cities. Concierge hand-off included.',
    offers: ['Complimentary handwritten note', 'Add signature scented candle at ₹499'],
  },
  {
    id: '2',
    name: 'Purple Orchid Basket Arrangement',
    price: 7599,
    originalPrice: 8999,
    rating: 4.8,
    reviews: 156,
    badge: 'Best Seller',
    category: 'Orchids',
    image: getImage(1),
    description: 'Lush orchid arrangement elevated with heart-shaped silhouette and vibrant greens.',
    composition: ['90 heart-clustered roses', 'Evergreen foliage base', 'Artisan wicker tray'],
    deliveryInfo: 'Delivered in climate-controlled vehicles within 2-4 hours.',
    offers: ['Flat ₹300 off for first-time orders', 'Complimentary glass vase upgrade'],
  },
  {
    id: '3',
    name: 'Purple Orchid Basket Arrangement',
    price: 7099,
    rating: 4.6,
    reviews: 89,
    category: 'Orchids',
    image: getImage(2),
    description: 'Romantic dome of fresh roses sculpted for intimate celebrations and proposals.',
    composition: ['75 Ecuadorian roses', 'Eucalyptus sprigs', 'Velvet gift ribbon'],
    deliveryInfo: 'Choose your delivery slot between 8 AM – 10 PM.',
    offers: ['Bundle chocolate truffles at 20% off', 'Complimentary care guide card'],
  },
  {
    id: '4',
    name: 'Purple Orchid Basket Arrangement',
    price: 4949,
    originalPrice: 5999,
    rating: 4.9,
    reviews: 312,
    badge: 'Best Seller',
    category: 'Orchids',
    image: getImage(3),
    description: 'Signature grand bouquet curated by Bloom atelier florists.',
    composition: ['120 roses', 'Imported foliage', 'Keepsake hatbox'],
    deliveryInfo: 'Express dispatch within 90 minutes in Jakarta core.',
    offers: ['Earn 500 Bloom reward petals', 'Free upgrade to luxe wrapping'],
  },
  {
    id: '5',
    name: 'Purple Orchid Basket Arrangement',
    price: 5049,
    rating: 4.5,
    reviews: 124,
    category: 'Orchids',
    image: getImage(4),
    description: 'Softly layered rose arrangement perfect for anniversaries and milestones.',
    composition: ['60 garden roses', 'Baby’s breath halo', 'Wrapped in blush suede'],
    deliveryInfo: 'Timely delivery with live tracking updates via SMS.',
    offers: ['Add-on macarons set at ₹399', 'Free next-day delivery coupon'],
  },
  {
    id: '6',
    name: 'Purple Orchid Basket Arrangement',
    price: 6599,
    originalPrice: 7999,
    rating: 4.7,
    reviews: 201,
    badge: 'New',
    category: 'Orchids',
    image: getImage(5),
    description: 'Modern heart silhouette with premium blooms for statement gifting.',
    composition: ['Heart frame with 80 roses', 'Glossy philodendron leaves'],
    deliveryInfo: 'Priority handling with Bloom concierge service.',
    offers: ['Launch offer: Save ₹750 automatically', 'Include personalised video message'],
  },
  {
    id: '7',
    name: 'Purple Orchid Basket Arrangement',
    price: 3899,
    originalPrice: 4599,
    rating: 4.4,
    reviews: 167,
    category: 'Orchids',
    image: getImage(6),
    description: 'Compact yet lavish bloom arrangement ideal for desk displays.',
    composition: ['45 roses', 'Italian ruscus border'],
    deliveryInfo: 'Delivered in Bloom hydration box to maintain freshness.',
    offers: ['₹200 cashback via Bloom Pay', 'Complimentary floral food sachet'],
  },
  {
    id: '8',
    name: 'Purple Orchid Basket Arrangement',
    price: 8999,
    originalPrice: 10999,
    rating: 4.8,
    reviews: 445,
    badge: 'Hot Pick',
    category: 'Orchids',
    image: getImage(7),
    description: 'Opulent rose spread styled for statement centrepieces.',
    composition: ['Heart tray', '150 roses', 'Verdant foliage ring'],
    deliveryInfo: 'Doorstep styling assistance on arrival.',
    offers: ['Bundle with champagne flute set', 'Free message plaque engraving'],
  },
  {
    id: '9',
    name: 'Purple Orchid Basket Arrangement',
    price: 3299,
    rating: 4.3,
    reviews: 98,
    category: 'Orchids',
    image: getImage(8),
    description: 'Everyday bloom featuring curated roses for thoughtful gestures.',
    composition: ['30 roses', 'Seasonal fillers', 'Tissue gift wrap'],
    deliveryInfo: 'Standard next-day delivery across Indonesia.',
    offers: ['Buy 2 get 1 petite bouquet 50% off'],
  },
  {
    id: '10',
    name: 'Purple Orchid Basket Arrangement',
    price: 12499,
    originalPrice: 14999,
    rating: 4.9,
    reviews: 278,
    badge: 'Premium',
    category: 'Orchids',
    image: getImage(9),
    description: 'Heritage Luxe series featuring handpicked AAA-grade roses.',
    composition: ['200 roses', 'Preserved ivy border', 'Monogrammed keepsake box'],
    deliveryInfo: 'Arrives with Bloom stylist for on-site setup.',
    offers: ['Complimentary Bloom membership upgrade', 'Free anniversary reminder service'],
  },
  {
    id: '11',
    name: 'Purple Orchid Basket Arrangement',
    price: 5499,
    originalPrice: 6499,
    rating: 4.6,
    reviews: 189,
    category: 'Orchids',
    image: getImage(10),
    description: 'Classic romantic arrangement with curated rose mix.',
    composition: ['Mixed red & blush roses', 'Cedar foliage', 'Signature Bloom wrap'],
    deliveryInfo: 'Express shipping 2-3 hours in metro zones.',
    offers: ['Bundle with Bloom plush bear at ₹299'],
  },
  {
    id: '12',
    name: 'Purple Orchid Basket Arrangement',
    price: 4799,
    rating: 4.5,
    reviews: 134,
    category: 'Orchids',
    image: getImage(11),
    description: 'Statement heart bouquet to celebrate grand romantic gestures.',
    composition: ['Heart frame with 110 roses', 'Trailing foliage accents'],
    deliveryInfo: 'Delivered in Bloom temperature bags for maximum freshness.',
    offers: ['Free upgrade to luxe gift card', '₹250 off with code BLOOMLOVE'],
  },
];

