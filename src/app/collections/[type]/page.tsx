import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';

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
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-white py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-emerald-500">Bloom Collections</p>
          <h1 className="mt-3 text-4xl font-display font-bold text-gray-900">{config.title}</h1>
          <p className="mt-3 text-gray-600 max-w-3xl mx-auto">{config.subtitle}</p>
          {highlight && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              Highlighted: <span className="text-gray-900">{highlight}</span>
            </div>
          )}
        </header>

        {collectionProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">We&rsquo;re curating something special</h2>
            <p className="mt-2 text-sm text-gray-600">
              New additions for this collection are en route. Explore our other categories in the meantime.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Back to homepage
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {collectionProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={product.image ?? '/file.svg'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 rounded-md bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow">
                      {product.badge}
                    </span>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute top-3 right-3 rounded-md bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow">
                      Save ₹ {(product.originalPrice - product.price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-emerald-600">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">₹ {product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">₹ {product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
