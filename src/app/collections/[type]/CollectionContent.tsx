'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { useCurrency } from '@/context/CurrencyContext';

type CollectionContentProps = {
  title: string;
  subtitle: string;
  highlight?: string;
  products: Product[];
};

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
];

export default function CollectionContent({
  title,
  subtitle,
  highlight,
  products,
}: CollectionContentProps) {
  const { formatPrice } = useCurrency();
  const [sortOption, setSortOption] = useState<string>('featured');

  const sortedProducts = useMemo(() => {
    if (sortOption === 'featured') {
      return products;
    }

    const sorted = [...products];
    if (sortOption === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating-desc') {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    return sorted;
  }, [products, sortOption]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-white py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-emerald-500">Bloom Collections</p>
          <h1 className="mt-3 text-4xl font-display font-bold text-gray-900">{title}</h1>
          <p className="mt-3 text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          {highlight && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              Highlighted: <span className="text-gray-900">{highlight}</span>
            </div>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <label htmlFor="sort-by" className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
              Sort by
            </label>
            <select
              id="sort-by"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        {sortedProducts.length === 0 ? (
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
            {sortedProducts.map((product) => (
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
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-emerald-600">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
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

