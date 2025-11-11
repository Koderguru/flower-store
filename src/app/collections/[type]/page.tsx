import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import CollectionContent from './CollectionContent';

const typeConfig = {
  express: {
    title: 'Express Delivery',
    subtitle: 'Beat the clock with hand-tied blooms ready for urgent gifting.',
    getProducts: () => products.slice(0, 8),
  },
  flowers: {
    title: 'Signature Flowers',
    subtitle: 'Discover our complete curation of luxury bouquets and arrangements.',
    getProducts: () => products,
  },
  gifts: {
    title: 'Curated Gift Bundles',
    subtitle: 'Pair your flowers with thoughtful add-ons and celebratory hampers.',
    getProducts: () => products.slice(8, 16),
  },
  cakes: {
    title: 'Cakes & Sweet Treats',
    subtitle: 'Celebrate milestones with decadent cakes and dessert pairings.',
    getProducts: () => products.slice(12, 16),
  },
  occasion: {
    title: 'Shop by Occasion',
    subtitle: 'From birthdays to anniversaries, find blooms tailored to every moment.',
    getProducts: () => products.slice(4, 12),
  },
  deal: {
    title: 'Deal Zone',
    subtitle: 'Fresh offers, limited-time drops, and bestsellers at irresistible value.',
    getProducts: () => products.filter((product) => product.badge === 'Hot Pick' || product.badge === 'Best Seller'),
  },
  plants: {
    title: 'Indoor Plants',
    subtitle: 'Verdant greens to elevate workspaces and cosy corners.',
    getProducts: () => products.slice(6, 12),
  },
  luxury: {
    title: 'The Luxury Edit',
    subtitle: 'Statement-making arrangements for unforgettable impressions.',
    getProducts: () => products.slice(0, 6),
  },
} as const;

type CollectionType = keyof typeof typeConfig;

type PageProps = {
  params: { type: string };
  searchParams?: { highlight?: string };
};

export default function CollectionPage({ params, searchParams }: PageProps) {
  const type = params.type as CollectionType;
  const config = typeConfig[type];

  if (!config) {
    notFound();
  }

  const highlight = searchParams?.highlight ? decodeURIComponent(searchParams.highlight) : undefined;
  const collectionProducts = config.getProducts();

  return (
    <CollectionContent
      title={config.title}
      subtitle={config.subtitle}
      highlight={highlight}
      products={collectionProducts}
    />
  );
}
